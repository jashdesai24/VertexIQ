import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/dataService.js'
import { computeIntelligence } from '../services/intelligenceEngine.js'
import { quickActions } from '../data/staticContent.js'

// GET /api/dashboard — same response shape as the frontend's
// DataContext.getDashboardData(), so swapping the frontend over later is a
// pure "change the data source" edit, not a UI change.
export const getDashboard = asyncHandler(async (req, res) => {
  const { rows, isDemoData, fileName } = await getActiveDataset()
  const { metrics, healthScore, alerts, opportunities, churnSummary } = computeIntelligence(rows)

  const profit = Math.round(metrics.revenue * 0.32) // assumed margin — see PROJECT_MEMORY.md
  const retention = Math.round((1 - churnSummary.highRiskRatio) * 100)

  const kpis = [
    { id: 'revenue', label: 'Revenue', value: metrics.revenue, change: metrics.revenueGrowthPct, format: 'currency', icon: 'revenue' },
    { id: 'profit', label: 'Profit', value: profit, change: metrics.revenueGrowthPct, format: 'currency', icon: 'profit' },
    { id: 'growth', label: 'Customer Growth', value: metrics.customerCount, change: metrics.revenueGrowthPct, format: 'number', icon: 'growth' },
    { id: 'retention', label: 'Retention Rate', value: retention, change: -Math.round(churnSummary.highRiskRatio * 100), format: 'percent', icon: 'retention' },
  ]

  const recentAlerts = alerts.slice(0, 5).map((a) => ({ id: a.id, type: a.type, text: a.text }))
  const upcomingRisks = alerts
    .filter((a) => a.type === 'danger')
    .map((a) => ({ id: a.id, text: a.text, impact: a.priority === 'high' ? 'High' : 'Medium' }))
  const businessOpportunities = opportunities.map((o) => ({ id: o.id, text: o.text, impact: o.impact }))

  res.json({
    success: true,
    data: {
      isDemoData,
      fileName,
      businessHealthScore: { score: healthScore.score, change: 0 },
      kpis,
      forecastData: metrics.forecastData,
      topProducts: metrics.topProducts,
      topCustomers: metrics.topCustomers,
      recentAlerts,
      upcomingRisks,
      businessOpportunities,
      quickActions,
    },
  })
})
