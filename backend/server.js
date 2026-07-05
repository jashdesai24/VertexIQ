import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import apiRoutes from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 5000

// CORS_ORIGIN supports a comma-separated list (e.g. production Vercel URL +
// preview deployment URLs). Falls back to '*' only if unset, which is fine
// for local dev but should always be set explicitly in production.
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  })
)
app.use(express.json())
app.use(requestLogger)

app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => logger.info(`VertexIQ backend listening on port ${PORT}`))
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
}

start()
