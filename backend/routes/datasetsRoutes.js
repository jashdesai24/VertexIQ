import { Router } from 'express'
import { getDatasets, getDataset, deleteDataset } from '../controllers/datasetsController.js'

const router = Router()
router.get('/', getDatasets)
router.get('/:id', getDataset)
router.delete('/:id', deleteDataset)
export default router
