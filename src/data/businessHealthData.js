// Business Health Score breakdown — weights match PROJECT_MEMORY.md Section 12.
export const healthScore = { score: 78, change: -6 }

export const healthHistory = [
  { period: 'Jan', score: 72 },
  { period: 'Feb', score: 74 },
  { period: 'Mar', score: 75 },
  { period: 'Apr', score: 79 },
  { period: 'May', score: 84 },
  { period: 'Jun', score: 83 },
  { period: 'Jul', score: 78 },
]

export const healthComponents = [
  { label: 'Revenue Growth', weight: 20, contribution: 16, status: 'good' },
  { label: 'Customer Churn Rate', weight: 20, contribution: 8, status: 'bad' },
  { label: 'Customer Growth', weight: 10, contribution: 9, status: 'good' },
  { label: 'Customer Satisfaction', weight: 15, contribution: 11, status: 'neutral' },
  { label: 'Customer Lifetime Value', weight: 10, contribution: 8, status: 'good' },
  { label: 'Repeat Purchase Rate', weight: 10, contribution: 7, status: 'neutral' },
  { label: 'Average Order Value', weight: 5, contribution: 4, status: 'good' },
  { label: 'Inventory Health', weight: 5, contribution: 3, status: 'bad' },
  { label: 'Marketing Performance', weight: 5, contribution: 4, status: 'neutral' },
]

export const healthSummary =
  'Your score dropped 6 points this month, mainly driven by a 15% churn rate increase in your loyalty segment and tightening inventory health. Revenue growth and customer growth remain strong.'
