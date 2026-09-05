"use client";

import { Marquee } from "@/components/marquee";

const pill =
  "rounded-full bg-burgundy px-[26px] py-[11px] text-[13px] font-semibold tracking-[.55em] text-cream uppercase hover:text-cream";

export function Hero() {
  const scrollToShop = () => {
    const shop = document.getElementById("shop");
    if (shop) window.scrollTo({ top: shop.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <section id="top" className="relative flex min-h-screen flex-col bg-dizzy-orange">
      <div className="flex justify-between gap-4 p-5">
        <a href="#top" className={pill}>
          Home
        </a>
        <a href="#shop" className={pill}>
          Shop
        </a>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-10 text-center">
        <h1 className="font-display text-[clamp(66px,17vw,240px)] leading-[.82] font-extrabold tracking-[-.045em] text-cream">
          DIZZY
          <br />
          GALS!
        </h1>
        <p className="mt-[clamp(28px,5vw,64px)] text-[clamp(12px,1.35vw,17px)] font-semibold tracking-[.3em] text-burgundy uppercase">
          Cake worth losing your head over
        </p>
        <button
          type="button"
          onClick={scrollToShop}
          className="mt-6 cursor-pointer rounded-full bg-burgundy px-[26px] py-3 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-burgundy"
        >
          go on. dig in.
        </button>
      </div>

      <Marquee />
    </section>
  );
}
