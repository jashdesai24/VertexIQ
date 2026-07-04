import { Card } from '@/components/ui/Card'
import { PulseDot } from '@/components/ui/PulseDot'
import { Badge } from '@/components/ui/Badge'
import { ForecastChart } from '@/components/charts/ForecastChart'
import { businessHealthScore, kpis, forecastData } from '@/data/dashboardData'
import { decisions } from '@/data/decisionData'
import { formatCurrency, formatPercent } from '@/utils/format'

// A non-interactive preview of the real Dashboard, built from the same
// components + dummy data — not a screenshot, so it never goes stale.
export function DashboardPreview() {
  const topDecision = decisions[0]

  return (
    <Card className="pointer-events-none select-none p-4 shadow-xl shadow-black/5 lg:p-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-1.5">
            <PulseDot />
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)]">Business Health</p>
          </div>
          <p className="font-data mt-1 text-3xl font-bold">{businessHealthScore.score}</p>
          <p className="text-[11px] font-medium text-red-600">{businessHealthScore.change} pts vs last month</p>
        </Card>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {kpis.slice(0, 2).map((kpi) => (
            <Card key={kpi.id}>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)]">{kpi.label}</p>
              <p className="font-data mt-1 text-lg font-semibold">
                {kpi.format === 'currency' ? formatCurrency(kpi.value, { compact: true }) : kpi.value}
              </p>
              <p className={`text-[11px] font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(kpi.change)}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-1 text-xs font-semibold">Sales Forecast</p>
          <div className="scale-y-95">
            <ForecastChart data={forecastData} />
          </div>
        </Card>
        <Card className="lg:col-span-1">
          <p className="mb-2 text-xs font-semibold">AI Decision</p>
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            <Badge variant="danger">high priority</Badge>
            <Badge variant="accent">{topDecision.category}</Badge>
          </div>
          <p className="text-xs font-medium leading-snug">{topDecision.title}</p>
          <p className="mt-1 text-[11px] text-[var(--color-muted)]">{topDecision.impact}</p>
        </Card>
      </div>
    </Card>
  )
}
