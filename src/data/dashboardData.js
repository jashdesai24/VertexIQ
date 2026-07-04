// Mock data shaped exactly like the future API response (see services/ in Sprint 7).
// Swapping this file for a real fetch call later requires zero changes downstream.

export const businessHealthScore = {
  score: 78,
  change: -6,
  trend: [72, 74, 75, 79, 84, 83, 78],
}

export const kpis = [
  { id: 'revenue', label: 'Revenue', value: 1842000, change: 8.2, format: 'currency' },
  { id: 'profit', label: 'Profit', value: 512000, change: 4.6, format: 'currency' },
  { id: 'growth', label: 'Customer Growth', value: 214, change: 12.4, format: 'number' },
  { id: 'retention', label: 'Retention Rate', value: 84.3, change: -2.1, format: 'percent' },
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

export const topProducts = [
  { name: 'Hydrating Serum 30ml', revenue: 312000, units: 1042 },
  { name: 'Vitamin C Face Wash', revenue: 268000, units: 1890 },
  { name: 'SPF 50 Sunscreen', revenue: 241000, units: 980 },
  { name: 'Night Repair Cream', revenue: 198000, units: 610 },
  { name: 'Micellar Water 200ml', revenue: 154000, units: 1320 },
]

export const topCustomers = [
  { name: 'Ananya Rao', ltv: 84200, orders: 22 },
  { name: 'Karan Mehta', ltv: 76500, orders: 19 },
  { name: 'Sneha Patil', ltv: 71200, orders: 17 },
  { name: 'Rohit Verma', ltv: 68900, orders: 15 },
  { name: 'Divya Nair', ltv: 63400, orders: 14 },
]

export const recentAlerts = [
  { id: 1, type: 'danger', text: '34 customers crossed high churn-risk threshold (>70%)' },
  { id: 2, type: 'warning', text: '3 products will stock out within 9 days' },
  { id: 3, type: 'warning', text: '5 negative reviews this week mention "late delivery"' },
]

export const upcomingRisks = [
  { id: 1, text: 'Loyalty segment churn risk up 15% this month', impact: 'High' },
  { id: 2, text: 'Inventory for SPF 50 Sunscreen critically low', impact: 'Medium' },
]

export const businessOpportunities = [
  { id: 1, text: 'Demand for Vitamin C Face Wash up 40% this week', impact: 'High' },
  { id: 2, text: '12 high-value customers eligible for upsell bundle', impact: 'Medium' },
]

export const quickActions = [
  { id: 1, label: 'Review at-risk customers' },
  { id: 2, label: 'Approve reorder for low-stock items' },
  { id: 3, label: 'Send win-back campaign' },
]
