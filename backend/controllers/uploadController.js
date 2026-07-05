import { asyncHandler } from '../utils/asyncHandler.js'
import { saveUpload, clearAllUploads, getActiveDataset } from '../services/dataService.js'

// POST /api/upload — body: { fileName, rows: [{ customer_name, product_name,
// order_value, order_date }, ...] }. Rows are already parsed client-side by
// PapaParse (same as Sprint 5's SettingsPage flow) — this endpoint's job is
// persistence, not CSV parsing itself.
export const uploadData = asyncHandler(async (req, res) => {
  const { fileName, rows } = req.body
  const result = await saveUpload(fileName, rows)
  res.status(201).json({ success: true, data: result })
})

// DELETE /api/upload — clears all uploads, reverting the active dataset to demo data.
export const clearUpload = asyncHandler(async (req, res) => {
  await clearAllUploads()
  res.json({ success: true, message: 'Uploads cleared — showing demo data.' })
})

// GET /api/upload/status — lets the frontend check what dataset is currently active.
export const getUploadStatus = asyncHandler(async (req, res) => {
  const { isDemoData, fileName } = await getActiveDataset()
  res.json({ success: true, data: { isDemoData, fileName } })
})
