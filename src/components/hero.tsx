import { hero } from "@/lib/content";

import { Photo, Square, button } from "./ui";

export function Hero() {
  return (
    <section id="top" className="fade-bottom relative min-h-[82vh] w-full overflow-hidden lg:min-h-[88vh]">
      <Photo label={hero.imageLabel} src={hero.image} fill parallax priority sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/45 via-night/25 to-night/10" />

      <div className="relative flex min-h-[82vh] flex-col items-center justify-center px-5 pt-16 pb-28 text-center lg:min-h-[88vh]">
        <h1
          data-hero-word
          className="text-[clamp(76px,17vw,232px)] leading-[.9] font-semibold tracking-[-.055em] text-balance [text-shadow:0_2px_40px_rgba(10,26,32,.55)]"
        >
          {hero.word}
        </h1>
        <p
          data-hero-copy
          className="mt-6 max-w-[440px] text-[17px] leading-[1.35] font-semibold tracking-[-.02em] text-balance sm:text-[19px]"
        >
          {hero.lead}
        </p>
        <a data-hero-copy href={hero.cta.href} className={`${button.pill} mt-8`}>
          {hero.cta.label}
          <Square />
        </a>
      </div>
    </section>
  );
}
