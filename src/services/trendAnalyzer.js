// Trend Analyzer (Sprint 10A). Turns raw order rows into a monthly time
// series per metric, then reads the trend off the two most recent points.
// Rule-based, no ML — same philosophy as the rest of the intelligence layer
// (see churnService.js, healthScoreService.js).
//
// The series-building helpers below are exported and reused by
// utils/comparePeriods.js so the two modules never duplicate the same
// month-bucketing logic.

// Groups rows into monthly buckets using a real sortable key (YYYY-MM), not
// just the display label — avoids the classic "Jan sorts before Dec" bug.
export function buildMonthlySeries(rows, valueExtractor) {
  const buckets = new Map()
  rows.forEach((r) => {
    if (!r.order_date) return
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets.has(sortKey)) {
      buckets.set(sortKey, { label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }), value: 0 })
    }
    buckets.get(sortKey).value += valueExtractor(r)
  })
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ period: v.label, value: v.value }))
}

// New customers per month, bucketed by each customer's FIRST order date —
// counts acquisition, not repeat activity (a plain per-row count would double
// count returning customers).
export function buildNewCustomersSeries(rows) {
  const firstOrder = new Map()
  rows.forEach((r) => {
    if (!r.customer_name || !r.order_date) return
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const existing = firstOrder.get(r.customer_name)
    if (!existing || d < existing) firstOrder.set(r.customer_name, d)
  })

  const buckets = new Map()
  for (const d of firstOrder.values()) {
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets.has(sortKey)) {
      buckets.set(sortKey, { label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }), value: 0 })
    }
    buckets.get(sortKey).value += 1
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ period: v.label, value: v.value }))
}

// Distinct products sold per month — tracks assortment/catalog breadth
// growing over time, deliberately different from raw order volume.
export function buildDistinctProductsSeries(rows) {
  const buckets = new Map()
  rows.forEach((r) => {
    if (!r.product_name || !r.order_date) return
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets.has(sortKey)) {
      buckets.set(sortKey, { label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }), products: new Set() })
    }
    buckets.get(sortKey).products.add(r.product_name)
  })
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ period: v.label, value: v.products.size }))
}

// Reads a trend off the last two points of any {period, value} series.
// Handles empty datasets, a missing previous period, and divide-by-zero —
// all return a safe 'stable'/'low confidence' result instead of throwing.
export function analyzeTrendFromSeries(series) {
  const valid = series.filter((p) => typeof p.value === 'number' && !Number.isNaN(p.value))

  if (valid.length < 2) {
    return { trend: 'stable', percentage: 0, confidence: 'low' }
  }

  const previous = valid[valid.length - 2].value
  const current = valid[valid.length - 1].value
  const percentage = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100

  const trend = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable'
  // Confidence reflects how much history backs the read, not the magnitude
  // of the change — a 40% jump off two data points is still low-confidence.
  const confidence = valid.length >= 4 ? 'high' : valid.length >= 2 ? 'medium' : 'low'

  return { trend, percentage: Number(percentage.toFixed(1)), confidence }
}

export function analyzeRevenueTrend(rows) {
  if (!rows || rows.length === 0) return { trend: 'stable', percentage: 0, confidence: 'low' }
  return analyzeTrendFromSeries(buildMonthlySeries(rows, (r) => Number(r.order_value || 0)))
}

export function analyzeOrdersTrend(rows) {
  if (!rows || rows.length === 0) return { trend: 'stable', percentage: 0, confidence: 'low' }
  return analyzeTrendFromSeries(buildMonthlySeries(rows, () => 1))
}

export function analyzeCustomerGrowth(rows) {
  if (!rows || rows.length === 0) return { trend: 'stable', percentage: 0, confidence: 'low' }
  return analyzeTrendFromSeries(buildNewCustomersSeries(rows))
}

export function analyzeProductGrowth(rows) {
  if (!rows || rows.length === 0) return { trend: 'stable', percentage: 0, confidence: 'low' }
  return analyzeTrendFromSeries(buildDistinctProductsSeries(rows))
}
