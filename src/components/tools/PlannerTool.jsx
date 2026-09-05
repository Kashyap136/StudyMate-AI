import { useEffect, useState } from 'react'
import {
  CalendarClock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Filter,
  ClipboardList,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import Button from '../Button'
import { useToast } from '../ToastContext'
import { Storage } from '../../utils/storage'

const priorities = [
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300', dot: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', dot: 'bg-amber-500' },
  { value: 'low', label: 'Low', color: 'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300', dot: 'bg-accent-500' },
]

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Completed' },
]

const subjectOptions = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'English',
  'Economics',
  'Other',
]

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export default function PlannerTool() {
  const [tasks, setTasks] = useState(() => Storage.tasks.load())
  const [subject, setSubject] = useState('')
  const [task, setTask] = useState('')
  const [date, setDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ task: '', subject: '', date: '', priority: 'medium' })
  const showToast = useToast()

  useEffect(() => {
    Storage.tasks.save(tasks)
  }, [tasks])

  const handleAdd = (e) => {
    e?.preventDefault()
    const trimmed = task.trim()
    if (!trimmed) {
      showToast('Please describe the task.', 'error')
      return
    }
    if (trimmed.length < 3) {
      showToast('The task should be at least 3 characters.', 'error')
      return
    }
    if (!date) {
      showToast('Please pick a date.', 'error')
      return
    }
    const newTask = {
      id: uid(),
      subject: subject || 'General',
      task: trimmed,
      date,
      priority,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [newTask, ...prev])
    setTask('')
    setSubject('')
    setDate('')
    setPriority('medium')
    showToast('Task added to your study plan.', 'success')
  }

  const toggleComplete = (id) => {
    const t = tasks.find((x) => x.id === id)
    setTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed, completedAt: !item.completed ? Date.now() : null }
          : item
      )
    )
    showToast(t && !t.completed ? 'Task marked complete!' : 'Task reopened.', t && !t.completed ? 'success' : 'info')
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (editingId === id) setEditingId(null)
    showToast('Task deleted.', 'info')
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setEditForm({ task: t.task, subject: t.subject, date: t.date, priority: t.priority })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ task: '', subject: '', date: '', priority: 'medium' })
  }

  const saveEdit = (id) => {
    const trimmed = editForm.task.trim()
    if (!trimmed) {
      showToast('Please describe the task.', 'error')
      return
    }
    if (trimmed.length < 3) {
      showToast('The task should be at least 3 characters.', 'error')
      return
    }
    if (!editForm.date) {
      showToast('Please pick a date.', 'error')
      return
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              task: trimmed,
              subject: editForm.subject || 'General',
              date: editForm.date,
              priority: editForm.priority,
            }
          : t
      )
    )
    cancelEdit()
    showToast('Task updated.', 'success')
  }

  const handleClearDone = () => {
    const hasDone = tasks.some((t) => t.completed)
    if (!hasDone) {
      showToast('No completed tasks to clear.', 'info')
      return
    }
    setTasks((prev) => prev.filter((t) => !t.completed))
    showToast('Cleared all completed tasks.', 'info')
  }

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date)
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.priority] - order[b.priority]
    }
    if (sortBy === 'created') return b.createdAt - a.createdAt
    return 0
  })

  const activeCount = tasks.filter((t) => !t.completed).length
  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{tasks.length}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">Total tasks</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 sm:text-3xl">{activeCount}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">Active</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400 sm:text-3xl">{doneCount}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">Completed</div>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Study Planner</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add a study task to your plan.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="subject" className="label">Subject</label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
            >
              <option value="">Select subject…</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="task" className="label">Task</label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Review Chapter 4"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="date" className="label">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="flex gap-1.5">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  aria-pressed={priority === p.value}
                  className={`flex-1 rounded-lg border px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    priority === p.value
                      ? p.color + ' border-transparent ring-2 ring-offset-1 dark:ring-offset-slate-900'
                      : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Button type="submit" variant="primary">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </form>

      {/* Task list */}
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Study Plan</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-1">
              <Filter className="mr-1 h-4 w-4 text-slate-400 dark:text-slate-500" />
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-primary-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Sort tasks"
            >
              <option value="date">Sort by date</option>
              <option value="priority">Sort by priority</option>
              <option value="created">Sort by newest</option>
            </select>
            <Button variant="ghost" onClick={handleClearDone} className="px-3 py-1.5 text-xs">
              <Trash2 className="h-3.5 w-3.5" />
              Clear done
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center dark:border-slate-700 dark:bg-slate-800">
              <ClipboardList className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                {filter === 'all'
                  ? 'No tasks yet. Add your first study task above.'
                  : 'No tasks match this filter.'}
              </p>
            </div>
          ) : (
            sorted.map((t) => {
              const p = priorities.find((x) => x.value === t.priority)
              const now = new Date()
              const due = new Date(t.date + 'T23:59:59')
              const isOverdue = !t.completed && due < now
              const isEditing = editingId === t.id
              return (
                <div
                  key={t.id}
                  className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
                    t.completed
                      ? 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60'
                      : 'border-slate-200 bg-white hover:border-primary-200 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-primary-500/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleComplete(t.id)}
                    className="mt-0.5 flex-shrink-0 transition-colors"
                    aria-label={t.completed ? 'Mark as not done (undo)' : 'Mark as done'}
                    title={t.completed ? 'Undo completion' : 'Mark as done'}
                  >
                    {t.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-accent-500 dark:text-accent-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300 transition-colors group-hover:text-primary-400 dark:text-slate-600 dark:group-hover:text-primary-400" />
                    )}
                  </button>

                  {isEditing ? (
                    <div className="min-w-0 flex-1 space-y-3">
                      <input
                        type="text"
                        value={editForm.task}
                        onChange={(e) => setEditForm((f) => ({ ...f, task: e.target.value }))}
                        className="input"
                        placeholder="Task name"
                        aria-label="Task name"
                      />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <select
                          value={editForm.subject}
                          onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                          className="input"
                          aria-label="Subject"
                        >
                          <option value="">Select subject…</option>
                          {subjectOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                          className="input"
                          aria-label="Date"
                        />
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value }))}
                          className="input"
                          aria-label="Priority"
                        >
                          {priorities.map((pl) => (
                            <option key={pl.value} value={pl.value}>{pl.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" onClick={() => saveEdit(t.id)} className="px-3 py-1.5 text-xs">
                          <Check className="h-3.5 w-3.5" />
                          Save
                        </Button>
                        <Button variant="ghost" onClick={cancelEdit} className="px-3 py-1.5 text-xs">
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`badge ${p.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                            {p.label}
                          </span>
                          <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {t.subject}
                          </span>
                          {isOverdue && (
                            <span className="badge bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">Overdue</span>
                          )}
                        </div>
                        <p
                          className={`mt-1.5 text-sm font-medium ${
                            t.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {t.task}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          Due{' '}
                          {new Date(t.date + 'T00:00:00').toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(t)}
                          className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-slate-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
                          aria-label="Edit task"
                          title="Edit task"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          className="flex-shrink-0 rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}