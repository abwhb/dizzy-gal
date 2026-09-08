"use client";

import { useEffect, useState } from "react";

import { agency, nav } from "@/lib/content";

import { Mark } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/85 backdrop-blur-md">
      <div className="flex h-14 items-stretch">
        <a
          href="#top"
          className="flex items-center gap-2 border-r border-line px-5 text-[14px] font-bold tracking-[-.02em]"
          aria-label={`${agency.name} — accueil`}
        >
          <Mark className="h-3.5 w-3.5" />
          {agency.name}
        </a>

        <nav aria-label="Navigation principale" className="ml-auto hidden items-stretch md:flex">
          <ul className="flex items-center gap-7 px-6">
            {nav.links.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-[12px] font-semibold text-white/85 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={nav.cta.href}
            className="flex items-center border-l border-line px-7 text-[12px] font-bold hover:bg-night-2"
          >
            {nav.cta.label}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="ml-auto flex w-14 items-center justify-center border-l border-line md:hidden"
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-night md:hidden">
        <ul>
          {[...nav.links, nav.cta].map((item) => (
            <li key={item.label} className="border-b border-line last:border-b-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-[22px] font-semibold tracking-[-.03em]"
              >
                <span>
                  <span className="mr-1 text-mist">+</span>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
