import { createContext, useEffect, useMemo, useState } from "react";

export const carrinhoContext = createContext({});

const CART_STORAGE_KEY = "@meuLivroCart";

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter(
      ({ book_id, quantity }) =>
        Number.isInteger(book_id) &&
        book_id > 0 &&
        Number.isInteger(quantity) &&
        quantity > 0
    );
  } catch {
    return [];
  }
}

function getBookId(book) {
  return Number(book?.id_livro);
}

function getBookStock(book) {
  if (book?.stock_quantity === undefined || book?.stock_quantity === null) {
    return null;
  }

  const stock = Number(book.stock_quantity);
  return Number.isInteger(stock) && stock >= 0 ? stock : null;
}

function createUnavailableItem(bookId, quantity, item = null, reason = "missing") {
  return { book_id: bookId, quantity, item, reason };
}

export function CarrinhoProvider({
  children,
  book: catalog = [],
  catalogLoading = true,
  catalogError = false,
}) {
  const [carrinho, setCarrinho] = useState([]);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [storedItems, setStoredItems] = useState([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    setStoredItems(readStoredCart());
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (cartReady || !storageLoaded || catalogLoading) return;

    const catalogById = new Map(catalog.map((book) => [getBookId(book), book]));
    const quantitiesById = new Map();
    const currentItems = carrinho.map(({ item, quantidade }) => ({
      book_id: getBookId(item),
      quantity: quantidade,
    }));

    [...storedItems, ...currentItems].forEach(({ book_id, quantity }) => {
      quantitiesById.set(
        book_id,
        (quantitiesById.get(book_id) || 0) + quantity
      );
    });

    const restoredItems = [];
    const restoredUnavailableItems = [];

    quantitiesById.forEach((quantity, bookId) => {
      const book = catalogById.get(bookId);

      if (!book) {
        restoredUnavailableItems.push(
          createUnavailableItem(
            bookId,
            quantity,
            null,
            catalogError ? "catalog_error" : "missing"
          )
        );
        return;
      }

      const stock = getBookStock(book);

      if (stock === 0) {
        restoredUnavailableItems.push(
          createUnavailableItem(bookId, quantity, book, "out_of_stock")
        );
        return;
      }

      restoredItems.push({
        item: book,
        quantidade: stock === null ? quantity : Math.min(quantity, stock),
      });
    });

    setCarrinho(restoredItems);
    setUnavailableItems(restoredUnavailableItems);
    setCartReady(true);
  }, [
    catalog,
    catalogError,
    catalogLoading,
    carrinho,
    cartReady,
    storageLoaded,
    storedItems,
  ]);

  useEffect(() => {
    if (!cartReady) return;

    const persistedItems = [
      ...carrinho.map(({ item, quantidade }) => ({
        book_id: getBookId(item),
        quantity: quantidade,
      })),
      ...unavailableItems.map(({ book_id, quantity }) => ({
        book_id,
        quantity,
      })),
    ];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedItems));
  }, [carrinho, cartReady, unavailableItems]);

  function adicionaNoCarrinho(livro) {
    const bookId = getBookId(livro);
    if (!Number.isInteger(bookId) || bookId <= 0) return;

    const stock = getBookStock(livro);
    const unavailableItem = unavailableItems.find(
      ({ book_id }) => book_id === bookId
    );

    if (unavailableItem) {
      setUnavailableItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.book_id === bookId
            ? { ...currentItem, quantity: currentItem.quantity + 1, item: livro }
            : currentItem
        )
      );
      return;
    }

    const existingItem = carrinho.find(
      ({ item }) => getBookId(item) === bookId
    );

    if (!existingItem && stock === 0) {
      setUnavailableItems((items) => [
        ...items,
        createUnavailableItem(bookId, 1, livro, "out_of_stock"),
      ]);
      return;
    }

    setCarrinho((currentItems) => {
      const currentExistingItem = currentItems.find(
        ({ item }) => getBookId(item) === bookId
      );

      if (!currentExistingItem) {
        return [...currentItems, { item: livro, quantidade: 1 }];
      }

      if (stock !== null && currentExistingItem.quantidade >= stock) {
        return currentItems;
      }

      return currentItems.map((currentItem) =>
        getBookId(currentItem.item) === bookId
          ? { ...currentItem, quantidade: currentItem.quantidade + 1 }
          : currentItem
      );
    });
  }

  function removeDoCarrinho(id) {
    setCarrinho((currentItems) =>
      currentItems.filter(({ item }) => getBookId(item) !== Number(id))
    );
  }

  function removeUnavailableItem(bookId) {
    setUnavailableItems((currentItems) =>
      currentItems.filter((item) => item.book_id !== Number(bookId))
    );
  }

  function totalDoCarrinho() {
    const formatoBRL = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const total = carrinho.reduce((acc, produto) => {
      const preco = Number(String(produto.item.preco).replace(",", "."));
      return acc + produto.quantidade * (Number.isFinite(preco) ? preco : 0);
    }, 0);

    return formatoBRL.format(total);
  }

  function incrementaCarrinho(id) {
    setCarrinho((currentItems) =>
      currentItems.map((currentItem) => {
        if (getBookId(currentItem.item) !== Number(id)) return currentItem;

        const stock = getBookStock(currentItem.item);
        if (stock !== null && currentItem.quantidade >= stock) {
          return currentItem;
        }

        return { ...currentItem, quantidade: currentItem.quantidade + 1 };
      })
    );
  }

  function decrementaCarrinho(id) {
    setCarrinho((currentItems) =>
      currentItems.map((currentItem) => {
        if (getBookId(currentItem.item) !== Number(id)) return currentItem;

        return {
          ...currentItem,
          quantidade: Math.max(1, currentItem.quantidade - 1),
        };
      })
    );
  }

  function checkoutCarrinho() {
    setCarrinho([]);
    setUnavailableItems([]);
  }

  const cartLoading = !cartReady || catalogLoading;

  const contextValue = useMemo(
    () => ({
      carrinho,
      unavailableItems,
      cartLoading,
      catalogError,
      checkoutCarrinho,
      adicionaNoCarrinho,
      removeDoCarrinho,
      removeUnavailableItem,
      totalDoCarrinho,
      incrementaCarrinho,
      decrementaCarrinho,
    }),
    [carrinho, unavailableItems, cartLoading, catalogError]
  );

  return (
    <carrinhoContext.Provider value={contextValue}>
      {children}
    </carrinhoContext.Provider>
  );
}
