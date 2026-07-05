// Smart Alerts + Opportunity Detection — pure rule-based generation from
// computed metrics/churn data. Every alert/opportunity carries priority,
// reason, and a recommended action so the UI never has to guess "why".

export function generateSmartAlerts({ metrics, churnList, churnSummary, topCustomerSharePct, demandSpikes }) {
  const alerts = []

  if (churnSummary.highCount > 0) {
    alerts.push({
      id: 'churn-high',
      priority: 'high',
      type: 'danger',
      text: `${churnSummary.highCount} customer(s) inactive for 60+ days`,
      reason: `Revenue at risk: ₹${Math.round(churnSummary.revenueAtRisk).toLocaleString('en-IN')} across high-risk customers.`,
      action: 'Send a win-back offer to high-risk customers',
    })
  }

  if (metrics.revenueGrowthPct <= -10) {
    alerts.push({
      id: 'revenue-decline',
      priority: 'high',
      type: 'danger',
      text: `Revenue declined ${metrics.revenueGrowthPct}% last period`,
      reason: 'Month-over-month revenue dropped beyond the 10% threshold.',
      action: 'Review recent campaigns and top customer activity',
    })
  } else if (metrics.revenueGrowthPct >= 15) {
    alerts.push({
      id: 'revenue-spike',
      priority: 'medium',
      type: 'warning',
      text: `Revenue grew ${metrics.revenueGrowthPct}% last period`,
      reason: 'Strong month-over-month growth — worth understanding what drove it.',
      action: 'Identify and double down on the growth driver',
    })
  }

  demandSpikes.forEach((p) => {
    alerts.push({
      id: `demand-${p.name}`,
      priority: 'medium',
      type: 'warning',
      text: `Demand spike: ${p.name} (+${p.growthPct}%)`,
      reason: `Units sold rose from ${p.prevUnits} to ${p.currUnits} month-over-month.`,
      action: `Check stock levels for ${p.name}`,
    })
  })

  if (topCustomerSharePct >= 20) {
    alerts.push({
      id: 'concentration',
      priority: churnSummary.highRiskRatio > 0.3 ? 'high' : 'medium',
      type: 'warning',
      text: `Top customer represents ${topCustomerSharePct.toFixed(0)}% of revenue`,
      reason: 'High revenue concentration in a single customer is a business continuity risk.',
      action: 'Diversify customer base; deepen relationship with top account',
    })
  }

  return alerts.sort((a, b) => (a.priority === 'high' ? -1 : 1) - (b.priority === 'high' ? -1 : 1))
}

export function detectOpportunities({ metrics, churnList, demandSpikes }) {
  const opportunities = []

  demandSpikes
    .filter((p) => p.growthPct > 0)
    .forEach((p) => {
      opportunities.push({
        id: `opp-demand-${p.name}`,
        text: `Fast-growing product: ${p.name} (+${p.growthPct}%)`,
        impact: p.growthPct >= 50 ? 'High' : 'Medium',
      })
    })

  const returning = churnList.filter((c) => c.riskLevel === 'Low' && c.orders > 1)
  if (returning.length > 0) {
    opportunities.push({
      id: 'opp-returning',
      text: `${returning.length} returning customer(s) actively ordering`,
      impact: 'Medium',
    })
  }

  if (metrics.topCustomers[0]) {
    opportunities.push({
      id: 'opp-upsell',
      text: `Upsell opportunity: ${metrics.topCustomers[0].name} (highest LTV)`,
      impact: 'High',
    })
  }

  return opportunities
}
