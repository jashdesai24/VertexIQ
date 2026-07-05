import { logger } from '../utils/logger.js'

// Simple request logging middleware — records method, path, status code, and
// duration for every request. Registered first in server.js.
export function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`)
  })
  next()
}
