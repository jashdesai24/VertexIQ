// Signature element: marks any AI-generated content. Reused across Dashboard,
// Business Health, and Decision Center so the "this is live AI" language stays consistent.
export function PulseDot({ className = '' }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)]" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
    </span>
  )
}
