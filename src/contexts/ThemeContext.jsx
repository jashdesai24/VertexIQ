import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

// Owns dark/light mode as app-wide state. Reads the saved preference (or system
// preference on first visit) once, then keeps <html class="dark"> in sync so
// every Tailwind dark: utility across the app reacts automatically.
export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('aura-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('aura-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  // Memoized so consumers (Navbar, etc.) only re-render when theme itself
  // changes, not on every ThemeProvider render.
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
