import { Router } from 'express'
import { getBusinessHealth } from '../controllers/businessHealthController.js'

const router = Router()
router.get('/', getBusinessHealth)
export default router
