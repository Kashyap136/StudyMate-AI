import { useState } from 'react'
import { Sparkles, Send, CheckCircle2, Loader2, Mail, MapPin, Clock } from 'lucide-react'
import Button from '../components/Button'
import { useToast } from '../components/ToastContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const subjectOptions = [
  'General question',
  'Feedback',
  'Feature request',
  'Report a bug',
  'Something else',
]

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const supportCards = [
  {
    icon: Mail,
    title: 'Email us',
    text: 'hello@studymate-ai.example',
    note: 'We reply within 2 business days.',
  },
  {
    icon: Clock,
    title: 'Fastest response',
    text: 'Use the AI Study Assistant',
    note: 'Instant answers on study topics.',
  },
  {
    icon: MapPin,
    title: 'Where to find us',
    text: 'The Tools dashboard',
    note: 'No account needed to get started.',
  },
]

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const showToast = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    } else if (form.name.trim().length < 2) {
      nextErrors.name = 'Your name should be at least 2 characters.'
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!EMAIL_RE.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!form.subject) nextErrors.subject = 'Please choose a subject.'
    const messageLength = form.message.trim().length
    if (!form.message.trim()) {
      nextErrors.message = 'Please write a message.'
    } else if (messageLength < 10) {
      nextErrors.message = 'Your message should be at least 10 characters.'
    } else if (messageLength > 2000) {
      nextErrors.message = 'Your message is too long — please keep it under 2000 characters.'
    }
    return nextErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      showToast('Please fix the errors in the form.', 'error')
      return
    }

    setSending(true)
    // Simulate a server round-trip
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm(initialForm)
      showToast('Message sent successfully!', 'success')
    }, 900)
  }

  const handleReset = () => {
    setForm(initialForm)
    setErrors({})
    setSent(false)
    showToast('Form cleared.', 'info')
  }

  const inputClass = (field) =>
    `input ${errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-50/60 to-white px-4 py-16 dark:from-primary-900/40 dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Contact
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Have a question, a feature idea, or some feedback? Drop us a line — we read
            every message.
          </p>
        </div>
      </section>

      {/* Support cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {supportCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="card card-hover flex items-start gap-4 p-6">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">{card.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{card.note}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact form */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {sent ? (
            <div className="card flex flex-col items-center gap-4 p-12 text-center animate-fade-in">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Message sent!</h2>
              <p className="max-w-md text-slate-500 dark:text-slate-400">
                Thanks for reaching out. This demo simulates a successful submission — in
                a real deployment your message would be delivered to our team.
              </p>
              <Button variant="secondary" onClick={handleReset} className="mt-2">
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="card space-y-6 p-6 sm:p-8">
              <div>
                <label htmlFor="contact-name" className="label">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="label">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-subject" className="label">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputClass('subject')}
                  aria-invalid={!!errors.subject}
                >
                  <option value="">Select a subject…</option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows={6}
                  className={`${inputClass('message')} min-h-32 resize-y`}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={sending}
                  className="sm:flex-1 sm:max-w-xs"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                This is a demo form — no data is stored or transmitted anywhere.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
