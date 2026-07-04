import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { PulseDot } from '@/components/ui/PulseDot'
import { ForecastChart } from '@/components/charts/ForecastChart'
import { DecisionFeedItem } from '@/components/dashboard/DecisionFeedItem'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp as OppIcon, Bell } from 'lucide-react'
import {
  businessHealthScore,
  kpis,
  forecastData,
  topProducts,
  topCustomers,
  recentAlerts,
  upcomingRisks,
  businessOpportunities,
  quickActions,
} from '@/data/dashboardData'
import { decisions } from '@/data/decisionData'
import { formatCurrency } from '@/utils/format'

// The hero page. Every widget from Sprint 2's dashboard spec is present here,
// composed from the reusable ui/ and charts/ components — this file only arranges layout.
export function DashboardPage() {
  const topDecisions = decisions.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Row 1: Business Health + KPIs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <PulseDot />
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Business Health Score</p>
          </div>
          <p className="font-data mt-2 text-4xl font-bold">{businessHealthScore.score}</p>
          <p className={`mt-1 text-xs font-medium ${businessHealthScore.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {businessHealthScore.change > 0 ? '+' : ''}{businessHealthScore.change} pts vs last month
          </p>
          <Link to="/app/business-health" className="mt-3 inline-block text-xs font-medium text-[var(--color-accent)]">
            View breakdown →
          </Link>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {kpis.map((kpi) => (
            <StatCard key={kpi.id} {...kpi} />
          ))}
        </div>
      </div>

      {/* Row 2: Forecast + Recent AI Decisions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Sales Forecast</p>
            <Link to="/app/forecast" className="text-xs font-medium text-[var(--color-accent)]">View details →</Link>
          </div>
          <ForecastChart data={forecastData} />
        </Card>
        <Card className="lg:col-span-1">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-semibold">Recent AI Decisions</p>
            <Link to="/app/decision-center" className="text-xs font-medium text-[var(--color-accent)]">See all →</Link>
          </div>
          <div>
            {topDecisions.map((d) => (
              <DecisionFeedItem key={d.id} decision={d} />
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Top Products, Top Customers, Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <p className="mb-3 text-sm font-semibold">Top Products</p>
          <ul className="space-y-2.5">
            {topProducts.map((p) => (
              <li key={p.name} className="flex items-center justify-between text-sm">
                <span className="truncate pr-2 text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{p.name}</span>
                <span className="font-data shrink-0 text-[var(--color-muted)]">{formatCurrency(p.revenue, { compact: true })}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="mb-3 text-sm font-semibold">Top Customers</p>
          <ul className="space-y-2.5">
            {topCustomers.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{c.name}</span>
                <span className="font-data text-[var(--color-muted)]">{formatCurrency(c.ltv, { compact: true })}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="mb-3 text-sm font-semibold">Quick Actions</p>
          <ul className="space-y-2">
            {quickActions.map((a) => (
              <li key={a.id}>
                <button className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm hover:bg-gray-50 dark:border-[var(--color-border-dark)] dark:hover:bg-white/5">
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Row 4: Alerts, Risks, Opportunities */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Bell size={15} className="text-[var(--color-danger)]" />
            <p className="text-sm font-semibold">Recent Alerts</p>
          </div>
          <ul className="space-y-2">
            {recentAlerts.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-sm">
                <Badge variant={a.type === 'danger' ? 'danger' : 'warning'} className="mt-0.5 shrink-0">•</Badge>
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{a.text}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-[var(--color-warning)]" />
            <p className="text-sm font-semibold">Upcoming Risks</p>
          </div>
          <ul className="space-y-2">
            {upcomingRisks.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{r.text}</span>
                <Badge variant="danger">{r.impact}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <OppIcon size={15} className="text-[var(--color-success)]" />
            <p className="text-sm font-semibold">Business Opportunities</p>
          </div>
          <ul className="space-y-2">
            {businessOpportunities.map((o) => (
              <li key={o.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{o.text}</span>
                <Badge variant="success">{o.impact}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
