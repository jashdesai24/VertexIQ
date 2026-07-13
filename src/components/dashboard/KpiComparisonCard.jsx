import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatNumber } from '@/utils/format'

// Reusable KPI Comparison Card (Sprint 10B, Part 4). One component driven
// entirely by props — supports Revenue/Orders/Customers/Products by passing
// a different `format`, not by having 4 separate components.
export function KpiComparisonCard({ label, current, previous, percentage, format = 'number' }) {
  const isPositive = percentage > 0
  const isFlat = percentage === 0
  const Icon = isFlat ? Minus : isPositive ? TrendingUp : TrendingDown
  const colorClass = isFlat
    ? 'text-[var(--color-muted)]'
    : isPositive
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'

  const displayValue = format === 'currency' ? formatCurrency(current, { compact: true }) : formatNumber(current)
  const displayPrevious = format === 'currency' ? formatCurrency(previous, { compact: true }) : formatNumber(previous)

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
        {label}
      </p>
      <p className="font-data mt-2 text-2xl font-semibold">{displayValue}</p>
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${colorClass}`}>
        <Icon size={14} />
        <span>{Math.abs(percentage).toFixed(1)}% vs previous period</span>
      </div>
      <p className="mt-1 text-xs text-[var(--color-muted)]">Previous: {displayPrevious}</p>
    </Card>
  )
}
