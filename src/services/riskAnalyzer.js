// Risk Analyzer (Sprint 10A). Detects negative/cautionary signals from order
// data. Reuses existing services rather than reimplementing their logic:
// metricsService for aggregates, trendAnalyzer for revenue trend,
// opportunityEngine's momentum calc for product decline, and the existing
// churnService (from Sprint 6) for customer inactivity — that module already
// owns the >60/30-60/<30 day rule, no reason to duplicate it here.
import { deriveMetrics } from './metricsService'
import { computeChurnList, churnRiskSummary } from './churnService'
import { analyzeRevenueTrend } from './trendAnalyzer'
import { computeProductMomentum } from './opportunityEngine'

const SEVERITY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 }

// Accepts optional precomputed { metrics, momentum, revenueTrend } so
// aiInsightEngine.js can share these across opportunityEngine + riskAnalyzer
// instead of each recomputing independently.
export function detectRisks(rows, precomputed = {}) {
  if (!rows || rows.length === 0) return []

  const metrics = precomputed.metrics || deriveMetrics(rows)
  const momentum = precomputed.momentum || computeProductMomentum(rows)
  const revenueTrend = precomputed.revenueTrend || analyzeRevenueTrend(rows)
  const risks = []

  // Customer concentration
  const topCustomer = metrics.topCustomers[0]
  if (topCustomer && metrics.revenue > 0) {
    const share = (topCustomer.ltv / metrics.revenue) * 100
    const severity = share >= 40 ? 'Critical' : share >= 25 ? 'High' : share >= 15 ? 'Medium' : null
    if (severity) {
      risks.push({
        type: 'Customer Concentration',
        severity,
        description: `${topCustomer.name} accounts for ${share.toFixed(0)}% of total revenue — losing this customer would significantly impact the business.`,
      })
    }
  }

  // Revenue dependency on a single product
  const topProduct = metrics.topProducts[0]
  if (topProduct && metrics.revenue > 0) {
    const share = (topProduct.revenue / metrics.revenue) * 100
    const severity = share >= 50 ? 'Critical' : share >= 35 ? 'High' : share >= 20 ? 'Medium' : null
    if (severity) {
      risks.push({
        type: 'Revenue Dependency',
        severity,
        description: `${topProduct.name} drives ${share.toFixed(0)}% of revenue — demand or supply issues here would disproportionately affect the business.`,
      })
    }
  }

  // Revenue decline
  if (revenueTrend.trend === 'down') {
    const severity = revenueTrend.percentage <= -20 ? 'Critical' : revenueTrend.percentage <= -10 ? 'High' : 'Medium'
    risks.push({
      type: 'Revenue Decline',
      severity,
      description: `Revenue dropped ${Math.abs(revenueTrend.percentage)}% compared to the previous period.`,
    })
  }

  // Product decline — the fastest-DEclining product (opposite end of the
  // same momentum list opportunityEngine reads from the growth end).
  const decliningProduct = momentum[momentum.length - 1]
  if (decliningProduct && decliningProduct.growthPct <= -30) {
    const severity = decliningProduct.growthPct <= -60 ? 'Critical' : decliningProduct.growthPct <= -40 ? 'High' : 'Medium'
    risks.push({
      type: 'Product Decline',
      severity,
      description: `${decliningProduct.product} sales fell ${Math.abs(decliningProduct.growthPct)}% month-over-month.`,
    })
  }

  // Low repeat customers
  if (metrics.repeatPurchaseRate < 20) {
    const severity = metrics.repeatPurchaseRate < 10 ? 'High' : 'Medium'
    risks.push({
      type: 'Low Repeat Customers',
      severity,
      description: `Only ${metrics.repeatPurchaseRate}% of customers have ordered more than once — retention needs attention.`,
    })
  }

  // Missing activity / inactive customers — reuses the existing churnService
  // (Sprint 6) rather than re-deriving days-since-last-order here.
  const churnList = computeChurnList(rows)
  const summary = churnRiskSummary(churnList)
  if (summary.highRiskRatio >= 0.15) {
    const severity = summary.highRiskRatio >= 0.5 ? 'Critical' : summary.highRiskRatio >= 0.3 ? 'High' : 'Medium'
    risks.push({
      type: 'Inactive Customers',
      severity,
      description: `${summary.highCount} of ${churnList.length} customers (${Math.round(summary.highRiskRatio * 100)}%) haven't ordered in over 60 days.`,
    })
  }

  return risks.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])
}
