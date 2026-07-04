import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { PulseDot } from '@/components/ui/PulseDot'
import { ForecastChart } from '@/components/charts/ForecastChart'
import { DecisionFeedItem } from '@/components/dashboard/DecisionFeedItem'
import {
  AlertTriangle,
  TrendingUp as OppIcon,
  Bell,
  Package,
  Crown,
  Zap,
  Sparkles,
} from 'lucide-react'
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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

// Premium-pass hero page: same widgets as Sprint 3, upgraded with staggered
// entrance motion, hover elevation, and tighter visual hierarchy.
export function DashboardPage() {
  const topDecisions = decisions.slice(0, 3)

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] dark:border-[var(--color-border-dark)] sm:flex">
          <PulseDot />
          AI monitoring live
        </div>
      </motion.div>

      {/* Row 1: Business Health + KPIs */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Card className="relative overflow-hidden lg:col-span-1">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-accent-soft)] blur-2xl dark:bg-[var(--color-accent-soft-dark)]" />
          <div className="relative flex items-center gap-2">
            <PulseDot />
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Business Health Score</p>
          </div>
          <p className="font-data relative mt-2 text-4xl font-bold">{businessHealthScore.score}</p>
          <p className={`relative mt-1 text-xs font-medium ${businessHealthScore.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {businessHealthScore.change > 0 ? '+' : ''}{businessHealthScore.change} pts vs last month
          </p>
          <Link to="/app/business-health" className="relative mt-3 inline-block text-xs font-medium text-[var(--color-accent)] hover:underline">
            View breakdown →
          </Link>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {kpis.map((kpi) => (
            <StatCard key={kpi.id} {...kpi} />
          ))}
        </div>
      </motion.div>

      {/* Row 2: Forecast + Recent AI Decisions */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-[var(--color-accent)]" />
              <p className="text-sm font-semibold">Sales Forecast</p>
            </div>
            <Link to="/app/forecast" className="text-xs font-medium text-[var(--color-accent)] hover:underline">View details →</Link>
          </div>
          <ForecastChart data={forecastData} />
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5 lg:col-span-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--color-accent)]" />
              <p className="text-sm font-semibold">AI Decision Center</p>
            </div>
            <Link to="/app/decision-center" className="text-xs font-medium text-[var(--color-accent)] hover:underline">See all →</Link>
          </div>
          <div>
            {topDecisions.map((d) => (
              <DecisionFeedItem key={d.id} decision={d} />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Row 3: Top Products, Top Customers, Quick Actions */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
          <div className="mb-3 flex items-center gap-2">
            <Package size={15} className="text-[var(--color-accent)]" />
            <p className="text-sm font-semibold">Top Products</p>
          </div>
          <ul className="space-y-2.5">
            {topProducts.map((p) => (
              <li key={p.name} className="flex items-center justify-between text-sm">
                <span className="truncate pr-2 text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{p.name}</span>
                <span className="font-data shrink-0 text-[var(--color-muted)]">{formatCurrency(p.revenue, { compact: true })}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
          <div className="mb-3 flex items-center gap-2">
            <Crown size={15} className="text-[var(--color-accent)]" />
            <p className="text-sm font-semibold">Top Customers</p>
          </div>
          <ul className="space-y-2.5">
            {topCustomers.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{c.name}</span>
                <span className="font-data text-[var(--color-muted)]">{formatCurrency(c.ltv, { compact: true })}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
          <p className="mb-3 text-sm font-semibold">Quick Actions</p>
          <ul className="space-y-2">
            {quickActions.map((a) => (
              <li key={a.id}>
                <button className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-gray-50 dark:border-[var(--color-border-dark)] dark:hover:bg-white/5">
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Row 4: Alerts, Risks, Opportunities */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
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
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
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
        <Card className="transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5">
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
      </motion.div>
    </div>
  )
}
