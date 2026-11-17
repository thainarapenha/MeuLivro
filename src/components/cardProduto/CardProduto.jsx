import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { carrinhoContext } from "@/contexts/carrinhoContext";

export function CardProduto({ book }) {
  const carousel = useRef(null);
  const { adicionaNoCarrinho } = useContext(carrinhoContext);

  if (!book?.length) return null;

  const scroll = (direction) => {
    if (carousel.current) {
      carousel.current.scrollLeft += direction * carousel.current.offsetWidth;
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-bold uppercase tracking-widest text-brand">
            Nosso acervo
          </p>

          <h2 className="mt-2 text-3xl font-black text-ink">
            Conheça nosso catálogo
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="rounded-full border border-slate-200 p-3 transition hover:bg-brand"
            aria-label="Livros anteriores"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scroll(1)}
            className="rounded-full border border-slate-200 p-3 transition hover:bg-brand"
            aria-label="Próximos livros"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={carousel}
        className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none]"
      >
        {book.map((item) => (
          <article
            key={item.id_livro}
            className="flex min-w-[220px] max-w-[220px] snap-start flex-col sm:min-w-[240px] sm:max-w-[240px]"
          >
            <Link
              to={`/detalhes/${item.id_livro}`}
              className="group flex flex-1 flex-col"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f3f3f1] p-5">
                <img
                  src={item.url_img}
                  alt={item.titulo}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-2">
                <h3 className="line-clamp-1 text-sm font-bold text-ink group-hover:text-amber-700">
                  {item.titulo}
                </h3>

                <p className="mt-1 text-xs text-slate-500">{item.autor}</p>

                {item.descricao && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                    {item.descricao}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-lg font-black text-ink">R$ {item.preco}</p>

                {item.editora && (
                  <span className="max-w-[110px] truncate rounded-full bg-amber-100 px-2 py-1 text-[9px] font-semibold text-amber-800">
                    {item.editora}
                  </span>
                )}
              </div>
            </Link>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => adicionaNoCarrinho(item)}
                className="flex-1 rounded-lg bg-brand px-2 py-2.5 text-[11px] font-bold text-ink transition hover:brightness-95"
              >
                Adicionar
              </button>

              <Link
                to={`/detalhes/${item.id_livro}`}
                className="flex-1 rounded-lg bg-ink px-2 py-2.5 text-center text-[11px] font-bold text-white transition hover:bg-slate-700"
              >
                Ver livro
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
