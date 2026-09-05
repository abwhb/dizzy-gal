"use client";

import { useSite } from "@/components/site-provider";

const navLink = "hover:text-dizzy-orange";

export function SiteHeader() {
  const { cartCount, openNewsletter } = useSite();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b-[3px] border-burgundy bg-cream px-5 py-3">
      <a
        href="#top"
        className="font-display text-[26px] leading-none font-extrabold tracking-[-.02em] text-dizzy-orange hover:text-dizzy-orange"
      >
        DIZZY GALS!
      </a>
      <nav className="flex flex-wrap items-center justify-end gap-5 text-[11px] font-semibold tracking-[.18em] uppercase">
        <a href="#shop" className={navLink}>
          Shop
        </a>
        <a href="#story" className={navLink}>
          Story
        </a>
        <a href="#feed" className={navLink}>
          Feed
        </a>
        <button
          type="button"
          onClick={openNewsletter}
          className="cursor-pointer p-0 text-[11px] font-semibold tracking-[.18em] text-burgundy uppercase hover:text-dizzy-orange"
        >
          Newsletter
        </button>
        <span className="flex items-center gap-[7px]">
          Cart
          <span className="rounded-full bg-dizzy-orange px-[9px] py-[2px] text-[11px] text-cream">
            {cartCount}
          </span>
        </span>
      </nav>
    </header>
  );
}
