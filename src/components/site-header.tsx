"use client";

import { useSite } from "@/components/site-provider";

const navLink = "py-1 transition-colors hover:text-dizzy-orange";

export function SiteHeader() {
  const { cartCount, openNewsletter } = useSite();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-[3px] border-burgundy bg-cream px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
      <a
        href="#top"
        className="font-display text-[22px] leading-none font-extrabold tracking-[-.02em] whitespace-nowrap text-dizzy-orange transition-transform hover:scale-[1.03] hover:text-dizzy-orange sm:text-[26px]"
      >
        DIZZY GALS!
      </a>
      <nav className="flex flex-wrap items-center justify-end gap-x-3.5 gap-y-0 text-[10px] font-semibold tracking-[.14em] uppercase sm:gap-5 sm:text-[11px] sm:tracking-[.18em]">
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
          className="cursor-pointer py-1 text-[10px] font-semibold tracking-[.14em] text-burgundy uppercase transition-colors hover:text-dizzy-orange sm:text-[11px] sm:tracking-[.18em]"
        >
          Newsletter
        </button>
        <span className="flex items-center gap-[7px] py-1">
          Cart
          <span
            data-cart-badge
            className="inline-block rounded-full bg-dizzy-orange px-[9px] py-[2px] text-[11px] text-cream"
          >
            {cartCount}
          </span>
        </span>
      </nav>
    </header>
  );
}
