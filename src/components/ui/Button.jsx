import { cn } from '@/utils/cn'

const VARIANTS = {
  primary: 'bg-[var(--color-accent)] text-white hover:opacity-90',
  secondary:
    'border border-[var(--color-border)] dark:border-[var(--color-border-dark)] text-[var(--color-ink)] dark:text-[var(--color-ink-dark)] hover:bg-gray-50 dark:hover:bg-white/5',
  ghost: 'text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]',
}

export function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
