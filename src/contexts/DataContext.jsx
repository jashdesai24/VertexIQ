import { createContext, useCallback, useMemo, useState } from 'react'
import { api } from '@/services/apiClient'

export const DataContext = createContext(null)

// Business logic lives entirely in the backend. This context's only job is:
// (1) trigger CSV upload/clear/select/delete against the backend, and
// (2) bump `dataVersion` so every page's useBackendResource() hook knows to
// refetch. No data is computed or cached here — which dataset is "active" is
// backend/MongoDB truth (Dataset.isActive), so a browser refresh always shows
// the correct selection with zero client-side state to keep in sync.
//
// Actions are wrapped in useCallback and the provider value in useMemo so
// consumers only re-render when dataVersion actually changes, not on every
// DataProvider render.
export function DataProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0)
  const bump = useCallback(() => setDataVersion((v) => v + 1), [])

  const uploadData = useCallback(
    async (fileName, rows) => {
      await api.uploadData(fileName, rows) // throws on failure — caller (SettingsPage) handles the error
      bump()
    },
    [bump]
  )

  const clearData = useCallback(async () => {
    await api.clearUpload()
    bump()
  }, [bump])

  const selectDataset = useCallback(
    async (id) => {
      await api.selectDataset(id)
      bump()
    },
    [bump]
  )

  const removeDataset = useCallback(
    async (id) => {
      await api.deleteDataset(id)
      bump()
    },
    [bump]
  )

  const value = useMemo(
    () => ({ dataVersion, uploadData, clearData, selectDataset, removeDataset }),
    [dataVersion, uploadData, clearData, selectDataset, removeDataset]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
