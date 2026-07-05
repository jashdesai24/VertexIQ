import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/dataService.js'
import { computeIntelligence } from '../services/intelligenceEngine.js'

// GET /api/recommendations — per-customer product recommendations
// (see services/recommendationService.js — popularity-gap logic, no ML yet).
export const getRecommendations = asyncHandler(async (req, res) => {
  const { rows, isDemoData, fileName } = await getActiveDataset()
  const { recommendations } = computeIntelligence(rows)

  res.json({ success: true, data: { recommendations, isDemoData, fileName } })
})
