import { Router } from 'express'
import { getCurrentWorkspace } from '../controllers/workspaceController.js'

const router = Router()
router.get('/current', getCurrentWorkspace)
export default router
