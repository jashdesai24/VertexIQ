// Business Recommendation engine (Sprint 10B, Part 3). Distinct from the
// existing services/recommendationService.js (Sprint 6, per-customer product
// recommendations) — this generates business-strategy recommendations from
// risks/opportunities/trends/BI score. Takes already-computed data as input;
// does no derivation of its own, so it never duplicates riskAnalyzer/
// opportunityEngine/trendAnalyzer logic.
const PRIORITY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 }

export function generateBusinessRecommendations({ businessIntelligenceScore, risks, opportunities, trends }) {
  const recommendations = []

  risks.forEach((r) => {
    recommendations.push({
      priority: r.severity,
      category: 'Risk Mitigation',
      title: `Address ${r.type}`,
      explanation: r.description,
      expectedImpact:
        r.severity === 'Critical'
          ? 'High impact if addressed promptly'
          : r.severity === 'High'
            ? 'Significant impact on business stability'
            : 'Moderate impact — worth monitoring closely',
    })
  })

  opportunities.forEach((o) => {
    recommendations.push({
      priority: o.priority,
      category: 'Growth',
      title: o.title,
      explanation: o.reason,
      expectedImpact: `Priority score ${o.score}/100 — ${o.priority.toLowerCase()} potential upside`,
    })
  })

  // Declining trends not already surfaced as a risk still deserve a recommendation.
  Object.entries(trends)
    .filter(([, t]) => t.trend === 'down')
    .forEach(([key, t]) => {
      const label = labelForTrendKey(key)
      recommendations.push({
        priority: t.confidence === 'high' ? 'High' : 'Medium',
        category: 'Trend Response',
        title: `Reverse declining ${label.toLowerCase()}`,
        explanation: `${label} is down ${Math.abs(t.percentage)}% (${t.confidence} confidence).`,
        expectedImpact: 'Prevents further erosion if addressed early',
      })
    })

  if (businessIntelligenceScore && businessIntelligenceScore.overall < 50) {
    recommendations.push({
      priority: 'Critical',
      category: 'Business Health',
      title: 'Conduct a full business health review',
      explanation: `Overall Business Intelligence Score is ${businessIntelligenceScore.overall}/100 — multiple areas need attention.`,
      expectedImpact: 'Establishes a recovery plan across growth, retention, and risk',
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'Low',
      category: 'Business Health',
      title: 'No urgent actions',
      explanation: 'Business signals look stable across revenue, customers, and products.',
      expectedImpact: 'Maintain current course',
    })
  }

  return recommendations.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority])
}

function labelForTrendKey(key) {
  const labels = { revenueTrend: 'Revenue', ordersTrend: 'Orders', customerTrend: 'Customer growth', productTrend: 'Product variety' }
  return labels[key] || key
}
