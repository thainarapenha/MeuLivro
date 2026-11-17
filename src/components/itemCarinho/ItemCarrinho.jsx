import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "phosphor-react";
import { carrinhoContext } from "@/contexts/carrinhoContext";
export function ItemCarrinho({ produto }) {
  const { item: livro } = produto;
  const { incrementaCarrinho, decrementaCarrinho, removeDoCarrinho } =
    useContext(carrinhoContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 py-5">
      <img
        onClick={() => navigate(`/detalhes/${livro.id_livro}`)}
        className="h-24 w-16 cursor-pointer rounded-lg object-cover"
        src={livro.url_img}
        alt="Capa do livro"
      />
      <div className="min-w-[180px] flex-1">
        <strong
          className="cursor-pointer"
          onClick={() => navigate(`/detalhes/${livro.id_livro}`)}
        >
          {livro.titulo}
        </strong>
        <p className="mt-1 text-sm text-slate-500">{livro.autor}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={produto.quantidade === 1}
            onClick={() => decrementaCarrinho(livro.id_livro)}
            className="h-8 w-8 rounded-lg bg-brand font-bold disabled:opacity-40"
          >
            -
          </button>
          <input
            readOnly
            value={produto.quantidade}
            className="h-8 w-10 rounded-lg border text-center"
          />
          <button
            onClick={() => incrementaCarrinho(livro.id_livro)}
            className="h-8 w-8 rounded-lg bg-brand font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <strong>R$ {livro.preco}</strong>
        <button
          aria-label="Remover item"
          onClick={() => removeDoCarrinho(livro.id_livro)}
          className="text-slate-400 transition hover:text-rose-600"
        >
          <X size={25} />
        </button>
      </div>
    </div>
  );
}
