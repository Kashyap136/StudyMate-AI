// Vercel Serverless Function — POST /api/generate-quiz
//
// Alias of /api/quiz: the frontend calls /api/quiz, while /api/generate-quiz is
// provided for consumers expecting the longer endpoint name. Both use the same
// handler (server/handlers.js → server/llm.js) so behavior is identical.

import { handleQuiz, requireMethod } from '../server/handlers.js'

// Generating a quiz with several questions can take a while.
export const maxDuration = 60

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return
  await handleQuiz(req, res)
}