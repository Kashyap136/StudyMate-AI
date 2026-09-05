import { useEffect, useRef, useState } from 'react'
import { GraduationCap, Trash2, Send, Sparkles, User } from 'lucide-react'
import Button from '../Button'
import { useToast } from '../ToastContext'
import { generateAssistantResponse } from '../../utils/assistant'
import { getErrorMessage } from '../../utils/api'
import { formatAssistantMessage } from '../../utils/format'
import { Storage } from '../../utils/storage'

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm your StudyMate AI assistant. Ask me about **programming** (JavaScript, React, HTML/CSS, Python, Node.js, Express, Git, databases, DSA, OOP, OS, networking…), **math**, **science**, **history**, or **study techniques** — and I'll break it down for you. What would you like to learn today?",
  timestamp: Date.now(),
}

const suggestions = [
  'Explain closures in JavaScript',
  'How do hooks work in React?',
  'What is Big O notation?',
  'Best way to prepare for an exam',
]

export default function AssistantTool() {
  const [messages, setMessages] = useState(() => {
    const saved = Storage.chat.load()
    return saved && saved.length > 0 ? saved : [welcomeMessage]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const scrollRef = useRef(null)
  const inFlightRef = useRef(false)
  const showToast = useToast()

  useEffect(() => {
    Storage.chat.save(messages)
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const handleSend = async (text) => {
    const message = (text ?? input).trim()
    if (!message) {
      showToast('Type a question first.', 'error')
      return
    }
    if (inFlightRef.current) return
    // Guard against race conditions: set the ref synchronously BEFORE any
    // awaits so a second click/Enter cannot fire a duplicate request.
    inFlightRef.current = true

    const userMsg = {
      id: Date.now() + Math.random(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }
    const history = [...messages, userMsg]

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setStarted(true)
    setTyping(true)

    try {
      const response = await generateAssistantResponse(history)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        },
      ])
    } catch (error) {
      const friendly = getErrorMessage(error, 'Could not get a reply from the AI. Please try again.')
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          role: 'assistant',
          content: friendly,
          timestamp: Date.now(),
        },
      ])
      showToast(
        error?.code === 'NOT_CONFIGURED' ? 'AI backend is not configured.' : 'Could not get an AI reply.',
        'error'
      )
    } finally {
      inFlightRef.current = false
      setTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([welcomeMessage])
    Storage.chat.clear()
    setStarted(false)
    showToast('Chat cleared.', 'info')
  }

  return (
    <div className="card flex h-[640px] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
            <GraduationCap className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-accent-500 dark:border-slate-900" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">AI Study Assistant</h2>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3 w-3 text-primary-500 dark:text-primary-400" />
              Online · AI-powered
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleClear} className="px-3 py-2 text-xs">
          <Trash2 className="h-4 w-4" />
          Clear chat
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950">
        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  isUser
                    ? 'bg-slate-700 text-white dark:bg-slate-600'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'rounded-tr-sm bg-primary-600 text-white'
                    : 'rounded-tl-sm border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: formatAssistantMessage(msg.content) }} />
                )}
                <div
                  className={`mt-1.5 text-[10px] ${
                    isUser ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {typing && (
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">StudyMate AI is thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions + input */}
      <div className="border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {!started && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a study question… (Enter to send)"
            className="input max-h-32 min-h-11 flex-1 resize-none"
            rows={1}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || typing}
            className="h-11 w-11 shrink-0 px-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Powered by your configured LLM backend — API keys stay server-side. Ask about any study
          topic and follow up to dig deeper.
        </p>
      </div>
    </div>
  )
}