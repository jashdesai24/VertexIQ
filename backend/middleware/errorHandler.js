import { logger } from '../utils/logger.js'

// Central error-handling middleware (must be registered last in server.js).
// AppError instances carry their own statusCode; anything else is treated as
// an unexpected 500 and logged with its stack for debugging.
export function errorHandler(err, req, res, next) {
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
