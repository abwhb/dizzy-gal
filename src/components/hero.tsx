"use client";

import { Marquee } from "@/components/marquee";

// Hover scale transitions the `scale` property, never `transform`: GSAP
// animates these elements' transform on entry, and a CSS transition on the
// same property makes the tween read its own start state as the end.
const pill =
  "rounded-full bg-burgundy px-5 py-[10px] text-xs font-semibold tracking-[.45em] text-cream uppercase transition-[scale,background-color,color] duration-200 hover:scale-[1.04] hover:text-cream active:scale-[.97] sm:px-[26px] sm:py-[11px] sm:text-[13px] sm:tracking-[.55em]";

export function Hero() {
  const scrollToShop = () => {
    const shop = document.getElementById("shop");
    if (shop) window.scrollTo({ top: shop.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <section
      id="top"
      data-hero-root
      className="relative flex min-h-svh flex-col overflow-hidden bg-dizzy-orange"
    >
      <div className="flex justify-between gap-4 p-4 sm:p-5">
        <a href="#top" data-hero="pill" className={pill}>
          Home
        </a>
        <a href="#shop" data-hero="pill" className={pill}>
          Shop
        </a>
      </div>

      <div
        data-hero-content
        className="flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-10 text-center"
      >
        <h1
          data-hero="title"
          className="font-display text-[clamp(66px,17vw,240px)] leading-[.82] font-extrabold tracking-[-.045em] text-cream"
        >
          DIZZY
          <br />
          GALS!
        </h1>
        <p
          data-hero="tagline"
          className="mt-[clamp(28px,5vw,64px)] text-[clamp(12px,1.35vw,17px)] font-semibold tracking-[.3em] text-burgundy uppercase"
        >
          Cake worth losing your head over
        </p>
        <button
          type="button"
          data-hero="cta"
          onClick={scrollToShop}
          className="mt-6 cursor-pointer rounded-full bg-burgundy px-[26px] py-3 text-sm font-medium text-cream transition-[scale,background-color,color] duration-200 hover:scale-[1.04] hover:bg-cream hover:text-burgundy active:scale-[.97]"
        >
          go on. dig in.
        </button>
      </div>

      <Marquee />
    </section>
  );
}
