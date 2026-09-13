"use client";

function stepFeed(direction: -1 | 1) {
  const section = document.getElementById("feed");
  const rail = section?.querySelector<HTMLElement>(".rail");
  if (!section || !rail) return;

  // The desktop pin maps a card step to page scroll. If it is not active,
  // keep the same controls working with the native horizontal swipe rail.
  const stepEvent = new CustomEvent("dizzy:feed-step", {
    bubbles: true,
    cancelable: true,
    detail: { direction },
  });
  if (!section.dispatchEvent(stepEvent)) return;

  const first = rail.children[0] as HTMLElement | undefined;
  const second = rail.children[1] as HTMLElement | undefined;
  const cardWidth = first?.offsetWidth ?? rail.clientWidth;
  const step = first && second ? second.offsetLeft - first.offsetLeft : cardWidth;

  rail.scrollBy({
    left: direction * step,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

export function FeedControls() {
  return (
    <div role="group" aria-label="Browse social cards" className="flex shrink-0 items-center gap-2.5">
      {([-1, 1] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          onClick={() => stepFeed(direction)}
          aria-label={direction === -1 ? "Previous social cards" : "Next social cards"}
          aria-controls="social-cards"
          className="flex size-12 cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy bg-cream text-burgundy shadow-[0_3px_0_#57151F] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-lemon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy active:translate-y-[3px] active:shadow-none motion-reduce:transition-none"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={`size-6 ${direction === -1 ? "rotate-180" : ""}`}
          >
            <path d="M5 16h21M18 7l9 9-9 9" />
          </svg>
        </button>
      ))}
    </div>
  );
}
