// Dynamic Quiz Generator — asks the StudyMate backend to have the LLM create a
// fresh set of multiple-choice questions for the requested topic, difficulty,
// and count. The hardcoded question bank has been removed.

import { quizWithAI, ApiError } from './api'

// Normalize and validate AI-generated questions so malformed JSON can never
// crash the quiz UI. Accepted keys: correctAnswer / answer / correct.
export function normalizeQuestions(rawQuestions) {
  if (!Array.isArray(rawQuestions)) return []

  const valid = rawQuestions
    .map((question) => {
      if (!question || typeof question !== 'object') return null

      const text = String(question.question ?? '').trim()
      if (!text) return null

      const options = (Array.isArray(question.options) ? question.options : [])
        .map((o) => String(o ?? '').trim())
        .filter(Boolean)
      if (options.length < 2) return null

      const correctRaw = question.correctAnswer ?? question.answer ?? question.correct
      let answer = typeof correctRaw === 'number' ? correctRaw : Number.parseInt(correctRaw, 10)
      if (Number.isNaN(answer) || answer < 0 || answer >= options.length) return null

      return {
        question: text,
        options,
        answer,
        explanation: String(question.explanation ?? '').trim(),
      }
    })
    .filter(Boolean)
    .slice(0, 10)

  return valid
}

export async function generateQuiz(topic, difficulty = 'medium', count = 5) {
  const cleanTopic = String(topic ?? '').trim()
  if (!cleanTopic) {
    throw new ApiError('Enter a topic to generate a quiz.', 'EMPTY_TOPIC')
  }

  const data = await quizWithAI(cleanTopic, difficulty, count)
  const questions = normalizeQuestions(data?.questions)

  if (questions.length === 0) {
    throw new ApiError('The quiz generator returned invalid questions. Please try again.', 'INVALID_RESPONSE')
  }

  return {
    category: cleanTopic,
    questions: questions.slice(0, count),
  }
}