import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeSlash, X } from "phosphor-react"
import { loginContext } from "@/contexts/loginContext"
import { loginCustomer, registerCustomer } from "@/services/authApi"
import { validateRegistrationData } from "@/utils/validaFormulario"
import { toast } from "react-toastify"

function PasswordField({ name, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-[#1B1F27] outline-none transition placeholder:text-slate-400 focus:border-[#FFBC03] focus:ring-2 focus:ring-[#FFBC03]/20"
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />

      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#1B1F27]"
      >
        {visible ? <Eye size={20} /> : <EyeSlash size={20} />}
      </button>
    </div>
  )
}

export function AuthModal({
  open,
  onOpenChange,
  initialTab = "login",
}) {
  const [tab, setTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useContext(loginContext)
  const navigate = useNavigate()

  const isRegister = tab === "register"

  useEffect(() => {
    if (open) {
      setTab(initialTab)
      setError("")
    }
  }, [open, initialTab])

  useEffect(() => {
    if (!open) return

    function handleEscape(event) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  function handleTabChange(nextTab) {
    setTab(nextTab)
    setError("")
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    const data = new FormData(event.currentTarget)

    try {
      setIsLoading(true)

      if (isRegister) {
        const customerData = {
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          password: String(data.get("password") || ""),
        }

        const validation = validateRegistrationData(customerData)

        if (validation.error) {
          setError(validation.message)
          toast.error(validation.message, {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }

        await registerCustomer(customerData)

        toast.success("Cadastro efetuado com sucesso. Faça seu login.", {
          position: toast.POSITION.TOP_CENTER,
        })

        handleTabChange("login")
        return
      }

      const credentials = {
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      }

      const authenticatedSession = await loginCustomer(credentials)

      login(authenticatedSession)

      toast.success("Login efetuado com sucesso", {
        position: toast.POSITION.TOP_CENTER,
      })

      onOpenChange(false)
      navigate("/")
    } catch (requestError) {
      const status = requestError.response?.status

      const message = isRegister
        ? status === 409
          ? "Este e-mail já está cadastrado."
          : status === 400
            ? requestError.response?.data?.error || "Confira os dados informados."
            : !requestError.response
              ? "Não foi possível acessar o servidor."
              : "Ocorreu um erro inesperado. Tente novamente."
        : status === 401
          ? "E-mail e/ou senha inválidos."
          : status === 400
            ? requestError.response?.data?.error || "Confira os dados informados."
            : !requestError.response
              ? "Não foi possível acessar o servidor."
              : "Ocorreu um erro inesperado. Tente novamente."

      setError(message)
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[460px] overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Fechar modal"
          className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#1B1F27]"
        >
          <X size={22} />
        </button>

        <div className="px-7 pb-8 pt-9 sm:px-10">
          <div className="mb-7 text-center">
            <h2
              id="auth-title"
              className="text-2xl font-black text-[#1B1F27]"
            >
              Meu Livro
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isRegister
                ? "Crie sua conta e aproveite nossa livraria."
                : "Entre na sua conta para continuar suas compras."}
            </p>
          </div>

          <div className="mb-7 flex items-center justify-center gap-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`border-b-2 px-3 pb-3 text-base font-bold transition ${
                !isRegister
                  ? "border-[#FFBC03] text-[#1B1F27]"
                  : "border-transparent text-slate-400 hover:text-[#1B1F27]"
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`border-b-2 px-3 pb-3 text-base font-bold transition ${
                isRegister
                  ? "border-[#FFBC03] text-[#1B1F27]"
                  : "border-transparent text-slate-400 hover:text-[#1B1F27]"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <input
                name="name"
                type="text"
                placeholder="Nome completo"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1B1F27] outline-none transition placeholder:text-slate-400 focus:border-[#FFBC03] focus:ring-2 focus:ring-[#FFBC03]/20"
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1B1F27] outline-none transition placeholder:text-slate-400 focus:border-[#FFBC03] focus:ring-2 focus:ring-[#FFBC03]/20"
            />

            <PasswordField
              name="password"
              placeholder="Senha"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />

            {error && (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#FFBC03] px-5 py-3 font-bold text-[#1B1F27] transition hover:bg-[#E5A800] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Aguarde..."
                : isRegister
                  ? "Finalizar cadastro"
                  : "Entrar"}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-[#F4F7FA] px-4 py-3 text-center">
            <p className="text-xs text-slate-500">
              {isRegister
                ? "Já possui uma conta?"
                : "Ainda não possui uma conta?"}
              {" "}
              <button
                type="button"
                onClick={() =>
                  handleTabChange(isRegister ? "login" : "register")
                }
                className="font-bold text-[#1B1F27] underline decoration-[#FFBC03] decoration-2 underline-offset-2"
              >
                {isRegister ? "Entrar" : "Cadastre-se"}
              </button>
            </p>
          </div>
        </div>

        <div className="h-2 w-full bg-[#FFBC03]" />
      </section>
    </div>
  )
}
