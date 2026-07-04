// Product Recommendation Engine (Sprint 6 MVP — popularity-based, no ML).
// For each customer: compare what they've purchased against overall product
// popularity (by order count) and recommend their highest-ranked gap.
// Isolated here so a real collaborative-filtering model can replace only
// this function later without touching ChurnPredictionPage/ProductRecommendationPage.
export function generateRecommendations(rows) {
  const productPopularity = {}
  rows.forEach((r) => {
    if (!r.product_name) return
    productPopularity[r.product_name] = (productPopularity[r.product_name] || 0) + 1
  })
  const rankedProducts = Object.entries(productPopularity)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)

  const purchasesByCustomer = {}
  rows.forEach((r) => {
    if (!r.customer_name || !r.product_name) return
    if (!purchasesByCustomer[r.customer_name]) purchasesByCustomer[r.customer_name] = new Set()
    purchasesByCustomer[r.customer_name].add(r.product_name)
  })

  return Object.entries(purchasesByCustomer).map(([customer, purchasedSet]) => {
    const purchased = Array.from(purchasedSet)
    const notPurchased = rankedProducts.filter((p) => !purchasedSet.has(p))
    return {
      customer,
      purchased,
      recommended: notPurchased[0] || null,
      reason: notPurchased[0]
        ? `Popular with similar customers; ${customer} hasn't purchased this yet.`
        : 'Already purchased across the full catalog.',
    }
  })
}
