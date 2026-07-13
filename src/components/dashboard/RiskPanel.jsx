import { ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Critical/High map to the existing 'danger' Badge variant (no 'critical'
// variant exists and adding one would touch the shared Badge component) —
// the severity name in the label text still distinguishes them.
const SEVERITY_VARIANT = { Critical: 'danger', High: 'danger', Medium: 'warning', Low: 'success' }
const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low']

// Risk Panel (Sprint 10B, Part 6): counts by severity + the full risk list,
// each with a severity badge. `risks` is already computed (riskAnalyzer.js
// via aiInsightEngine.js) — this component only presents it.
export function RiskPanel({ risks }) {
  const counts = SEVERITY_ORDER.reduce((acc, s) => {
    acc[s] = risks.filter((r) => r.severity === s).length
    return acc
  }, {})

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert size={15} className="text-[var(--color-danger)]" />
        <p className="text-sm font-semibold">Risk Panel</p>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {SEVERITY_ORDER.map((s) => (
          <div key={s} className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-center dark:border-[var(--color-border-dark)]">
            <p className="font-data text-lg font-semibold">{counts[s]}</p>
            <p className="text-[10px] text-[var(--color-muted)]">{s}</p>
          </div>
        ))}
      </div>

      {risks.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">No risks detected this period.</p>
      ) : (
        <ul className="space-y-2.5">
          {risks.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Badge variant={SEVERITY_VARIANT[r.severity]} className="mt-0.5 shrink-0">{r.severity}</Badge>
              <div>
                <p className="font-medium text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">{r.type}</p>
                <p className="text-xs text-[var(--color-muted)]">{r.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
