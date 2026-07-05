import { monthKey } from '../utils/dateUtils.js'

// Turns raw order rows into aggregate business metrics: revenue, top products,
// top customers, and a monthly trend with a short-term forecast projection.
// Pure function: same rows in, same metrics out — easy to unit test, easy to
// swap the forecast projection for a real time-series model in a later sprint.
export function deriveMetrics(rows) {
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
  const repeatCustomers = Object.values(byCustomer).filter((c) => c.orders > 1).length
  const repeatPurchaseRate = uniqueCustomers.size > 0 ? (repeatCustomers / uniqueCustomers.size) * 100 : 0

  const byMonth = {}
  clean.forEach((r) => {
    const key = monthKey(r.order_date)
    if (!key) return
    byMonth[key] = (byMonth[key] || 0) + Number(r.order_value || 0)
  })
  const monthlyEntries = Object.entries(byMonth)
  const forecastData = monthlyEntries.map(([month, actual]) => ({ month, actual, forecast: null }))

  // Naive linear projection from the trailing trend — placeholder until a real
  // time-series model (Prophet/ARIMA-style) replaces it in a later sprint.
  let revenueGrowthPct = 0
  if (forecastData.length >= 2) {
    const last = forecastData[forecastData.length - 1].actual
    const prev = forecastData[forecastData.length - 2].actual
    revenueGrowthPct = prev > 0 ? ((last - prev) / prev) * 100 : 0
    forecastData[forecastData.length - 1].forecast = last
    let projected = last
    for (let i = 1; i <= 2; i++) {
      projected = projected * (1 + revenueGrowthPct / 100)
      forecastData.push({ month: `+${i}mo`, actual: null, forecast: Math.round(projected) })
    }
  }

  return {
    revenue,
    customerCount: uniqueCustomers.size,
    orderCount: clean.length,
    topProducts,
    topCustomers,
    byProduct,
    byCustomer,
    byMonth,
    forecastData,
    revenueGrowthPct: Number(revenueGrowthPct.toFixed(1)),
    repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(1)),
  }
}

// Month-over-month unit-sold comparison per product — powers demand-spike
// alerts and opportunity detection. Compares the two most recent months only.
export function computeDemandSpikes(rows) {
  const clean = rows.filter((r) => r.product_name && r.order_date)
  const byProductMonth = {}
  clean.forEach((r) => {
    const key = monthKey(r.order_date)
    if (!key) return
    if (!byProductMonth[r.product_name]) byProductMonth[r.product_name] = {}
    byProductMonth[r.product_name][key] = (byProductMonth[r.product_name][key] || 0) + 1
  })

  const allMonths = [...new Set(clean.map((r) => monthKey(r.order_date)))].sort(
    (a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`)
  )
  if (allMonths.length < 2) return []
  const [prevMonth, currMonth] = allMonths.slice(-2)

  const spikes = []
  Object.entries(byProductMonth).forEach(([name, months]) => {
    const prevUnits = months[prevMonth] || 0
    const currUnits = months[currMonth] || 0
    if (prevUnits === 0 && currUnits === 0) return
    const growthPct = prevUnits > 0 ? Math.round(((currUnits - prevUnits) / prevUnits) * 100) : 100
    if (growthPct >= 30) {
      spikes.push({ name, prevUnits, currUnits, growthPct })
    }
  })
  return spikes.sort((a, b) => b.growthPct - a.growthPct)
}
