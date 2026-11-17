import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "phosphor-react"
import { CartContext } from "@/contexts/CartContext"

export const CartItems = ({ cartItem }) => {
  const { item: book, quantity } = cartItem
  const { incrementQuantity, decrementQuantity, removeFromCart } =
    useContext(CartContext)
  const navigate = useNavigate()
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-5">
      <img
        onClick={() => navigate(`/detalhes/${book.id}`)}
        className="h-24 w-16 cursor-pointer rounded-lg object-cover"
        src={book.imageUrl}
        alt="Capa do livro"
      />
      <div className="min-w-[180px] flex-1">
        <strong
          className="cursor-pointer"
          onClick={() => navigate(`/detalhes/${book.id}`)}
        >
          {book.title}
        </strong>
        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={quantity === 1}
            onClick={() => decrementQuantity(book.id)}
            className="h-8 w-8 rounded-lg bg-brand font-bold disabled:opacity-40"
          >
            -
          </button>
          <input
            readOnly
            value={quantity}
            className="h-8 w-10 rounded-lg border text-center"
          />
          <button
            onClick={() => incrementQuantity(book.id)}
            className="h-8 w-8 rounded-lg bg-brand font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <strong>R$ {book.price}</strong>
        <button
          aria-label="Remover item"
          onClick={() => removeFromCart(book.id)}
          className="text-slate-400 transition hover:text-rose-600"
        >
          <X size={25} />
        </button>
      </div>
    </div>
  )
}
