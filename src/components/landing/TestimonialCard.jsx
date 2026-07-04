import { Card } from '@/components/ui/Card'

// Photo placeholder is initials-on-accent-circle (no image asset needed for MVP).
export function TestimonialCard({ name, company, quote }) {
  const initials = name.split(' ').map((n) => n[0]).join('')
  return (
    <Card className="flex h-full flex-col justify-between">
      <p className="text-sm leading-relaxed text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">{company}</p>
        </div>
      </div>
    </Card>
  )
}
