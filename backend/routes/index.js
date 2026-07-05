import { Router } from 'express'
import healthRoutes from './healthRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import businessHealthRoutes from './businessHealthRoutes.js'
import executiveSummaryRoutes from './executiveSummaryRoutes.js'
import alertsRoutes from './alertsRoutes.js'
import recommendationsRoutes from './recommendationsRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import datasetsRoutes from './datasetsRoutes.js'

// Single mount point — server.js only needs to know about this one router.
// Adding a new API resource later means one line here, not touching server.js.
const router = Router()
router.use('/health', healthRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/business-health', businessHealthRoutes)
router.use('/executive-summary', executiveSummaryRoutes)
router.use('/alerts', alertsRoutes)
router.use('/recommendations', recommendationsRoutes)
router.use('/upload', uploadRoutes)
router.use('/datasets', datasetsRoutes)

export default router
