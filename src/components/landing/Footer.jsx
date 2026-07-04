import { Link } from 'react-router-dom'
import { Sparkles, Mail } from 'lucide-react'
import { footerLinks } from '@/data/landingData'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-10 dark:border-[var(--color-border-dark)] lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
              <Sparkles size={14} />
            </div>
            <span className="text-sm font-semibold">AURA AI</span>
          </div>
          <p className="mt-2 text-xs text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
            Your AI Growth Operating System.
          </p>
          <div className="mt-4 flex items-center gap-3 text-[var(--color-muted)]">
            <a href="#" className="text-xs font-medium hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]">GitHub</a>
            <a href="#" className="text-xs font-medium hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]">LinkedIn</a>
            <a href="#" aria-label="Contact" className="hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]"><Mail size={16} /></a>
          </div>
        </div>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{section}</p>
            <ul className="mt-3 space-y-2">
              {links.map((l) => (
                <li key={l}>
                  <Link to="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:text-[var(--color-muted-dark)] dark:hover:text-[var(--color-ink-dark)]">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-[var(--color-muted)]">© 2026 AURA AI. Built as a portfolio project.</p>
    </footer>
  )
}
