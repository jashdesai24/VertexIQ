// Wraps async route handlers so rejected promises are forwarded to next(err)
// automatically — controllers never need their own try/catch boilerplate.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
