import mongoose from 'mongoose'

const businessHealthSnapshotSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, unique: true, index: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  score: { type: Number, required: true },
  breakdown: { type: [mongoose.Schema.Types.Mixed], required: true },
  explanation: { type: [String], required: true },
  generatedAt: { type: Date, default: Date.now },
})

export const BusinessHealthSnapshot = mongoose.model('BusinessHealthSnapshot', businessHealthSnapshotSchema)
