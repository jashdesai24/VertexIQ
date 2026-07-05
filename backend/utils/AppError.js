// Custom error class carrying an HTTP status code alongside the message, so
// the central errorHandler middleware knows how to respond without every
// controller needing to set res.status() itself.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
