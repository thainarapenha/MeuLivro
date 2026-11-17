import api from "@/services/api"

export async function registerCustomer(customerData) {
  const response = await api.post("/customers/register", customerData)
  return response.data
}

export async function loginCustomer(credentials) {
  const response = await api.post("/customers/login", credentials)
  return response.data
}

export async function getCurrentCustomer() {
  const response = await api.get("/customers/me")
  return response.data
}
