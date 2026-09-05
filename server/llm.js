// Server-side Gemini integration for StudyMate AI, built on the official
// @google/genai SDK. The API key is read from the server environment only and
// is never sent to the browser.

import { GoogleGenAI } from '@google/genai'
import { GEMINI_MODEL } from './config.js'
import { SYSTEM_PROMPTS } from './prompts.js'

export class LLMError extends Error {
  constructor(code, message, status = 502) {
    super(message)
    this.code = code
    this.status = status
  }
}

const REQUEST_TIMEOUT_MS = 90000
const STRICT_SUFFIX =
  '\n\nSTRICT MODE (retry): Return ONLY valid JSON matching the exact schema above. ' +
  'No prose, no explanations outside the JSON, no markdown fences.'

let cachedClient = null

export function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY)
}

// Lazily constructs the SDK client with the API key from the server env.
// GEMINI_BASE_URL (optional) overrides the upstream endpoint for testing/proxies.
function getClient() {
  if (!isConfigured()) {
    throw new LLMError(
      'NOT_CONFIGURED',
      'The AI service is not configured. Set GEMINI_API_KEY in the server .env file and restart the backend.',
      503
    )
  }
  if (!cachedClient) {
    const httpOptions = { timeout: REQUEST_TIMEOUT_MS }
    if (process.env.GEMINI_BASE_URL) {
      httpOptions.baseUrl = process.env.GEMINI_BASE_URL.replace(/\/+$/, '')
    }
    cachedClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions,
    })
  }
  return cachedClient
}

// ---- Error logging (server-side only, secrets redacted) ---------------------

// Parses the SDK's JSON-wrapped error message to extract upstream details.
function parseUpstreamError(message) {
  try {
    const parsed = JSON.parse(String(message))
    if (parsed?.error) {
      return {
        upstreamCode: parsed.error.code,
        upstreamStatus: parsed.error.status,
        upstreamMessage: parsed.error.message,
        details: parsed.error.details,
      }
    }
  } catch {
    // message is a plain string (timeout, network, etc.)
  }
  return null
}

// Logs full upstream error details to the server console.
// NEVER logs API key, Authorization header, or x-goog-api-key value.
function logGeminiError(error, context = '') {
  const now = new Date().toISOString()
  const upstream = parseUpstreamError(error?.message)
  const status = error?.status ?? 'unknown'
  const source = context || 'gemini'

  if (upstream) {
    const detail = upstream.details
      ? ` | details: ${JSON.stringify(upstream.details).slice(0, 300)}`
      : ''
    console.error(
      `[${now}] GEMINI ${source}: HTTP ${status} upstream=${upstream.upstreamCode} status=${upstream.upstreamStatus} ` +
        `message="${String(upstream.upstreamMessage ?? '').slice(0, 300)}" model=${GEMINI_MODEL}${detail}`
    )
  } else {
    console.error(
      `[${now}] GEMINI ${source}: status=${status} message="${String(error?.message ?? '').slice(0, 400)}" model=${GEMINI_MODEL}`
    )
  }
}

// ---- Error mapping (user-facing messages, no secrets) -----------------------

function mapGeminiError(error) {
  if (error instanceof LLMError) return error
  const status = typeof error?.status === 'number' ? error.status : null
  const message = String(error?.message ?? '')
  const upstream = parseUpstreamError(message)
  const upstreamStatus = upstream?.upstreamStatus ?? ''

  // 400 with an API-key problem → auth failure (Gemini returns HTTP 400
  // INVALID_ARGUMENT / API_KEY_INVALID for bad or misconfigured keys).
  if (status === 400 && (upstreamStatus === 'API_KEY_INVALID' || /api.?key/i.test(message))) {
    return new LLMError('AUTH_FAILED', 'Authentication failed. Please check the API configuration.', 401)
  }

  // 400 → invalid request
  if (status === 400) {
    return new LLMError('LLM_API_ERROR', 'The AI service could not process the request. Please try again.', 502)
  }

  // 401 / 403 → permission
  if (status === 401 || status === 403) {
    return new LLMError('AUTH_FAILED', 'The API key does not have permission to access this service.', 502)
  }

  // 404 → model not found or deprecated
  if (status === 404) {
    return new LLMError(
      'MODEL_NOT_FOUND',
      `The selected Gemini model "${GEMINI_MODEL}" was not found or is unavailable. ` +
        'Set GEMINI_MODEL in the server .env to a valid model name.',
      502
    )
  }

  // 429 → rate limit / quota
  if (status === 429) {
    return new LLMError(
      'RATE_LIMITED',
      'Too many requests or API quota exceeded. Please wait a moment and try again.',
      429
    )
  }

  // 5xx → server error
  if (status !== null && status >= 500) {
    return new LLMError(
      'SERVER_ERROR',
      'The AI service encountered a temporary server error. Please try again.',
      502
    )
  }

  // Timeout
  if (/tim(e|ed) ?out|abort/i.test(message)) {
    return new LLMError(
      'TIMEOUT',
      'The AI service took too long to respond. Please try again.',
      504
    )
  }

  // Network / everything else
  return new LLMError(
    'NETWORK',
    'Unable to connect to the AI service. Please check your internet connection.',
    503
  )
}

