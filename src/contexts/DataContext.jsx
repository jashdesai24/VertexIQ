import { createContext, useState } from 'react'
import { api } from '@/services/apiClient'

export const DataContext = createContext(null)

// Business logic lives entirely in the backend. This context's only job is:
// (1) trigger CSV upload/clear/select/delete against the backend, and
// (2) bump `dataVersion` so every page's useBackendResource() hook knows to
// refetch. No data is computed or cached here — which dataset is "active" is
// backend/MongoDB truth (Dataset.isActive), so a browser refresh always shows
// the correct selection with zero client-side state to keep in sync.
export function DataProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0)
  const bump = () => setDataVersion((v) => v + 1)

  const uploadData = async (fileName, rows) => {
    await api.uploadData(fileName, rows) // throws on failure — caller (SettingsPage) handles the error
    bump()
  }

  const clearData = async () => {
    await api.clearUpload()
    bump()
  }

  const selectDataset = async (id) => {
    await api.selectDataset(id)
    bump()
  }

  const removeDataset = async (id) => {
    await api.deleteDataset(id)
    bump()
  }

  return (
    <DataContext.Provider value={{ dataVersion, uploadData, clearData, selectDataset, removeDataset }}>
      {children}
    </DataContext.Provider>
  )
}
