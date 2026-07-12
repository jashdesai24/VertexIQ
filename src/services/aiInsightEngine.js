// AI Insight Engine (Sprint 10A). Composes Trend Analyzer + Opportunity
// Engine + Risk Analyzer + Period Comparison into one structured, fully
// dynamic executive summary. Every string below is built from computed
// values — nothing here is hardcoded demo text, so a real uploaded dataset
// and the demo dataset both produce genuinely different summaries.
import { deriveMetrics } from './metricsService'
import { analyzeRevenueTrend, analyzeOrdersTrend, analyzeCustomerGrowth, analyzeProductGrowth } from './trendAnalyzer'
import { detectOpportunities, computeProductMomentum } from './opportunityEngine'
import { detectRisks } from './riskAnalyzer'
import { api } from './apiClient'
import { demoOrders } from '@/data/demoOrders'

export function generateAIInsights(rows, meta = {}) {
  const { isDemoData = false, fileName = null } = meta

  if (!rows || rows.length === 0) {
    return {
      isEmpty: true,
      isDemoData,
      fileName,
      headline: 'Not enough data yet',
      summary: 'Upload a CSV with order history to generate AI-powered business insights.',
      highlights: [],
      recommendations: [],
    }
  }

  // Computed once, shared with opportunityEngine/riskAnalyzer below instead
  // of each recomputing metrics/momentum/revenue trend independently.
  const metrics = deriveMetrics(rows)
  const momentum = computeProductMomentum(rows)
  const revenueTrend = analyzeRevenueTrend(rows)

  const ordersTrend = analyzeOrdersTrend(rows)
  const customerTrend = analyzeCustomerGrowth(rows)
  const productTrend = analyzeProductGrowth(rows)

  const opportunities = detectOpportunities(rows, { metrics, momentum })
  const risks = detectRisks(rows, { metrics, momentum, revenueTrend })

  const trends = { revenueTrend, ordersTrend, customerTrend, productTrend }

  return {
    isEmpty: false,
    isDemoData,
    fileName,
    headline: buildHeadline(revenueTrend, risks),
    summary: buildSummary({ ...trends, topOpportunity: opportunities[0], topRisk: risks[0] }),
    highlights: buildHighlights({ ...trends, opportunities, risks }),
    recommendations: buildRecommendations({ opportunities, risks }),
    trends,
    opportunities,
    risks,
  }
}

function buildHeadline(revenueTrend, risks) {
  const criticalRisk = risks.find((r) => r.severity === 'Critical')
  if (criticalRisk) return `Action needed: ${criticalRisk.type}`
  if (revenueTrend.trend === 'up') return `Revenue is trending up ${revenueTrend.percentage}%`
  if (revenueTrend.trend === 'down') return `Revenue is down ${Math.abs(revenueTrend.percentage)}% — worth investigating`
  return 'Business performance is steady'
}

function buildSummary({ revenueTrend, customerTrend, productTrend, topOpportunity, topRisk }) {
  const parts = []

  parts.push(
    revenueTrend.trend === 'stable'
      ? 'Revenue has been steady over the last period.'
      : `Revenue is ${revenueTrend.trend} ${Math.abs(revenueTrend.percentage)}% (${revenueTrend.confidence} confidence).`
  )

  parts.push(
    customerTrend.trend === 'up'
      ? `New customer acquisition is growing (${customerTrend.percentage}%).`
      : customerTrend.trend === 'down'
        ? `New customer acquisition has slowed (${customerTrend.percentage}%).`
        : 'New customer acquisition is stable.'
  )

  if (productTrend.trend === 'up') parts.push('Product assortment sold is expanding.')

  if (topOpportunity) parts.push(`Biggest opportunity: ${topOpportunity.title}.`)
  if (topRisk) parts.push(`Biggest risk: ${topRisk.type} (${topRisk.severity}).`)

  return parts.join(' ')
}

function buildHighlights({ revenueTrend, customerTrend, productTrend, opportunities, risks }) {
  const highlights = [
    `Revenue ${revenueTrend.trend} ${Math.abs(revenueTrend.percentage)}%`,
    `Customer growth ${customerTrend.trend} ${Math.abs(customerTrend.percentage)}%`,
    `Product variety ${productTrend.trend} ${Math.abs(productTrend.percentage)}%`,
  ]
  opportunities.slice(0, 2).forEach((o) => highlights.push(o.title))
  risks.slice(0, 2).forEach((r) => highlights.push(`${r.type}: ${r.severity}`))
  return highlights
}

// Recommendations are built directly from the opportunities/risks arrays —
// never a fixed string list. An empty-signal business gets a genuinely
// different (and honest) recommendation than a struggling one.
function buildRecommendations({ opportunities, risks }) {
  const recommendations = []
  risks.slice(0, 3).forEach((r) => recommendations.push(`Address ${r.type.toLowerCase()}: ${r.description}`))
  opportunities.slice(0, 3).forEach((o) => recommendations.push(`${o.title} — ${o.reason}`))
  if (recommendations.length === 0) recommendations.push('No urgent actions — business signals look stable.')
  return recommendations
}

// "Live" data path (the apiCall passed to useBackendResource on the
// Dashboard). Checks which dataset is active for the workspace, fetches its
// raw rows if one exists, and runs generateAIInsights() on them — the same
// function the offline fallback (services/localFallback.js) calls on
// demoOrders. If the workspace has no upload yet, that's a legitimate demo
// state (not a failure) so it still resolves successfully with demo rows.
// If the backend itself is unreachable, this throws and useBackendResource
// falls back to getLocalAIInsights() instead.
export async function fetchAndGenerateAIInsights() {
  const workspace = await api.getCurrentWorkspace()
  if (!workspace.datasetId) {
    return generateAIInsights(demoOrders, { isDemoData: true, fileName: null })
  }
  const dataset = await api.getDataset(workspace.datasetId)
  return generateAIInsights(dataset.rows, { isDemoData: false, fileName: dataset.fileName })
}
