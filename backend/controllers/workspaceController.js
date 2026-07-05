import { asyncHandler } from '../utils/asyncHandler.js'
import { getActiveDataset } from '../services/datasetService.js'
import { DEFAULT_WORKSPACE_ID } from '../config/workspace.js'

// GET /api/workspace/current — tells the frontend which dataset (if any) is
// currently active for this workspace. Since "active" is persisted in
// MongoDB (Dataset.isActive), this is also what makes a selected dataset
// survive a browser refresh with zero client-side state.
export const getCurrentWorkspace = asyncHandler(async (req, res) => {
  const active = await getActiveDataset(DEFAULT_WORKSPACE_ID)
  res.json({
    success: true,
    data: {
      workspaceId: DEFAULT_WORKSPACE_ID,
      isDemoData: !active,
      fileName: active?.fileName ?? null,
      datasetId: active?._id ?? null,
    },
  })
})
