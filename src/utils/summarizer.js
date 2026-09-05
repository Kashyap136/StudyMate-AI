// Notes Summarizer — sends the user's notes to the StudyMate backend, which
// has the LLM produce a summary, key takeaways, and topics based only on the
// text the user entered. No hardcoded output.

import { summarizeWithAI, ApiError } from './api'

export async function summarizeNotes(text) {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) {
    throw new ApiError('Please paste some notes first.', 'EMPTY_TEXT')
  }

  const data = await summarizeWithAI(trimmed)

  // Client-side sanity checks so malformed AI output never breaks the UI.
  const summary = String(data?.summary ?? '').trim()
  const keyTakeaways = (Array.isArray(data?.keyTakeaways) ? data.keyTakeaways : [])
    .map((k) => String(k ?? '').trim())
    .filter(Boolean)
    .slice(0, 5)
  const importantTopics = (Array.isArray(data?.importantTopics) ? data.importantTopics : [])
    .map((k) => String(k ?? '').trim())
    .filter(Boolean)
    .slice(0, 5)

  if (!summary || keyTakeaways.length === 0) {
    throw new ApiError('The summarizer returned an invalid result. Please try again.', 'INVALID_RESPONSE')
  }

  const originalWords = trimmed.split(/\s+/).length
  const summaryWords = summary.split(/\s+/).length
  const stats =
    data?.stats && Number.isFinite(Number(data.stats.summaryWords))
      ? data.stats
      : {
          originalWords,
          originalCharacters: trimmed.length,
          summaryWords,
          compression: Math.max(1, Math.min(95, Math.round((1 - summaryWords / originalWords) * 100))),
        }

  return {
    summary,
    keyTakeaways,
    importantTopics,
    revisionNotes: String(data?.revisionNotes ?? '').trim(),
    topic: data?.topic || importantTopics[0] || null,
    stats,
  }
}