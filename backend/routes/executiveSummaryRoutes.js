import { Router } from 'express'
import { getExecutiveSummary } from '../controllers/executiveSummaryController.js'

const router = Router()
router.get('/', getExecutiveSummary)
export default router
