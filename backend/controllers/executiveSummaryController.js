import { asyncHandler } from '../utils/asyncHandler.js'
import { getExecutiveSummarySnapshot } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

export const getExecutiveSummary = asyncHandler(async (req, res) => {
  const data = await getExecutiveSummarySnapshot(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
