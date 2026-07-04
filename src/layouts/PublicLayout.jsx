import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

// Minimal shell for Landing + Login — just a slim top bar, no sidebar.
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
            <Sparkles size={16} />
          </div>
          <span className="text-base font-semibold">AURA AI</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]">
            Log in
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
