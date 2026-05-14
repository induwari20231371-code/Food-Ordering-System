import axios from 'axios'

// Prefer Vite dev proxy (/api → backend) when VITE_API_BASE_URL is unset — avoids CORS and hardcoded ports.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token expires redirect to login (but not on failed sign-in — those must show an error message)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = String(error.config?.url ?? '')
    const isSignInAttempt = url.includes('/auth/signin')
    if (error.response?.status === 401 && !isSignInAttempt) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
