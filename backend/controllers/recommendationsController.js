import { asyncHandler } from '../utils/asyncHandler.js'
import { getRecommendationsSnapshot } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

export const getRecommendations = asyncHandler(async (req, res) => {
  const data = await getRecommendationsSnapshot(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
