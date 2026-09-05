import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FeatureCard({ feature, index = 0 }) {
  const Icon = feature.icon

  return (
    <div
      className="card card-hover flex flex-col p-6"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {feature.description}
      </p>
      <ul className="mt-4 space-y-2">
        {feature.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
            {benefit}
          </li>
        ))}
      </ul>
      <Link
        to={feature.toolPath}
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Try now
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}