import mongoose from 'mongoose'

// Replaces the Sprint 7 Order/UploadBatch pair with one document per upload:
// raw rows embedded directly (simpler than a separate Order collection for
// this data size), plus upload metadata. Exactly one dataset per workspace is
// isActive at a time — that's the dataset generated intelligence is computed
// from. Older datasets remain queryable (GET /api/datasets) but inactive.
const rowSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    product_name: { type: String, required: true },
    order_value: { type: Number, required: true },
    order_date: { type: Date, required: true },
  },
  { _id: false }
)

const datasetSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  rowCount: { type: Number, required: true },
  rows: { type: [rowSchema], required: true },
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
})

export const Dataset = mongoose.model('Dataset', datasetSchema)
