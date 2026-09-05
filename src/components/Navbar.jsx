import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { GraduationCap, Menu, X, Sun, Moon, Monitor } from 'lucide-react'
import Button from './Button'
import { useTheme } from './ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/tools', label: 'AI Tools' },
  { to: '/contact', label: 'Contact' },
]

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function ThemeSelector({ compact = false }) {
  const { theme, setTheme } = useTheme()

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
        {themeOptions.map((opt) => {
          const Icon = opt.icon
          const active = theme === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              aria-pressed={active}
              aria-label={`${opt.label} theme`}
              title={opt.label}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                active
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800">
      <Sun className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        aria-label="Theme"
        className="cursor-pointer appearance-none bg-transparent pl-8 pr-7 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-200"
      >
        {themeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Monitor className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md transition-shadow duration-300 dark:bg-slate-900/90 ${
        scrolled ? 'shadow-md shadow-slate-900/5 dark:shadow-slate-950/40' : 'border-b border-slate-100 dark:border-slate-800'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-600/30 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            StudyMate<span className="text-primary-600"> AI</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="mx-2 hidden w-px self-stretch bg-slate-200 dark:bg-slate-700 md:block" />
          <div className="hidden md:block">
            <ThemeSelector />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <ThemeSelector compact />
              <div className="mt-2">
                <NavLink to="/tools" className="block w-full" onClick={closeMobileMenu}>
                  <Button variant="primary" className="w-full">
                    Launch App
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}