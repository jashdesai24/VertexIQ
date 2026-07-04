import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from './Card'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format'

// The KPI card used 4x on the Dashboard (Revenue/Profit/Growth/Retention).
// One component, one formatting rule, driven entirely by the `format` prop.
export function StatCard({ label, value, change, format }) {
  const isPositive = change >= 0
  const displayValue =
    format === 'currency'
      ? formatCurrency(value, { compact: true })
      : format === 'percent'
        ? `${value}%`
        : formatNumber(value)

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
        {label}
      </p>
      <p className="font-data mt-2 text-2xl font-semibold">{displayValue}</p>
      <div
        className={`mt-2 flex items-center gap-1 text-xs font-medium ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}
      >
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{formatPercent(change)} vs last month</span>
      </div>
    </Card>
  )
}
