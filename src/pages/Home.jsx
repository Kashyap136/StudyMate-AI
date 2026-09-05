import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, HelpCircle, CalendarClock, GraduationCap, BookOpen, Target, Zap, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import FeatureCard from '../components/FeatureCard'
import { features, steps, benefits } from '../data/features'

function HeroVisual() {
  const floatingCards = [
    { icon: FileText, className: 'top-6 right-2', label: 'Summarized in 3 bullet points' },
    { icon: HelpCircle, className: 'bottom-10 left-0 -rotate-3', label: 'Quiz score: 9/10' },
    { icon: CalendarClock, className: '-top-5 left-8 rotate-2', label: '3 tasks due today' },
  ]

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="relative rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-2xl shadow-primary-600/10">
        <div className="flex items-center gap-2">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a4 4 0 0 1 4 4c0 1.1-.45 2.1-1.18 2.83A4 4 0 0 1 12 10a4 4 0 0 1-4-4 4 4 0 0 1 4-4z'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3C/svg%3E"
            alt=""
            className="h-6 w-6 rounded-full"
          />
          <div className="flex-1">
            <div className="h-2.5 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-1.5 h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
            AI Active
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 p-5 dark:from-primary-900/40 dark:to-accent-900/30">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Study Assistant</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            Help me understand how React state works
          </h3>
          <div className="mt-4 space-y-2.5">
            <div className="rounded-xl bg-white p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300 shadow-sm">
              React state is data that triggers a re-render when it changes. Think of it
              as the "memory" of a component...
            </div>
            <div className="rounded-xl bg-primary-600 p-3 text-sm text-white shadow-lg shadow-primary-600/20">
              State changes automatically update the UI — that's what makes React reactive!
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Summarize', value: 'Notes' },
            { label: 'Generate', value: 'Quiz' },
            { label: 'Plan', value: 'Study' },
          ].map((item) => (
            <div key={item.value} className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 p-3 text-center">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</div>
              <div className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {floatingCards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`absolute hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-3.5 py-2.5 shadow-lg shadow-slate-900/5 md:flex md:items-center md:gap-2 ${card.className} animate-float`}
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{card.label}</span>
          </div>
        )
      })}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="animate-slide-up">
              <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                <Sparkles className="h-3.5 w-3.5" />
                Your AI-powered study companion
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Study Smarter{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                StudyMate AI helps you organize your learning, summarize notes,
                generate practice quizzes, plan your study time, and get answers to
                academic questions — all from one beautiful workspace.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/tools">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">Free • No sign-up • Works in your browser</p>
              </div>
            </div>

            <div className="animate-fade-in lg:py-4">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Features preview */}
      <section className="bg-white dark:bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">Core Tools</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to study effectively
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Four intelligent tools designed around the way students actually learn.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/features">
              <Button variant="secondary">
                View all features
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">How It Works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Three simple steps
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
              From raw material to mastery — in no time.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
                {step.number !== '03' && (
                  <div className="absolute right-[15%] top-8 hidden h-0.5 w-[70%] bg-gradient-to-r from-primary-200 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white dark:bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">Why StudyMate AI?</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Built around how learning really works
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
                Research shows that active practice, organization, and spaced review are
                the most effective study strategies. StudyMate AI bakes all three into
                one simple workflow.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                      {benefit.title === 'Save Time' && <Zap className="h-4 w-4" />}
                      {benefit.title === 'Learn Actively' && <Target className="h-4 w-4" />}
                      {benefit.title === 'Stay Organized' && <BookOpen className="h-4 w-4" />}
                      {benefit.title === 'Always Available' && <ShieldCheck className="h-4 w-4" />}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[GraduationCap, FileText, HelpCircle, CalendarClock].map((Icon, i) => (
                <div
                  key={i}
                  className={`card flex flex-col items-center justify-center gap-3 p-8 text-center ${
                    i % 2 === 0 ? 'mt-6' : ''
                  }`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {['Smart Summaries', 'Practice Quizzes', 'Study Plans', '24/7 AI Tutor'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            Open the AI tools dashboard and start summarizing notes, taking quizzes, or
            planning your study schedule right now.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/tools">
              <Button variant="primary" className="w-full sm:w-auto">
                Launch AI Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="w-full border border-slate-600 bg-transparent text-white hover:bg-slate-800 sm:w-auto">
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}