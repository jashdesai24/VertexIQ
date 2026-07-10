import mongoose from 'mongoose'

// One snapshot document per workspace holding the full Smart Alerts +
// Opportunity Detection + churn summary output — not one Mongo doc per alert,
// since alerts are regenerated wholesale on every upload rather than
// individually created/resolved (that granularity can come later if needed).
const alertSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, unique: true, index: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  fileName: { type: String, required: true }, // denormalized from Dataset to avoid an extra query on every read
  alerts: { type: [mongoose.Schema.Types.Mixed], required: true },
  opportunities: { type: [mongoose.Schema.Types.Mixed], required: true },
  churnSummary: { type: mongoose.Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now },
})

export const Alert = mongoose.model('Alert', alertSchema)
