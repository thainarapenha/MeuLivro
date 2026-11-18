import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Minus, Plus } from "lucide-react"
import { X } from "phosphor-react"
import { CartContext } from "@/contexts/CartContext"

export const CartItems = ({ cartItem }) => {
  const { item: book, quantity } = cartItem
  const { incrementQuantity, decrementQuantity, removeFromCart } = useContext(CartContext)
  const navigate = useNavigate()

  const parsePrice = (value) => {
    if (typeof value === "number") return value

    const normalizedValue = String(value ?? "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")

    return Number(normalizedValue)
  }

  const price = parsePrice(book.price ?? book.preco)

  const formattedPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const subtotal = (price * quantity).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const openDetails = () => navigate(`/detalhes/${book.id}`)

  return (
    <div className="grid grid-cols-2 items-center gap-4 border-b border-slate-200 py-5 md:grid-cols-[minmax(0,1fr)_110px_130px_110px_32px]">
      <div className="col-span-2 flex min-w-0 items-center gap-4 md:col-span-1">
        <img
          onClick={openDetails}
          className="h-24 w-16 shrink-0 cursor-pointer rounded-lg object-cover"
          src={book.imageUrl}
          alt={`Capa de ${book.title}`}
        />

        <div className="min-w-0 flex-1">
          <strong
            className="cursor-pointer text-sm text-slate-900 transition hover:text-amber-700"
            onClick={openDetails}
          >
            {book.title}
          </strong>
          <p className="mt-1 text-sm text-slate-500">{book.author}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-500 md:hidden">Preço</span>
        <strong className="text-sm text-slate-700">
          {formattedPrice}
        </strong>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-500 md:hidden">Quantidade</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={quantity === 1}
            onClick={() => decrementQuantity(book.id)}
            aria-label="Diminuir quantidade"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-600 font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={20} strokeWidth={2.5} />
          </button>

          <span className="min-w-5 text-center text-sm font-semibold text-slate-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => incrementQuantity(book.id)}
            aria-label="Aumentar quantidade"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-600 font-bold text-white transition hover:bg-amber-700"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-500 md:hidden">Subtotal</span>
        <strong className="text-sm text-slate-900">{subtotal}</strong>
      </div>

      <button
        type="button"
        aria-label={`Remover ${book.title} do carrinho`}
        onClick={() => removeFromCart(book.id)}
        className="justify-self-end text-slate-400 transition hover:text-rose-600"
      >
        <X size={21} />
      </button>
    </div>
  )
}
