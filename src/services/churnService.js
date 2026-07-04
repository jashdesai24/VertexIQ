import { daysSince } from '@/utils/dateUtils'

// Rule-based churn prediction (Sprint 6 MVP). Thresholds are explicit and
// isolated here so swapping this for a trained classifier later means
// changing this one function, not any component that consumes churnList.
const RISK_RULES = [
  { max: 30, level: 'Low' },
  { max: 60, level: 'Medium' },
  { max: Infinity, level: 'High' },
]

function classifyRisk(daysInactive) {
  if (daysInactive == null) return 'Unknown'
  return RISK_RULES.find((r) => daysInactive <= r.max).level
}

export function computeChurnList(rows, referenceDate = new Date()) {
  const byCustomer = {}
  rows.forEach((r) => {
    if (!r.customer_name || !r.order_date) return
    const key = r.customer_name
    if (!byCustomer[key]) byCustomer[key] = { name: key, orders: 0, ltv: 0, lastOrderDate: r.order_date }
    byCustomer[key].orders += 1
    byCustomer[key].ltv += Number(r.order_value || 0)
    if (new Date(r.order_date) > new Date(byCustomer[key].lastOrderDate)) {
      byCustomer[key].lastOrderDate = r.order_date
    }
  })

  return Object.values(byCustomer)
    .map((c) => {
      const daysInactive = daysSince(c.lastOrderDate, referenceDate)
      return { ...c, daysInactive, riskLevel: classifyRisk(daysInactive) }
    })
    .sort((a, b) => b.daysInactive - a.daysInactive)
}

export function churnRiskSummary(churnList) {
  const high = churnList.filter((c) => c.riskLevel === 'High')
  const medium = churnList.filter((c) => c.riskLevel === 'Medium')
  const revenueAtRisk = high.reduce((sum, c) => sum + c.ltv, 0)
  return {
    highCount: high.length,
    mediumCount: medium.length,
    lowCount: churnList.length - high.length - medium.length,
    revenueAtRisk,
    highRiskRatio: churnList.length > 0 ? high.length / churnList.length : 0,
  }
}
