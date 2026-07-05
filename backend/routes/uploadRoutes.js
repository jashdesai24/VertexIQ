import { Router } from 'express'
import { uploadData, clearUpload, getUploadStatus } from '../controllers/uploadController.js'
import { validateUploadPayload } from '../middleware/validateRequest.js'

const router = Router()
router.post('/', validateUploadPayload, uploadData)
router.delete('/', clearUpload)
router.get('/status', getUploadStatus)
export default router
