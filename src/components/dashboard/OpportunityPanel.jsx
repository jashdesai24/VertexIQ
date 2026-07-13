import { TrendingUp, Crown, Zap, Star, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'

// Finds the first opportunity whose title starts with any of the given
// prefixes — a presentation-level lookup only (the underlying business logic
// of computing these opportunities lives entirely in opportunityEngine.js;
// this just picks which pre-computed item goes in which panel slot).
function findOpportunity(opportunities, prefixes) {
  return opportunities.find((o) => prefixes.some((p) => o.title.startsWith(p)))
}

function mostImprovedMetric(trends) {
  const labels = { revenueTrend: 'Revenue', ordersTrend: 'Orders', customerTrend: 'Customer growth', productTrend: 'Product variety' }
  const entries = Object.entries(trends).filter(([, t]) => t.trend === 'up')
  if (entries.length === 0) return null
  const [key, best] = entries.reduce((a, b) => (b[1].percentage > a[1].percentage ? b : a))
  return { label: labels[key] || key, percentage: best.percentage }
}

// Opportunity Panel (Sprint 10B, Part 5): Top Growth Opportunity, Highest
// Revenue Customer, Fastest Growing Product, Most Valuable Customer, Most
// Improved Metric. All derived from already-computed opportunities/metrics/
// trends passed in as props — no new business logic here.
export function OpportunityPanel({ opportunities, metrics, trends }) {
  const topGrowth = opportunities[0]
  const highestRevenueCustomer = metrics.topCustomers[0]
  const fastestGrowingProduct = findOpportunity(opportunities, ['Fastest growing product'])
  const mostValuableCustomer = findOpportunity(opportunities, ['Best repeat customer', 'Highest revenue customer'])
  const improved = mostImprovedMetric(trends)

  const rows = [
    { icon: TrendingUp, label: 'Top Growth Opportunity', value: topGrowth ? topGrowth.title : 'No standout opportunity detected' },
    {
      icon: Crown,
      label: 'Highest Revenue Customer',
      value: highestRevenueCustomer ? `${highestRevenueCustomer.name} (${formatCurrency(highestRevenueCustomer.ltv, { compact: true })})` : '—',
    },
    { icon: Zap, label: 'Fastest Growing Product', value: fastestGrowingProduct ? fastestGrowingProduct.title.replace('Fastest growing product: ', '') : '—' },
    { icon: Star, label: 'Most Valuable Customer', value: mostValuableCustomer ? mostValuableCustomer.title.replace(/^(Best repeat customer|Highest revenue customer): /, '') : '—' },
    { icon: ArrowUpRight, label: 'Most Improved Metric', value: improved ? `${improved.label} (+${improved.percentage}%)` : 'No metric improved this period' },
  ]

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold">Opportunity Panel</p>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-2.5">
            <r.icon size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
            <div>
              <p className="text-xs text-[var(--color-muted)]">{r.label}</p>
              <p className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{r.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
