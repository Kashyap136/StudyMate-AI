import { useState } from 'react'
import { FileText, Wand2, Copy, Check, Trash2, Loader2, Lightbulb, TrendingDown, Tags, AlertTriangle, BookOpen } from 'lucide-react'
import Button from '../Button'
import { useToast } from '../ToastContext'
import { summarizeNotes } from '../../utils/summarizer'
import { getErrorMessage } from '../../utils/api'

const SAMPLE_NOTES = `JavaScript is a high-level programming language that powers interactivity on the web. It runs in the browser and the engine interprets the code line by line.

One of the most important concepts is the variable. Variables store values like numbers, strings, and objects using the keywords let, const, and var. Many developers prefer const for values that never change, and let for values that should be reassigned.

Functions are reusable blocks of code. A function is defined with the function keyword, or more modernly as an arrow function. Functions receive parameters and can return values.

The Document Object Model, or DOM, represents the page structure as a tree of objects. JavaScript can select elements, change their content, and respond to events like clicks or key presses.

Asynchronous programming is essential on the web. Promises represent values that will be available later. The async and await keywords make promise-based code read like normal synchronous code, which is much easier to follow.`

export default function SummarizerTool() {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const showToast = useToast()

  const wordCount = notes.trim().split(/\s+/).filter(Boolean).length

  const handleSummarize = async () => {
    const trimmed = notes.trim()
    if (!trimmed) {
      showToast('Please paste some notes first.', 'error')
      return
    }
    if (wordCount < 15) {
      showToast(`Add a bit more text — notes need to be at least 15 words (currently ${wordCount}).`, 'error')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const summary = await summarizeNotes(notes)
      setResult(summary)
      showToast('Summary generated!', 'success')
    } catch (error) {
      setError(
        getErrorMessage(error, 'Something went wrong while generating your summary. Please check your notes and try again.')
      )
      showToast('Failed to generate a summary.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setNotes('')
    setResult(null)
    setError(null)
    setCopied(false)
    showToast('Notes cleared.', 'info')
  }

  const handleCopy = async () => {
    if (!result) return
    const text = `${result.summary}\n\nKey takeaways:\n${result.keyTakeaways.map((t) => `• ${t}`).join('\n')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Summary copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy. Please copy manually.', 'error')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card flex flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notes Summarizer</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Paste your notes, get the key points.</p>
          </div>
        </div>

        <label htmlFor="notes" className="label mt-5">
          Your study notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste or type your study notes here…"
          className="input min-h-64 flex-1 resize-y"
          rows={10}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? 'Summarizing…' : 'Summarize'}
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={!notes && !result}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <button
            type="button"
            onClick={() => {
              setNotes(SAMPLE_NOTES)
              setError(null)
            }}
            className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Try a sample
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          {wordCount} words · analyzed by the StudyMate AI backend
        </p>
      </div>

      <div className="card flex flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Summary</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Key points extracted from your notes.</p>
          </div>
          {result && (
            <Button variant="secondary" onClick={handleCopy} className="px-3 py-2">
              {copied ? <Check className="h-4 w-4 text-accent-600 dark:text-accent-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </div>

        <div className="mt-5 flex-1">
          {loading ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyzing your notes…</p>
            </div>
          ) : error ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-300 bg-red-50 p-8 text-center dark:border-red-500/50 dark:bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
              <p className="max-w-xs text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {result.stats && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-primary-50 p-3 text-center dark:bg-primary-500/10">
                    <div className="text-lg font-bold text-primary-700 dark:text-primary-300">
                      {result.stats.originalWords}
                    </div>
                    <div className="text-xs font-medium text-primary-500 dark:text-primary-400">Original words</div>
                  </div>
                  <div className="rounded-xl bg-accent-50 p-3 text-center dark:bg-accent-500/10">
                    <div className="text-lg font-bold text-accent-700 dark:text-accent-300">
                      {result.stats.summaryWords}
                    </div>
                    <div className="text-xs font-medium text-accent-600 dark:text-accent-400">Summary words</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
                      {result.stats.compression}%
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      <TrendingDown className="mb-0.5 inline h-3 w-3" /> compressed
                    </div>
                  </div>
                </div>
              )}

              {result.importantTopics && result.importantTopics.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Tags className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Important topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.importantTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Wand2 className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Summary
                </h3>
                <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {result.summary}
                </p>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Lightbulb className="h-4 w-4 text-accent-600 dark:text-accent-400" /> Key takeaways
                </h3>
                <ul className="space-y-2">
                  {result.keyTakeaways.map((takeaway, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-accent-50 p-3 text-sm leading-relaxed text-slate-700 dark:bg-accent-500/10 dark:text-slate-300"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              {result.revisionNotes && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Revision notes
                  </h3>
                  <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {result.revisionNotes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <Lightbulb className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Your summary will appear here. Paste notes on the left and click{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">Summarize</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}