import { AppError } from '../utils/AppError.js'

const REQUIRED_ROW_FIELDS = ['customer_name', 'product_name', 'order_value', 'order_date']

// Lightweight manual validation (no Joi/Zod — not part of the requested
// stack). Checks the CSV upload payload shape before it ever reaches the
// controller/service layer.
export function validateUploadPayload(req, res, next) {
  const { rows, fileName } = req.body

  if (!fileName || typeof fileName !== 'string') {
    return next(new AppError('fileName is required and must be a string', 400))
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    return next(new AppError('rows must be a non-empty array', 400))
  }

  const sample = rows[0]
  const missing = REQUIRED_ROW_FIELDS.filter((f) => !(f in sample))
  if (missing.length > 0) {
    return next(new AppError(`Missing required column(s): ${missing.join(', ')}`, 400))
  }

  // Spot-check value types on the sample row — catches an obviously wrong
  // CSV (e.g. columns swapped) with a clear message instead of letting bad
  // data reach MongoDB and fail there as an opaque cast error.
  if (Number.isNaN(Number(sample.order_value))) {
    return next(new AppError('order_value must be a number', 400))
  }
  if (Number.isNaN(new Date(sample.order_date).getTime())) {
    return next(new AppError('order_date must be a valid date', 400))
  }

  next()
}
