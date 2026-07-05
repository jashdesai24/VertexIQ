import { useCallback, useEffect, useState } from 'react'

// Generic data-fetching hook: calls apiCall(); if it fails (backend down,
// network error, timeout), automatically falls back to fallbackCompute()
// (see services/localFallback.js) so the page still renders. Exposes
// loading/error/isFallback/retry so every page implements the same
// Loading -> Empty -> Error -> Retry states consistently.
export function useBackendResource(apiCall, fallbackCompute, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null, isFallback: false })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null, isFallback: false })
    } catch (err) {
      try {
        const data = fallbackCompute()
        setState({ data, loading: false, error: err.message, isFallback: true })
      } catch {
        setState({ data: null, loading: false, error: err.message, isFallback: false })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { ...state, retry: load }
}
