import api from "@/services/api";

export async function createOrder(items) {
  const response = await api.post("/orders", { items });

  if (response.status !== 201) {
    const error = new Error("Unexpected order response status");
    error.response = response;
    throw error;
  }

  return response.data;
}
