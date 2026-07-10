import { computeIntelligence } from './intelligenceEngine'
import { demoOrders } from '@/data/demoOrders'
import { quickActions } from '@/data/dashboardData'

// Offline/demo fallback layer — used ONLY when the backend is unreachable
// (see hooks/useBackendResource.js). Reuses the exact Sprint 6 intelligence
// engine so fallback numbers are still genuinely computed, never hardcoded.
// Response shapes mirror the backend controllers exactly, so pages never know
// which source they're rendering.
let cached = null
function getLocalIntelligence() {
  if (!cached) cached = computeIntelligence(demoOrders)
  return cached
}

export function getLocalDashboard() {
  const { metrics, healthScore, churnSummary } = getLocalIntelligence()
  const profit = Math.round(metrics.revenue * 0.32)
  const retention = Math.round((1 - churnSummary.highRiskRatio) * 100)

  const kpis = [
    { id: 'revenue', label: 'Revenue', value: metrics.revenue, change: metrics.revenueGrowthPct, format: 'currency', icon: 'revenue' },
    { id: 'profit', label: 'Profit', value: profit, change: metrics.revenueGrowthPct, format: 'currency', icon: 'profit' },
    { id: 'growth', label: 'Customer Growth', value: metrics.customerCount, change: metrics.revenueGrowthPct, format: 'number', icon: 'growth' },
    { id: 'retention', label: 'Retention Rate', value: retention, change: -Math.round(churnSummary.highRiskRatio * 100), format: 'percent', icon: 'retention' },
  ]

  return {
    isDemoData: true,
    fileName: null,
    businessHealthScore: { score: healthScore.score, change: 0 },
    kpis,
    forecastData: metrics.forecastData,
    topProducts: metrics.topProducts,
    topCustomers: metrics.topCustomers,
    quickActions,
  }
}

export function getLocalBusinessHealth() {
  return { ...getLocalIntelligence().healthScore, isDemoData: true, fileName: null }
}

export function getLocalExecutiveSummary() {
  const { executiveSummary, insights } = getLocalIntelligence()
  return { ...executiveSummary, insights, isDemoData: true, fileName: null }
}

export function getLocalAlerts() {
  const { alerts, opportunities, churnSummary } = getLocalIntelligence()
  return { alerts, opportunities, churnSummary, isDemoData: true, fileName: null }
}

export function getLocalRecommendations() {
  return { recommendations: getLocalIntelligence().recommendations, isDemoData: true, fileName: null }
}

// Churn Prediction has no backend endpoint yet (out of Sprint 7.5 scope) —
// this page continues reading local data unconditionally. Add /api/churn in
// a future sprint so uploaded (non-demo) data can power it too.
export function getLocalChurn() {
  const { churnList, churnSummary } = getLocalIntelligence()
  return { churnList, churnSummary }
}
