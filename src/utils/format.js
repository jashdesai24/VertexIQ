// Centralized formatters so every widget renders numbers/currency/dates identically.
export function formatCurrency(value, { compact = false } = {}) {
  if (compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatPercent(value, { showSign = true } = {}) {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
