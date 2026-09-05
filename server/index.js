// StudyMate AI backend.
// Serves the AI API endpoints and, in production, the built frontend.
//
// Run with:  npm run server   (or: node server/index.js)

import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

import {
  getAssistantReply,
  summarizeText,
  generateQuizWithRetry,
  isConfigured,
  LLMError,
} from './llm.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json({ limit: '1mb' }))

// ---- Helpers ---------------------------------------------------------------

// Wrap async route handlers so thrown errors are turned into JSON responses.
const asyncHandler = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((error) => handleError(error, res))

function handleError(error, res) {
  if (error instanceof LLMError) {
    return res.status(error.status).json({ error: { code: error.code, message: error.message } })
  }
  console.error('Unexpected server error:', error)
  res.status(500).json({
    error: { code: 'SERVER_ERROR', message: 'Something went wrong on the server. Please try again.' },
  })
}

// ---- Basic rate-limit protection (in-memory, per IP) -----------------------
// Prevents rapid-fire duplicate requests from draining the API quota.
// Configure via RATE_LIMIT_MAX (0 disables) and RATE_LIMIT_WINDOW_MS.

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 20)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
const recentHits = new Map()

function rateLimit(req, res, next) {
  if (RATE_LIMIT_MAX <= 0) return next()
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (recentHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: { code: 'RATE_LIMITED', message: 'Too many AI requests. Please wait a moment and try again.' },
    })
  }
  recent.push(now)
  recentHits.set(ip, recent)
  next()
}

// ---- AI endpoints ----------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ ok: true, aiConfigured: isConfigured() })
})

app.post(
  '/api/chat',
  rateLimit,
  asyncHandler(async (req, res) => {
    const { messages } = req.body || {}
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new LLMError('BAD_REQUEST', 'A chat history is required.', 400)
    }
    const reply = await getAssistantReply(messages)
    res.json(reply)
  })
)

app.post(
  '/api/summarize',
  rateLimit,
  asyncHandler(async (req, res) => {
    const { text } = req.body || {}
    const result = await summarizeText(text)
    res.json(result)
  })
)

app.post(
  '/api/quiz',
  rateLimit,
  asyncHandler(async (req, res) => {
    const { topic, difficulty, count } = req.body || {}
    const result = await generateQuizWithRetry(topic, difficulty, count)
    res.json(result)
  })
)

// ---- Static frontend (production) ------------------------------------------

const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(distPath, 'index.html')))
}

// 404 for unknown API routes (mounted after the static catch-all stays above
// the API routes thanks to the /api prefix match).
app.use('/api', (req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Unknown API endpoint.' } })
})

app.listen(PORT, () => {
  console.log(`StudyMate AI backend listening on http://localhost:${PORT}`)
})