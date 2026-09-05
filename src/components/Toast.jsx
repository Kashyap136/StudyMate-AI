import { useCallback, useState, useRef } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { ToastContext } from './ToastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    delete timers.current[id]
  }, [])

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type }])
      timers.current[id] = setTimeout(() => dismiss(id), 4000)
    },
    [dismiss]
  )

  const config = {
    success: { icon: CheckCircle2, accent: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-500/40', bg: 'bg-emerald-50 dark:bg-emerald-500/15' },
    error: { icon: XCircle, accent: 'text-red-600', border: 'border-red-200 dark:border-red-500/40', bg: 'bg-red-50 dark:bg-red-500/15' },
    info: { icon: Info, accent: 'text-primary-600', border: 'border-primary-200 dark:border-primary-500/40', bg: 'bg-primary-50 dark:bg-primary-500/15' },
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toast) => {
          const { icon: Icon, accent, border, bg } = config[toast.type]
          return (
            <div
              key={toast.id}
              className={`${bg} ${border} flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-slide-in-right`}
              role="status"
            >
              <Icon className={`${accent} mt-0.5 h-5 w-5 flex-shrink-0`} />
              <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700/60 dark:hover:text-slate-300"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}