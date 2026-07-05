import { asyncHandler } from '../utils/asyncHandler.js'
import { getBusinessHealthSnapshot } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

export const getBusinessHealth = asyncHandler(async (req, res) => {
  const data = await getBusinessHealthSnapshot(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
