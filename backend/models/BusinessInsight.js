import mongoose from 'mongoose'

// Holds both the raw insight facts (services/insightService.js) and the
// narrative executive summary (services/executiveSummaryService.js) together,
// since GET /api/executive-summary has always returned both as one payload.
const businessInsightSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, unique: true, index: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  fileName: { type: String, required: true }, // denormalized from Dataset to avoid an extra query on every read
  executiveSummary: { type: mongoose.Schema.Types.Mixed, required: true },
  insights: { type: mongoose.Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now },
})

export const BusinessInsight = mongoose.model('BusinessInsight', businessInsightSchema)
