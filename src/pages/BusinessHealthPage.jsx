import { Card } from '@/components/ui/Card'
import { PulseDot } from '@/components/ui/PulseDot'
import { HealthTrendChart } from '@/components/charts/HealthTrendChart'
import { healthHistory } from '@/data/businessHealthData'
import { useAppData } from '@/hooks/useAppData'
import { cn } from '@/utils/cn'

const STATUS_COLOR = {
  good: 'bg-green-500',
  neutral: 'bg-amber-500',
  bad: 'bg-red-500',
}

// Score, breakdown, and explanation now come from healthScoreService via the
// intelligence engine — nothing here is hardcoded. Trend history (healthHistory)
// remains illustrative until score snapshots are persisted (needs the Sprint 7 backend/DB).
export function BusinessHealthPage() {
  const { getIntelligence } = useAppData()
  const { healthScore } = getIntelligence()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Business Health</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          One score, explained — computed from your revenue trend, retention, concentration, and dependency signals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <PulseDot />
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Score</p>
          </div>
          <p className="font-data mt-2 text-5xl font-bold">{healthScore.score}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">out of 100</p>
          <div className="mt-4 space-y-1.5 rounded-lg bg-[var(--color-accent-soft)] p-3 text-xs text-[var(--color-accent)] dark:bg-[var(--color-accent-soft-dark)]">
            {healthScore.explanation.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <p className="mb-2 text-sm font-semibold">Score Trend (illustrative)</p>
          <HealthTrendChart data={healthHistory} />
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Trend history will reflect real historical scores once snapshots are persisted (Sprint 7 backend).
          </p>
        </Card>
      </div>

      <Card>
        <p className="mb-4 text-sm font-semibold">Score Breakdown by Component</p>
        <div className="space-y-4">
          {healthScore.breakdown.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{c.label}</span>
                <span className="font-data text-xs text-[var(--color-muted)]">
                  {c.contribution}/{c.weight} pts
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <div
                  className={cn('h-full rounded-full', STATUS_COLOR[c.status])}
                  style={{ width: `${Math.min(100, (c.contribution / c.weight) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
