import { useNavigate } from 'react-router-dom'
import { FileText, HelpCircle, CalendarClock, GraduationCap, ExternalLink } from 'lucide-react'

const tools = [
  {
    id: 'summarizer',
    name: 'Notes Summarizer',
    description: 'Condense your notes into key points',
    icon: FileText,
  },
  {
    id: 'quiz',
    name: 'Quiz Generator',
    description: 'Practice any topic with quizzes',
    icon: HelpCircle,
  },
  {
    id: 'planner',
    name: 'Study Planner',
    description: 'Organize tasks with priorities',
    icon: CalendarClock,
  },
  {
    id: 'assistant',
    name: 'AI Study Assistant',
    description: 'Chat with your AI tutor',
    icon: GraduationCap,
  },
]

export default function ToolCard({ toolId, active }) {
  const navigate = useNavigate()
  const tool = tools.find((t) => t.id === toolId)
  const Icon = tool?.icon || FileText

  return (
    <button
      type="button"
      onClick={() => navigate(`/tools?tool=${tool.id}`)}
      className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
        active
          ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-500/20 dark:border-primary-500 dark:bg-primary-500/10 dark:ring-primary-500/30'
          : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-600 dark:hover:bg-slate-800'
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            active ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className={`block text-sm font-semibold ${active ? 'text-primary-800 dark:text-primary-200' : 'text-slate-800 dark:text-slate-100'}`}>
            {tool?.name}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{tool?.description}</span>
        </span>
      </span>
      <ExternalLink className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 group-hover:text-primary-500 dark:text-slate-600 dark:group-hover:text-primary-400'}`} />
    </button>
  )
}