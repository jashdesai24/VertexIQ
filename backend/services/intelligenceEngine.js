// Single orchestration entry point for the entire AI Intelligence Layer.
// DataContext calls ONLY this function. Every rule-based module (metrics,
// churn, health score, alerts, recommendations, insights, executive summary)
// stays independently swappable for a real ML model later — this file is the
// seam; nothing above it (contexts/pages/components) needs to change when that happens.
import { deriveMetrics, computeDemandSpikes } from './metricsService.js'
import { computeChurnList, churnRiskSummary } from './churnService.js'
import { computeBusinessHealthScore } from './healthScoreService.js'
import { generateSmartAlerts, detectOpportunities } from './alertsService.js'
import { generateRecommendations } from './recommendationService.js'
import { generateInsights } from './insightService.js'
import { buildExecutiveSummary } from './executiveSummaryService.js'

export function computeIntelligence(rows, referenceDate = new Date()) {
  const metrics = deriveMetrics(rows)
  const demandSpikes = computeDemandSpikes(rows)
  const churnList = computeChurnList(rows, referenceDate)
  const churnSummary = churnRiskSummary(churnList)

  const topCustomerSharePct = metrics.revenue > 0 && metrics.topCustomers[0]
    ? (metrics.topCustomers[0].ltv / metrics.revenue) * 100
    : 0
  const topProductSharePct = metrics.revenue > 0 && metrics.topProducts[0]
    ? (metrics.topProducts[0].revenue / metrics.revenue) * 100
    : 0

  const healthScore = computeBusinessHealthScore({
    revenueGrowthPct: metrics.revenueGrowthPct,
    customerGrowthPct: metrics.revenueGrowthPct, // proxy until we track customer counts over time (needs backend/DB — Sprint 7)
    churnSummary,
    repeatPurchaseRate: metrics.repeatPurchaseRate,
    topCustomerSharePct,
    topProductSharePct,
  })

  const opportunities = detectOpportunities({ metrics, churnList, demandSpikes })
  const alerts = generateSmartAlerts({ metrics, churnList, churnSummary, topCustomerSharePct, demandSpikes })
  const recommendations = generateRecommendations(rows)
  const insights = generateInsights(rows, metrics)
  const executiveSummary = buildExecutiveSummary({
    metrics,
    insights,
    churnSummary,
    topCustomerSharePct,
    topProductSharePct,
    opportunities,
  })

  return {
    metrics,
    demandSpikes,
    churnList,
    churnSummary,
    healthScore,
    opportunities,
    alerts,
    recommendations,
    insights,
    executiveSummary,
    topCustomerSharePct,
    topProductSharePct,
  }
}
