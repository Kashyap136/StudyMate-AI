import { Link } from 'react-router-dom'
import { GraduationCap, Mail, MessageCircle } from 'lucide-react'

const productLinks = [
  { to: '/features', label: 'Features' },
  { to: '/tools', label: 'AI Tools' },
  { to: '/about', label: 'About Us' },
]

const resourcesLinks = [
  { to: '/tools?tool=summarizer', label: 'Notes Summarizer' },
  { to: '/tools?tool=quiz', label: 'Quiz Generator' },
  { to: '/tools?tool=planner', label: 'Study Planner' },
  { to: '/tools?tool=assistant', label: 'Study Assistant' },
]

const companyLinks = [
  { to: '/contact', label: 'Contact Us' },
  { to: '/about', label: 'Our Mission' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                StudyMate<span className="text-primary-600"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your AI-powered study companion. Summarize notes, generate quizzes, plan
              your study time, and get help with academic questions — all in one place.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tools</h3>
            <ul className="mt-4 space-y-3">
              {resourcesLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {currentYear} StudyMate AI. Built as a demonstration project.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="mailto:hello@studymate-ai.example"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-slate-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
              aria-label="Email"
              title="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <Link
              to="/contact"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-slate-500 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
              aria-label="Contact"
              title="Contact"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}