// ---- Transient error backoff (429, 5xx, network) ----------------------------

const RETRYABLE_CODES = new Set(['RATE_LIMITED', 'SERVER_ERROR', 'NETWORK'])
const MAX_BACKOFF_ATTEMPTS = 3
const BACKOFF_BASE_MS = 1000

async function withBackoff(fn, attempt = 1) {
  try {
    return await fn()
  } catch (error) {
    if (
      error instanceof LLMError &&
      RETRYABLE_CODES.has(error.code) &&
      attempt < MAX_BACKOFF_ATTEMPTS
    ) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1)
      console.error(`[Gemini] Retry ${attempt}/${MAX_BACKOFF_ATTEMPTS - 1} after ${delay}ms for ${error.code}`)
      await new Promise((r) => setTimeout(r, delay))
      return withBackoff(fn, attempt + 1)
    }
    throw error
  }
}

// ---- Low-level generateContent -------------------------------------------

async function completeChat({ system, contents, temperature = 0.7, maxTokens = 2048, json = false, strict = false }) {
  const client = getClient()
  const finalSystem = strict && json ? `${system}\n\n${STRICT_SUFFIX}` : system

  const config = {
    systemInstruction: { parts: [{ text: finalSystem }] },
    temperature,
    maxOutputTokens: maxTokens,
  }
  if (json) config.responseMimeType = 'application/json'

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config,
    })
    const text = response?.text
    if (!text || !text.trim()) {
      throw new LLMError('EMPTY_RESPONSE', 'The AI service returned an empty response. Please try again.', 502)
    }
    return text
  } catch (error) {
    logGeminiError(error, system === SYSTEM_PROMPTS.assistant ? 'chat' : system === SYSTEM_PROMPTS.summarize ? 'summarize' : 'quiz')
    throw mapGeminiError(error)
  }
}

// Retry once when the model returns unparseable/empty output, this time with a
// stricter "JSON only" instruction.
async function withRetry(fn) {
  try {
    return await fn(false)
  } catch (error) {
    if (
      error instanceof LLMError &&
      (error.code === 'INVALID_RESPONSE' || error.code === 'EMPTY_RESPONSE')
    ) {
      return await fn(true)
    }
    throw error
  }
}

// ---- Response parsing -----------------------------------------------------

// Best-effort JSON extraction: plain JSON, JSON inside code fences, or a JSON
// object embedded in surrounding prose.
export function extractJson(content) {
  const trimmed = String(content ?? '').trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed)
  } catch {
    // fall through
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) {
    try {
      return JSON.parse(fence[1].trim())
    } catch {
      // fall through
    }
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      // give up
    }
  }
  return null
}

// ---- Feature 1: AI Study Assistant ----------------------------------------

function normalizeChatMessages(messages) {
  if (!Array.isArray(messages)) return []
  return messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .slice(-20)
}

