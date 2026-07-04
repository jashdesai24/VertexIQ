import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

// Shared stub for routes not built in Sprint 3 (Customer Analytics, Churn Prediction,
// Recommendations, Forecast, Sentiment, Reports, Settings, Profile). Swapped for a
// real page one at a time in later sprints — routing/nav never changes.
export function PlaceholderPage({ title }) {
  return (
    <Card className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="text-[var(--color-muted)]" size={28} />
      <h2 className="mt-3 text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
        This module is designed and scoped — build coming in a later sprint.
      </p>
    </Card>
  )
}
