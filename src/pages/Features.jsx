import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import { features } from '../data/features'

export default function Features() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="bg-gradient-to-b from-primary-50/60 to-white px-4 py-16 dark:from-primary-900/40 dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Features
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Four tools. One study workflow.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Each feature is designed to plug into how you actually study — take material
            in, practice it actively, stay organized, and get unstuck fast.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const layout = index % 2
            return (
              <article
                key={feature.id}
                className="card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-500/40"
              >
                <div className={`flex flex-col gap-6 p-8 ${layout ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{feature.title}</h2>
                    <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">{feature.description}</p>
                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Benefits
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link to={feature.toolPath} className="mt-6 inline-block">
                      <Button variant="primary">
                        Try Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-14 rounded-3xl bg-slate-900 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            All tools are live right now
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-300">
            Open the dashboard and try every feature — notes, quizzes, plans, and chat.
          </p>
          <div className="mt-6">
            <Link to="/tools">
              <Button variant="primary" className="px-8">
                Launch AI Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}