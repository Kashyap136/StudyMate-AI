// StudyMate AI backend — local development / self-hosting.
//
// For production on Vercel, the same API logic runs as Serverless Functions in
// /api/*.js (see api/chat.js, api/summarize.js, api/quiz.js, etc.). No Express
// process is required on Vercel — npm run dev:server is only used locally.
//
// Run with:  npm run dev:server   (or: node server/index.js)

import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

import {
  handleChat,
  handleSummarize,
  handleQuiz,
  handleHealth,
} from './handlers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json({ limit: '1mb' }))

// ---- Basic rate-limit protection (in-memory, per IP) -----------------------
// Local safeguard for the self-hosted server. On Vercel the API runs as
// stateless Functions, which rely on the platform's own infrastructure instead.
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
// Same handlers power the Vercel Functions in /api, so behavior is identical
// locally and in production.

app.get('/api/health', handleHealth)
app.post('/api/chat', rateLimit, handleChat)
app.post('/api/summarize', rateLimit, handleSummarize)
app.post('/api/quiz', rateLimit, handleQuiz)
app.post('/api/generate-quiz', rateLimit, handleQuiz)

// ---- Static frontend (production / self-hosting) ----------------------------

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