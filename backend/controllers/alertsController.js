import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/dataService.js'
import { computeIntelligence } from '../services/intelligenceEngine.js'

// GET /api/alerts — Smart Alerts + Opportunities, each with priority/reason/action.
export const getAlerts = asyncHandler(async (req, res) => {
  const { rows, isDemoData, fileName } = await getActiveDataset()
  const { alerts, opportunities, churnSummary } = computeIntelligence(rows)

  res.json({ success: true, data: { alerts, opportunities, churnSummary, isDemoData, fileName } })
})
