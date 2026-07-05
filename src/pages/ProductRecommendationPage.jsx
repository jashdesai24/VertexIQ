import { ShoppingBag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingState, ErrorState, EmptyState, FallbackBanner } from '@/components/ui/AsyncState'
import { useAppData } from '@/hooks/useAppData'
import { useBackendResource } from '@/hooks/useBackendResource'
import { api } from '@/services/apiClient'
import { getLocalRecommendations } from '@/services/localFallback'

// Recommendations now come from GET /api/recommendations (falls back to local
// computation if the backend is unreachable). No ML yet — see
// backend/services/recommendationService.js for the popularity-gap logic.
export function ProductRecommendationPage() {
  const { dataVersion } = useAppData()
  const { data, loading, error, isFallback, retry } = useBackendResource(
    api.getRecommendations,
    getLocalRecommendations,
    [dataVersion]
  )

  if (loading) return <LoadingState label="Generating recommendations…" />
  if (!data) return <ErrorState message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Product Recommendation</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Based on purchase history — what each customer hasn't bought yet, ranked by overall popularity.
        </p>
      </div>

      {isFallback && <FallbackBanner onRetry={retry} />}

      {data.recommendations.length === 0 ? (
        <EmptyState message="No purchase history available yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.recommendations.map((r) => (
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
      )}
    </div>
  )
}
