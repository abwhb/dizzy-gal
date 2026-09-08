"use client";

import { useEffect } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
import { useSite } from "@/components/site-provider";
import { newsletter } from "@/lib/content";

export function NewsletterModal() {
  const { newsletterOpen, closeNewsletter } = useSite();

  useEffect(() => {
    if (!newsletterOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNewsletter();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [newsletterOpen, closeNewsletter]);

  if (!newsletterOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-burgundy/60 p-5 motion-safe:animate-fade-in"
      onClick={closeNewsletter}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-heading"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[440px] flex-col gap-4 rounded-[18px] border-[3px] border-burgundy bg-lemon px-6 py-7 motion-safe:animate-modal-in"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="newsletter-heading"
            className="font-display text-[32px] leading-none font-extrabold uppercase"
          >
            Newsletter
          </h2>
          <button
            type="button"
            onClick={closeNewsletter}
            className="cursor-pointer text-[10px] font-semibold tracking-[.18em] text-burgundy uppercase hover:text-dizzy-orange"
          >
            Close
          </button>
        </div>

        <p className="text-sm leading-[1.5] font-medium">{newsletter.blurb}</p>

        <NewsletterForm />
      </div>
    </div>
  );
}
