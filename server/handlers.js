// Shared request handlers for the StudyMate AI API.
//
// These are used by two entry points so request handling never drifts:
//   1. The local Express server (server/index.js) — development / self-hosting.
//   2. The Vercel Serverless Functions in /api/*.js — production on Vercel.
//
// Handlers receive a Node-style (req, res) pair, which is what both Express and
// Vercel Functions provide. Prefer pre-parsed req.body when the runtime already
// parsed it (Express json middleware / Vercel runtime) and fall back to reading
// the raw stream otherwise.

import {
  getAssistantReply,
  summarizeText,
  generateQuizWithRetry,
  isConfigured,
  LLMError,
} from './llm.js'

const ERROR_HEADERS = { 'Content-Type': 'application/json' }

// ---- Body parsing ------------------------------------------------------------

// Returns the parsed JSON body (an object) no matter how the runtime delivered
// it. Never throws: malformed or missing bodies become {} so every handler can
// validate required fields with friendly 400 responses.
export async function parseJsonBody(req) {
  const body = req.body
  if (
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    !Buffer.isBuffer(body)
  ) {
    return body
  }
  if (typeof body === 'string' && body.trim()) {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  let raw = ''
  try {
    for await (const chunk of req) {
      raw += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
    }
  } catch {
    // body already consumed or the request is not streamable
  }
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

// ---- Response helpers ---------------------------------------------------------

export function sendJson(res, status, payload) {
  if (typeof res.status === 'function') res.status(status)
  else if (res.statusCode !== undefined) res.statusCode = status
  if (res.setHeader && !res.headersSent) {
    for (const [key, value] of Object.entries(ERROR_HEADERS)) res.setHeader(key, value)
  }
  res.json(payload)
}

function handleError(res, error) {
  if (error instanceof LLMError) {
    return sendJson(res, error.status, {
      error: { code: error.code, message: error.message },
    })
  }
  console.error('Unexpected server error:', error)
  sendJson(res, 500, {
    error: { code: 'SERVER_ERROR', message: 'Something went wrong on the server. Please try again.' },
  })
}

export function requireMethod(req, res, method) {
  if (req.method === method) return true
  sendJson(res, 405, {
    error: { code: 'METHOD_NOT_ALLOWED', message: `Only ${method} is supported.` },
  })
  return false
}

// ---- Handlers (shared by Express and Vercel Functions) -------------------------

export async function handleHealth(req, res) {
  sendJson(res, 200, { ok: true, aiConfigured: isConfigured() })
}

export async function handleChat(req, res) {
  try {
    const { messages } = await parseJsonBody(req)
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new LLMError('BAD_REQUEST', 'A chat history is required.', 400)
    }
    const reply = await getAssistantReply(messages)
    sendJson(res, 200, reply)
  } catch (error) {
    handleError(res, error)
  }
}

export async function handleSummarize(req, res) {
  try {
    const { text } = await parseJsonBody(req)
    const result = await summarizeText(text)
    sendJson(res, 200, result)
  } catch (error) {
    handleError(res, error)
  }
}

export async function handleQuiz(req, res) {
  try {
    const { topic, difficulty, count } = await parseJsonBody(req)
    const result = await generateQuizWithRetry(topic, difficulty, count)
    sendJson(res, 200, result)
  } catch (error) {
    handleError(res, error)
  }
}