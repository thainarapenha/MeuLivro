import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/authApi";
import { validateRegistrationData } from "../../utils/validaFormulario";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Cadastro.module.css";

export function Cadastro() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toastAlertErro = (mensagem) =>
    toast.error(mensagem, {
      position: toast.POSITION.TOP_CENTER,
    });

  const toastAlertSucesso = (mensagem) =>
    toast.success(mensagem, {
      position: toast.POSITION.TOP_CENTER,
    });

  async function handleSubmit(event) {
    event.preventDefault();

    const validation = validateRegistrationData(customerData);

    if (validation.error) {
      toastAlertErro(validation.message);
      return;
    }

    try {
      await registerCustomer(customerData);
      toastAlertSucesso("Cadastro efetuado com sucesso");
      navigate("/login");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error;

      if (status === 409) {
        toastAlertErro("Este email já está cadastrado");
      } else if (status === 400) {
        toastAlertErro(message || "Confira os dados informados");
      } else if (!error.response) {
        toastAlertErro("Não foi possível acessar o servidor");
      } else {
        toastAlertErro("Ocorreu um erro inesperado. Tente novamente");
      }
    }
  }

  return (
    <div className={styles.container}>
      <h2>Cadastro</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          type="text"
          id="name"
          required
          value={customerData.name}
          onChange={(e) =>
            setCustomerData({ ...customerData, name: e.target.value })
          }
        />
        <div>
          <input
            className={styles.email}
            placeholder="E-mail"
            type="email"
            id="email"
            required
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Senha"
            id="password"
            required
            value={customerData.password}
            onChange={(e) =>
              setCustomerData({ ...customerData, password: e.target.value })
            }
          />
        </div>

        <button className={styles.btn} type="submit">
          Finalizar cadastro
        </button>
      </form>
    </div>
  );
}
