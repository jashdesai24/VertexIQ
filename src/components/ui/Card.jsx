import { cn } from '@/utils/cn'

// The base surface every widget sits on. One place controls border, radius,
// padding, and dark-mode surface color for the entire app.
export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)]',
        'bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]',
        'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
