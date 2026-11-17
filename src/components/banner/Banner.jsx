import bannerHero from "@/assets/jpg/banner-hero.jpg";

export function Banner() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full justify-center pb-6 sm:pb-6">
        <img
          src={bannerHero}
          alt="Banner principal da livraria"
          className="h-auto max-h-[620px] w-[100%] object-cover object-center"
        />
      </div>
    </section>
  );
}
