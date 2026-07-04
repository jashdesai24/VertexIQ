// Rule-based Business Health Score (Sprint 6 MVP — no ML). Weights are an
// explicit, documented hypothesis (see PROJECT_MEMORY.md Section 12) so a
// future model can replace computeComponentScores() without touching the UI.
const WEIGHTS = {
  revenueTrend: 30,
  customerGrowth: 15,
  inactiveCustomers: 20,
  repeatCustomers: 15,
  concentrationRisk: 10,
  productDependency: 10,
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

function computeComponentScores({ revenueGrowthPct, customerGrowthPct, churnSummary, repeatPurchaseRate, topCustomerSharePct, topProductSharePct }) {
  // Each sub-score is 0-100; the final score is their weighted average.
  const revenueTrend = clamp(50 + revenueGrowthPct * 2.5)
  const customerGrowth = clamp(50 + customerGrowthPct * 3)
  const inactiveCustomers = clamp(100 - churnSummary.highRiskRatio * 100 - churnSummary.mediumCount * 3)
  const repeatCustomers = clamp(repeatPurchaseRate)
  const concentrationRisk = clamp(100 - Math.max(0, topCustomerSharePct - 20) * 2)
  const productDependency = clamp(100 - Math.max(0, topProductSharePct - 30) * 1.5)

  return { revenueTrend, customerGrowth, inactiveCustomers, repeatCustomers, concentrationRisk, productDependency }
}

export function computeBusinessHealthScore(inputs) {
  const components = computeComponentScores(inputs)
  const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  const weightedSum = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + (components[key] * weight) / 100, 0)
  const score = Math.round((weightedSum / totalWeight) * 100)

  const breakdown = Object.entries(WEIGHTS).map(([key, weight]) => ({
    label: LABELS[key],
    weight,
    contribution: Math.round((components[key] * weight) / 100),
    status: components[key] >= 70 ? 'good' : components[key] >= 45 ? 'neutral' : 'bad',
  }))

  const explanation = buildExplanation(inputs, components)

  return { score, breakdown, explanation }
}

const LABELS = {
  revenueTrend: 'Revenue Growth',
  customerGrowth: 'Customer Growth',
  inactiveCustomers: 'Customer Retention (Inactivity)',
  repeatCustomers: 'Repeat Purchase Rate',
  concentrationRisk: 'Customer Concentration Risk',
  productDependency: 'Product Dependency',
}

function buildExplanation(inputs, components) {
  const lines = []

  if (inputs.revenueGrowthPct > 5) lines.push(`Revenue is growing strongly (+${inputs.revenueGrowthPct}% last period).`)
  else if (inputs.revenueGrowthPct < -5) lines.push(`Revenue is declining (${inputs.revenueGrowthPct}% last period) — needs attention.`)
  else lines.push('Revenue is roughly flat compared to the previous period.')

  if (components.inactiveCustomers >= 70) lines.push('Customer retention is stable — few customers are going inactive.')
  else if (components.inactiveCustomers >= 45) lines.push('A moderate number of customers are becoming inactive.')
  else lines.push('A significant share of customers are going inactive — retention needs attention.')

  if (inputs.topProductSharePct >= 30) {
    lines.push(`One product contributes ${inputs.topProductSharePct.toFixed(0)}% of revenue. Monitor dependency.`)
  }
  if (inputs.topCustomerSharePct >= 20) {
    lines.push(`Your top customer accounts for ${inputs.topCustomerSharePct.toFixed(0)}% of revenue — a concentration risk.`)
  }
  if (components.repeatCustomers >= 50) lines.push('Repeat purchase rate is healthy.')
  else lines.push('Repeat purchase rate is low — most customers only order once.')

  return lines
}
