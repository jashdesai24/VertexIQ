import { asyncHandler } from '../utils/asyncHandler.js'
import { getDashboardSnapshot } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

// GET /api/dashboard — reads the persisted DashboardMetrics/BusinessHealthSnapshot
// (or an in-memory demo computation if nothing has been uploaded yet).
export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardSnapshot(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
