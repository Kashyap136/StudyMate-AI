// Vercel Serverless Function — POST /api/quiz
//
// The quiz endpoint used by the frontend (src/utils/api.js calls /api/quiz).
// Shares the same handler as /api/generate-quiz. The Gemini call lives in
// server/handlers.js → server/llm.js, so behavior matches local development.

import { handleQuiz, requireMethod } from '../server/handlers.js'

// Generating a quiz with several questions can take a while.
export const maxDuration = 60

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return
  await handleQuiz(req, res)
}