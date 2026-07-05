// /api/health — used for uptime checks / load balancer probes.
export function healthCheck(req, res) {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() })
}
