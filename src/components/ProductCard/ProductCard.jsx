import { useContext, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "phosphor-react"
import { CartContext } from "@/contexts/CartContext"

export const ProductCard = ({
  books,
  title = "Conheça nosso catálogo",
  loading = false,
  error = false,
}) => {
  const carousel = useRef(null)
  const { addToCart } = useContext(CartContext)

  const scroll = (direction) => {
    if (carousel.current) {
      carousel.current.scrollLeft += direction * carousel.current.offsetWidth
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-bold uppercase tracking-widest text-brand">
            Nosso acervo
          </p>

          <h2 className="mt-2 text-3xl font-black text-ink">
            {title}
          </h2>
        </div>

        {!loading && !error && books?.length > 0 && (
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="rounded-full border border-slate-200 p-3 transition hover:bg-brand"
              aria-label={`${title}: livros anteriores`}
            >
              <ArrowLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scroll(1)}
              className="rounded-full border border-slate-200 p-3 transition hover:bg-brand"
              aria-label={`${title}: próximos livros`}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>

      {loading && (
        <p className="py-8 text-sm text-slate-500">
          Carregando livros...
        </p>
      )}

      {!loading && error && (
        <p className="py-8 text-sm text-slate-500">
          Não foi possível carregar esta seção.
        </p>
      )}

      {!loading && !error && !books?.length && (
        <p className="py-8 text-sm text-slate-500">
          Nenhum livro disponível nesta seção.
        </p>
      )}

      {!loading && !error && books?.length > 0 && (
        <div
          ref={carousel}
          className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none]"
        >
          {books.map((book) => (
            <article
              key={book.id}
              className="flex min-w-[220px] max-w-[220px] snap-start flex-col sm:min-w-[240px] sm:max-w-[240px]"
            >
              <Link
                to={`/detalhes/${book.id}`}
                className="group flex flex-1 flex-col"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f3f3f1] p-5">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-2">
                  <h3 className="line-clamp-1 text-sm font-bold text-ink group-hover:text-amber-700">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">{book.author}</p>

                  {book.description && (
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      {book.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-lg font-black text-ink">R$ {book.price}</p>

                  {book.publisher && (
                    <span className="max-w-[110px] truncate rounded-full bg-amber-100 px-2 py-1 text-[9px] font-semibold text-amber-800">
                      {book.publisher}
                    </span>
                  )}
                </div>
              </Link>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(book)}
                  className="flex-1 rounded-lg bg-brand px-2 py-2.5 text-[11px] font-bold text-ink transition hover:brightness-95"
                >
                  Adicionar
                </button>

                <Link
                  to={`/detalhes/${book.id}`}
                  className="flex-1 rounded-lg bg-ink px-2 py-2.5 text-center text-[11px] font-bold text-white transition hover:bg-slate-700"
                >
                  Ver livro
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
