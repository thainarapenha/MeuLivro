import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import "@/global.css"
import "react-toastify/dist/ReactToastify.css"

import { Header } from "@/components/Header/Header.jsx"
import { AuthModal } from "@/components/AuthModal/AuthModal.jsx"

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
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialTab, setAuthInitialTab] = useState("login")

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

  const openAuthModal = (tab = "login") => {
    setAuthInitialTab(tab)
    setAuthModalOpen(true)
  }

  return (
    <BrowserRouter>
      <LoginProvider>
        <CartProvider
          catalog={books}
          catalogLoading={catalogLoading}
          catalogError={catalogError}
        >
          <Header
            books={books}
            setSearchQuery={setSearchQuery}
            onOpenAuth={openAuthModal}
          />

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
            <Route
              path="/carrinho"
              element={<CartPresenterScreen onOpenAuth={openAuthModal} />}
            />
            <Route
              path="/detalhes/:id"
              element={<ProductDetailsPresenterScreen />}
            />
            <Route
              path="/pesquisa"
              element={<SearchPresenterScreen searchQuery={searchQuery} />}
            />
          </Routes>

          <AuthModal
            open={authModalOpen}
            onOpenChange={setAuthModalOpen}
            initialTab={authInitialTab}
          />
        </CartProvider>

        <ToastContainer
          position="top-right"
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
