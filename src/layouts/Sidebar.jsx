import { NavLink } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'
import { NAV_ITEMS } from '@/constants/nav'
import { cn } from '@/utils/cn'

// Persistent left nav (desktop) / slide-in drawer (mobile, controlled by `open`+`onClose`).
// Reads NAV_ITEMS so adding a route never means touching this file again.
export function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 dark:border-[var(--color-border-dark)] dark:bg-[var(--color-surface-dark)]',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-base font-semibold">AURA AI</span>
          </div>
          <button onClick={onClose} className="text-[var(--color-muted)] lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] dark:bg-[var(--color-accent-soft-dark)]'
                    : 'text-[var(--color-muted)] hover:bg-gray-50 hover:text-[var(--color-ink)] dark:text-[var(--color-muted-dark)] dark:hover:bg-white/5 dark:hover:text-[var(--color-ink-dark)]'
                )
              }
            >
              <item.icon size={17} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {item.status === 'placeholder' && (
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/10 dark:text-gray-400">
                  soon
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] px-5 py-4 text-xs text-[var(--color-muted)] dark:border-[var(--color-border-dark)]">
          AURA AI v0.1 — MVP
        </div>
      </aside>
    </>
  )
}
