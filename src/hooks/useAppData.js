import { useContext } from 'react'
import { DataContext } from '@/contexts/DataContext'

// Consumption hook — pages call useAppData() instead of importing DataContext
// or the static demo data files directly.
export function useAppData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useAppData must be used within a DataProvider')
  return ctx
}
