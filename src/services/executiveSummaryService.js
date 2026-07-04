// Composes outputs from metricsService/churnService/insightService/alertsService
// into the plain-English Executive Summary shown at the top of the Dashboard.
// This is the one function an LLM-based AI Advisor (Sprint 9) would replace —
// everything else in this file (the inputs) stays exactly the same.
export function buildExecutiveSummary({ metrics, insights, churnSummary, topCustomerSharePct, topProductSharePct, opportunities }) {
  const revenueTrend =
    metrics.revenueGrowthPct > 0
      ? `Revenue increased ${metrics.revenueGrowthPct}% last period.`
      : metrics.revenueGrowthPct < 0
        ? `Revenue declined ${Math.abs(metrics.revenueGrowthPct)}% last period.`
        : 'Revenue held steady last period.'

  const customerGrowth = `${metrics.customerCount} active customers, ${metrics.repeatPurchaseRate}% of whom are repeat buyers.`

  const topCustomer = insights.mostValuableCustomer
  const topProduct = insights.mostPurchasedProduct

  const concentrationNote =
    topProductSharePct >= 30
      ? `Revenue concentration is moderately high — ${topProduct} alone drives ${topProductSharePct.toFixed(0)}% of sales.`
      : 'Revenue is reasonably diversified across products.'

  const retentionNote =
    churnSummary.highRiskRatio < 0.2
      ? 'Customer retention appears healthy.'
      : `Retention needs attention — ${churnSummary.highCount} customer(s) are at high churn risk.`

  const recommendedActions = []
  if (opportunities[0]) recommendedActions.push(`Act on: ${opportunities[0].text}`)
  if (churnSummary.highCount > 0) recommendedActions.push('Contact inactive customers before they fully churn')
  if (topProductSharePct >= 30) recommendedActions.push(`Consider promoting a second product alongside ${topProduct} to reduce dependency`)
  if (recommendedActions.length === 0) recommendedActions.push('No urgent actions — business signals look stable')

  return {
    revenueTrend,
    customerGrowth,
    topCustomer,
    topProduct,
    inventoryNote: 'Inventory levels are not available from the uploaded data — connect an inventory feed in a future update for stock-based alerts.',
    concentrationNote,
    retentionNote,
    recommendedActions,
  }
}
