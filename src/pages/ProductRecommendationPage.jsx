import { ShoppingBag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAppData } from '@/hooks/useAppData'

// Popularity-gap recommendation engine (see services/recommendationService.js):
// for each customer, recommend the highest-popularity product they haven't
// bought yet. No ML — a real collaborative-filtering model can replace only
// that service function later without touching this page.
export function ProductRecommendationPage() {
  const { getIntelligence } = useAppData()
  const { recommendations } = getIntelligence()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Product Recommendation</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Based on purchase history — what each customer hasn't bought yet, ranked by overall popularity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {recommendations.map((r) => (
          <Card key={r.customer}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">{r.customer}</p>
              {r.recommended && <Badge variant="accent">Recommendation</Badge>}
            </div>
            <p className="mb-1 text-xs text-[var(--color-muted)]">Purchased: {r.purchased.join(', ')}</p>
            {r.recommended ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-accent-soft)] px-3 py-2 text-sm dark:bg-[var(--color-accent-soft-dark)]">
                <ShoppingBag size={15} className="text-[var(--color-accent)]" />
                <span className="font-medium text-[var(--color-accent)]">{r.recommended}</span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-[var(--color-muted)]">{r.reason}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
