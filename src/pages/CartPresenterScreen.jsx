import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { CartItems } from "@/components/CartItems/CartItems"
import { Loading } from "@/components/Loading/Loading"

import { CartContext } from "@/contexts/CartContext"
import { LoginContext } from "@/contexts/LoginContext"

import { createOrder } from "@/services/ordersApi"
import { listBooks } from "@/services/booksApi"

import { toast } from "react-toastify"

export const CartPresenterScreen = ({ onOpenAuth }) => {
  const {
    cart,
    unavailableItems,
    cartLoading,
    clearCart,
    removeUnavailableItem,
    getCartTotal,
  } = useContext(CartContext)

  const { isAuthenticated, authLoading } = useContext(LoginContext)
  const [checkingOut, setCheckingOut] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  const checkoutLock = useRef(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    let active = true

    listBooks()
      .then((books) => {
        if (active) {
          setRecommendations(books)
        }
      })
      .catch(() => {
        if (active) {
          setRecommendations([])
        }
      })

    return () => {
      active = false
    }
  }, [])

  async function checkout() {
    if (
      checkoutLock.current ||
      checkingOut ||
      cartLoading ||
      authLoading ||
      !cart.length
    ) {
      return
    }

    if (!isAuthenticated) {
      onOpenAuth("login")
      return
    }

    if (unavailableItems.length) {
      toast.error("Remova os livros indisponíveis antes de finalizar", {
        position: toast.POSITION.TOP_CENTER,
      })
      return
    }

    const items = cart.map(({ item, quantity }) => ({
      book_id: Number(item.id),
      quantity,
    }))

    checkoutLock.current = true
    setCheckingOut(true)

    try {
      const order = await createOrder(items)

      clearCart()
      toast.success(
        order?.id
          ? `Compra efetuada com sucesso. Pedido #${order.id}`
          : "Compra efetuada com sucesso",
        { position: toast.POSITION.TOP_CENTER }
      )
      navigate("/")
    } catch (error) {
      const status = error.response?.status

      if (status === 400) {
        toast.error("Não foi possível processar os itens do carrinho", {
          position: toast.POSITION.TOP_CENTER,
        })
      } else if (status === 401) {
        toast.error("Sua sessão expirou. Faça login para continuar", {
          position: toast.POSITION.TOP_CENTER,
        })
        navigate("/login")
      } else if (status === 404) {
        toast.error("Algum livro não está mais disponível", {
          position: toast.POSITION.TOP_CENTER,
        })
      } else if (status === 409) {
        toast.error("A disponibilidade de estoque foi alterada", {
          position: toast.POSITION.TOP_CENTER,
        })
      } else if (status === 500) {
        toast.error("Falha temporária ao concluir a compra", {
          position: toast.POSITION.TOP_CENTER,
        })
      } else if (!error.response) {
        toast.error("Não foi possível acessar o servidor", {
          position: toast.POSITION.TOP_CENTER,
        })
      } else {
        toast.error("Não foi possível concluir a compra", {
          position: toast.POSITION.TOP_CENTER,
        })
      }
    } finally {
      checkoutLock.current = false
      setCheckingOut(false)
    }
  }

  if (cartLoading) {
    return <Loading />
  }

  if (!cart.length && !unavailableItems.length) {
    return (
      <main className="mx-auto my-12 max-w-6xl px-6 pt-20">
        <div className="rounded-2xl bg-white p-8 text-center shadow-soft sm:p-12">
          <h1 className="text-2xl font-black text-slate-900">
            Meu carrinho
          </h1>

          <p className="my-10 text-slate-500">
            Seu carrinho está vazio.
          </p>

          <Link
            to="/"
            className="primary-button mx-auto block max-w-md text-center"
          >
            Voltar para página inicial
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto my-12 max-w-7xl px-6 pb-12 pt-20">
      <h1 className="mb-8 text-2xl font-black text-slate-900">
        Meu carrinho
      </h1>

      {unavailableItems.length > 0 && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="font-bold text-rose-700">
            Livros indisponíveis
          </h2>

          <p className="mt-1 text-sm text-rose-600">
            Remova os livros que não estão mais disponíveis para continuar.
          </p>

          {unavailableItems.map(({ bookId, item, reason }) => (
            <div
              key={bookId}
              className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rose-200 pt-3"
            >
              <span className="text-sm text-slate-700">
                {item?.title || `Livro #${bookId}`} —{" "}
                {reason === "out_of_stock"
                  ? "sem estoque"
                  : reason === "catalog_error"
                    ? "não foi possível verificar"
                    : "não encontrado"}
              </span>

              <button
                type="button"
                onClick={() => removeUnavailableItem(bookId)}
                className="text-sm font-bold text-rose-600 transition hover:text-rose-800"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <section className="min-w-0 max-h-[calc(100vh-16rem)] overflow-y-auto rounded-2xl bg-white p-5 shadow-soft sm:p-7">
          <div className="hidden grid-cols-[minmax(0,1fr)_110px_130px_110px_32px] items-center gap-4 border-b border-slate-200 pb-4 text-sm font-bold text-slate-700 md:grid">
            <span>Livro</span>
            <span>Preço</span>
            <span>Quantidade</span>
            <span>Subtotal</span>
            <span />
          </div>

          {cart.length > 0 ? (
            cart.map((cartItem) => (
              <CartItems
                key={cartItem.item.id}
                cartItem={cartItem}
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">
              Não há livros disponíveis no carrinho.
            </p>
          )}
        </section>

        <aside className="flex h-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-soft sm:p-7">
          <div className="flex flex-col gap-5">
            <h2 className="border-b border-slate-200 pb-4 text-lg font-bold text-slate-900">
              Resumo do carrinho
            </h2>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                {getCartTotal()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-5 text-base font-black text-slate-900">
              <span>Total</span>
              <span className="text-amber-700">{getCartTotal()}</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-5">
            <button
              type="button"
              className="primary-button w-full py-3 text-sm font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
              onClick={checkout}
              disabled={
                checkingOut ||
                authLoading ||
                cartLoading ||
                !cart.length ||
                unavailableItems.length > 0
              }
            >
              {checkingOut ? "Processando..." : "Concluir compra"}
            </button>

            <Link
              to="/"
              className="text-center text-sm font-medium text-amber-700 transition hover:text-amber-800"
            >
              Continuar comprando
            </Link>
          </div>
        </aside>
      </div>

      {recommendations.filter(
        (book) => !cart.some(
          (cartItem) => Number(cartItem.item.id) === Number(book.id)
        )
      ).length > 0 && (
        <section className="mt-12 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Você também pode gostar
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommendations
              .filter(
                (book) => !cart.some(
                  (cartItem) => Number(cartItem.item.id) === Number(book.id)
                )
              )
              .slice(0, 5)
              .map((book) => {
                const price = Number(book.price ?? book.preco)
                const image = book.imageUrl || book.image_url || ""

                return (
                  <Link
                    key={book.id}
                    to={`/detalhes/${book.id}`}
                    className="group min-w-0"
                  >
                    <div className="overflow-hidden rounded-xl bg-white p-2 shadow-sm transition group-hover:shadow-md">
                      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={book.title}
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            Imagem indisponível
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-1 px-1">
                      <span className="line-clamp-2 text-sm font-semibold text-slate-800 transition group-hover:text-amber-700">
                        {book.title}
                      </span>

                      <span className="text-sm font-bold text-amber-700">
                        {Number.isFinite(price)
                          ? price.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "Consulte o preço"}
                      </span>
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      )}
    </main>
  )
}
