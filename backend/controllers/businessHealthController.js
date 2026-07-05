import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/dataService.js'
import { computeIntelligence } from '../services/intelligenceEngine.js'

// GET /api/business-health — score, breakdown, and explanation (see
// services/healthScoreService.js for the weighted rules).
export const getBusinessHealth = asyncHandler(async (req, res) => {
  const { rows, isDemoData, fileName } = await getActiveDataset()
  const { healthScore } = computeIntelligence(rows)

  res.json({ success: true, data: { ...healthScore, isDemoData, fileName } })
})
