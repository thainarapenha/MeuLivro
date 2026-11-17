import { Banner } from "../../components/banner/Banner.jsx";
import { CardProduto } from "../../components/cardProduto/CardProduto.jsx";
import { Editoras } from "../../components/Section/Editora/Editoras.jsx";
import { Novidades } from "../../components/Section/Novidades/Novidades.jsx";
import { Vantagens } from "../../components/Section/Vantagens/Vantagens.jsx";
import { Categoria } from "../../components/categorias/Categorias.jsx";
import { Loading } from "../../components/Loading/Loading.jsx";

export const Home = (props) => {
  const { book, catalogoCarregando, catalogoErro } = props;

  if (catalogoCarregando) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (catalogoErro) {
    return (
      <div style={{ textAlign: "center", padding: "64px 20px" }}>
        <h2>Não foi possível carregar o catálogo.</h2>
        <p>Verifique sua conexão e tente novamente.</p>
      </div>
    );
  }

  if (!book.length) {
    return (
      <div style={{ textAlign: "center", padding: "64px 20px" }}>
        <h2>O catálogo está vazio.</h2>
      </div>
    );
  }

  return (
    <div>
      <Banner />
      <Vantagens />
      <CardProduto book={book} />
      <Categoria />
      <Editoras />
      <Novidades />
    </div>
  );
};
