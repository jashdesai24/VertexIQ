// Landing page mockup data (DashboardPreview.jsx) + the one genuinely static
// piece of dashboard content (quickActions, used by services/localFallback.js).
// Everything else that used to live here (topProducts, topCustomers, alerts,
// churn summary) was superseded by real computation in Sprint 6/7.5 and has
// been removed — it was dead code, never imported after that point.
export const businessHealthScore = {
  score: 78,
  change: -6,
  trend: [72, 74, 75, 79, 84, 83, 78],
}

export const kpis = [
  { id: 'revenue', label: 'Revenue', value: 1842000, change: 8.2, format: 'currency', icon: 'revenue' },
  { id: 'profit', label: 'Profit', value: 512000, change: 4.6, format: 'currency', icon: 'profit' },
  { id: 'growth', label: 'Customer Growth', value: 214, change: 12.4, format: 'number', icon: 'growth' },
  { id: 'retention', label: 'Retention Rate', value: 84.3, change: -2.1, format: 'percent', icon: 'retention' },
]

export const forecastData = [
  { month: 'Feb', actual: 1420000, forecast: null },
  { month: 'Mar', actual: 1510000, forecast: null },
  { month: 'Apr', actual: 1489000, forecast: null },
  { month: 'May', actual: 1620000, forecast: null },
  { month: 'Jun', actual: 1705000, forecast: null },
  { month: 'Jul', actual: 1842000, forecast: 1842000 },
  { month: 'Aug', actual: null, forecast: 1958000 },
  { month: 'Sep', actual: null, forecast: 2064000 },
  { month: 'Oct', actual: null, forecast: 2110000 },
]

export const quickActions = [
  { id: 1, label: 'Review at-risk customers' },
  { id: 2, label: 'Approve reorder for low-stock items' },
  { id: 3, label: 'Send win-back campaign' },
]
