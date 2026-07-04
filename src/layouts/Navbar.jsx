import { useLocation, Link } from 'react-router-dom'
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { NAV_ITEMS } from '@/constants/nav'

// Top bar: breadcrumb/page title (left), global search (center, decorative in MVP),
// notifications + theme toggle + avatar (right). Mobile menu button only shows <lg.
export function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const current = NAV_ITEMS.find((item) =>
    item.path === '/app' ? pathname === '/app' : pathname.startsWith(item.path)
  )

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 py-3 backdrop-blur dark:border-[var(--color-border-dark)] dark:bg-[var(--color-surface-dark)]/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-[var(--color-muted)] lg:hidden">
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
          {current?.label ?? 'AURA AI'}
        </h1>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-muted)] md:mx-8 md:flex dark:border-[var(--color-border-dark)]">
        <Search size={15} />
        <span className="flex-1">Search customers, orders, reports…</span>
        <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] dark:border-[var(--color-border-dark)]">⌘K</kbd>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]">
          <Bell size={19} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <Link
          to="/app/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white"
        >
          RS
        </Link>
      </div>
    </header>
  )
}
