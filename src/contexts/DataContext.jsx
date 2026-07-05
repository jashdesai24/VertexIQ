import { createContext, useState } from 'react'
import { api } from '@/services/apiClient'

export const DataContext = createContext(null)

// Business logic now lives entirely in the backend (services/intelligenceEngine.js
// on the server). This context's only job is: (1) trigger CSV upload/clear
// against the backend, and (2) bump `dataVersion` so every page's
// useBackendResource() hook knows to refetch. No data is computed here anymore.
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

  return (
    <DataContext.Provider value={{ dataVersion, uploadData, clearData }}>
      {children}
    </DataContext.Provider>
  )
}
