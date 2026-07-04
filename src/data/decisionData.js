// Decision Center feed: each item mirrors an eventual real ML-model output row,
// carrying its own explanation so the UI never has to guess "why".
export const decisions = [
  {
    id: 1,
    priority: 'high',
    category: 'Churn Risk',
    title: '34 customers at high churn risk',
    impact: '₹4.2L revenue at risk',
    reasons: [
      'No purchase in 90+ days',
      'Average order value dropped 40%',
      'Zero email engagement in last 5 campaigns',
    ],
    action: 'Send retention coupon',
  },
  {
    id: 2,
    priority: 'high',
    category: 'Inventory',
    title: 'SPF 50 Sunscreen will stock out in 9 days',
    impact: 'Est. ₹1.1L lost sales if unresolved',
    reasons: [
      'Sales velocity up 22% week-over-week',
      'Current stock covers 9 days at this rate',
    ],
    action: 'Reorder 500 units',
  },
  {
    id: 3,
    priority: 'medium',
    category: 'Sentiment',
    title: '5 reviews this week flag delivery delays',
    impact: 'Risk to satisfaction score',
    reasons: [
      'Keyword "late delivery" up 3x vs last month',
      'Avg. rating on affected orders: 2.1 / 5',
    ],
    action: 'Escalate to logistics team',
  },
  {
    id: 4,
    priority: 'medium',
    category: 'Opportunity',
    title: 'Demand spike: Vitamin C Face Wash',
    impact: 'Potential +₹80K this month',
    reasons: [
      'Search/click volume up 40% this week',
      'Conversion rate on product page up 18%',
    ],
    action: 'Feature in next campaign',
  },
  {
    id: 5,
    priority: 'low',
    category: 'Upsell',
    title: '12 high-value customers eligible for bundle offer',
    impact: 'Est. +₹45K if 20% convert',
    reasons: [
      'CLV in top 15th percentile',
      'No bundle purchase in last 60 days',
    ],
    action: 'Send personalized bundle offer',
  },
]
