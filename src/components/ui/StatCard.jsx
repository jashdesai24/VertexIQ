import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Users2, Repeat } from 'lucide-react'
import { Card } from './Card'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format'

const ICONS = { revenue: DollarSign, profit: PiggyBank, growth: Users2, retention: Repeat }

// The KPI card used 4x on the Dashboard (Revenue/Profit/Growth/Retention).
// One component, one formatting rule, driven entirely by the `format` prop.
export function StatCard({ label, value, change, format, icon }) {
  const isPositive = change >= 0
  const Icon = ICONS[icon]
  const displayValue =
    format === 'currency'
      ? formatCurrency(value, { compact: true })
      : format === 'percent'
        ? `${value}%`
        : formatNumber(value)

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          {label}
        </p>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)] dark:bg-[var(--color-accent-soft-dark)]">
            <Icon size={14} />
          </div>
        )}
      </div>
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
