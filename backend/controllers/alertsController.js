import { asyncHandler } from '../utils/asyncHandler.js'
import { getAlertsSnapshot } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

export const getAlerts = asyncHandler(async (req, res) => {
  const data = await getAlertsSnapshot(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
