import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

// Isolated connection setup. server.js just calls connectDB() once at boot —
// retry/pooling/replica-set options can be added here later without touching
// anything else in the app.
export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.')
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  logger.info(`MongoDB connected: ${mongoose.connection.name}`)
}
