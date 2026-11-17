import api from "./api";

function formatarPreco(preco) {
  if (preco === null || preco === undefined || preco === "") {
    return "";
  }

  // Mantém os dígitos recebidos do PostgreSQL e apenas adapta o separador
  // decimal para a apresentação já utilizada pela interface.
  return String(preco).trim().replace(".", ",");
}

export function normalizarLivro(livro) {
  return {
    ...livro,
    id_livro: livro.id,
    titulo: livro.title,
    autor: livro.author,
    editora: livro.publisher,
    descricao: livro.description,
    url_img: livro.image_url,
    preco: formatarPreco(livro.price),
  };
}

export async function listarLivros() {
  const resposta = await api.get("/books");
  return resposta.data.map(normalizarLivro);
}

export async function buscarLivro(id) {
  const resposta = await api.get(`/books/${id}`);
  return normalizarLivro(resposta.data);
}
