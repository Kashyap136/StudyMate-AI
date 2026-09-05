// Frontend client for the StudyMate AI backend.
// All AI requests fan out to the server so API keys never reach the browser.

export class ApiError extends Error {
  constructor(message, code = 'REQUEST_FAILED') {
    super(message)
    this.code = code
  }
}

async function request(path, { method = 'POST', body } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'Could not reach the AI service. Make sure the backend server is running.',
      'NETWORK'
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // non-JSON response — handled below
  }

  if (!response.ok) {
    const code = data?.error?.code || 'REQUEST_FAILED'
    const serverMessage = data?.error?.message
    // Prefer the server's message (already per-error), fall back to HTTP-based
    // messages when the body is missing or malformed.
    const message =
      serverMessage ||
      (response.status === 429
        ? 'Too many requests or API quota exceeded. Please wait a moment and try again.'
        : response.status === 404
        ? 'The selected AI model was not found or is unavailable.'
        : response.status === 503
        ? 'Unable to connect to the AI service. Please check your internet connection.'
        : response.status === 500
        ? 'The AI service encountered a temporary server error. Please try again.'
        : 'The AI service had a problem. Please try again.')
    throw new ApiError(message, code)
  }

  if (data === null) {
    throw new ApiError('The AI service returned an empty response. Please try again.', 'EMPTY_RESPONSE')
  }
  return data
}

export function chatWithAssistant(messages) {
  return request('/api/chat', { body: { messages } })
}

export function summarizeWithAI(text) {
  return request('/api/summarize', { body: { text } })
}

export function quizWithAI(topic, difficulty, count) {
  return request('/api/quiz', { body: { topic, difficulty, count } })
}

export function getAIHealth() {
  return request('/api/health', { method: 'GET' })
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }
  return fallback
}