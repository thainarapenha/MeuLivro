import { useState } from "react";
import { toast } from "react-toastify";
import newsletter from "@/assets/jpg/newsletter.jpg";

export const Novidades = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim()) return;

    toast.success("Ótima escolha! Iremos enviar nossos conteúdos para você.", {
      position: toast.POSITION.TOP_CENTER,
    });

    setNome("");
    setEmail("");
  };

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[320px] max-w-7xl items-center justify-center overflow-hidden rounded-2xl">
        <img
          src={newsletter}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-3xl px-5 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Fique por dentro das novidades e promoções
          </h2>

          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Receba novidades, lançamentos e ofertas diretamente no seu e-mail.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              aria-label="Seu nome"
              autoComplete="name"
              required
              className="min-w-0 rounded-xl border border-white/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              aria-label="Seu melhor e-mail"
              autoComplete="email"
              required
              className="min-w-0 rounded-xl border border-white/30 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand"
            />

            <button
              type="submit"
              disabled={!nome.trim() || !email.trim()}
              className="rounded-xl bg-ink px-7 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
