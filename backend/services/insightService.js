// Insight Engine: small, focused facts derived from rows + metrics.
// Kept separate from executiveSummaryService (which turns these into prose)
// and from alertsService (which turns them into actionable warnings).
export function generateInsights(rows, metrics) {
  const monthlyEntries = Object.entries(metrics.byMonth)
  const highestRevenueMonth = monthlyEntries.length
    ? monthlyEntries.reduce((a, b) => (b[1] > a[1] ? b : a))
    : null

  const customerFirstOrder = {}
  const customerLastOrder = {}
  rows.forEach((r) => {
    if (!r.customer_name || !r.order_date) return
    const d = new Date(r.order_date)
    if (!customerFirstOrder[r.customer_name] || d < customerFirstOrder[r.customer_name]) {
      customerFirstOrder[r.customer_name] = d
    }
    if (!customerLastOrder[r.customer_name] || d > customerLastOrder[r.customer_name]) {
      customerLastOrder[r.customer_name] = d
    }
  })
  // "Fastest growing" proxy: customer with the most orders in the shortest active window.
  let fastestGrowingCustomer = null
  let bestRate = -Infinity
  Object.entries(metrics.byCustomer).forEach(([name, data]) => {
    const spanDays = Math.max(1, (customerLastOrder[name] - customerFirstOrder[name]) / (1000 * 60 * 60 * 24))
    const rate = data.orders / spanDays
    if (rate > bestRate) {
      bestRate = rate
      fastestGrowingCustomer = name
    }
  })

  const mostValuableCustomer = metrics.topCustomers[0]?.name || null
  const mostPurchasedProduct = metrics.topProducts[0]?.name || null
  const avgOrderValue = metrics.orderCount > 0 ? metrics.revenue / metrics.orderCount : 0

  return {
    highestRevenueMonth: highestRevenueMonth ? { month: highestRevenueMonth[0], revenue: highestRevenueMonth[1] } : null,
    fastestGrowingCustomer,
    mostValuableCustomer,
    mostPurchasedProduct,
    avgOrderValue: Math.round(avgOrderValue),
    repeatPurchaseRate: metrics.repeatPurchaseRate,
    monthlyGrowthPct: metrics.revenueGrowthPct,
  }
}
