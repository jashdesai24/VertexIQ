import { useContext } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext'

// Consumption hook — components call useTheme() instead of importing
// ThemeContext directly, so the context implementation can change freely.
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
