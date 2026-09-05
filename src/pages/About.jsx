import { Link } from 'react-router-dom'
import { Sparkles, Target, Users, Brain, ArrowRight } from 'lucide-react'
import Button from '../components/Button'

const audience = [
  {
    title: 'Students',
    description: 'From high school through university, who juggle multiple subjects and need a system that works.',
  },
  {
    title: 'Self-learners',
    description: 'Anyone studying on their own — online courses, certifications, or independent projects.',
  },
  {
    title: 'Busy professionals',
    description: 'People upskilling after work who need efficient, focused study sessions.',
  },
  {
    title: 'Teachers & tutors',
    description: 'Instructors who want to quickly prep quizzes or review material for their classes.',
  },
]

export default function About() {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-50/60 to-white px-4 py-16 dark:from-primary-900/40 dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            About StudyMate AI
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Learning, made lighter.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            StudyMate AI is an AI-powered study companion that helps students organize
            their learning, summarize notes, generate quizzes, build study plans, and get
            help with academic questions — all in one friendly workspace.
          </p>
        </div>
      </section>

      {/* Problem + solution */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">The problem</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              Students are drowning in material. Long lecture notes pile up, deadlines
              sneak closer, and revision is often a last-minute cram session. Balancing
              multiple subjects, staying organized, and testing understanding takes real
              effort — and most existing tools only solve one small piece of the puzzle.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Notes are scattered and hard to review before exams',
                'Active practice (quizzes) is time-consuming to create',
                'Study schedules fall apart without a clear plan',
                'Questions go unanswered outside class hours',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
              <Brain className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">What StudyMate AI does</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              We combine the four essentials of effective study into one place. Paste
              notes and get instant summaries. Turn any topic into a practice quiz. Plan
              your week with prioritized tasks. And chat with an AI assistant whenever a
              question comes to mind.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Condense long notes into key points and takeaways',
                'Generate quizzes on any topic at any difficulty',
                'Track study tasks with subjects, dates, and priorities',
                'Get clear, friendly explanations from an AI tutor',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">Who it&apos;s for</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Designed for every kind of learner
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audience.map((item) => (
              <div key={item.title} className="card card-hover p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">Our mission</h2>
            </div>
            <div className="p-8">
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                Our mission is to make effective studying accessible to every student —
                regardless of budget, schedule, or subject. We believe technology should
                remove friction from learning, not add to it. StudyMate AI is built to
                save students time, keep them organized, and help them actually
                understand their material through active practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI */}
      <section className="bg-slate-50 dark:bg-slate-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">Why AI?</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Why AI helps students learn more efficiently
            </h2>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
              AI is not about replacing studying — it&apos;s about amplifying the time you
              have.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Instant turnaround',
                text: 'Summarizing notes or creating a quiz takes seconds instead of hours, leaving more time for real studying.',
              },
              {
                title: 'Personalized practice',
                text: 'Quizzes and explanations adapt to your topic and level, so practice targets exactly what you need.',
              },
              {
                title: 'Active recall at scale',
                text: 'AI-generated questions make self-testing easy and repeatable — the most proven way to retain material.',
              },
              {
                title: 'No more waiting',
                text: 'Unlike a classroom or office hours, an AI assistant is ready whenever the question strikes.',
              },
            ].map((item) => (
              <div key={item.title} className="card card-hover p-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Experience it yourself
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-500 dark:text-slate-400">
            All four tools are live right now — no account needed.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/tools">
              <Button variant="primary">
                Explore the AI Tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="secondary">See the features</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}