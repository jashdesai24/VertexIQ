import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAppData } from '@/hooks/useAppData'
import { formatCurrency } from '@/utils/format'

const RISK_VARIANT = { High: 'danger', Medium: 'warning', Low: 'success', Unknown: 'neutral' }

// Rule-based churn prediction (see services/churnService.js):
// >60 days inactive = High, 30-60 = Medium, <30 = Low. No ML — explicit rules,
// swappable for a trained classifier later without touching this page.
export function ChurnPredictionPage() {
  const { getIntelligence } = useAppData()
  const { churnList, churnSummary } = getIntelligence()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Churn Prediction</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Rule-based risk: High (60+ days inactive), Medium (30–60 days), Low (under 30 days).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">High Risk</p>
          <p className="font-data mt-1 text-2xl font-semibold text-red-600">{churnSummary.highCount}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {formatCurrency(churnSummary.revenueAtRisk, { compact: true })} revenue at risk
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Medium Risk</p>
          <p className="font-data mt-1 text-2xl font-semibold text-amber-600">{churnSummary.mediumCount}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Low Risk</p>
          <p className="font-data mt-1 text-2xl font-semibold text-green-600">{churnSummary.lowCount}</p>
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold">Customer Risk List</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-muted)] dark:border-[var(--color-border-dark)]">
              <tr>
                <th className="py-2 pr-4 font-medium">Customer</th>
                <th className="py-2 pr-4 font-medium">Risk</th>
                <th className="py-2 pr-4 font-medium">Reason</th>
                <th className="py-2 pr-4 font-medium">LTV</th>
              </tr>
            </thead>
            <tbody>
              {churnList.map((c) => (
                <tr key={c.name} className="border-b border-[var(--color-border)] last:border-0 dark:border-[var(--color-border-dark)]">
                  <td className="py-2.5 pr-4 font-medium">{c.name}</td>
                  <td className="py-2.5 pr-4"><Badge variant={RISK_VARIANT[c.riskLevel]}>{c.riskLevel}</Badge></td>
                  <td className="py-2.5 pr-4 text-[var(--color-muted)]">
                    {c.daysInactive} days since last order ({c.lastOrderDate})
                  </td>
                  <td className="font-data py-2.5 pr-4">{formatCurrency(c.ltv, { compact: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