// The Gemini API expects alternating 'user'/'model' roles, so 'assistant' is
// mapped to 'model' and wrapper objects become Gemini Content parts.
function toGeminiContents(history) {
  return history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

export async function getAssistantReply(messages) {
  const history = normalizeChatMessages(messages)
  if (history.length === 0) {
    throw new LLMError('BAD_REQUEST', 'A chat history is required.', 400)
  }

  const content = await withBackoff(async () =>
    completeChat({
      system: SYSTEM_PROMPTS.assistant,
      contents: toGeminiContents(history),
      temperature: 0.7,
      maxTokens: 2048,
    })
  )

  return { content }
}

// ---- Feature 2: Notes Summarizer ------------------------------------------

export async function summarizeText(text) {
  const raw = String(text ?? '').trim()
  if (!raw) {
    throw new LLMError('BAD_REQUEST', 'No notes were provided.', 400)
  }
  if (raw.split(/\s+/).length < 5) {
    throw new LLMError('BAD_REQUEST', 'The notes are too short to summarize.', 400)
  }
  // Guard against absurdly large inputs.
  const source = raw.length > 50000 ? raw.slice(0, 50000) : raw

  const run = async (strict) => {
    const content = await completeChat({
      system: SYSTEM_PROMPTS.summarize,
      contents: [{ role: 'user', parts: [{ text: source }] }],
      temperature: 0.3,
      maxTokens: 2048,
      json: true,
      strict,
    })

    const parsed = extractJson(content)
    if (!parsed) {
      throw new LLMError('INVALID_RESPONSE', 'The AI service did not return a valid summary. Please try again.')
    }

    const summary = String(parsed.summary ?? '').trim()
    const keyTakeaways = (Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [])
      .map((k) => String(k ?? '').trim())
      .filter(Boolean)
      .slice(0, 5)
    const importantTopics = (Array.isArray(parsed.importantTopics) ? parsed.importantTopics : [])
      .map((k) => String(k ?? '').trim())
      .filter(Boolean)
      .slice(0, 5)
    const revisionNotes = String(parsed.revisionNotes ?? '').trim()

    if (!summary || keyTakeaways.length === 0) {
      throw new LLMError('INVALID_RESPONSE', 'The AI service did not return a valid summary. Please try again.')
    }

    const originalWords = source.split(/\s+/).length
    const summaryWords = summary.split(/\s+/).length
    const stats = {
      originalWords,
      originalCharacters: source.length,
      summaryWords,
      compression: Math.max(1, Math.min(95, Math.round((1 - summaryWords / originalWords) * 100))),
    }

    return {
      summary,
      keyTakeaways,
      importantTopics,
      revisionNotes,
      topic: importantTopics[0] || null,
      stats,
    }
  }

  return withBackoff(() => withRetry(run))
}

// ---- Feature 3: Dynamic Quiz Generator -------------------------------------

const ALLOWED_DIFFICULTIES = ['easy', 'medium', 'hard']
const ALLOWED_COUNTS = [3, 5, 10]

export function validateQuizQuestions(rawQuestions, expectedCount) {
  if (!Array.isArray(rawQuestions)) return []

  const clean = rawQuestions
    .slice(0, Math.max(expectedCount, 10) * 2)
    .map((question) => {
      if (!question || typeof question !== 'object') return null
      const text = String(question.question ?? '').trim()
      if (!text) return null

      // Exactly four options, per the quiz schema contract.
      const options = (Array.isArray(question.options) ? question.options : [])
        .map((o) => String(o ?? '').trim())
        .filter(Boolean)
      if (options.length !== 4) return null

      const correctRaw = question.correctAnswer ?? question.answer
      const answer = typeof correctRaw === 'number' ? correctRaw : Number.parseInt(correctRaw, 10)
      if (Number.isNaN(answer) || answer < 0 || answer >= options.length) return null

      // Every question must carry an explanation.
      const explanation = String(question.explanation ?? '').trim()
      if (!explanation) return null

      return {
        question: text,
        options,
        answer,
        explanation,
      }
    })
    .filter(Boolean)

  return clean.slice(0, expectedCount)
}

export async function generateQuiz(topic, difficulty, count) {
  const cleanTopic = String(topic ?? '').trim()
  if (!cleanTopic) {
    throw new LLMError('BAD_REQUEST', 'Please provide a quiz topic.', 400)
  }
  if (cleanTopic.length > 120) {
    throw new LLMError('BAD_REQUEST', 'That topic is too long. Use a shorter topic.', 400)
  }
  const cleanDifficulty = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium'
  const cleanCount = ALLOWED_COUNTS.includes(count) ? count : 5

  const run = async (strict) => {
    const content = await completeChat({
      system: SYSTEM_PROMPTS.quiz,
      contents: [
        {
          role: 'user',
          parts: [{ text: `Topic: ${cleanTopic}\nDifficulty: ${cleanDifficulty}\nNumber of questions: ${cleanCount}\n\nGenerate the quiz now.` }],
        },
      ],
      temperature: 0.9,
      maxTokens: 4096,
      json: true,
      strict,
    })

    const parsed = extractJson(content)
    if (!parsed) {
      throw new LLMError('INVALID_RESPONSE', 'The AI service did not return a valid quiz. Please try again.')
    }

    const questions = validateQuizQuestions(parsed.questions, cleanCount)
    if (questions.length < Math.min(3, cleanCount)) {
      throw new LLMError('INVALID_RESPONSE', 'The AI service did not return valid quiz questions. Please try again.')
    }

    return {
      topic: cleanTopic,
      difficulty: cleanDifficulty,
      questions,
    }
  }

  return withBackoff(() => withRetry(run))
}

export async function generateQuizWithRetry(topic, difficulty, count) {
  return generateQuiz(topic, difficulty, count)
}
