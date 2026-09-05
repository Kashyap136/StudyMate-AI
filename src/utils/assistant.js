// AI Study Assistant — sends the conversation to the StudyMate backend,
// which relays it to the configured LLM. No hardcoded responses.

import { chatWithAssistant, ApiError } from './api'

export async function generateAssistantResponse(messages) {
  const chatMessages = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content }))

  if (chatMessages.length === 0) {
    throw new ApiError('There is no message to send.', 'EMPTY_MESSAGE')
  }

  const data = await chatWithAssistant(chatMessages)
  const content = data?.content
  if (!content || !content.trim()) {
    throw new ApiError('The assistant returned an empty response. Please try again.', 'EMPTY_RESPONSE')
  }
  return content
}