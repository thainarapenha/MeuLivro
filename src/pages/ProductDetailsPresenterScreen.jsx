import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Minus, Plus } from "lucide-react"

import { Loading } from "@/components/Loading/Loading"

import { getBookById, listBooks } from "@/services/booksApi"

import { CartContext } from "@/contexts/CartContext"

import { formatBookPrice, getBookPricing } from "@/utils/bookPricing"

export const ProductDetailsPresenterScreen = () => {
  const { id } = useParams()
  const { addToCart, cart } = useContext(CartContext)
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [error, setError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [recommendations, setRecommendations] = useState([])
  
  useEffect(() => {
    window.scrollTo({ top: 0 })

    setBook(null)
    setError(false)
    setQuantity(1)

    getBookById(id)
      .then(setBook)
      .catch(() => setError(true))
  }, [id])

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

  if (error) {
    return (
      <main className="px-6 py-24 text-center">
        <h2 className="text-2xl font-black">
          Livro não encontrado.
        </h2>
        <p className="mt-2 text-slate-500">
          Não foi possível carregar os detalhes deste livro.
        </p>
      </main>
    )
  }

  if (!book) return <Loading />

  const title = book.title || book.titulo || ""
  const author = book.author || book.autor || ""
  const description = book.description || book.descricao || ""
  const imageUrl =
    book.imageUrl || book.image_url || book.url_img || ""
  const pricing = getBookPricing(book)
  const stock = Number(book.stockQuantity ?? book.stock_quantity ?? 99)
  const categories = Array.isArray(book.categories) ? book.categories : []
  const releaseDate = book.releaseDate || book.release_date
  const parsedReleaseDate = releaseDate ? new Date(releaseDate) : null
  const formattedReleaseDate =
    parsedReleaseDate && !Number.isNaN(parsedReleaseDate.getTime())
      ? parsedReleaseDate.toLocaleDateString("pt-BR")
      : ""

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, stock)
    )
  }

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const handleAddToCart = () => {
    addToCart(book, quantity)
    navigate("/carrinho")
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-12 pt-28 sm:pt-32 lg:pt-36">
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-10">

        {/* Galeria do livro */}
        <section className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[64px_minmax(0,1fr)] md:gap-4">

          {/* Miniaturas */}
          <div className="hidden md:order-1 md:flex md:flex-col md:gap-3 md:overflow-visible">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex size-16 shrink-0 items-center justify-center overflow-hidden transition hover:border-amber-500"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${title} - miniatura ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-center text-[10px] text-slate-400">
                    Sem imagem
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Imagem principal */}
          <div className="order-1 flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 sm:p-0 md:order-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                Imagem indisponível
              </div>
            )}
          </div>
        </section>
        
        {/* Informações do livro */}
        <section className="flex min-w-0 flex-col">
          {/* Título */}
          <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>

          {/* Autor */}
          {author && (
            <p className="pt-2 text-sm font-semibold text-slate-700">
              {author}
            </p>
          )}

          {(book.isPreorder || book.isNewRelease || formattedReleaseDate) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.isPreorder && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Pré-venda
                </span>
              )}

              {book.isNewRelease && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Lançamento
                </span>
              )}

              {formattedReleaseDate && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Lançamento em {formattedReleaseDate}
                </span>
              )}
            </div>
          )}

          {/* Descrição */}
          {description && (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <h2 className="text-sm font-bold text-slate-900">
                Sobre este livro
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => {
                const categoryName =
                  typeof category === "string" ? category : category.name

                return categoryName ? (
                  <span
                    key={category.id || categoryName}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    {categoryName}
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Preço */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="text-xl font-black text-slate-900">
              {formatBookPrice(pricing.price)}
            </p>

            {pricing.hasPromotion && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  {formatBookPrice(pricing.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  -{pricing.discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Quantidade e botão Comprar */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">
                Quantidade:
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={20} strokeWidth={2.5} />
                </button>

                <span className="min-w-4 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= stock}
                  aria-label="Aumentar quantidade"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <button
              className="primary-button w-56 px-8 py-2.5 text-sm font-bold uppercase"
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              Comprar
            </button>
          </div>
        </section>
      </div>

      {recommendations.filter(
        (recommendedBook) =>
          Number(recommendedBook.id) !== Number(book.id) &&
          !cart.some(
            (cartItem) =>
              Number(cartItem.item.id) === Number(recommendedBook.id)
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
                (recommendedBook) =>
                  Number(recommendedBook.id) !== Number(book.id) &&
                  !cart.some(
                    (cartItem) =>
                      Number(cartItem.item.id) === Number(recommendedBook.id)
                  )
              )
              .slice(0, 5)
              .map((recommendedBook) => {
                const recommendedPricing = getBookPricing(recommendedBook)
                const recommendedImage =
                  recommendedBook.imageUrl || recommendedBook.image_url || ""

                return (
                  <Link
                    key={recommendedBook.id}
                    to={`/detalhes/${recommendedBook.id}`}
                    className="group min-w-0"
                  >
                    <div className="overflow-hidden rounded-xl bg-white p-2 shadow-sm transition group-hover:shadow-md">
                      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {recommendedImage ? (
                          <img
                            src={recommendedImage}
                            alt={recommendedBook.title}
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
                        {recommendedBook.title}
                      </span>

                      <span className="text-sm font-bold text-amber-700">
                        {formatBookPrice(recommendedPricing.price)}
                      </span>

                      {recommendedPricing.hasPromotion && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 line-through">
                            {formatBookPrice(recommendedPricing.originalPrice)}
                          </span>
                          <span className="text-xs font-bold text-emerald-700">
                            -{recommendedPricing.discountPercentage}%
                          </span>
                        </div>
                      )}
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
