import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginContext } from "@/contexts/loginContext";
import { loginCustomer } from "@/services/authApi";
import { toast } from "react-toastify";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useContext(loginContext);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0 });
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
      const status = error.response?.status;
      const message =
        status === 401
          ? "Email e/ou senha inválidos"
          : status === 400
            ? error.response.data?.error || "Confira os dados informados"
            : !error.response
              ? "Não foi possível acessar o servidor"
              : "Ocorreu um erro inesperado. Tente novamente";
      toast.error(message, { position: toast.POSITION.TOP_CENTER });
    }
  }
  return (
    <main className="mx-auto my-16 flex max-w-xl flex-col items-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-black">Faça seu login</h1>
      <p className="text-slate-500">
        Entre para prosseguir e tenha acesso a diversos livros e uma experiência
        de compra incrível.
      </p>
      <form onSubmit={evento} className="flex w-full flex-col gap-4">
        <input
          className="field"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          type="email"
          required
          placeholder="Digite seu email"
        />
        <input
          className="field"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          type="password"
          required
          placeholder="Digite sua senha"
        />
        <button className="primary-button w-full" type="submit">
          Entrar
        </button>
      </form>
      <p className="text-slate-500">Ou, se você ainda não é cliente:</p>
      <Link className="w-full" to="/cadastro">
        <button className="w-full rounded-xl bg-ink px-5 py-3 font-bold text-white transition hover:bg-slate-700">
          Cadastre-se
        </button>
      </Link>
    </main>
  );
};
