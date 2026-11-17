import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ItemCarrinho } from "@/components/itemCarinho/ItemCarrinho";
import { carrinhoContext } from "@/contexts/carrinhoContext";
import { loginContext } from "@/contexts/loginContext";
import { createOrder } from "@/services/ordersApi";
import { Loading } from "@/components/Loading/Loading";
import { toast } from "react-toastify";

export function Carrinho() {
  const {
    carrinho,
    unavailableItems,
    cartLoading,
    checkoutCarrinho,
    removeUnavailableItem,
    totalDoCarrinho,
  } = useContext(carrinhoContext);
  const { isAuthenticated, authLoading } = useContext(loginContext);
  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutLock = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  async function checkout() {
    if (
      checkoutLock.current ||
      checkingOut ||
      cartLoading ||
      authLoading ||
      !carrinho.length
    ) {
      return;
    }

    if (!isAuthenticated) {
      toast.error("Faça login para prosseguir com a compra", {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/login");
      return;
    }

    if (unavailableItems.length) {
      toast.error("Remova os livros indisponíveis antes de finalizar", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const items = carrinho.map(({ item, quantidade }) => ({
      book_id: Number(item.id_livro),
      quantity: quantidade,
    }));

    checkoutLock.current = true;
    setCheckingOut(true);

    try {
      const order = await createOrder(items);

      checkoutCarrinho();
      toast.success(
        order?.id
          ? `Compra efetuada com sucesso. Pedido #${order.id}`
          : "Compra efetuada com sucesso",
        { position: toast.POSITION.TOP_CENTER }
      );
      navigate("/");
    } catch (error) {
      const status = error.response?.status;

      if (status === 400) {
        toast.error("Não foi possível processar os itens do carrinho", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (status === 401) {
        toast.error("Sua sessão expirou. Faça login para continuar", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      } else if (status === 404) {
        toast.error("Algum livro não está mais disponível", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (status === 409) {
        toast.error("A disponibilidade de estoque foi alterada", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (status === 500) {
        toast.error("Falha temporária ao concluir a compra", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (!error.response) {
        toast.error("Não foi possível acessar o servidor", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("Não foi possível concluir a compra", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } finally {
      checkoutLock.current = false;
      setCheckingOut(false);
    }
  }

  if (cartLoading) {
    return <Loading />;
  }

  if (!carrinho.length && !unavailableItems.length) {
    return (
      <div className="mx-auto my-12 max-w-4xl rounded-3xl bg-white p-6 shadow-soft sm:p-12">
        <h1>Meu carrinho</h1>

        <h2
          style={{ textAlign: "center", fontWeight: "500", marginTop: "52px" }}
        >
          Seu carrinho está vazio :(
        </h2>

        <div className={styles.botoes}>
          <Link
            to="/"
            className="primary-button mx-auto block max-w-md text-center"
          >
            Voltar para página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-12 max-w-4xl rounded-3xl bg-white p-6 shadow-soft sm:p-12">
      <h1>Meu carrinho</h1>

      {unavailableItems.length > 0 && (
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h2>Itens indisponíveis</h2>
          <p>Remova os itens que não estão mais disponíveis para continuar.</p>
          {unavailableItems.map(({ book_id, item, reason }) => (
            <div key={book_id} style={{ margin: "12px 0" }}>
              <span>
                {item?.titulo || `Livro #${book_id}`} —
                {reason === "out_of_stock"
                  ? "sem estoque"
                  : reason === "catalog_error"
                    ? "não foi possível verificar"
                    : "não encontrado"}
              </span>{" "}
              <button onClick={() => removeUnavailableItem(book_id)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {carrinho.map((produto, index) => {
        return <ItemCarrinho key={index} produto={produto} />;
      })}

      {carrinho.length > 0 && (
        <p className="mt-6 text-right text-2xl font-black">
          Total: {totalDoCarrinho()}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Link className="primary-button text-center" to="/">
          Continuar comprando
        </Link>
        <button
          className="primary-button"
          onClick={checkout}
          disabled={
            checkingOut || authLoading || cartLoading || !carrinho.length
          }
        >
          {checkingOut ? "Processando..." : "Concluir compra"}
        </button>
      </div>
    </div>
  );
}
