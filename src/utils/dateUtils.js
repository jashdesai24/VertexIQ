// Pure date helpers used by the churn/alerts/health services. No business
// rules live here — just date math — so services stay readable.
export function daysSince(dateString, referenceDate = new Date()) {
  const then = new Date(dateString)
  if (Number.isNaN(then.getTime())) return null
  const ms = referenceDate.getTime() - then.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function monthKey(dateString) {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
}

export function isWithinLastNDays(dateString, n, referenceDate = new Date()) {
  const days = daysSince(dateString, referenceDate)
  return days !== null && days <= n
}
