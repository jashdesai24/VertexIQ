import mongoose from 'mongoose'

// One snapshot per workspace (unique index) — replaced on every upload.
// kpis/forecastData/topProducts/topCustomers use Mixed rather than rigid
// sub-schemas since their shape is owned by services/metricsService.js and
// may evolve; this model's job is persistence, not re-validating that shape.
const dashboardMetricsSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, unique: true, index: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  kpis: { type: [mongoose.Schema.Types.Mixed], required: true },
  forecastData: { type: [mongoose.Schema.Types.Mixed], required: true },
  topProducts: { type: [mongoose.Schema.Types.Mixed], required: true },
  topCustomers: { type: [mongoose.Schema.Types.Mixed], required: true },
  generatedAt: { type: Date, default: Date.now },
})

export const DashboardMetrics = mongoose.model('DashboardMetrics', dashboardMetricsSchema)
