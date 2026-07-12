// Opportunity Engine (Sprint 10A). Detects positive, actionable signals from
// order data. Reuses services/metricsService.js for aggregates rather than
// re-deriving revenue/customer/product totals here.
import { deriveMetrics } from './metricsService'
import { formatCurrency } from '@/utils/format'

function scoreToPriority(score) {
  if (score >= 70) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

// Month-over-month unit-growth per product. Exported so riskAnalyzer.js can
// reuse the exact same computation for "Product Decline" instead of
// recomputing per-product momentum a second time.
export function computeProductMomentum(rows) {
  const byProductMonth = new Map()
  rows.forEach((r) => {
    if (!r.product_name || !r.order_date) return
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byProductMonth.has(r.product_name)) byProductMonth.set(r.product_name, new Map())
    const monthMap = byProductMonth.get(r.product_name)
    monthMap.set(key, (monthMap.get(key) || 0) + 1)
  })

  const results = []
  byProductMonth.forEach((monthMap, product) => {
    const months = [...monthMap.keys()].sort()
    if (months.length < 2) return
    const prevUnits = monthMap.get(months[months.length - 2])
    const currUnits = monthMap.get(months[months.length - 1])
    const growthPct = prevUnits > 0 ? ((currUnits - prevUnits) / prevUnits) * 100 : currUnits > 0 ? 100 : 0
    results.push({ product, prevUnits, currUnits, growthPct: Number(growthPct.toFixed(1)) })
  })
  return results.sort((a, b) => b.growthPct - a.growthPct)
}

// Detects opportunities. Accepts optional precomputed { metrics, momentum }
// so aiInsightEngine.js can compute these once and share them across
// opportunityEngine + riskAnalyzer instead of each recomputing independently.
export function detectOpportunities(rows, precomputed = {}) {
  if (!rows || rows.length === 0) return []

  const metrics = precomputed.metrics || deriveMetrics(rows)
  const momentum = precomputed.momentum || computeProductMomentum(rows)
  const opportunities = []

  // Fastest growing product
  const topGrowth = momentum.find((m) => m.growthPct > 0)
  if (topGrowth) {
    opportunities.push({
      title: `Fastest growing product: ${topGrowth.product}`,
      reason: `Units sold grew ${topGrowth.growthPct}% month-over-month (${topGrowth.prevUnits} → ${topGrowth.currUnits}).`,
      score: Math.min(100, Math.round(topGrowth.growthPct)),
      priority: scoreToPriority(topGrowth.growthPct),
    })
  }

  // Highest revenue customer
  const topRevenueCustomer = metrics.topCustomers[0]
  if (topRevenueCustomer && metrics.revenue > 0) {
    const share = (topRevenueCustomer.ltv / metrics.revenue) * 100
    const score = Math.min(100, Math.round(share * 2))
    opportunities.push({
      title: `Highest revenue customer: ${topRevenueCustomer.name}`,
      reason: `Contributes ${share.toFixed(0)}% of total revenue across ${topRevenueCustomer.orders} orders — a strong relationship to deepen.`,
      score,
      priority: scoreToPriority(score),
    })
  }

  // Highest order frequency customer
  const byOrders = Object.values(metrics.byCustomer).sort((a, b) => b.orders - a.orders)[0]
  if (byOrders) {
    const score = Math.min(100, byOrders.orders * 10)
    opportunities.push({
      title: `Most frequent customer: ${byOrders.name}`,
      reason: `Placed ${byOrders.orders} orders — a strong candidate for a loyalty offer.`,
      score,
      priority: scoreToPriority(score),
    })
  }

  // Best repeat customer (most repeat orders, tie-broken by lifetime value)
  const repeatCustomers = Object.values(metrics.byCustomer)
    .filter((c) => c.orders > 1)
    .sort((a, b) => b.ltv - a.ltv)
  if (repeatCustomers[0]) {
    const c = repeatCustomers[0]
    const score = Math.min(100, Math.round(c.orders * 8))
    opportunities.push({
      title: `Best repeat customer: ${c.name}`,
      reason: `${c.orders} repeat orders worth ${formatCurrency(c.ltv, { compact: true })} total — a strong upsell candidate.`,
      score,
      priority: scoreToPriority(score),
    })
  }

  // Highest growth category — only if the uploaded data actually has a
  // category column (our core CSV schema doesn't require one).
  if (rows[0] && 'category' in rows[0]) {
    const categoryMomentum = computeCategoryMomentum(rows)
    const topCategory = categoryMomentum[0]
    if (topCategory && topCategory.growthPct > 0) {
      opportunities.push({
        title: `Fastest growing category: ${topCategory.category}`,
        reason: `Sales grew ${topCategory.growthPct}% month-over-month.`,
        score: Math.min(100, Math.round(topCategory.growthPct)),
        priority: scoreToPriority(topCategory.growthPct),
      })
    }
  }

  return opportunities.sort((a, b) => b.score - a.score)
}

// Same month-over-month growth logic as computeProductMomentum, keyed by
// category instead of product. Only called when a category column exists.
function computeCategoryMomentum(rows) {
  const byCategoryMonth = new Map()
  rows.forEach((r) => {
    if (!r.category || !r.order_date) return
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byCategoryMonth.has(r.category)) byCategoryMonth.set(r.category, new Map())
    const monthMap = byCategoryMonth.get(r.category)
    monthMap.set(key, (monthMap.get(key) || 0) + 1)
  })

  const results = []
  byCategoryMonth.forEach((monthMap, category) => {
    const months = [...monthMap.keys()].sort()
    if (months.length < 2) return
    const prevUnits = monthMap.get(months[months.length - 2])
    const currUnits = monthMap.get(months[months.length - 1])
    const growthPct = prevUnits > 0 ? ((currUnits - prevUnits) / prevUnits) * 100 : currUnits > 0 ? 100 : 0
    results.push({ category, growthPct: Number(growthPct.toFixed(1)) })
  })
  return results.sort((a, b) => b.growthPct - a.growthPct)
}
