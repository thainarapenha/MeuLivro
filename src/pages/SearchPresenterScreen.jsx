import { useContext, useEffect } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { CartContext } from "@/contexts/CartContext"

export const SearchPresenterScreen = ({ searchQuery }) => {
  const { addToCart } = useContext(CartContext)
  const { state } = useLocation()
  const navigate = useNavigate()

  function renderSearchMessage() {
    if (state.length > 0 || searchQuery.length > 0) {
      return <h2>Resultados de : "{searchQuery}"</h2>
    }
    return <></>
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })

    if (!state) {
      navigate("/", { replaced: true })
    }
  }, [])

  if (!state) return null

  return (
    <div className="mx-auto my-12 min-h-[45vh] max-w-6xl px-6">
      {renderSearchMessage()}

      <div className="mt-8 flex flex-wrap gap-5">
        {state.length > 0 ? (
          <>
            {state?.map((item, index) => {
              return (
                <div
                  className="flex w-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  key={index}
                >
                  <Link to={`/detalhes/${item.id}`}>
                    <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 p-4">
                      <img
                        className="max-h-full max-w-full object-contain"
                        src={item?.imageUrl}
                        alt={item?.title}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 py-4">
                      <strong>
                        <p className="font-bold">{item?.title}</p>
                      </strong>
                      <p className="font-black text-amber-600">
                        R$ {item?.price}
                      </p>
                    </div>
                  </Link>
                  <div>
                    <button
                      className="primary-button w-full text-sm"
                      onClick={() => addToCart(item)}
                    >
                      <strong>Adicionar ao carrinho</strong>
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <div className="w-full py-16 text-center">
            <h2>Não encontramos o seu livro.</h2>
            <h3>Você encontra mais opções em nossa home!!</h3>
          </div>
        )}
      </div>
    </div>
  )
}
