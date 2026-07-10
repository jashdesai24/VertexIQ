import { logger } from '../utils/logger.js'

// Central error-handling middleware (must be registered last in server.js).
// AppError instances carry their own statusCode; Mongoose validation/cast
// errors are recognized and mapped to a clean 400 instead of an opaque 500;
// anything else is treated as an unexpected 500 and logged with its stack.
export function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    // Mongoose schema validation failure (e.g. a required field missing on a
    // sub-document Papa Parse produced) — collect the individual field messages.
    const message = Object.values(err.errors).map((e) => e.message).join('; ')
    logger.warn(`${req.method} ${req.originalUrl} -> 400 ${message}`)
    return res.status(400).json({ success: false, error: message })
  }

  if (err.name === 'CastError') {
    // Usually a malformed value for a typed field (e.g. a non-numeric
    // order_value, or an invalid ObjectId that slipped past route validation).
    const message = `Invalid value for field "${err.path}": ${err.value}`
    logger.warn(`${req.method} ${req.originalUrl} -> 400 ${message}`)
    return res.status(400).json({ success: false, error: message })
  }

  const statusCode = err.statusCode || 500
  if (!err.isOperational) {
    logger.error(`Unexpected error: ${err.stack || err.message}`)
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${err.message}`)
  }

  res.status(statusCode).json({
    success: false,
    error: err.isOperational ? err.message : 'Internal server error',
  })
}

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` })
}
