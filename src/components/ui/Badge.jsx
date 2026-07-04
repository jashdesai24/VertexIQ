import { cn } from '@/utils/cn'

const VARIANTS = {
  success: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300',
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] dark:bg-[var(--color-accent-soft-dark)]',
}

// Status pills used for churn-risk badges, priority tags, category tags, etc.
export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
