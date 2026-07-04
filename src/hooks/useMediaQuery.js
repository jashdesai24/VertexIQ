import { useEffect, useState } from 'react'

// Lets components respond to breakpoints in JS (e.g., swap the sidebar for a
// mobile drawer) where Tailwind's responsive classes alone aren't enough.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
