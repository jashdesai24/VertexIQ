import { Router } from 'express'
import { getDatasets, getDataset, deleteDataset, selectDataset } from '../controllers/datasetsController.js'

const router = Router()
router.get('/', getDatasets)
router.get('/:id', getDataset)
router.delete('/:id', deleteDataset)
router.post('/:id/select', selectDataset)
export default router
