
import { useContext, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  ShoppingCart,
  UserCircle,
  SignOut,
  MagnifyingGlass,
} from "phosphor-react"

import { LoginContext } from "@/contexts/LoginContext"
import { CartContext } from "@/contexts/CartContext"

export const Header = ({ books = [], setSearchQuery, onOpenAuth }) => {
  const [searchInput, setSearchInput] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  const { isAuthenticated, customer, logout } = useContext(LoginContext)
  const { cart } = useContext(CartContext)
  const cartItemCount = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  )

  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === "/"

  const handleSearch = (event) => {
    event.preventDefault()

    const query = searchInput.trim()

    if (!query) return

    const searchResults = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    )

    setSearchQuery(query)
    setSearchInput("")
    setSearchFocused(false)

    navigate("/pesquisa", { state: searchResults })
  }

  const handleViewAll = () => {
    setSearchQuery("Todos os livros")
    setSearchInput("")
    setSearchFocused(false)

    navigate("/pesquisa", { state: books })
  }

  return (
    <header className="absolute left-0 top-0 z-20 w-full px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto grid min-h-[76px] max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-full border px-4 py-3 text-black shadow-lg backdrop-blur-sm transition-colors duration-300 sm:gap-4 sm:px-5 lg:px-8 ${
          isHome
            ? "border-white/30 bg-white/20"
            : "border-slate-200/70 bg-white/85"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="justify-self-start text-black">
          <span className="whitespace-nowrap text-lg font-black tracking-tight sm:text-xl">
            Meu Livro
          </span>
        </Link>

        {/* Pesquisa */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto flex w-full max-w-[580px] min-w-0 rounded-xl bg-white shadow-inner"
        >
          <input
            className="min-w-0 flex-1 rounded-l-xl bg-gray-100 px-3 py-2 text-sm text-black outline-none placeholder:text-slate-400 sm:px-4"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar um livro..."
            aria-label="Buscar um livro"
          />

          <button
            type="submit"
            aria-label="Buscar"
            className="rounded-r-xl bg-gray-100 px-3 text-slate-700 transition hover:bg-slate-100 sm:px-4"
          >
            <MagnifyingGlass size={20} />
          </button>

          {searchFocused && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleViewAll}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
              >
                <MagnifyingGlass size={18} />
                Ver todos os livros
              </button>
            </div>
          )}
        </form>

        {/* Usuário e carrinho */}
        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-1 text-black sm:gap-2">
              <UserCircle size={30} />

              <div className="hidden text-xs leading-tight sm:block">
                <span className="block font-bold">
                  Olá, {customer?.name?.split(" ")[0] || "Usuário"}
                </span>

                <button
                  type="button"
                  onClick={logout}
                  className="font-medium underline"
                >
                  Sair
                </button>
              </div>

              <button
                type="button"
                onClick={logout}
                aria-label="Sair da conta"
                className="rounded-lg p-2 transition hover:bg-black/5"
              >
                <SignOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-black">

              <button
                  type="button"
                  onClick={() => onOpenAuth("login")}
                >
                  <UserCircle size={30} />
                </button>

              <div className="hidden text-xs leading-tight sm:block">
                <span className="block font-bold">Meu Livro</span>

                <button
                  type="button"
                  onClick={() => onOpenAuth("login")}
                >
                  Entre ou Cadastre-se
                </button>
              </div>
            </div>
          )}

          <Link
            to="/carrinho"
            className="relative rounded-lg p-2 text-black transition hover:bg-black/5"
            aria-label="Carrinho"
          >
            <ShoppingCart size={27} />

            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
