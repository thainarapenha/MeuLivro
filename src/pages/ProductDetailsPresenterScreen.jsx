import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ratingImage from "@/assets/avaliação-do-cliente.png"
import { getBookById } from "@/services/booksApi"
import { CartContext } from "@/contexts/CartContext"
import { Loading } from "@/components/Loading/Loading"

export const ProductDetailsPresenterScreen = () => {
  const [showFullDescription, setShowFullDescription] = useState(true)
  const [book, setBook] = useState(null)
  const [error, setError] = useState(false)
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0 })
    getBookById(id)
      .then(setBook)
      .catch(() => setError(true))
  }, [id])

  if (error)
    return (
      <div className="px-6 py-24 text-center">
        <h2 className="text-2xl font-black">Livro não encontrado.</h2>
        <p className="mt-2 text-slate-500">
          Não foi possível carregar os detalhes deste livro.
        </p>
      </div>
    )

  if (!book) return <Loading />

  const description = book.description || ""

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <div className="flex justify-center rounded-3xl bg-white p-8 shadow-sm">
        <img
          className="max-h-[460px] object-contain"
          src={book.imageUrl}
          alt={book.title}
        />
      </div>
      <div>
        <h1 className="text-3xl font-black sm:text-5xl">{book.title}</h1>
        <p className="mt-6 text-4xl font-black text-amber-600">
          R$ {book.price}
        </p>
        <p className="mt-2 font-medium text-slate-500">
          Entrega GRÁTIS no seu primeiro pedido
        </p>
        <button
          className="primary-button mt-6 w-full sm:w-auto sm:px-16"
          onClick={() => {
            addToCart(book)
            navigate("/carrinho")
          }}
        >
          Comprar
        </button>
        <div className="mt-8 border-t pt-6">
          <span className="font-bold">Avaliações de clientes</span>
          <img className="mt-2" src={ratingImage} alt="" />
        </div>
        <p className="mt-6 leading-7 text-slate-600">
          {showFullDescription && description.length >= 610
            ? description.slice(0, 610) + "..."
            : description}{" "}
          {description.length >= 610 && (
            <button
              className="block font-bold text-blue-600"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Leia mais" : "Leia menos"}
            </button>
          )}
        </p>
      </div>
    </main>
  )
}
