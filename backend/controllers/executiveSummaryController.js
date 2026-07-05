import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/dataService.js'
import { computeIntelligence } from '../services/intelligenceEngine.js'

// GET /api/executive-summary — natural-language summary + supporting insights.
export const getExecutiveSummary = asyncHandler(async (req, res) => {
  const { rows, isDemoData, fileName } = await getActiveDataset()
  const { executiveSummary, insights } = computeIntelligence(rows)

  res.json({ success: true, data: { ...executiveSummary, insights, isDemoData, fileName } })
})
