import { Link } from "react-router-dom"
import bannerHero from "@/assets/jpg/banner-hero.jpg"

export const Hero = ({ books = [] }) => {
  return (
    <section className="relative bg-white">
      <div className="relative mx-auto flex w-full justify-center pb-6">
        <img
          src={bannerHero}
          alt="Banner principal da livraria"
          className="h-[90dvh] max-h-[620px] w-full object-cover object-center md:h-auto"
        />

        <div className="h-[90dvh] max-h-[620px] absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl text-white">
            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Sua próxima história começa aqui.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Descubra livros que inspiram, emocionam e transformam.
            </p>

            <Link
              to="/pesquisa"
              state={books}
              className="mt-7 inline-flex rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-amber-300 sm:text-base"
            >
              Explorar livros
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
