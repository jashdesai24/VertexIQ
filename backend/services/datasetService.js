import { Dataset } from '../models/Dataset.js'
import { AppError } from '../utils/AppError.js'

// Write-side dataset CRUD. Exactly one Dataset is isActive per workspace —
// createDataset() deactivates any previous active dataset before creating the
// new one, so "the active dataset" is always a single, unambiguous query.
export async function createDataset(workspaceId, fileName, rows) {
  await Dataset.updateMany({ workspaceId, isActive: true }, { isActive: false })

  const dataset = await Dataset.create({
    workspaceId,
    fileName,
    rowCount: rows.length,
    rows: rows.map((r) => ({
      customer_name: r.customer_name,
      product_name: r.product_name,
      order_value: Number(r.order_value),
      order_date: new Date(r.order_date),
    })),
    isActive: true,
  })

  return dataset
}

export async function getActiveDataset(workspaceId) {
  return Dataset.findOne({ workspaceId, isActive: true })
}

export async function listDatasets(workspaceId) {
  // Exclude embedded rows — this is a metadata list, not a data dump.
  return Dataset.find({ workspaceId }).select('-rows').sort({ uploadedAt: -1 })
}

export async function getDatasetById(id) {
  const dataset = await Dataset.findById(id)
  if (!dataset) throw new AppError('Dataset not found', 404)
  return dataset
}

export async function deleteDatasetById(id) {
  const dataset = await Dataset.findById(id)
  if (!dataset) throw new AppError('Dataset not found', 404)
  await dataset.deleteOne()
  return dataset
}

// Makes `id` the active dataset for its workspace (deactivating any other
// active dataset first), so exactly one dataset is ever active per workspace
// — same invariant createDataset() maintains on upload.
export async function selectDatasetById(workspaceId, id) {
  const dataset = await Dataset.findById(id)
  if (!dataset) throw new AppError('Dataset not found', 404)
  if (dataset.workspaceId !== workspaceId) throw new AppError('Dataset does not belong to this workspace', 403)

  await Dataset.updateMany({ workspaceId, isActive: true }, { isActive: false })
  dataset.isActive = true
  await dataset.save()
  return dataset
}
