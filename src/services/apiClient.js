import axios from 'axios'

// Axios client matching the Sprint 7 backend's API contract. A response
// interceptor unwraps { success, data } into just `data` and turns any
// failure (network error, 4xx/5xx, or success:false) into a plain Error —
// callers (useBackendResource) just try/catch, they never touch axios directly.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (res) => {
    if (!res.data?.success) throw new Error(res.data?.error || 'Request failed')
    return res.data.data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error — backend unreachable'
    return Promise.reject(new Error(message))
  }
)

export const api = {
  getDashboard: () => http.get('/dashboard'),
  getBusinessHealth: () => http.get('/business-health'),
  getExecutiveSummary: () => http.get('/executive-summary'),
  getAlerts: () => http.get('/alerts'),
  getRecommendations: () => http.get('/recommendations'),
  getUploadStatus: () => http.get('/upload/status'),
  uploadData: (fileName, rows) => http.post('/upload', { fileName, rows }),
  clearUpload: () => http.delete('/upload'),
}
