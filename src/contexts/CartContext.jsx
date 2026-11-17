import { createContext, useEffect, useState } from "react"

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

  function addToCart(book) {
    const bookId = getBookId(book)

    if (!Number.isInteger(bookId) || bookId <= 0) return

    const stock = getBookStock(book)

    const unavailableItem = unavailableItems.find(
      ({ bookId: unavailableBookId }) => unavailableBookId === bookId
    )

    if (unavailableItem) {
      setUnavailableItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.bookId === bookId
            ? {
                ...currentItem,
                quantity: currentItem.quantity + 1,
                item: book,
              }
            : currentItem
        )
      )
      return
    }

    const existingItem = cart.find(
      ({ item }) => getBookId(item) === bookId
    )

    if (!existingItem && stock === 0) {
      setUnavailableItems((items) => [
        ...items,
        createUnavailableItem(bookId, 1, book, "out_of_stock"),
      ])
      return
    }

    setCart((currentItems) => {
      const currentExistingItem = currentItems.find(
        ({ item }) => getBookId(item) === bookId
      )

      if (!currentExistingItem) {
        return [...currentItems, { item: book, quantity: 1 }]
      }

      if (stock !== null && currentExistingItem.quantity >= stock) {
        return currentItems
      }

      return currentItems.map((currentItem) =>
        getBookId(currentItem.item) === bookId
          ? { ...currentItem, quantity: currentItem.quantity + 1 }
          : currentItem
      )
    })
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

  function getCartTotal() {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    const total = cart.reduce((accumulator, cartItem) => {
      const price = Number(
        String(cartItem.item.price).replace(",", ".")
      )

      return (
        accumulator +
        cartItem.quantity * (Number.isFinite(price) ? price : 0)
      )
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
