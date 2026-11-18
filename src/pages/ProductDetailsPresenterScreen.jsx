import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Minus, Plus } from "lucide-react"

import { getBookById } from "@/services/booksApi"
import { CartContext } from "@/contexts/CartContext"
import { Loading } from "@/components/Loading/Loading"

export const ProductDetailsPresenterScreen = () => {
  const [book, setBook] = useState(null)
  const [error, setError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0 })

    setBook(null)
    setError(false)
    setQuantity(1)

    getBookById(id)
      .then(setBook)
      .catch(() => setError(true))
  }, [id])

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
  const price = book.price ?? book.preco
  const stock = Number(book.stockQuantity ?? book.stock_quantity ?? 99)

  const formattedPrice =
    price !== null && price !== undefined && price !== ""
      ? String(price).replace(".", ",")
      : "Consulte o preço"

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, stock)
    )
  }

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(book)
    }

    navigate("/carrinho")
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-12 pt-28 sm:pt-32 lg:pt-36">
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-10">

        {/* Galeria do livro */}
        <section className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[64px_minmax(0,1fr)] md:gap-4">

          {/* Miniaturas */}
          <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
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

          {/* Preço */}
          <p className="mt-5 text-xl font-black text-slate-900">
            {price !== null && price !== undefined && price !== ""
              ? `R$ ${formattedPrice}`
              : formattedPrice}
          </p>

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
    </main>
  )
}
