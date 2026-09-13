"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef, useState } from "react";

import { Scallop } from "@/components/decor";
import { ProductFeature } from "@/components/product-feature";
import { SectionRail } from "@/components/section-rail";
import type { Product } from "@/lib/content";

const SWIPE = 48;

/**
 * The shop section: one flavour at a time, the section recolouring to match.
 * Tabs, arrows, arrow keys, and a swipe on touch all move it.
 */
export function FlavourCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const count = products.length;
  const active = products[index];

  const go = useCallback(
    (next: number) => setIndex((((next % count) + count) % count) as number),
    [count],
  );

  useGSAP(
    () => {
      if (!track.current) return;
      gsap.to(track.current, { xPercent: -100 * index, duration: 0.75, ease: "power3.inOut" });
    },
    { dependencies: [index] },
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
  };

  return (
    <section
      id="shop"
      role="region"
      aria-roledescription="carousel"
      aria-label="Our cakes in a jar"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy outline-none transition-[background-color] duration-700"
      style={{ backgroundColor: active.bg }}
    >
      <Scallop color="#F2EFE6" />
      <SectionRail label="Our cakes in a jar" />
      <h2 className="sr-only">Our cakes in a jar</h2>

      <div className="min-w-0">
        <div
          className="overflow-hidden"
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const dx = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (dx <= -SWIPE) go(index + 1);
            else if (dx >= SWIPE) go(index - 1);
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <div ref={track} className="flex">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="w-full flex-none"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${product.name}`}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <ProductFeature product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-burgundy px-4 py-3 sm:px-6">
          <div role="tablist" aria-label="Flavours" className="flex flex-wrap gap-2">
            {products.map((product, i) => (
              <button
                key={product.id}
                role="tab"
                type="button"
                aria-selected={i === index}
                onClick={() => go(i)}
                className={`cursor-pointer rounded-full border-2 border-burgundy px-3.5 py-1.5 text-[10px] font-semibold tracking-[.16em] uppercase transition-[scale,background-color,color] duration-200 hover:scale-[1.04] sm:px-4 sm:text-[11px] ${
                  i === index ? "bg-burgundy text-cream" : "bg-cream text-burgundy"
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous flavour"
              onClick={() => go(index - 1)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy bg-cream text-burgundy transition-[scale,background-color,color] duration-200 hover:scale-[1.06] hover:bg-burgundy hover:text-cream"
            >
              <Arrow className="size-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next flavour"
              onClick={() => go(index + 1)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy bg-cream text-burgundy transition-[scale,background-color,color] duration-200 hover:scale-[1.06] hover:bg-burgundy hover:text-cream"
            >
              <Arrow className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
