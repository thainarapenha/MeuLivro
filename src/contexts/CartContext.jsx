import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getBookPricing } from "@/utils/bookPricing"

export const CartContext = createContext({})

const CART_STORAGE_KEY = "@meuLivroCart"

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    const parsedCart = storedCart ? JSON.parse(storedCart) : []

    if (!Array.isArray(parsedCart)) return []

    return parsedCart
      .filter(
        ({ book_id: bookId, quantity }) =>
          Number.isInteger(bookId) &&
          bookId > 0 &&
          Number.isInteger(quantity) &&
          quantity > 0
      )
      .map(({ book_id: bookId, quantity }) => ({ bookId, quantity }))
  } catch {
    return []
  }
}

function getBookId(book) {
  return Number(book?.id)
}

function getBookStock(book) {
  if (book?.stockQuantity === undefined || book?.stockQuantity === null) {
    return null
  }

  const stock = Number(book.stockQuantity)

  return Number.isInteger(stock) && stock >= 0 ? stock : null
}

function createUnavailableItem(
  bookId,
  quantity,
  item = null,
  reason = "missing"
) {
  return { bookId, quantity, item, reason }
}

export function CartProvider({
  children,
  catalog = [],
  catalogLoading = true,
  catalogError = false,
}) {
  const [cart, setCart] = useState([])
  const [unavailableItems, setUnavailableItems] = useState([])
  const [storedItems, setStoredItems] = useState([])
  const [storageLoaded, setStorageLoaded] = useState(false)
  const [cartReady, setCartReady] = useState(false)

  useEffect(() => {
    setStoredItems(readStoredCart())
    setStorageLoaded(true)
  }, [])

  useEffect(() => {
    if (cartReady || !storageLoaded || catalogLoading) return

    const catalogById = new Map(
      catalog.map((book) => [getBookId(book), book])
    )

    const quantitiesById = new Map()

    const currentItems = cart.map(({ item, quantity }) => ({
      bookId: getBookId(item),
      quantity,
    }));

    [...storedItems, ...currentItems].forEach(({ bookId, quantity }) => {
      quantitiesById.set(
        bookId,
        (quantitiesById.get(bookId) || 0) + quantity
      )
    })

    const restoredItems = []
    const restoredUnavailableItems = []

    quantitiesById.forEach((quantity, bookId) => {
      const book = catalogById.get(bookId)

      if (!book) {
        restoredUnavailableItems.push(
          createUnavailableItem(
            bookId,
            quantity,
            null,
            catalogError ? "catalog_error" : "missing"
          )
        )
        return
      }

      const stock = getBookStock(book)

      if (stock === 0) {
        restoredUnavailableItems.push(
          createUnavailableItem(bookId, quantity, book, "out_of_stock")
        )
        return
      }

      restoredItems.push({
        item: book,
        quantity: stock === null ? quantity : Math.min(quantity, stock),
      })
    })

    setCart(restoredItems)
    setUnavailableItems(restoredUnavailableItems)
    setCartReady(true)
  }, [
    catalog,
    catalogError,
    catalogLoading,
    cart,
    cartReady,
    storageLoaded,
    storedItems,
  ])

  useEffect(() => {
    if (!cartReady) return

    const persistedItems = [
      ...cart.map(({ item, quantity }) => ({
        book_id: getBookId(item),
        quantity,
      })),
      ...unavailableItems.map(({ bookId, quantity }) => ({
        book_id: bookId,
        quantity,
      })),
    ]

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedItems))
  }, [cart, cartReady, unavailableItems])

  function addToCart(book, quantity = 1) {
    const bookId = getBookId(book)
    const requestedQuantity = Number(quantity)

    if (
      !Number.isInteger(bookId) ||
      bookId <= 0 ||
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return
    }

    const stock = getBookStock(book)

    const unavailableItem = unavailableItems.find(
      ({ bookId: unavailableBookId }) => unavailableBookId === bookId
    )

    if (unavailableItem) {
      toast.error("Este livro está indisponível no momento.")
      return
    }

    const existingItem = cart.find(
      ({ item }) => getBookId(item) === bookId
    )

    const currentQuantity = existingItem?.quantity || 0
    const newQuantity = currentQuantity + requestedQuantity

    if (stock === 0 || (stock !== null && newQuantity > stock)) {
      toast.warning(
        stock === 0
          ? "Este livro está sem estoque."
          : "Quantidade solicitada superior ao estoque disponível."
      )
      return
    }

    setCart((currentItems) => {
      const currentExistingItem = currentItems.find(
        ({ item }) => getBookId(item) === bookId
      )

      if (!currentExistingItem) {
        return [
          ...currentItems,
          { item: book, quantity: requestedQuantity },
        ]
      }

      return currentItems.map((currentItem) =>
        getBookId(currentItem.item) === bookId
          ? {
              ...currentItem,
              quantity: currentItem.quantity + requestedQuantity,
            }
          : currentItem
      )
    })

    toast.success("Livro adicionado ao carrinho!")
  }

  function removeFromCart(bookId) {
    setCart((currentItems) =>
      currentItems.filter(
        ({ item }) => getBookId(item) !== Number(bookId)
      )
    )
  }

  function removeUnavailableItem(bookId) {
    setUnavailableItems((currentItems) =>
      currentItems.filter((item) => item.bookId !== Number(bookId))
    )
  }

  function getCartSubtotal() {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    const subtotal = cart.reduce((accumulator, cartItem) => {
      const pricing = getBookPricing(cartItem.item)

      return pricing.originalPrice === null
        ? accumulator
        : accumulator + cartItem.quantity * pricing.originalPrice
    }, 0)

    return formatter.format(subtotal)
  }

  function getCartDiscount() {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    const discount = cart.reduce((accumulator, cartItem) => {
      const pricing = getBookPricing(cartItem.item)

      if (!pricing.hasPromotion) return accumulator

      return accumulator +
        cartItem.quantity * (pricing.originalPrice - pricing.price)
    }, 0)

    return formatter.format(discount)
  }

  function getCartTotal() {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    const total = cart.reduce((accumulator, cartItem) => {
      const pricing = getBookPricing(cartItem.item)

      return pricing.price === null
        ? accumulator
        : accumulator + cartItem.quantity * pricing.price
    }, 0)

    return formatter.format(total)
  }

  function incrementQuantity(bookId) {
    setCart((currentItems) =>
      currentItems.map((currentItem) => {
        if (getBookId(currentItem.item) !== Number(bookId)) {
          return currentItem
        }

        const stock = getBookStock(currentItem.item)

        if (stock !== null && currentItem.quantity >= stock) {
          return currentItem
        }

        return {
          ...currentItem,
          quantity: currentItem.quantity + 1,
        }
      })
    )
  }

  function decrementQuantity(bookId) {
    setCart((currentItems) =>
      currentItems.map((currentItem) => {
        if (getBookId(currentItem.item) !== Number(bookId)) {
          return currentItem
        }

        return {
          ...currentItem,
          quantity: Math.max(1, currentItem.quantity - 1),
        }
      })
    )
  }

  function clearCart() {
    setCart([])
    setUnavailableItems([])
  }

  const cartLoading = !cartReady || catalogLoading

  const contextValue = {
    cart,
    unavailableItems,
    cartLoading,
    catalogError,
    clearCart,
    addToCart,
    removeFromCart,
    removeUnavailableItem,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    incrementQuantity,
    decrementQuantity,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}
