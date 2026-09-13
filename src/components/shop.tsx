"use client";

import Image from "next/image";
import { useState } from "react";

import { Illustration } from "@/components/illustrations";
import { SectionRail } from "@/components/section-rail";
import { useSite } from "@/components/site-provider";
import { formatPrice } from "@/lib/format";
import type { ShopProduct } from "@/lib/products";

type ButtonState = { kind: "idle" } | { kind: "adding" } | { kind: "added" } | { kind: "error"; message: string };

function AddButton({ product }: { product: ShopProduct }) {
  const { addToCart } = useSite();
  const [state, setState] = useState<ButtonState>({ kind: "idle" });

  const label = !product.inStock
    ? "sold out"
    : state.kind === "adding"
      ? "adding…"
      : state.kind === "added"
        ? "in your cart"
        : product.cta;

  const onClick = async () => {
    setState({ kind: "adding" });
    const result = await addToCart(product.id);
    if (result.ok) {
      setState({ kind: "added" });
      window.setTimeout(() => setState({ kind: "idle" }), 1800);
    } else {
      setState({ kind: "error", message: result.error });
    }
  };

  return (
    <div className="flex flex-col gap-2 self-start">
      <button
        type="button"
        onClick={onClick}
        disabled={!product.inStock || state.kind === "adding"}
        className="cursor-pointer self-start rounded-full bg-burgundy px-8 py-[15px] text-sm font-semibold tracking-[.16em] text-cream uppercase transition-colors hover:bg-dizzy-orange disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-burgundy"
      >
        {label}
      </button>
      {state.kind === "error" ? (
        <p role="alert" className="text-xs font-semibold tracking-[.08em] text-dizzy-orange uppercase">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

export function Shop({ products }: { products: ShopProduct[] }) {
  return (
    <section
      id="shop"
      className="grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-lemon"
    >
      <SectionRail label="Our cakes in a jar" />
      <div>
        {products.length === 0 ? (
          <p className="px-[clamp(20px,3vw,44px)] py-[clamp(28px,4vw,56px)] font-display text-[clamp(28px,4vw,48px)] leading-none font-extrabold text-burgundy uppercase">
            New flavours are in the oven. Check back soon.
          </p>
        ) : null}
        {products.map((product) => (
          <article
            key={product.id}
            className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-stretch"
          >
            <div className="relative flex min-h-[clamp(340px,46vw,560px)] items-center justify-center border-r-[3px] border-burgundy bg-strawberry p-8">
              <div className="relative aspect-3/4 w-full max-w-[330px] overflow-hidden rounded-[18px] border-[3px] border-burgundy bg-cream">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
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

              {product.warning ? (
                <span className="absolute right-[18px] bottom-[18px] flex size-[136px] -rotate-10 flex-col items-center justify-center gap-[3px] rounded-full border-[3px] border-burgundy bg-lemon p-[14px] text-center leading-[1.25] font-semibold text-burgundy uppercase">
                  <span className="text-[10px] tracking-[.22em]">Warning</span>
                  <span className="text-[11px] tracking-[.02em]">{product.warning}</span>
                </span>
              ) : null}
            </div>

            <div className="flex flex-col justify-center gap-[18px] px-[clamp(20px,3vw,44px)] py-[clamp(28px,4vw,56px)]">
              <h3 className="font-display text-[clamp(38px,5.6vw,76px)] leading-[.9] font-extrabold tracking-[-.03em] text-burgundy uppercase">
                {product.name}
              </h3>
              <p className="max-w-[34ch] text-[clamp(15px,1.7vw,20px)] leading-[1.4] font-medium">
                {product.description}
              </p>
              <p className="font-display text-[clamp(24px,3vw,36px)] leading-none font-extrabold text-burgundy">
                {formatPrice(product.priceCents, product.currency)}
                <span className="ml-2 font-body text-[11px] font-semibold tracking-[.18em] uppercase">
                  per jar
                </span>
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

              <AddButton product={product} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
