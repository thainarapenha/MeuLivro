import bannerHero from "@/assets/jpg/banner-hero.jpg"

export const Hero = () => {
  return (
    <section className="relative bg-white">
      <div className="mx-auto flex w-full justify-center pb-6">
        <img
          src={bannerHero}
          alt="Banner principal da livraria"
          className="h-[60dvh] max-h-[620px] w-full object-cover object-center md:h-auto"
        />
      </div>
    </section>
  )
}
