import { createContext, useMemo, useState } from 'react'
import { computeIntelligence } from '@/services/intelligenceEngine'
import { demoOrders } from '@/data/demoOrders'
import { quickActions } from '@/data/dashboardData'

export const DataContext = createContext(null)

// Single source of truth for "what data is the app showing right now" — either
// the uploaded CSV or the built-in demo dataset. BOTH run through the exact
// same computeIntelligence() engine, so nothing (health score, alerts, churn,
// recommendations) is hardcoded, even in demo mode. Components read only
// through getDashboardData()/getIntelligence() and never touch services/ or
// data/ files directly — that boundary is what lets Sprint 7's backend or a
// future ML model replace the engine without any component changing.
export function DataProvider({ children }) {
  const [uploadedRows, setUploadedRows] = useState(null)
  const [fileName, setFileName] = useState(null)

  const isDemoData = !uploadedRows
  const activeRows = uploadedRows ?? demoOrders

  const intelligence = useMemo(() => computeIntelligence(activeRows), [activeRows])

  const dashboardData = useMemo(() => {
    const { metrics, healthScore, alerts, opportunities, churnSummary } = intelligence

    // Assumed 32% margin (no cost/COGS column exists in the CSV schema yet —
    // this is a documented placeholder until real cost data arrives, e.g. via
    // the Sprint 7 backend). Retention approximated from churn risk ratio.
    const profit = Math.round(metrics.revenue * 0.32)
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

    return {
      isDemoData,
      fileName,
      businessHealthScore: { score: healthScore.score, change: 0 }, // trend history needs persistence — arrives with Sprint 7 backend/DB
      kpis,
      forecastData: metrics.forecastData,
      topProducts: metrics.topProducts,
      topCustomers: metrics.topCustomers,
      recentAlerts,
      upcomingRisks,
      businessOpportunities,
      quickActions,
    }
  }, [intelligence, isDemoData, fileName])

  const uploadData = (rows, name) => {
    setUploadedRows(rows)
    setFileName(name)
  }

  const clearData = () => {
    setUploadedRows(null)
    setFileName(null)
  }

  return (
    <DataContext.Provider
      value={{
        uploadedRows,
        fileName,
        isDemoData,
        uploadData,
        clearData,
        getDashboardData: () => dashboardData,
        getIntelligence: () => intelligence,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
