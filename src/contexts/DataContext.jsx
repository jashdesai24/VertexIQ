import { createContext, useMemo, useState } from 'react'
import { deriveMetricsFromRows } from '@/utils/csvParser'
import * as demo from '@/data/dashboardData'

export const DataContext = createContext(null)

// Owns the uploaded CSV (if any) and produces one merged "dashboard data" object:
// fields we can derive from the CSV (revenue, customer growth, top products/customers,
// forecast) come from the upload; fields we can't yet (health score, retention,
// decisions, alerts — these need the Sprint 6 ML/rules layer) fall back to demo data.
// Components always read through getDashboardData() and never touch demo/ files directly.
export function DataProvider({ children }) {
  const [uploadedRows, setUploadedRows] = useState(null)
  const [fileName, setFileName] = useState(null)

  const derived = useMemo(() => (uploadedRows ? deriveMetricsFromRows(uploadedRows) : null), [uploadedRows])

  const dashboardData = useMemo(() => {
    if (!derived) {
      return {
        isDemoData: true,
        fileName: null,
        businessHealthScore: demo.businessHealthScore,
        kpis: demo.kpis,
        forecastData: demo.forecastData,
        topProducts: demo.topProducts,
        topCustomers: demo.topCustomers,
        recentAlerts: demo.recentAlerts,
        upcomingRisks: demo.upcomingRisks,
        businessOpportunities: demo.businessOpportunities,
        quickActions: demo.quickActions,
      }
    }

    // Merge: override what we derived, keep demo placeholders for everything else.
    const kpis = demo.kpis.map((kpi) => {
      if (kpi.id === 'revenue') return { ...kpi, value: derived.revenue, change: 0 }
      if (kpi.id === 'growth') return { ...kpi, value: derived.customerCount, change: 0 }
      return kpi // profit/retention need cost + repeat-purchase data — still demo until Sprint 6
    })

    return {
      isDemoData: false,
      fileName,
      businessHealthScore: demo.businessHealthScore, // Sprint 6: compute from real churn/sentiment
      kpis,
      forecastData: derived.forecastData.length ? derived.forecastData : demo.forecastData,
      topProducts: derived.topProducts.length ? derived.topProducts : demo.topProducts,
      topCustomers: derived.topCustomers.length ? derived.topCustomers : demo.topCustomers,
      recentAlerts: demo.recentAlerts, // Sprint 6: generate from real inventory/sentiment signals
      upcomingRisks: demo.upcomingRisks,
      businessOpportunities: demo.businessOpportunities,
      quickActions: demo.quickActions,
    }
  }, [derived, fileName])

  const uploadData = (rows, name) => {
    setUploadedRows(rows)
    setFileName(name)
  }

  const clearData = () => {
    setUploadedRows(null)
    setFileName(null)
  }

  return (
    <DataContext.Provider value={{ uploadedRows, fileName, uploadData, clearData, getDashboardData: () => dashboardData }}>
      {children}
    </DataContext.Provider>
  )
}
