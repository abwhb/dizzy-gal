"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { PatternBand, Scallop } from "@/components/decor";
import { Illustration } from "@/components/illustrations";
import { flyToCart } from "@/components/motion";
import { SectionRail } from "@/components/section-rail";
import { useSite } from "@/components/site-provider";
import { products, type Product } from "@/lib/content";

export function Shop() {
  return (
    <section
      id="shop"
      className="relative grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-lemon"
    >
      <Scallop color="#F2EFE6" />
      <SectionRail label="Our cakes in a jar" />
      <div>
        {products.map((product) => (
          <ProductFeature key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductFeature({ product }: { product: Product }) {
  const { addToCart } = useSite();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    addToCart();
    flyToCart(event.currentTarget);
    setJustAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-stretch">
      <div
        data-reveal
        className="relative flex min-h-[clamp(340px,46vw,560px)] items-center justify-center overflow-hidden border-r-[3px] border-burgundy bg-strawberry p-6 pt-12 sm:p-8 sm:pt-14"
      >
        <PatternBand overlay stroke="rgba(87,21,31,.16)" data-parallax-bg />

        <div
          data-float
          data-draw
          className="relative aspect-3/4 w-full max-w-[330px] overflow-hidden rounded-[18px] border-[3px] border-burgundy bg-cream"
        >
          {product.jarImage ? (
            <Image
              src={product.jarImage}
              alt={`${product.name} cake in a jar`}
              fill
              sizes="(max-width: 768px) 100vw, 330px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-dizzy-orange">
              <Illustration name="jar" strokeWidth={1.6} className="w-[68%]" />
              <span className="text-[9px] font-semibold tracking-[.22em] text-burgundy/55 uppercase">
                jar shot coming soon
              </span>
            </div>
          )}
        </div>

        {product.tag ? (
          <span className="absolute top-9 left-3.5 rounded-full border-2 border-burgundy bg-burgundy px-[14px] py-[7px] text-[11px] font-semibold tracking-[.18em] text-cream uppercase sm:top-11 sm:left-[22px]">
            {product.tag}
          </span>
        ) : null}

        <span className="absolute right-3 bottom-3 flex size-[116px] -rotate-10 flex-col items-center justify-center gap-[3px] rounded-full border-[3px] border-burgundy bg-lemon p-3 text-center leading-[1.25] font-semibold text-burgundy uppercase sm:right-[18px] sm:bottom-[18px] sm:size-[136px] sm:p-[14px] motion-safe:animate-wiggle">
          <span className="text-[10px] tracking-[.22em]">Warning</span>
          <span className="text-[11px] tracking-[.02em]">{product.warning}</span>
        </span>
      </div>

      <div
        data-reveal
        className="flex flex-col justify-center gap-[18px] px-[clamp(20px,3vw,44px)] py-[clamp(28px,4vw,56px)] pt-[clamp(40px,5vw,64px)]"
      >
        <h3
          data-split="chars"
          className="font-display text-[clamp(38px,5.6vw,76px)] leading-[.9] font-extrabold tracking-[-.03em] text-burgundy uppercase"
        >
          {product.name}
        </h3>
        <p className="max-w-[34ch] text-[clamp(15px,1.7vw,20px)] leading-[1.4] font-medium">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          {product.ingredients.map((ingredient) => (
            <div
              key={ingredient.label}
              data-reveal="pop"
              className="group flex flex-col items-center gap-2"
            >
              <span
                data-draw
                className="flex size-[76px] items-center justify-center rounded-full border-[3px] border-burgundy bg-cream text-dizzy-orange transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:size-[88px]"
              >
                <Illustration
                  name={ingredient.illustration}
                  className="size-[46px] sm:size-[52px]"
                />
              </span>
              <span className="text-[10px] font-semibold tracking-[.18em] uppercase">
                {ingredient.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-live="polite"
          className={`cursor-pointer self-start rounded-full px-8 py-[15px] text-sm font-semibold tracking-[.16em] text-cream uppercase transition-[scale,background-color] duration-200 hover:scale-[1.04] active:scale-[.97] ${
            justAdded ? "bg-dizzy-orange" : "bg-burgundy hover:bg-dizzy-orange"
          }`}
        >
          {justAdded ? "in the jar!" : product.cta}
        </button>
      </div>
    </article>
  );
}
