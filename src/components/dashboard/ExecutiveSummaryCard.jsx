import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PulseDot } from '@/components/ui/PulseDot'

// The AI Executive Summary — top-of-Dashboard narrative generated entirely
// from executiveSummaryService output (rule-based today, LLM-backed later;
// this component doesn't change either way since it just renders the object).
export function ExecutiveSummaryCard({ summary }) {
  return (
    <Card className="border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-accent-soft)] to-transparent dark:from-[var(--color-accent-soft-dark)]">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)] text-white">
          <Sparkles size={14} />
        </div>
        <p className="text-sm font-semibold">AI Executive Summary</p>
        <PulseDot className="ml-auto" />
      </div>

      <ul className="space-y-1.5 text-sm text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
        <li>{summary.revenueTrend}</li>
        <li>{summary.customerGrowth}</li>
        <li>Top customer: <span className="font-medium">{summary.topCustomer || '—'}</span></li>
        <li>Highest-selling product: <span className="font-medium">{summary.topProduct || '—'}</span></li>
        <li>{summary.concentrationNote}</li>
        <li>{summary.retentionNote}</li>
      </ul>

      <div className="mt-4 border-t border-[var(--color-border)] pt-3 dark:border-[var(--color-border-dark)]">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Recommended Actions</p>
        <ul className="space-y-1 text-sm">
          {summary.recommendedActions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--color-accent)]">•</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
