import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext } from "../../contexts/loginContext";
import { loginCustomer } from "../../services/authApi";

import styles from "./login.module.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useContext(loginContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  async function evento(event) {
    event.preventDefault();

    try {
      const authenticatedSession = await loginCustomer(credentials);
      toast.success("Login efetuado com sucesso", {
        position: toast.POSITION.TOP_CENTER,
      });

      setCredentials({ email: "", password: "" });
      login(authenticatedSession);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Email e/ou senha inválidos", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.error || "Confira os dados informados", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (!error.response) {
        toast.error("Não foi possível acessar o servidor", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  }

  return (
    <main className={styles.main}>
      <h2>Faça seu login</h2>
      <p className={styles.paragrafo}>
        Ficamos felizes em ter você por aqui. Entre para prosseguir e tenha
        acesso a diversos livros e obtenha uma experiência de compra incrível!
      </p>

      <form onSubmit={evento} className={styles.formulario}>
        <input
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          className={styles.campo}
          value={credentials.email}
          type="email"
          required
          placeholder="Digite seu email"
        />
        <input
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className={styles.campo}
          value={credentials.password}
          type="password"
          required
          placeholder="Digite sua senha"
        />

        <button className={styles.enviar} type="submit">
          Entrar
        </button>
      </form>

      <p>Ou, se você ainda não é cliente:</p>
      <Link className={styles.linkCadastro} to="/cadastro">
        <button className={styles.cadastro}>Cadastre-se</button>
      </Link>
    </main>
  );
};
