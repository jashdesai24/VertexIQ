import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/AppError.js'
import { listDatasets, getDatasetById, deleteDatasetById, selectDatasetById } from '../services/datasetService.js'
import { clearPersistedIntelligence, generateAndPersistIntelligence } from '../services/intelligencePersistenceService.js'
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

// POST /api/datasets/:id/select — makes this dataset active and regenerates
// all persisted intelligence from it (same generateAndPersistIntelligence
// used on upload — selecting a dataset is just "re-run intelligence on
// already-stored rows instead of newly-parsed ones").
export const selectDataset = asyncHandler(async (req, res) => {
  assertValidId(req.params.id)
  const dataset = await selectDatasetById(DEFAULT_WORKSPACE_ID, req.params.id)
  await generateAndPersistIntelligence(DEFAULT_WORKSPACE_ID, dataset._id, dataset.rows)
  res.json({ success: true, data: { datasetId: dataset._id, fileName: dataset.fileName, rowCount: dataset.rowCount } })
})
