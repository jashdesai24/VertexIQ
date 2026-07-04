import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PulseDot } from '@/components/ui/PulseDot'

const PRIORITY_VARIANT = { high: 'danger', medium: 'warning', low: 'neutral' }

// One row in the Decision Center feed (also used for the "top 3" preview on Dashboard).
// Every row carries its own reasoning — this IS the Explainable AI principle in UI form.
export function DecisionFeedItem({ decision, expanded = false }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 last:border-0 dark:border-[var(--color-border-dark)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <PulseDot className="mt-1.5 shrink-0" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge variant={PRIORITY_VARIANT[decision.priority]}>{decision.priority} priority</Badge>
              <Badge variant="accent">{decision.category}</Badge>
            </div>
            <p className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
              {decision.title}
            </p>
            <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">{decision.impact}</p>
          </div>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0 text-[var(--color-muted)]" />
      </div>

      {expanded && (
        <div className="ml-4 rounded-lg bg-gray-50 p-3 text-xs dark:bg-white/5">
          <p className="mb-1.5 font-medium text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">Why this was flagged:</p>
          <ul className="list-disc space-y-1 pl-4 text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
            {decision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <p className="mt-2 font-medium text-[var(--color-accent)]">Suggested action: {decision.action}</p>
        </div>
      )}
    </div>
  )
}
