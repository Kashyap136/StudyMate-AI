// Vercel Serverless Function — GET /api/health
//
// Mirrors the local Express /api/health route. Returns whether the AI service
// is configured (GEMINI_API_KEY set) on the server.

import { handleHealth, requireMethod } from '../server/handlers.js'

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return
  await handleHealth(req, res)
}