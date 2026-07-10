import { computeIntelligence } from './intelligenceEngine.js'
import { DashboardMetrics } from '../models/DashboardMetrics.js'
import { BusinessHealthSnapshot } from '../models/BusinessHealthSnapshot.js'
import { BusinessInsight } from '../models/BusinessInsight.js'
import { Alert } from '../models/Alert.js'
import { Recommendation } from '../models/Recommendation.js'

// Runs the (unchanged) rule-based intelligence engine once, then persists
// every derived artifact as a per-workspace snapshot (upsert = replace).
// This is what makes reads instant and stable across refreshes instead of
// recomputing from raw rows on every GET request. Takes the full `dataset`
// (not just id+rows) so fileName can be denormalized onto every snapshot —
// avoids an extra Dataset lookup on every subsequent read (see dataService.js).
export async function generateAndPersistIntelligence(workspaceId, dataset) {
  const { _id: datasetId, fileName, rows } = dataset
  const intelligence = computeIntelligence(rows)
  const { metrics, healthScore, executiveSummary, insights, alerts, opportunities, churnSummary, recommendations } = intelligence

  await Promise.all([
    DashboardMetrics.findOneAndUpdate(
      { workspaceId },
      {
        workspaceId,
        datasetId,
        fileName,
        kpis: buildKpis(metrics, churnSummary),
        forecastData: metrics.forecastData,
        topProducts: metrics.topProducts,
        topCustomers: metrics.topCustomers,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    ),
    BusinessHealthSnapshot.findOneAndUpdate(
      { workspaceId },
      { workspaceId, datasetId, fileName, score: healthScore.score, breakdown: healthScore.breakdown, explanation: healthScore.explanation, generatedAt: new Date() },
      { upsert: true, new: true }
    ),
    BusinessInsight.findOneAndUpdate(
      { workspaceId },
      { workspaceId, datasetId, fileName, executiveSummary, insights, generatedAt: new Date() },
      { upsert: true, new: true }
    ),
    Alert.findOneAndUpdate(
      { workspaceId },
      { workspaceId, datasetId, fileName, alerts, opportunities, churnSummary, generatedAt: new Date() },
      { upsert: true, new: true }
    ),
    Recommendation.findOneAndUpdate(
      { workspaceId },
      { workspaceId, datasetId, fileName, recommendations, generatedAt: new Date() },
      { upsert: true, new: true }
    ),
  ])

  return intelligence
}

export async function clearPersistedIntelligence(workspaceId) {
  await Promise.all([
    DashboardMetrics.deleteOne({ workspaceId }),
    BusinessHealthSnapshot.deleteOne({ workspaceId }),
    BusinessInsight.deleteOne({ workspaceId }),
    Alert.deleteOne({ workspaceId }),
    Recommendation.deleteOne({ workspaceId }),
  ])
}

// Same profit/retention assumptions as before (see PROJECT_MEMORY.md) — kept
// here since this is the one place KPIs are computed before persistence.
function buildKpis(metrics, churnSummary) {
  const profit = Math.round(metrics.revenue * 0.32)
  const retention = Math.round((1 - churnSummary.highRiskRatio) * 100)
  return [
    { id: 'revenue', label: 'Revenue', value: metrics.revenue, change: metrics.revenueGrowthPct, format: 'currency', icon: 'revenue' },
    { id: 'profit', label: 'Profit', value: profit, change: metrics.revenueGrowthPct, format: 'currency', icon: 'profit' },
    { id: 'growth', label: 'Customer Growth', value: metrics.customerCount, change: metrics.revenueGrowthPct, format: 'number', icon: 'growth' },
    { id: 'retention', label: 'Retention Rate', value: retention, change: -Math.round(churnSummary.highRiskRatio * 100), format: 'percent', icon: 'retention' },
  ]
}
