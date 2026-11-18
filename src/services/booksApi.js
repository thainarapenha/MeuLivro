import api from "@/services/api"

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return ""
  }

  // Mantém os dígitos recebidos do PostgreSQL e apenas adapta o separador
  // decimal para a apresentação já utilizada pela interface.
  return String(price).trim().replace(".", ",")
}

export function normalizeBook(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    description: book.description,
    imageUrl: book.image_url,
    price: formatPrice(book.price),
    stockQuantity: book.stock_quantity,
  }
}

export async function listBooks() {
  const response = await api.get("/books")
  return response.data.map(normalizeBook)
}

export async function getBookById(id) {
  const response = await api.get(`/books/${id}`)
  return normalizeBook(response.data)
}
