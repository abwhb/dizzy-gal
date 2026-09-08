"use client";

import { useEffect, useState } from "react";

import { agency, nav } from "@/lib/content";

import { Container, StarMark, button } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-sand/90 shadow-[0_1px_0_rgba(20,33,27,.04)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${agency.name} — accueil`}>
          <StarMark className="h-5 w-5 text-gold" />
          <span className="font-display text-[22px] leading-none font-medium tracking-[-.01em]">
            Voyages <span className="italic">Cortoba</span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-ink/80 transition-colors hover:text-green"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={agency.phone.href} className="text-[14px] font-semibold hover:text-green">
            {agency.phone.label}
          </a>
          <a href="#contact" className={`${button.primary} px-5 py-2.5`}>
            Réserver un appel
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-sand lg:hidden"
      >
        <Container className="flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-[17px] font-medium hover:bg-mint"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
            <a href={agency.phone.href} className="px-3 text-[15px] font-semibold">
              {agency.phone.label} · {agency.tollFree.label}
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className={button.primary}>
              Réserver un appel
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
