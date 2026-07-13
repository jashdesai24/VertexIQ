// Business Intelligence Score engine (Sprint 10B). Scores 7 underlying
// business dimensions (0-100 each) from real computed data — never
// hardcoded — then maps them into the required return shape.
//
// NOTE on the mapping: the spec lists 7 scoring dimensions (Revenue Growth,
// Customer Growth, Customer Retention, Product Performance, Revenue
// Stability, Risk, Operational Health) but the required return shape only
// has 5 sub-scores + overall. Documented mapping used here:
//   growth     = avg(Revenue Growth, Customer Growth)
//   retention  = Customer Retention
//   stability  = Revenue Stability
//   risk       = Risk
//   operations = avg(Product Performance, Operational Health)
// All 7 raw scores are still returned in `breakdown` for transparency and
// reuse by other Sprint 10B modules (executiveInsightEngine, etc.).
import { buildMonthlySeries } from './trendAnalyzer'

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

const SEVERITY_PENALTY = { Critical: 30, High: 20, Medium: 10, Low: 5 }

// Coefficient-of-variation based stability read: low month-to-month
// volatility in revenue = high stability, independent of growth direction
// (a business can be growing AND volatile, or flat AND stable).
function computeStabilityScore(rows) {
  const series = buildMonthlySeries(rows, (r) => Number(r.order_value || 0))
  const values = series.map((s) => s.value)
  if (values.length < 2) return 50 // not enough history for a confident read — neutral score

  const mean = values.reduce((a, b) => a + b, 0) / values.length
  if (mean === 0) return 50
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  const coefficientOfVariation = Math.sqrt(variance) / mean
  return clamp(100 - coefficientOfVariation * 100)
}

function computeRiskScore(risks) {
  const penalty = risks.reduce((sum, r) => sum + (SEVERITY_PENALTY[r.severity] || 0), 0)
  return clamp(100 - penalty)
}

// Accepts optional precomputed { metrics, revenueTrend, ordersTrend,
// customerTrend, productTrend, risks } to avoid recomputing what
// aiInsightEngine.js already derived once (same pattern as
// opportunityEngine.js / riskAnalyzer.js from Sprint 10A).
export function computeBusinessIntelligenceScore(rows, precomputed = {}) {
  if (!rows || rows.length === 0) {
    return { overall: 0, growth: 0, retention: 0, stability: 0, risk: 0, operations: 0, breakdown: [] }
  }

  const metrics = precomputed.metrics
  const revenueTrend = precomputed.revenueTrend
  const ordersTrend = precomputed.ordersTrend
  const customerTrend = precomputed.customerTrend
  const productTrend = precomputed.productTrend
  const risks = precomputed.risks || []

  const revenueGrowthScore = clamp(50 + revenueTrend.percentage * 1.5)
  const customerGrowthScore = clamp(50 + customerTrend.percentage * 1.5)
  const retentionScore = clamp(metrics.repeatPurchaseRate)
  const productPerformanceScore = clamp(50 + productTrend.percentage * 1.5)
  const stabilityScore = computeStabilityScore(rows)
  const riskScore = computeRiskScore(risks)
  // Operational health has no direct signal in the current CSV schema (no
  // inventory/fulfillment data) — order-volume trend is used as an honest
  // proxy until real operational data is available (documented assumption,
  // same pattern as the 32% profit-margin assumption elsewhere in the app).
  const operationalHealthScore = clamp(50 + ordersTrend.percentage * 1.2)

  const weighted = [
    { label: 'Revenue Growth', score: revenueGrowthScore, weight: 20 },
    { label: 'Customer Growth', score: customerGrowthScore, weight: 15 },
    { label: 'Customer Retention', score: retentionScore, weight: 15 },
    { label: 'Product Performance', score: productPerformanceScore, weight: 15 },
    { label: 'Revenue Stability', score: stabilityScore, weight: 15 },
    { label: 'Risk', score: riskScore, weight: 10 },
    { label: 'Operational Health', score: operationalHealthScore, weight: 10 },
  ]
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  const overall = weighted.reduce((sum, w) => sum + (w.score * w.weight) / totalWeight, 0)

  return {
    overall: Math.round(overall),
    growth: Math.round((revenueGrowthScore + customerGrowthScore) / 2),
    retention: Math.round(retentionScore),
    stability: Math.round(stabilityScore),
    risk: Math.round(riskScore),
    operations: Math.round((productPerformanceScore + operationalHealthScore) / 2),
    breakdown: weighted.map((w) => ({ ...w, score: Math.round(w.score) })),
  }
}
