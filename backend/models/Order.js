import mongoose from 'mongoose'

// Mirrors the CSV row shape exactly (customer_name, product_name, order_value,
// order_date) plus a batchId tying rows to a specific upload. No tenant/company
// field yet — multi-tenancy arrives with auth in Sprint 8.
const orderSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadBatch', required: true, index: true },
  customer_name: { type: String, required: true },
  product_name: { type: String, required: true },
  order_value: { type: Number, required: true },
  order_date: { type: Date, required: true },
})

export const Order = mongoose.model('Order', orderSchema)
