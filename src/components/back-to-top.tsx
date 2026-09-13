"use client";

/** Scrolls to the top without putting a `#top` in the address bar. */
export function BackToTop({ className, children }: { className?: string; children: React.ReactNode }) {
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <button type="button" onClick={scrollToTop} className={`cursor-pointer ${className ?? ""}`}>
      {children}
    </button>
  );
}
