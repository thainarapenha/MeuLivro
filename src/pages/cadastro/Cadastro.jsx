import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "@/services/authApi";
import { validateRegistrationData } from "@/utils/validaFormulario";
import { toast } from "react-toastify";

export function Cadastro() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleSubmit(event) {
    event.preventDefault();
    const validation = validateRegistrationData(customerData);
    if (validation.error)
      return toast.error(validation.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    try {
      await registerCustomer(customerData);
      toast.success("Cadastro efetuado com sucesso", {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/login");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error;
      const alert =
        status === 409
          ? "Este email já está cadastrado"
          : status === 400
            ? message || "Confira os dados informados"
            : !error.response
              ? "Não foi possível acessar o servidor"
              : "Ocorreu um erro inesperado. Tente novamente";
      toast.error(alert, { position: toast.POSITION.TOP_CENTER });
    }
  }
  return (
    <main className="mx-auto my-16 max-w-xl px-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-10">
        <h1 className="mb-8 text-center text-4xl font-black">Cadastro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="field"
            placeholder="Nome"
            type="text"
            required
            value={customerData.name}
            onChange={(e) =>
              setCustomerData({ ...customerData, name: e.target.value })
            }
          />
          <input
            className="field"
            placeholder="E-mail"
            type="email"
            required
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
          />
          <input
            className="field"
            placeholder="Senha"
            type="password"
            required
            value={customerData.password}
            onChange={(e) =>
              setCustomerData({ ...customerData, password: e.target.value })
            }
          />
          <button className="primary-button w-full" type="submit">
            Finalizar cadastro
          </button>
        </form>
      </div>
    </main>
  );
}
