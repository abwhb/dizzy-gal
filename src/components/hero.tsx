import { hero } from "@/lib/content";

import { Photo, Square, button } from "./ui";

export function Hero() {
  return (
    <section id="top" className="fade-bottom relative min-h-[82vh] w-full overflow-hidden lg:min-h-[88vh]">
      <Photo label={hero.imageLabel} src={hero.image} fill priority sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-night/15" />

      <div className="relative flex min-h-[82vh] flex-col items-center justify-center px-5 pt-16 pb-28 text-center lg:min-h-[88vh]">
        <h1 className="text-[clamp(76px,17vw,232px)] leading-[.9] font-semibold tracking-[-.055em] text-balance">
          {hero.word}
        </h1>
        <p className="mt-6 max-w-[440px] text-[17px] leading-[1.35] font-semibold tracking-[-.02em] text-balance sm:text-[19px]">
          {hero.lead}
        </p>
        <a href={hero.cta.href} className={`${button.pill} mt-8`}>
          {hero.cta.label}
          <Square />
        </a>
      </div>
    </section>
  );
}
