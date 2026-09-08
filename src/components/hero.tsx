"use client";

import { SpinBadge } from "@/components/decor";
import { Illustration } from "@/components/illustrations";
import { Marquee } from "@/components/marquee";
import { hero, type IllustrationName } from "@/lib/content";

// Hover scale transitions the `scale` property, never `transform`: GSAP
// animates these elements' transform on entry, and a CSS transition on the
// same property makes the tween read its own start state as the end.
const pill =
  "rounded-full bg-burgundy px-5 py-[10px] text-xs font-semibold tracking-[.45em] text-cream uppercase transition-[scale,background-color,color] duration-200 hover:scale-[1.04] hover:text-cream active:scale-[.97] sm:px-[26px] sm:py-[11px] sm:text-[13px] sm:tracking-[.55em]";

/**
 * Doodles scattered around the lockup. `depth` drives mouse parallax
 * (motion.tsx); `rotate` is the resting tilt, set as the CSS `rotate`
 * property on the inner element so it never stacks with GSAP's transform.
 */
const doodles: {
  name: IllustrationName;
  className: string;
  depth: number;
  rotate: number;
}[] = [
  { name: "strawberry", className: "left-[5%] top-[12%] w-16 md:w-24", depth: 0.5, rotate: -14 },
  { name: "cake", className: "right-[6%] top-[14%] w-16 md:w-28", depth: 0.35, rotate: 10 },
  { name: "star", className: "left-[27%] top-[6%] w-7 md:w-11", depth: 0.75, rotate: 0 },
  { name: "star", className: "right-[26%] top-[9%] w-5 md:w-8", depth: 0.9, rotate: 20 },
  {
    name: "spoon",
    className: "left-[8%] bottom-[14%] hidden w-14 sm:block md:w-24",
    depth: 0.45,
    rotate: 15,
  },
  {
    name: "smiley",
    className: "right-[8%] top-[52%] hidden w-14 md:block md:w-20",
    depth: 0.3,
    rotate: -8,
  },
  { name: "star", className: "left-[30%] bottom-[10%] w-6 md:w-9", depth: 0.8, rotate: 35 },
  {
    name: "heart",
    className: "left-[16%] top-[46%] hidden w-8 lg:block md:w-10",
    depth: 0.6,
    rotate: -20,
  },
];

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
      <div className="relative z-10 flex justify-between gap-4 p-4 sm:p-5">
        <a href="#top" data-hero="pill" className={pill}>
          Home
        </a>
        <a href="#shop" data-hero="pill" className={pill}>
          Shop
        </a>
      </div>

      <div
        data-hero-content
        className="relative flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-16 text-center sm:pb-10"
      >
        {doodles.map((d, i) => (
          <span
            key={i}
            data-hero="doodle"
            data-parallax={d.depth}
            className={`pointer-events-none absolute text-cream ${d.className}`}
          >
            <span data-float className="block" style={{ rotate: `${d.rotate}deg` }}>
              <Illustration name={d.name} strokeWidth={2.2} className="w-full" />
            </span>
          </span>
        ))}

        <div className="relative">
          <Illustration
            name="zzz"
            data-hero="zzz"
            strokeWidth={3.2}
            className="absolute -top-8 -left-4 w-10 text-cream sm:-top-12 sm:-left-8 sm:w-16 md:-top-16 md:-left-12 md:w-20"
            style={{ rotate: "-12deg" }}
          />
          <h1
            data-hero="title"
            className="font-display text-[clamp(66px,17vw,240px)] leading-[.82] font-extrabold tracking-[-.045em] text-cream"
          >
            DIZZY
            <br />
            GALS!
          </h1>
        </div>

        <p
          data-hero="tagline"
          className="mt-[clamp(20px,3.5vw,44px)] text-[clamp(18px,2.3vw,30px)] leading-[1.15] font-semibold text-cream"
        >
          {hero.tagline[0]}
          <br />
          {hero.tagline[1]}
        </p>

        <button
          type="button"
          data-hero="cta"
          onClick={scrollToShop}
          className="mt-6 cursor-pointer rounded-full bg-burgundy px-7 py-3 text-[15px] font-medium text-cream transition-[scale,background-color,color] duration-200 hover:scale-[1.04] hover:bg-cream hover:text-burgundy active:scale-[.97]"
        >
          {hero.cta}
        </button>

        <div
          data-hero="badge"
          className="absolute right-4 bottom-3 w-[104px] sm:right-6 sm:bottom-5 sm:w-[136px] md:w-[156px]"
        >
          <SpinBadge text={hero.badge} className="w-full drop-shadow-[0_6px_0_rgba(87,21,31,.25)]" />
        </div>
      </div>

      <Marquee />
    </section>
  );
}
