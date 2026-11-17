import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "@/global.css"
import "react-toastify/dist/ReactToastify.css"

import { Home } from "@/pages/Home/Home.jsx"
// import { Cadastro } from "@/pages/cadastro/Cadastro"
// import { Login } from "@/pages/Login/Login"
import { LoginProvider } from "@/contexts/loginContext"
import { Carrinho } from "@/pages/carrinho/Carrinho"
import { Header } from "@/components/Header"
import { CarrinhoProvider } from "@/contexts/carrinhoContext"
import { ToastContainer } from "react-toastify"
import { DetalhesProduto } from "@/pages/detalhesProduto/DetalhesProduto"
import { Pesquisa } from "@/pages/pesquisa/Pesquisa"
import { listarLivros } from "@/services/livrosApi"

export function App() {
  const [book, setBook] = useState([])
  const [pesquisado, setPesquisado] = useState("")
  const [catalogoCarregando, setCatalogoCarregando] = useState(true)
  const [catalogoErro, setCatalogoErro] = useState(false)
  const catalogoSolicitado = useRef(false)

  useEffect(() => {
    if (catalogoSolicitado.current) return

    catalogoSolicitado.current = true

    listarLivros()
      .then((livros) => setBook(livros))
      .catch((erro) => {
        console.error("Não foi possível carregar o catálogo", erro)
        setCatalogoErro(true)
      })
      .finally(() => setCatalogoCarregando(false))
  }, [])

  return (
    <BrowserRouter>
      <LoginProvider>
        <CarrinhoProvider
          book={book}
          catalogLoading={catalogoCarregando}
          catalogError={catalogoErro}
        >
          <Header book={book} setPesquisado={setPesquisado} />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  book={book}
                  catalogoCarregando={catalogoCarregando}
                  catalogoErro={catalogoErro}
                />
              }
            />
            {/* <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} /> */}
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/detalhes/:id" element={<DetalhesProduto />} />
            <Route
              path="/pesquisa"
              element={<Pesquisa pesquisado={pesquisado} />}
            />
          </Routes>
        </CarrinhoProvider>

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
