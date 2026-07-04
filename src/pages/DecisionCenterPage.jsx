import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DecisionFeedItem } from '@/components/dashboard/DecisionFeedItem'
import { decisions } from '@/data/decisionData'

const FILTERS = ['all', 'high', 'medium', 'low']

// Full Decision Center: the prescriptive core of the product. Every card expands
// to show its Explainable AI reasoning + suggested action (see DecisionFeedItem).
export function DecisionCenterPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? decisions : decisions.filter((d) => d.priority === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Decision Center</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          What should you do today? Ranked by business impact, urgency, and confidence.
        </p>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-gray-50 dark:border-[var(--color-border-dark)] dark:hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        {filtered.map((d) => (
          <DecisionFeedItem key={d.id} decision={d} expanded />
        ))}
      </Card>
    </div>
  )
}
