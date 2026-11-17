import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import avaliacao from "@/assets/avaliação-do-cliente.png";
import { buscarLivro } from "@/services/livrosApi";
import { carrinhoContext } from "@/contexts/carrinhoContext";
import { Loading } from "@/components/Loading/Loading";
export function DetalhesProduto() {
  const [leiaMais, setLeiaMais] = useState(true);
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(false);
  const { id } = useParams();
  const { adicionaNoCarrinho } = useContext(carrinhoContext);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    buscarLivro(id)
      .then(setLivro)
      .catch(() => setErro(true));
  }, [id]);
  if (erro)
    return (
      <div className="px-6 py-24 text-center">
        <h2 className="text-2xl font-black">Livro não encontrado.</h2>
        <p className="mt-2 text-slate-500">
          Não foi possível carregar os detalhes deste livro.
        </p>
      </div>
    );
  if (!livro) return <Loading />;
  const descricao = livro.descricao || "";
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <div className="flex justify-center rounded-3xl bg-white p-8 shadow-sm">
        <img
          className="max-h-[460px] object-contain"
          src={livro.url_img}
          alt={livro.titulo}
        />
      </div>
      <div>
        <h1 className="text-3xl font-black sm:text-5xl">{livro.titulo}</h1>
        <p className="mt-6 text-4xl font-black text-amber-600">
          R$ {livro.preco}
        </p>
        <p className="mt-2 font-medium text-slate-500">
          Entrega GRÁTIS no seu primeiro pedido
        </p>
        <button
          className="primary-button mt-6 w-full sm:w-auto sm:px-16"
          onClick={() => {
            adicionaNoCarrinho(livro);
            navigate("/carrinho");
          }}
        >
          Comprar
        </button>
        <div className="mt-8 border-t pt-6">
          <span className="font-bold">Avaliações de clientes</span>
          <img className="mt-2" src={avaliacao} alt="" />
        </div>
        <p className="mt-6 leading-7 text-slate-600">
          {leiaMais && descricao.length >= 610
            ? descricao.slice(0, 610) + "..."
            : descricao}{" "}
          {descricao.length >= 610 && (
            <button
              className="block font-bold text-blue-600"
              onClick={() => setLeiaMais(!leiaMais)}
            >
              {leiaMais ? "Leia mais" : "Leia menos"}
            </button>
          )}
        </p>
      </div>
    </main>
  );
}
