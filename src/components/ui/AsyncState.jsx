import { Loader2, AlertTriangle, Inbox, RefreshCw } from 'lucide-react'
import { Card } from './Card'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Loader2 size={20} className="animate-spin text-[var(--color-accent)]" />
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
    </Card>
  )
}

// Shown when the API call failed AND no fallback data could be computed either
// (rare — fallback covers most cases). Always includes a Retry button.
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <AlertTriangle size={20} className="text-[var(--color-danger)]" />
      <p className="text-sm font-medium">Couldn't load this data</p>
      <p className="max-w-sm text-xs text-[var(--color-muted)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-[var(--color-border-dark)] dark:hover:bg-white/5"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </Card>
  )
}

export function EmptyState({ message = 'No data yet.' }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox size={20} className="text-[var(--color-muted)]" />
      <p className="text-sm text-[var(--color-muted)]">{message}</p>
    </Card>
  )
}

// Small inline banner (not a blocking state) shown alongside already-rendered
// fallback data, so a backend outage degrades gracefully instead of blanking the page.
export function FallbackBanner({ onRetry }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
      <span>Backend unreachable — showing demo data.</span>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 font-medium hover:underline">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  )
}
