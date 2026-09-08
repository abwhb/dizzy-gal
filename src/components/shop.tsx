"use client";

import Image from "next/image";

import { Illustration } from "@/components/illustrations";
import { SectionRail } from "@/components/section-rail";
import { useSite } from "@/components/site-provider";
import { products } from "@/lib/content";

export function Shop() {
  const { addToCart } = useSite();

  return (
    <section
      id="shop"
      className="grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-lemon"
    >
      <SectionRail label="Our cakes in a jar" />
      <div>
        {products.map((product) => (
          <article
            key={product.id}
            className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-stretch"
          >
            <div className="relative flex min-h-[clamp(340px,46vw,560px)] items-center justify-center border-r-[3px] border-burgundy bg-strawberry p-8">
              <div className="relative aspect-3/4 w-full max-w-[330px] overflow-hidden rounded-[18px] border-[3px] border-burgundy bg-cream">
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
                  <span className="absolute inset-3 flex items-center justify-center rounded-[10px] border-2 border-dashed border-burgundy/35 px-4 text-center text-[10px] font-semibold tracking-[.16em] text-burgundy/60 uppercase">
                    Drop the {product.name} jar shot
                  </span>
                )}
              </div>

              {product.tag ? (
                <span className="absolute top-[22px] left-[22px] rounded-full border-2 border-burgundy bg-burgundy px-[14px] py-[7px] text-[11px] font-semibold tracking-[.18em] text-cream uppercase">
                  {product.tag}
                </span>
              ) : null}

              <span className="absolute right-[18px] bottom-[18px] flex size-[136px] -rotate-10 flex-col items-center justify-center gap-[3px] rounded-full border-[3px] border-burgundy bg-lemon p-[14px] text-center leading-[1.25] font-semibold text-burgundy uppercase">
                <span className="text-[10px] tracking-[.22em]">Warning</span>
                <span className="text-[11px] tracking-[.02em]">{product.warning}</span>
              </span>
            </div>

            <div className="flex flex-col justify-center gap-[18px] px-[clamp(20px,3vw,44px)] py-[clamp(28px,4vw,56px)]">
              <h3 className="font-display text-[clamp(38px,5.6vw,76px)] leading-[.9] font-extrabold tracking-[-.03em] text-burgundy uppercase">
                {product.name}
              </h3>
              <p className="max-w-[34ch] text-[clamp(15px,1.7vw,20px)] leading-[1.4] font-medium">
                {product.description}
              </p>

              <div className="flex flex-wrap items-center gap-5">
                {product.ingredients.map((ingredient) => (
                  <div key={ingredient.label} className="flex flex-col items-center gap-2">
                    <span className="flex size-[88px] items-center justify-center rounded-full border-[3px] border-burgundy bg-cream text-dizzy-orange">
                      <Illustration name={ingredient.illustration} className="size-[52px]" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-[.18em] uppercase">
                      {ingredient.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addToCart()}
                className="cursor-pointer self-start rounded-full bg-burgundy px-8 py-[15px] text-sm font-semibold tracking-[.16em] text-cream uppercase transition-colors hover:bg-dizzy-orange"
              >
                {product.cta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
