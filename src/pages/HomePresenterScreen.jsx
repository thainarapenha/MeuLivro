import { useEffect, useRef, useState } from "react"

import { Hero } from "@/components/Hero/Hero.jsx"
import { ProductCard } from "@/components/ProductCard/ProductCard.jsx"
import { Newsletters } from "@/components/Newsletters/Newsletters.jsx"
import { Loading } from "@/components/Loading/Loading.jsx"
import { listBooks } from "@/services/booksApi"

const sectionDefinitions = [
  { key: "preorder", title: "Pré-venda", filters: { preorder: true } },
  { key: "newRelease", title: "Lançamentos", filters: { newRelease: true } },
  { key: "promotion", title: "Promoções", filters: { promotion: true } },
]

const createInitialSections = () =>
  sectionDefinitions.reduce((sections, section) => {
    sections[section.key] = {
      books: [],
      loading: true,
      error: false,
    }

    return sections
  }, {})

export const HomePresenterScreen = ({ books = [], catalogLoading, catalogError }) => {
  const [sections, setSections] = useState(createInitialSections)
  const sectionsRequestStarted = useRef(false)

  useEffect(() => {
    if (catalogLoading || catalogError || sectionsRequestStarted.current) {
      return
    }

    sectionsRequestStarted.current = true

    Promise.allSettled(
      sectionDefinitions.map((section) => listBooks(section.filters))
    ).then((results) => {
      setSections(
        sectionDefinitions.reduce((nextSections, section, index) => {
          const result = results[index]

          nextSections[section.key] = {
            books: result.status === "fulfilled" ? result.value : [],
            loading: false,
            error: result.status === "rejected",
          }

          return nextSections
        }, {})
      )
    })
  }, [catalogLoading, catalogError])

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

  return (
    <>
      <Hero books={books} />
      {sectionDefinitions.map((section) => {
        const sectionState = sections[section.key]

        return (
          <ProductCard
            key={section.key}
            books={sectionState.books}
            title={section.title}
            loading={sectionState.loading}
            error={sectionState.error}
          />
        )
      })}
      <Newsletters />
    </>
  )
}
