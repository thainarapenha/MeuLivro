import api from "@/services/api"

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return ""
  }

  // Mantém os dígitos recebidos do PostgreSQL e apenas adapta o separador
  // decimal para a apresentação já utilizada pela interface.
  return String(price).trim().replace(".", ",")
}

function getValue(book, camelCaseKey, snakeCaseKey) {
  return book[camelCaseKey] ?? book[snakeCaseKey]
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return value
  }

  const number = Number(value)
  return Number.isNaN(number) ? value : number
}

export function normalizeBook(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    isbn: book.isbn,
    description: book.description,
    imageUrl: getValue(book, "imageUrl", "image_url"),
    price: formatPrice(book.price),
    effectivePrice: formatPrice(book.effectivePrice ?? book.effective_price),
    promotionPrice: formatPrice(book.promotionPrice ?? book.promotion_price),
    promotionActive: getValue(
      book,
      "promotionActive",
      "promotion_active"
    ),
    stockQuantity: toNumber(
      getValue(book, "stockQuantity", "stock_quantity")
    ),
    isPreorder: getValue(book, "isPreorder", "is_preorder"),
    releaseDate: getValue(book, "releaseDate", "release_date"),
    isNewRelease: getValue(book, "isNewRelease", "is_new_release"),
    categories: book.categories,
  }
}

export async function listBooks(filters = {}) {
  const params = {}
  const filterKeys = ["preorder", "newRelease", "promotion"]

  filterKeys.forEach((key) => {
    if (filters?.[key] !== undefined && filters[key] !== null) {
      params[key] = filters[key]
    }
  })

  const response = Object.keys(params).length
    ? await api.get("/books", { params })
    : await api.get("/books")

  return response.data.map(normalizeBook)
}

export async function getBookById(id) {
  const response = await api.get(`/books/${id}`)
  return normalizeBook(response.data)
}
