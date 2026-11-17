import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, SignIn, SignOut, UserCircle } from "phosphor-react";
import { loginContext } from "@/contexts/loginContext";
import { carrinhoContext } from "@/contexts/carrinhoContext";
import { Logo } from "@/components/Header/logoHeader.jsx";

export function Header({ book = [], setPesquisado }) {
  const [digitado, setDigitado] = useState("");
  const { isAuthenticated, customer, logout } = useContext(loginContext);
  const { carrinho } = useContext(carrinhoContext);
  const navigate = useNavigate();
  function handleClick(event) {
    event.preventDefault();
    const resultadoPesquisa = book.filter((livro) =>
      livro.titulo.toLowerCase().includes(digitado.toLowerCase())
    );
    navigate("/pesquisa", { state: resultadoPesquisa });
    setPesquisado(digitado);
    setDigitado("");
  }
  return (
    <header className="sticky top-0 z-20 border-b border-yellow-500/30 bg-brand shadow-sm">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <form
          onSubmit={handleClick}
          className="flex min-w-0 flex-1 rounded-xl bg-white shadow-inner"
        >
          <input
            className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none placeholder:text-slate-400"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value)}
            placeholder="Buscar um livro..."
          />
          <button
            className="rounded-r-xl px-4 text-xl transition hover:bg-slate-100"
            type="submit"
            aria-label="Buscar"
          >
            ⌕
          </button>
        </form>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <SignOut size={28} className="cursor-pointer" onClick={logout} />
            ) : (
              <SignIn
                size={28}
                className="cursor-pointer"
                onClick={() => navigate("/login")}
              />
            )}
            <span className="max-w-[125px] text-xs font-bold leading-tight">
              {isAuthenticated ? (
                <>
                  Olá, {customer?.name?.split(" ")[0]}
                  <button className="block underline" onClick={logout}>
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="underline">
                  Entre ou cadastre-se
                </Link>
              )}
            </span>
          </div>
          <Link
            to="/carrinho"
            className="relative rounded-lg p-2 transition hover:bg-yellow-400"
            aria-label="Carrinho"
          >
            <ShoppingCart size={29} />
            {carrinho.length ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                {carrinho.length}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
