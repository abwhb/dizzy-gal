"use client";

import { useEffect, useRef, useState } from "react";

import { useSite } from "@/components/site-provider";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy";
const navLink = `py-1 transition-colors hover:text-dizzy-orange ${focusRing}`;
const navigation = [
  { label: "Shop", href: "#shop", detail: "Find your flavour" },
  { label: "Story", href: "#story", detail: "A little cake, a little chaos" },
  { label: "Reviews", href: "#reviews", detail: "Dizzy people say" },
  { label: "Feed", href: "#feed", detail: "Cake is better with company" },
];

export function SiteHeader() {
  const { cartCount, openNewsletter } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const desktopNav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      menu.current?.close();
      desktopNav.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    };
    desktop.addEventListener("change", closeOnDesktop);
    closeOnDesktop();

    return () => {
      root.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const openMenu = () => {
    if (!menu.current) return;
    menu.current.showModal();
    setMenuOpen(true);
    closeButton.current?.focus({ preventScroll: true });
  };

  const closeMenu = () => menu.current?.close();

  return (
    <header data-header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-[3px] border-burgundy bg-cream px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
      <a
        href="#top"
        className={`font-display text-[22px] leading-none font-extrabold tracking-[-.02em] whitespace-nowrap text-dizzy-orange transition-transform hover:scale-[1.03] hover:text-dizzy-orange sm:text-[26px] ${focusRing}`}
      >
        DIZZY GALS!
      </a>
      <nav
        ref={desktopNav}
        aria-label="Main navigation"
        className="ml-auto hidden items-center justify-end gap-5 text-[11px] font-semibold tracking-[.18em] uppercase md:flex"
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} className={navLink}>
            {item.label}
          </a>
        ))}
        <button
          type="button"
          onClick={openNewsletter}
          className={`cursor-pointer py-1 text-[11px] font-semibold tracking-[.18em] text-burgundy uppercase transition-colors hover:text-dizzy-orange ${focusRing}`}
        >
          Newsletter
        </button>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0 md:gap-0">
        <span className="flex items-center gap-[7px] py-1 text-[11px] font-semibold tracking-[.18em] uppercase">
          <span className="sr-only sm:not-sr-only">Cart</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-5 sm:hidden"
          >
            <path d="M5 7h14l1 14H4L5 7Z M8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          <span
            data-cart-badge
            aria-live="polite"
            aria-atomic="true"
            className="inline-block rounded-full bg-dizzy-orange px-[9px] py-[2px] text-[11px] text-cream"
          >
            {cartCount}
          </span>
        </span>
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-haspopup="dialog"
          onClick={openMenu}
          className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-burgundy bg-lemon px-3 text-[10px] font-semibold tracking-[.12em] uppercase transition-colors hover:bg-strawberry md:hidden ${focusRing}`}
        >
          Menu
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
            className="size-[18px]"
          >
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>
      </div>

      {/* The native top layer stays above the scroll-animated header, traps
          focus, makes the page inert, and restores focus when dismissed. */}
      <dialog
        ref={menu}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-heading"
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            closeMenu();
          }
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-[420px] overflow-x-hidden overflow-y-auto overscroll-contain border-0 border-l-[3px] border-burgundy bg-cream p-0 text-burgundy backdrop:bg-burgundy/60 motion-safe:open:animate-modal-in"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b-[3px] border-burgundy px-5 py-4">
            <span className="font-display text-[26px] leading-none font-extrabold tracking-[-.02em] text-dizzy-orange">
              DIZZY GALS!
            </span>
            <button
              ref={closeButton}
              type="button"
              onClick={closeMenu}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-burgundy bg-cream px-3 text-[10px] font-semibold tracking-[.12em] uppercase transition-colors hover:bg-lemon ${focusRing}`}
            >
              Close
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
                className="size-[18px]"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="border-b-[3px] border-burgundy bg-lemon px-5 py-5">
            <p className="mb-2 text-[10px] font-semibold tracking-[.2em] uppercase">Go on. Dig in.</p>
            <h2
              id="mobile-navigation-heading"
              className="font-display text-[38px] leading-[.95] font-extrabold tracking-[-.02em]"
            >
              What are you craving?
            </h2>
          </div>

          <nav aria-label="Mobile navigation" className="px-5">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`group flex min-h-[82px] items-center justify-between gap-4 border-b-2 border-burgundy/20 py-3 transition-colors hover:text-dizzy-orange ${focusRing}`}
              >
                <span>
                  <span className="block font-display text-[34px] leading-none font-extrabold tracking-[-.02em]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium">{item.detail}</span>
                </span>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-burgundy text-burgundy transition-transform group-hover:-rotate-12 ${index % 2 ? "bg-lemon" : "bg-strawberry"}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto px-5 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openNewsletter();
              }}
              className={`min-h-12 w-full cursor-pointer rounded-full border-2 border-burgundy bg-burgundy px-5 py-3 text-[11px] font-semibold tracking-[.16em] text-cream uppercase transition-colors hover:bg-dizzy-orange ${focusRing}`}
            >
              Get the good stuff — newsletter
            </button>
            <p className="mt-3 text-center text-[11px] font-medium">Drops, restocks, and a little chaos.</p>
          </div>
        </div>
      </dialog>
    </header>
  );
}
