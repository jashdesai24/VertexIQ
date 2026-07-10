// /api/health — used for uptime checks / load balancer probes. Same
// {success, data} envelope as every other endpoint for consistency.
export function healthCheck(req, res) {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
}
