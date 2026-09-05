// Vercel Serverless Function — POST /api/chat
//
// Replaces the Express /api/chat route in production. The Gemini call lives in
// server/handlers.js → server/llm.js, so behavior matches local development.
// GEMINI_API_KEY / GEMINI_MODEL are read from process.env on the server only.

import { handleChat, requireMethod } from '../server/handlers.js'

// Gemini calls can take a while; this keeps the Vercel invocation within the
// allowed execution window on all plan tiers.
export const maxDuration = 60

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return
  await handleChat(req, res)
}