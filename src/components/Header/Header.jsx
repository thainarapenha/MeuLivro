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
import { AuthModal } from "@/components/AuthModal/AuthModal.jsx"

export const Header = ({ books = [], setSearchQuery }) => {
  const [searchInput, setSearchInput] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialTab, setAuthInitialTab] = useState("login")

  const { isAuthenticated, customer, logout } = useContext(LoginContext)
  const { cart } = useContext(CartContext)

  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === "/"

  function openAuthModal(tab) {
    setAuthInitialTab(tab)
    setAuthModalOpen(true)
  }

  function handleSearch(event) {
    event.preventDefault()

    const query = searchInput.trim()

    if (!query) return

    const searchResults = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    )

    setSearchQuery(query)
    setSearchInput("")

    navigate("/pesquisa", { state: searchResults })
  }

  return (
    <>
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
            className="mx-auto flex w-full max-w-[580px] min-w-0 rounded-xl bg-white shadow-inner"
          >
            <input
              className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-slate-400 sm:px-4"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar um livro..."
              aria-label="Buscar um livro"
            />

            <button
              type="submit"
              aria-label="Buscar"
              className="rounded-r-xl px-3 text-slate-700 transition hover:bg-slate-100 sm:px-4"
            >
              <MagnifyingGlass size={20} />
            </button>
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
                <UserCircle size={30} />

                <div className="hidden text-xs leading-tight sm:block">
                  <span className="block font-bold">Meu Livro</span>

                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
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

              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        initialTab={authInitialTab}
      />
    </>
  )
}
