import { asyncHandler } from '../utils/asyncHandler.js'
import { createDataset, getActiveDataset } from '../services/datasetService.js'
import { generateAndPersistIntelligence, clearPersistedIntelligence } from '../services/intelligencePersistenceService.js'
import { getUploadStatus as getStatus } from '../services/dataService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

// POST /api/upload — body: { fileName, rows }. Creates a Dataset (raw rows
// persisted), then immediately generates and persists all derived
// intelligence (dashboard metrics, health score, insights, alerts,
// recommendations) so every subsequent GET is an instant read, not a recompute.
export const uploadData = asyncHandler(async (req, res) => {
  const { fileName, rows } = req.body
  const dataset = await createDataset(DEFAULT_WORKSPACE_ID, fileName, rows)
  await generateAndPersistIntelligence(DEFAULT_WORKSPACE_ID, dataset)

  res.status(201).json({ success: true, data: { datasetId: dataset._id, fileName: dataset.fileName, rowCount: dataset.rowCount } })
})

// DELETE /api/upload — clears the active dataset's generated intelligence,
// reverting all GET endpoints to the in-memory demo fallback. The Dataset
// documents themselves are left in place (upload history) — use
// DELETE /api/datasets/:id to remove a specific dataset entirely.
export const clearUpload = asyncHandler(async (req, res) => {
  const active = await getActiveDataset(DEFAULT_WORKSPACE_ID)
  if (active) {
    active.isActive = false
    await active.save()
  }
  await clearPersistedIntelligence(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, message: 'Uploads cleared — showing demo data.' })
})

// GET /api/upload/status
export const getUploadStatus = asyncHandler(async (req, res) => {
  const data = await getStatus(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data })
})
