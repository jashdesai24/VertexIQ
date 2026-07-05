// Realistic raw order-level demo dataset. This is the ONLY demo data left in
// the app — it runs through the exact same intelligenceEngine as an uploaded
// CSV, so nothing (health score, churn, alerts, recommendations) is hardcoded,
// including in demo mode. Dates are deliberately spread to produce natural
// churn-risk variety, a product demand spike, and customer concentration.
export const demoOrders = [
  // Ananya Rao — top customer by revenue (concentration signal), recently active (low churn risk)
  { customer_name: 'Ananya Rao', product_name: 'Hydrating Serum 30ml', order_value: 2400, order_date: '2026-01-14' },
  { customer_name: 'Ananya Rao', product_name: 'Night Repair Cream', order_value: 3200, order_date: '2026-02-20' },
  { customer_name: 'Ananya Rao', product_name: 'Night Repair Cream', order_value: 3200, order_date: '2026-04-02' },
  { customer_name: 'Ananya Rao', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-05-25' },
  { customer_name: 'Ananya Rao', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-28' },

  // Karan Mehta — medium churn risk (~45 days inactive as of 2026-07-04)
  { customer_name: 'Karan Mehta', product_name: 'Vitamin C Face Wash', order_value: 850, order_date: '2026-01-18' },
  { customer_name: 'Karan Mehta', product_name: 'SPF 50 Sunscreen', order_value: 650, order_date: '2026-03-10' },
  { customer_name: 'Karan Mehta', product_name: 'Micellar Water 200ml', order_value: 420, order_date: '2026-05-20' },

  // Sneha Patil — high churn risk (~111 days inactive)
  { customer_name: 'Sneha Patil', product_name: 'SPF 50 Sunscreen', order_value: 650, order_date: '2026-01-22' },
  { customer_name: 'Sneha Patil', product_name: 'Night Repair Cream', order_value: 3200, order_date: '2026-03-15' },

  // Rohit Verma — low churn risk, recent + frequent
  { customer_name: 'Rohit Verma', product_name: 'Micellar Water 200ml', order_value: 420, order_date: '2026-02-05' },
  { customer_name: 'Rohit Verma', product_name: 'Hydrating Serum 30ml', order_value: 2400, order_date: '2026-04-12' },
  { customer_name: 'Rohit Verma', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-10' },

  // Divya Nair — high churn risk (~94 days inactive)
  { customer_name: 'Divya Nair', product_name: 'Hydrating Serum 30ml', order_value: 2400, order_date: '2026-02-18' },
  { customer_name: 'Divya Nair', product_name: 'SPF 50 Sunscreen', order_value: 650, order_date: '2026-04-01' },

  // Priya Desai — high churn risk (~64 days inactive, just over the 60-day line)
  { customer_name: 'Priya Desai', product_name: 'Vitamin C Face Wash', order_value: 850, order_date: '2026-02-28' },
  { customer_name: 'Priya Desai', product_name: 'Micellar Water 200ml', order_value: 420, order_date: '2026-05-01' },

  // Vikram Singh — medium churn risk (~33 days inactive)
  { customer_name: 'Vikram Singh', product_name: 'SPF 50 Sunscreen', order_value: 650, order_date: '2026-04-05' },
  { customer_name: 'Vikram Singh', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-01' },

  // Aditya Kulkarni — newest customer, low churn risk, drives customer growth
  { customer_name: 'Aditya Kulkarni', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-15' },
  { customer_name: 'Aditya Kulkarni', product_name: 'Vitamin C Face Wash', order_value: 850, order_date: '2026-06-30' },

  // Meera Joshi — newer customer, drives the June Retinol Night Oil demand spike
  // without affecting Karan Mehta's / Vikram Singh's own last-order dates above.
  { customer_name: 'Meera Joshi', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-20' },
  { customer_name: 'Meera Joshi', product_name: 'Retinol Night Oil', order_value: 3600, order_date: '2026-06-29' },
]
