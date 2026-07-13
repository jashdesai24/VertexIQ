// Executive Insight engine (Sprint 10B, Part 2). Upgrades the flat
// headline/summary of Sprint 10A into structured executive sections. Takes
// already-computed data (metrics, trends, opportunities, risks, BI score,
// confidence) as input — this file does no data derivation of its own, only
// composition, so it never duplicates trendAnalyzer/opportunityEngine/
// riskAnalyzer/businessIntelligenceScore logic.
export function generateExecutiveInsights({ metrics, trends, opportunities, risks, businessIntelligenceScore, confidence }) {
  const topOpportunity = opportunities[0]
  const topRisk = risks[0]
  const upTrends = Object.entries(trends).filter(([, t]) => t.trend === 'up')

  return {
    overview: buildOverview({ metrics, trends, businessIntelligenceScore, confidence }),
    keyWins: buildKeyWins({ upTrends, topOpportunity, metrics }),
    keyRisks: buildKeyRisks(risks),
    growthOpportunities: buildGrowthOpportunities(opportunities),
    executiveRecommendation: buildExecutiveRecommendation({ businessIntelligenceScore, topRisk, topOpportunity }),
    nextSteps: buildNextSteps({ topRisk, topOpportunity }),
  }
}

function buildOverview({ metrics, trends, businessIntelligenceScore, confidence }) {
  const { revenueTrend } = trends
  const trendPhrase =
    revenueTrend.trend === 'stable'
      ? 'holding steady'
      : `trending ${revenueTrend.trend} ${Math.abs(revenueTrend.percentage)}%`
  return (
    `Overall Business Intelligence Score is ${businessIntelligenceScore.overall}/100 (${confidence.toLowerCase()} confidence). ` +
    `Revenue is ${trendPhrase} across ${metrics.customerCount} active customers and ${metrics.orderCount} orders.`
  )
}

function buildKeyWins({ upTrends, topOpportunity, metrics }) {
  const wins = upTrends.map(([key, t]) => `${labelForTrendKey(key)} is up ${t.percentage}%`)
  if (topOpportunity) wins.push(topOpportunity.title)
  if (metrics.repeatPurchaseRate >= 30) wins.push(`Repeat purchase rate is healthy at ${metrics.repeatPurchaseRate}%`)
  return wins.length > 0 ? wins : ['No standout wins this period — signals are steady rather than strong.']
}

function buildKeyRisks(risks) {
  if (risks.length === 0) return ['No significant risks detected this period.']
  return risks.map((r) => `${r.type} (${r.severity}): ${r.description}`)
}

function buildGrowthOpportunities(opportunities) {
  if (opportunities.length === 0) return ['No specific growth opportunities detected from the current data.']
  return opportunities.map((o) => o.reason)
}

function buildExecutiveRecommendation({ businessIntelligenceScore, topRisk, topOpportunity }) {
  if (businessIntelligenceScore.overall < 50) {
    return topRisk
      ? `Immediate attention needed across multiple areas — prioritize addressing ${topRisk.type.toLowerCase()} first.`
      : 'Immediate attention needed across multiple areas of the business.'
  }
  if (topRisk && (topRisk.severity === 'Critical' || topRisk.severity === 'High')) {
    return topOpportunity
      ? `Address ${topRisk.type.toLowerCase()} as the top priority while continuing to invest in ${topOpportunity.title.toLowerCase()}.`
      : `Address ${topRisk.type.toLowerCase()} as the top priority.`
  }
  return topOpportunity
    ? `Business fundamentals are healthy — focus on scaling: ${topOpportunity.title.toLowerCase()}.`
    : 'Business fundamentals are healthy — maintain current course.'
}

function buildNextSteps({ topRisk, topOpportunity }) {
  const steps = []
  if (topRisk) steps.push(`Review and address: ${topRisk.type}`)
  if (topOpportunity) steps.push(`Evaluate acting on: ${topOpportunity.title}`)
  steps.push('Re-check the Business Intelligence Score next period to confirm the trend')
  return steps
}

function labelForTrendKey(key) {
  const labels = { revenueTrend: 'Revenue', ordersTrend: 'Orders', customerTrend: 'Customer growth', productTrend: 'Product variety' }
  return labels[key] || key
}
