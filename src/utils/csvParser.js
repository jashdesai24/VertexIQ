import Papa from 'papaparse'

// Expected CSV columns (case-insensitive, order doesn't matter):
// customer_name, product_name, order_value, order_date
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => resolve({ rows: results.data, errors: results.errors, fields: results.meta.fields }),
      error: (err) => reject(err),
    })
  })
}

// Validates that the minimum required columns exist before we try to derive metrics.
export function validateRows(fields = []) {
  const required = ['customer_name', 'product_name', 'order_value', 'order_date']
  const missing = required.filter((r) => !fields.includes(r))
  return { valid: missing.length === 0, missing }
}
