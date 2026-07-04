import Papa from 'papaparse'

// Expected CSV columns (case-insensitive, order doesn't matter):
// customer_name, product_name, order_value, order_date
// Extra columns are ignored for now (review_text/rating arrive with Sprint 6 sentiment analysis).
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => resolve({ rows: results.data, errors: results.errors, fields: results.meta.fields }),
      error: (err) => reject(err),
    })
  })
}

// Validates that the minimum required columns exist before we try to derive metrics.
export function validateRows(fields = []) {
  const required = ['customer_name', 'product_name', 'order_value', 'order_date']
  const missing = required.filter((r) => !fields.includes(r))
  return { valid: missing.length === 0, missing }
}

// Turns raw order rows into the aggregate shapes the Dashboard widgets expect.
// NOTE: this is simple client-side aggregation for the MVP. Sprint 6 replaces the
// forecast projection and adds real churn/segmentation — this function is the
// seam where that upgrade plugs in without touching any component.
export function deriveMetricsFromRows(rows) {
  const clean = rows.filter((r) => r.customer_name && r.order_value != null && r.order_date)

  const revenue = clean.reduce((sum, r) => sum + Number(r.order_value || 0), 0)
  const uniqueCustomers = new Set(clean.map((r) => r.customer_name))

  const byProduct = {}
  clean.forEach((r) => {
    const key = r.product_name || 'Unknown Product'
    if (!byProduct[key]) byProduct[key] = { name: key, revenue: 0, units: 0 }
    byProduct[key].revenue += Number(r.order_value || 0)
    byProduct[key].units += 1
  })
  const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  const byCustomer = {}
  clean.forEach((r) => {
    const key = r.customer_name
    if (!byCustomer[key]) byCustomer[key] = { name: key, ltv: 0, orders: 0 }
    byCustomer[key].ltv += Number(r.order_value || 0)
    byCustomer[key].orders += 1
  })
  const topCustomers = Object.values(byCustomer).sort((a, b) => b.ltv - a.ltv).slice(0, 5)

  const byMonth = {}
  clean.forEach((r) => {
    const d = new Date(r.order_date)
    if (Number.isNaN(d.getTime())) return
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    byMonth[key] = (byMonth[key] || 0) + Number(r.order_value || 0)
  })
  const monthlyEntries = Object.entries(byMonth)
  const forecastData = monthlyEntries.map(([month, actual]) => ({ month, actual, forecast: null }))

  // Simple 2-month linear projection from the trailing trend — placeholder until
  // Sprint 6 swaps this for a real time-series forecasting model.
  if (forecastData.length >= 2) {
    const last = forecastData[forecastData.length - 1].actual
    const prev = forecastData[forecastData.length - 2].actual
    const growthRate = prev > 0 ? (last - prev) / prev : 0.05
    forecastData[forecastData.length - 1].forecast = last
    let projected = last
    for (let i = 1; i <= 2; i++) {
      projected = projected * (1 + growthRate)
      forecastData.push({ month: `+${i}mo`, actual: null, forecast: Math.round(projected) })
    }
  }

  return {
    revenue,
    customerCount: uniqueCustomers.size,
    orderCount: clean.length,
    topProducts,
    topCustomers,
    forecastData,
  }
}
