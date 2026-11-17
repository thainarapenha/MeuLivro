import { Banner } from "@/components/banner/Banner.jsx";
import { CardProduto } from "@/components/cardProduto/CardProduto.jsx";
import { Novidades } from "@/components/Section/Novidades/Novidades.jsx";
import { Loading } from "@/components/Loading/Loading.jsx";

export const Home = ({ book, catalogoCarregando, catalogoErro }) => {
  if (catalogoCarregando) {
    return <Loading />;
  }

  if (catalogoErro) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h2 className="text-2xl font-black">
          Não foi possível carregar o catálogo.
        </h2>

        <p className="mt-2 text-slate-500">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    );
  }

  if (!book.length) {
    return (
      <div className="px-6 py-24 text-center">
        <h2 className="text-2xl font-black">O catálogo está vazio.</h2>
      </div>
    );
  }

  return (
    <>
      <Banner />
      <CardProduto book={book} />
      <Novidades />
    </>
  );
};
