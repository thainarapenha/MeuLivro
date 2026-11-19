import axios from "axios"
import { clearAuthSession, getAuthToken } from "@/services/authStorage"

const api = axios.create({
  baseURL: import.meta.env.API_MEU_LIVRO || "http://localhost:3000",
})

api.interceptors.request.use((config) => {
  const requestUrl = config.url || ""
  const isPublicAuthRequest =
    requestUrl.includes("/customers/login") ||
    requestUrl.includes("/customers/register")

  if (isPublicAuthRequest) {
    delete config.headers.Authorization
    return config
  }

  const token = getAuthToken()

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ""
    const isLoginRequest = requestUrl.includes("/customers/login")

    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthSession()
      window.dispatchEvent(new Event("auth:logout"))
    }

    return Promise.reject(error)
  }
)

export default api