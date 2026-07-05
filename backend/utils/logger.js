// Minimal structured logger — no extra dependency (morgan/winston) since the
// requested stack didn't include one. Swappable for a real logging library
// later without touching any file that calls logger.*.
function timestamp() {
  return new Date().toISOString()
}

export const logger = {
  info: (msg) => console.log(`[${timestamp()}] INFO  ${msg}`),
  warn: (msg) => console.warn(`[${timestamp()}] WARN  ${msg}`),
  error: (msg) => console.error(`[${timestamp()}] ERROR ${msg}`),
}
