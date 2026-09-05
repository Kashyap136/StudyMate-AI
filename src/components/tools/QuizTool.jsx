import { useState } from 'react'
import { HelpCircle, Sparkles, RotateCcw, Trophy, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import Button from '../Button'
import { useToast } from '../ToastContext'
import { generateQuiz } from '../../utils/quiz'
import { getErrorMessage } from '../../utils/api'

const difficulties = [
  { value: 'easy', label: 'Easy', color: 'bg-accent-100 text-accent-700 border-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/40' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40' },
]

const questionCounts = [3, 5, 10]

export default function QuizTool() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [count, setCount] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const showToast = useToast()

  const handleGenerate = async () => {
    const cleanTopic = topic.trim()
    if (!cleanTopic) {
      showToast('Enter a topic to generate a quiz.', 'error')
      return
    }
    setGenerating(true)
    setGenerateError(null)
    setQuestions(null)
    setAnswers({})
    setSubmitted(false)
    setScore(0)

    try {
      const { questions: generated } = await generateQuiz(cleanTopic, difficulty, count)
      setQuestions(generated)
      showToast(`Quiz generated on "${cleanTopic}"`, 'success')
    } catch (error) {
      const message = getErrorMessage(error, 'Could not generate the quiz. Please try again.')
      setGenerateError(message)
      showToast('Failed to generate the quiz.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setTopic('')
    setDifficulty('easy')
    setCount(5)
    setQuestions(null)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setGenerateError(null)
  }

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const handleSubmit = () => {
    const unanswered = questions.reduce(
      (count, _, i) => (answers[i] === undefined ? count + 1 : count),
      0
    )
    if (unanswered > 0) {
      showToast(`You still have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.`, 'error')
      return
    }
    const correct = questions.reduce(
      (count, q, i) => (answers[i] === q.answer ? count + 1 : count),
      0
    )
    setScore(correct)
    setSubmitted(true)
  }

  const progress = questions ? Object.keys(answers).length : 0
  const isComplete = questions && Object.keys(answers).length === questions.length
  const percent = questions && questions.length ? Math.round((score / questions.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Setup panel */}
      {!questions && (
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quiz Generator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enter a topic and pick a difficulty.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <label htmlFor="quiz-topic" className="label">Topic</label>
              <input
                id="quiz-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. JavaScript, React, Git, World War II, Photosynthesis…"
                className="input"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      aria-pressed={difficulty === d.value}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        difficulty === d.value
                          ? d.color + ' ring-2 ring-offset-1 dark:ring-offset-slate-900'
                          : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Number of questions</label>
                <div className="flex gap-2">
                  {questionCounts.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      aria-pressed={count === n}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        count === n
                          ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-offset-1 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-offset-slate-900'
                          : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
            {topic && (
              <p className="text-sm text-slate-400">
                {count} multiple-choice questions · scored instantly
              </p>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            Questions are generated on demand by the AI for any topic, with the selected difficulty.
            Each request produces a fresh quiz — no hardcoded question bank.
          </p>

          {generateError && (
            <div className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/40 dark:bg-red-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
                <p className="text-sm leading-relaxed text-red-700 dark:text-red-300">{generateError}</p>
              </div>
              <Button variant="secondary" onClick={handleGenerate} disabled={generating} className="px-3 py-2 text-xs">
                Try again
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {generating && (
        <div className="card flex items-center justify-center gap-4 p-12">
          <div className="flex gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Generating your personalized quiz…
          </p>
        </div>
      )}

      {/* Quiz */}
      {questions && (
        <div className="space-y-6">
          {/* Header + score */}
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quiz on {topic.trim()}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {submitted
                  ? `You scored ${score}/${questions.length} (${percent}%)`
                  : `${progress}/${questions.length} answered`}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${(progress / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                {submitted ? 'Try Again' : 'New quiz'}
              </Button>
              {!submitted && (
                <Button variant="success" onClick={handleSubmit} disabled={!isComplete}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>

          {submitted && (
            <div
              className={`card flex items-center gap-4 p-6 ${
                percent >= 70
                  ? 'border-accent-200 bg-accent-50 dark:border-accent-500/40 dark:bg-accent-500/10'
                  : 'border-amber-200 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10'
              }`}
            >
              <Trophy
                className={`h-10 w-10 ${
                  percent >= 70 ? 'text-accent-600 dark:text-accent-400' : 'text-amber-500 dark:text-amber-400'
                }`}
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {score === questions.length
                    ? 'Perfect score! Outstanding work.'
                    : percent >= 70
                    ? 'Great job! You really know this topic.'
                    : percent >= 40
                    ? 'Good effort — a little more review will do it.'
                    : 'Keep going — review the answers below and retry.'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You answered {score} out of {questions.length} correctly ({percent}%). Read the explanations
                  to strengthen your understanding.
                </p>
              </div>
              <div
                className={`flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full border-4 ${
                  percent >= 70
                    ? 'border-accent-500 text-accent-700 dark:text-accent-300'
                    : 'border-amber-500 text-amber-700 dark:text-amber-300'
                }`}
              >
                <span className="text-lg font-extrabold">{percent}%</span>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-5">
            {questions.map((q, qIndex) => {
              const selected = answers[qIndex]
              const isCorrect = selected !== undefined && selected === q.answer
              return (
                <div key={qIndex} className="card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                        {qIndex + 1}
                      </span>
                      {q.question}
                    </h3>
                    {submitted &&
                      (isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                      ) : (
                        <XCircle className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
                      ))}
                  </div>

                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {q.options.map((option, oIndex) => {
                      let style = 'border-slate-200 bg-white hover:border-primary-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500'
                      if (!submitted) {
                        style =
                          selected === oIndex
                            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 dark:bg-primary-500/10 dark:ring-primary-400'
                            : 'border-slate-200 bg-white hover:border-primary-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500'
                      } else if (oIndex === q.answer) {
                        style = 'border-accent-500 bg-accent-50 text-accent-900 ring-1 ring-accent-500 dark:bg-accent-500/15 dark:text-accent-200 dark:ring-accent-400'
                      } else if (selected === oIndex) {
                        style = 'border-red-400 bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500'
                      } else {
                        style = 'border-slate-200 bg-white opacity-60 dark:border-slate-700 dark:bg-slate-800'
                      }

                      return (
                        <button
                          key={oIndex}
                          type="button"
                          onClick={() => handleSelect(qIndex, oIndex)}
                          disabled={submitted}
                          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 disabled:cursor-default ${style}`}
                        >
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                              selected === oIndex || (submitted && oIndex === q.answer)
                                ? 'border-transparent bg-current'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {submitted && oIndex === q.answer ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            ) : selected === oIndex ? (
                              <span className={submitted ? 'text-white' : 'text-primary-600 dark:text-primary-400'}>•</span>
                            ) : null}
                          </span>
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}

                  {!submitted && selected === undefined && (
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Not answered yet</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}