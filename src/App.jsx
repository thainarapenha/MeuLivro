import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import "@/global.css"
import "react-toastify/dist/ReactToastify.css"

import { Header } from "@/components/Header/Header.jsx"
import { LoginProvider } from "@/contexts/LoginContext"
import { CartProvider } from "@/contexts/CartContext"

import { listBooks } from "@/services/booksApi"

import { HomePresenterScreen } from "@/pages/HomePresenterScreen"
import { CartPresenterScreen } from "@/pages/CartPresenterScreen"
import { ProductDetailsPresenterScreen } from "@/pages/ProductDetailsPresenterScreen"
import { SearchPresenterScreen } from "@/pages/SearchPresenterScreen"

export function App() {
  const [books, setBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState(false)
  const catalogRequestStarted = useRef(false)

  useEffect(() => {
    if (catalogRequestStarted.current) return

    catalogRequestStarted.current = true

    listBooks()
      .then((loadedBooks) => setBooks(loadedBooks))
      .catch((error) => {
        console.error("Não foi possível carregar o catálogo", error)
        setCatalogError(true)
      })
      .finally(() => setCatalogLoading(false))
  }, [])

  return (
    <BrowserRouter>
      <LoginProvider>
        <CartProvider
          catalog={books}
          catalogLoading={catalogLoading}
          catalogError={catalogError}
        >
          <Header books={books} setSearchQuery={setSearchQuery} />

          <Routes>
            <Route
              path="/"
              element={
                <HomePresenterScreen
                  books={books}
                  catalogLoading={catalogLoading}
                  catalogError={catalogError}
                />
              }
            />
            <Route path="/carrinho" element={<CartPresenterScreen />} />
            <Route
              path="/detalhes/:id"
              element={<ProductDetailsPresenterScreen />}
            />
            <Route
              path="/pesquisa"
              element={<SearchPresenterScreen searchQuery={searchQuery} />}
            />
          </Routes>
        </CartProvider>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="light"
          closeOnClick
          pauseOnHover
          draggable
        />
      </LoginProvider>
    </BrowserRouter>
  )
}
