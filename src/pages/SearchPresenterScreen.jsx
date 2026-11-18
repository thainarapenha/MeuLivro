import { useContext, useEffect, useMemo, useState } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Funnel, X, CaretLeft, CaretRight } from "phosphor-react"

import { CartContext } from "@/contexts/CartContext"

const BOOKS_PER_PAGE = 8

const BOOK_CATEGORIES = [
  { key: "acao", name: "Ação" },
  { key: "fantasia", name: "Fantasia" },
  { key: "ficcao", name: "Ficção" },
  { key: "hqs-e-mangas", name: "HQs e mangás" },
  { key: "infantil", name: "Infantil" },
  { key: "nao-ficcao", name: "Não ficção" },
  { key: "poesia", name: "Poesia" },
  { key: "romance", name: "Romance" },
  { key: "serial-killers", name: "Serial killers" },
  { key: "terror-e-suspense", name: "Terror e suspense" },
]

function getNumericPrice(price) {
  if (price === null || price === undefined || price === "") {
    return 0
  }

  if (typeof price === "number") return price

  return Number(
    String(price)
      .replace(/\./g, "")
      .replace(",", ".")
  ) || 0
}

function formatCurrency(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

function getBookPrice(book) {
  return getNumericPrice(book.effectivePrice || book.price)
}

function getCategoryKey(category) {
  const value =
    typeof category === "string"
      ? category
      : category?.slug || category?.name || category?.title || ""

  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
}

export const SearchPresenterScreen = ({ searchQuery }) => {
  const { addToCart } = useContext(CartContext)
  const { state } = useLocation()
  const navigate = useNavigate()

  const [selectedCategories, setSelectedCategories] = useState([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortOrder, setSortOrder] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const searchResults = Array.isArray(state) ? state : []
  const availableCategories = BOOK_CATEGORIES

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })

    if (!Array.isArray(state)) {
      navigate("/", { replace: true })
    }
  }, [state, navigate])

  useEffect(() => {
    const matchingCategories = [
      ...new Set(
        searchResults.flatMap((book) =>
          (book.categories || []).map(getCategoryKey)
        )
      ),
    ]

    setSelectedCategories(matchingCategories)
    setCurrentPage(1)
  }, [state])

  const filteredBooks = useMemo(() => {
    let result = [...searchResults]

    if (selectedCategories.length > 0) {
      result = result.filter((book) =>
        book.categories?.some((category) =>
          selectedCategories.includes(getCategoryKey(category))
        )
      )
    }

    if (minPrice !== "") {
      result = result.filter(
        (book) => getBookPrice(book) >= Number(minPrice)
      )
    }

    if (maxPrice !== "") {
      result = result.filter(
        (book) => getBookPrice(book) <= Number(maxPrice)
      )
    }

    if (sortOrder === "price-ascending") {
      result.sort((a, b) => getBookPrice(a) - getBookPrice(b))
    }

    if (sortOrder === "price-descending") {
      result.sort((a, b) => getBookPrice(b) - getBookPrice(a))
    }

    if (sortOrder === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"))
    }

    return result
  }, [searchResults, selectedCategories, minPrice, maxPrice, sortOrder])

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  )

  function toggleCategory(categoryKey) {
    setSelectedCategories((current) =>
      current.includes(categoryKey)
        ? current.filter((item) => item !== categoryKey)
        : [...current, categoryKey]
    )

    setCurrentPage(1)
  }

  function clearFilters() {
    setSelectedCategories([])
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  function handlePriceChange(setter, value) {
    setter(value)
    setCurrentPage(1)
  }

  function renderFilters() {
    return (
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Filtros
          </h2>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-amber-600 transition hover:text-amber-700"
          >
            Limpar filtros
          </button>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-800">
            Categorias
          </h3>

          <div className="flex flex-col gap-3">
            {availableCategories.map((category) => (
              <label
                key={category.key}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.key)}
                  onChange={() => toggleCategory(category.key)}
                  className="h-4 w-4 accent-amber-500"
                />

                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-800">
            Faixa de preço
          </h3>

          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="min-price"
                className="mb-1 block text-xs text-slate-500"
              >
                Mínimo
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(event) =>
                  handlePriceChange(setMinPrice, event.target.value)
                }
                placeholder="R$ 0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-amber-500"
              />
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="max-price"
                className="mb-1 block text-xs text-slate-500"
              >
                Máximo
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(event) =>
                  handlePriceChange(setMaxPrice, event.target.value)
                }
                placeholder="R$ 999"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!Array.isArray(state)) return null

  return (
    <main className="mx-auto min-h-[45vh] max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-amber-600">
          Pesquisa
        </p>

        {searchQuery?.trim() && (
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {searchQuery === "Todos os livros"
              ? "Todos os livros"
              : `Resultados para "${searchQuery}"`}
          </h1>
        )}

        <p className="mt-2 text-sm text-slate-500">
          {filteredBooks.length} livro(s) encontrado(s)
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          <Funnel size={18} />
          Filtros
        </button>

        <select
          value={sortOrder}
          onChange={(event) => {
            setSortOrder(event.target.value)
            setCurrentPage(1)
          }}
          className="max-w-[190px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          aria-label="Ordenar resultados"
        >
          <option value="relevance">Mais relevantes</option>
          <option value="price-ascending">Menor preço</option>
          <option value="price-descending">Maior preço</option>
          <option value="title">Nome do livro</option>
        </select>
      </div>

      <div className="mt-6 flex items-start gap-8">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 lg:block">
          {renderFilters()}
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
            <p className="text-sm text-slate-500">
              Exibindo {paginatedBooks.length} de {filteredBooks.length} livros
            </p>

            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value)
                setCurrentPage(1)
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-amber-500"
              aria-label="Ordenar resultados"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-ascending">Menor preço</option>
              <option value="price-descending">Maior preço</option>
              <option value="title">Nome do livro</option>
            </select>
          </div>

          {paginatedBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book) => (
                <article
                  key={book.id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-4"
                >
                  <Link
                    to={`/detalhes/${book.id}`}
                    className="flex flex-1 flex-col"
                  >
                    <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 p-3 sm:h-60">
                      <img
                        src={book.imageUrl || book.image_url}
                        alt={book.title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-2 py-4">
                      <h2 className="line-clamp-2 text-sm font-semibold text-slate-800 sm:text-base">
                        {book.title}
                      </h2>

                      <p className="text-xs text-slate-500">
                        {book.author}
                      </p>

                      <p className="mt-auto pt-2 text-base font-bold text-amber-600 sm:text-lg">
                        {formatCurrency(getBookPrice(book))}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart(book)}
                    className="primary-button w-full text-xs sm:text-sm"
                  >
                    Adicionar ao carrinho
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 text-center">
              <h2 className="text-lg font-bold text-slate-800">
                Nenhum livro encontrado
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Tente alterar os filtros ou realizar outra pesquisa.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 font-semibold text-amber-600 hover:text-amber-700"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((page) => page - 1)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <CaretLeft size={20} />
              </button>

              <span className="text-sm text-slate-600">
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((page) => page + 1)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Próxima página"
              >
                <CaretRight size={20} />
              </button>
            </div>
          )}
        </section>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Filtrar livros
              </h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar filtros"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {renderFilters()}

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="primary-button mt-8 w-full"
            >
              Ver {filteredBooks.length} resultado(s)
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}
