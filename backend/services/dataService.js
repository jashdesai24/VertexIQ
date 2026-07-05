import { Order } from '../models/Order.js'
import { UploadBatch } from '../models/UploadBatch.js'
import { demoOrders } from '../data/demoOrders.js'

// Bridges MongoDB and the intelligence engine: returns the "active dataset"
// (most recent upload, or the demo dataset if nothing has been uploaded yet)
// in the exact row shape computeIntelligence() expects — same contract as the
// frontend's DataContext (uploadedRows ?? demoOrders).
export async function getActiveDataset() {
  const latestBatch = await UploadBatch.findOne().sort({ uploadedAt: -1 })

  if (!latestBatch) {
    return { rows: demoOrders, isDemoData: true, fileName: null }
  }

  const orders = await Order.find({ batchId: latestBatch._id }).lean()
  const rows = orders.map((o) => ({
    customer_name: o.customer_name,
    product_name: o.product_name,
    order_value: o.order_value,
    order_date: o.order_date.toISOString().slice(0, 10),
  }))

  return { rows, isDemoData: false, fileName: latestBatch.fileName }
}

export async function saveUpload(fileName, rows) {
  const batch = await UploadBatch.create({ fileName, rowCount: rows.length })
  const docs = rows.map((r) => ({
    batchId: batch._id,
    customer_name: r.customer_name,
    product_name: r.product_name,
    order_value: Number(r.order_value),
    order_date: new Date(r.order_date),
  }))
  await Order.insertMany(docs)
  return { batchId: batch._id, rowCount: rows.length }
}

export async function clearAllUploads() {
  await Order.deleteMany({})
  await UploadBatch.deleteMany({})
}
