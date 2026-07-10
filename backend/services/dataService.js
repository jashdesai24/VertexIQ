import { DashboardMetrics } from '../models/DashboardMetrics.js'
import { BusinessHealthSnapshot } from '../models/BusinessHealthSnapshot.js'
import { BusinessInsight } from '../models/BusinessInsight.js'
import { Alert } from '../models/Alert.js'
import { Recommendation } from '../models/Recommendation.js'
import { getActiveDataset } from './datasetService.js'
import { computeIntelligence } from './intelligenceEngine.js'
import { demoOrders } from '../data/demoOrders.js'
import { quickActions } from '../data/staticContent.js'

// Read-side: every GET endpoint reads a PERSISTED snapshot, not a live
// recomputation — that's what makes data stable across refreshes/restarts.
// Demo fallback is computed in-memory only (never written to MongoDB) when a
// workspace has no uploaded data yet, per requirement 7.
//
// Each snapshot document stores its own `fileName` (denormalized at write
// time — see intelligencePersistenceService.js), so reads never need a
// second Dataset lookup just to display it.
let demoIntelligenceCache = null
function getDemoIntelligence() {
  if (!demoIntelligenceCache) demoIntelligenceCache = computeIntelligence(demoOrders)
  return demoIntelligenceCache
}

export async function getDashboardSnapshot(workspaceId) {
  const metrics = await DashboardMetrics.findOne({ workspaceId }).lean()
  const health = await BusinessHealthSnapshot.findOne({ workspaceId }).lean()

  if (!metrics || !health) {
    const demo = getDemoIntelligence()
    const profit = Math.round(demo.metrics.revenue * 0.32)
    const retention = Math.round((1 - demo.churnSummary.highRiskRatio) * 100)
    return {
      isDemoData: true,
      fileName: null,
      businessHealthScore: { score: demo.healthScore.score, change: 0 },
      kpis: [
        { id: 'revenue', label: 'Revenue', value: demo.metrics.revenue, change: demo.metrics.revenueGrowthPct, format: 'currency', icon: 'revenue' },
        { id: 'profit', label: 'Profit', value: profit, change: demo.metrics.revenueGrowthPct, format: 'currency', icon: 'profit' },
        { id: 'growth', label: 'Customer Growth', value: demo.metrics.customerCount, change: demo.metrics.revenueGrowthPct, format: 'number', icon: 'growth' },
        { id: 'retention', label: 'Retention Rate', value: retention, change: -Math.round(demo.churnSummary.highRiskRatio * 100), format: 'percent', icon: 'retention' },
      ],
      forecastData: demo.metrics.forecastData,
      topProducts: demo.metrics.topProducts,
      topCustomers: demo.metrics.topCustomers,
      quickActions,
    }
  }

  return {
    isDemoData: false,
    fileName: metrics.fileName,
    businessHealthScore: { score: health.score, change: 0 },
    kpis: metrics.kpis,
    forecastData: metrics.forecastData,
    topProducts: metrics.topProducts,
    topCustomers: metrics.topCustomers,
    quickActions,
  }
}

export async function getBusinessHealthSnapshot(workspaceId) {
  const doc = await BusinessHealthSnapshot.findOne({ workspaceId }).lean()
  if (!doc) {
    const demo = getDemoIntelligence()
    return { ...demo.healthScore, isDemoData: true, fileName: null }
  }
  return { score: doc.score, breakdown: doc.breakdown, explanation: doc.explanation, isDemoData: false, fileName: doc.fileName }
}

export async function getExecutiveSummarySnapshot(workspaceId) {
  const doc = await BusinessInsight.findOne({ workspaceId }).lean()
  if (!doc) {
    const demo = getDemoIntelligence()
    return { ...demo.executiveSummary, insights: demo.insights, isDemoData: true, fileName: null }
  }
  return { ...doc.executiveSummary, insights: doc.insights, isDemoData: false, fileName: doc.fileName }
}

export async function getAlertsSnapshot(workspaceId) {
  const doc = await Alert.findOne({ workspaceId }).lean()
  if (!doc) {
    const demo = getDemoIntelligence()
    return { alerts: demo.alerts, opportunities: demo.opportunities, churnSummary: demo.churnSummary, isDemoData: true, fileName: null }
  }
  return { alerts: doc.alerts, opportunities: doc.opportunities, churnSummary: doc.churnSummary, isDemoData: false, fileName: doc.fileName }
}

export async function getRecommendationsSnapshot(workspaceId) {
  const doc = await Recommendation.findOne({ workspaceId }).lean()
  if (!doc) {
    const demo = getDemoIntelligence()
    return { recommendations: demo.recommendations, isDemoData: true, fileName: null }
  }
  return { recommendations: doc.recommendations, isDemoData: false, fileName: doc.fileName }
}

// The one read that legitimately still needs a Dataset lookup — it's asking
// about the Dataset itself (is there an active one?), not a derived snapshot.
export async function getUploadStatus(workspaceId) {
  const activeDataset = await getActiveDataset(workspaceId)
  return { isDemoData: !activeDataset, fileName: activeDataset?.fileName ?? null }
}
