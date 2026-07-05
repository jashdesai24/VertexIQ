import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/AppError.js'
import { listDatasets, getDatasetById, deleteDatasetById } from '../services/datasetService.js'
import { clearPersistedIntelligence } from '../services/intelligencePersistenceService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid dataset id', 400)
}

// GET /api/datasets — metadata list (no embedded rows) of every upload for this workspace.
export const getDatasets = asyncHandler(async (req, res) => {
  const datasets = await listDatasets(DEFAULT_WORKSPACE_ID)
  res.json({ success: true, data: datasets })
})

// GET /api/datasets/:id — full dataset including raw rows.
export const getDataset = asyncHandler(async (req, res) => {
  assertValidId(req.params.id)
  const dataset = await getDatasetById(req.params.id)
  res.json({ success: true, data: dataset })
})

// DELETE /api/datasets/:id — removes the dataset. If it was the active one,
// its derived intelligence snapshots are cleared too (they'd otherwise
// reference a datasetId that no longer exists), reverting reads to demo data.
export const deleteDataset = asyncHandler(async (req, res) => {
  assertValidId(req.params.id)
  const dataset = await deleteDatasetById(req.params.id)
  if (dataset.isActive) {
    await clearPersistedIntelligence(dataset.workspaceId)
  }
  res.json({ success: true, message: `Dataset "${dataset.fileName}" deleted.` })
})
