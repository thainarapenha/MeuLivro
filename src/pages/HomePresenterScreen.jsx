import { Hero } from "@/components/Hero/Hero.jsx"
import { ProductCard } from "@/components/ProductCard/ProductCard.jsx"
import { Newsletters } from "@/components/Newsletters/Newsletters.jsx"
import { Loading } from "@/components/Loading/Loading.jsx"

export const HomePresenterScreen = ({ books, catalogLoading, catalogError }) => {
  if (catalogLoading) {
    return <Loading />
  }

  if (catalogError) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h2 className="text-2xl font-black">
          Não foi possível carregar o catálogo.
        </h2>

        <p className="mt-2 text-slate-500">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    )
  }

  if (!books.length) {
    return (
      <div className="px-6 py-24 text-center">
        <h2 className="text-2xl font-black">O catálogo está vazio.</h2>
      </div>
    )
  }

  return (
    <>
      <Hero />
      <ProductCard books={books} />
      <Newsletters />
    </>
  )
}
