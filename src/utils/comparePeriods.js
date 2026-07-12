// Period Comparison utilities (Sprint 10A). Deliberately reuses the monthly
// series builders from services/trendAnalyzer.js rather than re-grouping rows
// here — this file's whole job is the current-vs-previous comparison math,
// not data bucketing.
import { buildMonthlySeries, buildNewCustomersSeries, buildDistinctProductsSeries } from '@/services/trendAnalyzer'

// Shared comparison shape: {current, previous, difference, percentage}.
// Safe for missing previous period (treated as 0) and divide-by-zero.
function compareValues(current, previous) {
  const safeCurrent = current ?? 0
  const safePrevious = previous ?? 0
  const difference = safeCurrent - safePrevious
  const percentage = safePrevious === 0 ? (safeCurrent > 0 ? 100 : 0) : (difference / safePrevious) * 100
  return { current: safeCurrent, previous: safePrevious, difference, percentage: Number(percentage.toFixed(1)) }
}

// Compares the last two points of any {period, value} series. A series with
// fewer than 2 points (no previous period available) is treated as growth
// from zero rather than throwing.
function compareLastTwo(series) {
  if (series.length === 0) return compareValues(0, 0)
  if (series.length < 2) return compareValues(series[0].value, 0)
  return compareValues(series[series.length - 1].value, series[series.length - 2].value)
}

export function compareRevenue(rows) {
  if (!rows || rows.length === 0) return compareValues(0, 0)
  return compareLastTwo(buildMonthlySeries(rows, (r) => Number(r.order_value || 0)))
}

export function compareOrders(rows) {
  if (!rows || rows.length === 0) return compareValues(0, 0)
  return compareLastTwo(buildMonthlySeries(rows, () => 1))
}

export function compareCustomers(rows) {
  if (!rows || rows.length === 0) return compareValues(0, 0)
  return compareLastTwo(buildNewCustomersSeries(rows))
}

export function compareProducts(rows) {
  if (!rows || rows.length === 0) return compareValues(0, 0)
  return compareLastTwo(buildDistinctProductsSeries(rows))
}
