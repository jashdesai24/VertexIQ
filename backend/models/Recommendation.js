import mongoose from 'mongoose'

const recommendationSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, unique: true, index: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  recommendations: { type: [mongoose.Schema.Types.Mixed], required: true },
  generatedAt: { type: Date, default: Date.now },
})

export const Recommendation = mongoose.model('Recommendation', recommendationSchema)
