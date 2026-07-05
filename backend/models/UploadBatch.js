import mongoose from 'mongoose'

// One document per CSV upload. The most recent batch is the "active dataset"
// — mirrors the frontend's single-active-upload model (see DataContext.jsx).
// Multi-tenancy (per-company batches) arrives with auth in Sprint 8.
const uploadBatchSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  rowCount: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
})

export const UploadBatch = mongoose.model('UploadBatch', uploadBatchSchema)
