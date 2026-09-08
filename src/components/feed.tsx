import { PatternBand } from "@/components/decor";
import { FeedControls } from "@/components/feed-controls";
import { Illustration } from "@/components/illustrations";
import { PhotoSlot } from "@/components/photo-slot";
import { SectionRail } from "@/components/section-rail";
import { feed } from "@/lib/content";

export function Feed() {
  return (
    <>
      <PatternBand />
      {/* On wide screens motion.tsx pins this and turns vertical scroll into
          the rail's horizontal travel; on touch it stays a native swipe rail. */}
      <section
        id="feed"
        data-pin-rail
        className="grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-strawberry"
      >
        <SectionRail label="Social feel" />
        <div className="min-w-0 lg:overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b-[3px] border-burgundy bg-strawberry px-5 py-6 sm:px-8">
            <h2 className="max-w-[19ch] font-display text-[clamp(28px,3.4vw,44px)] leading-[.98] font-extrabold tracking-[-.02em]">
              Cake tastes better together.
            </h2>
            <div className="flex items-center gap-3 sm:gap-5">
              <div aria-hidden="true" className="flex flex-col items-center -rotate-3">
                <span className="text-[10px] font-semibold tracking-[.08em] uppercase">
                  More sweet moments
                </span>
                <svg
                  viewBox="0 0 132 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 h-8 w-28"
                >
                  <path d="M5 12C18 34 54 39 66 23C79 5 47 0 48 17C49 35 95 36 124 16" />
                  <path d="m108 14 18 1-7 17" />
                </svg>
              </div>
              <FeedControls />
            </div>
          </div>
          <div
            id="social-cards"
            role="region"
            aria-label="Social feel cards"
            tabIndex={0}
            className="rail flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-burgundy"
          >
            {feed.map((card, index) => (
              <div
                key={index}
                data-reveal="slide"
                className="relative flex flex-[0_0_min(280px,78vw)] snap-start flex-col gap-3 overflow-hidden border-r-[3px] border-burgundy px-5 py-6"
                style={{ background: card.bg, color: card.fg }}
              >
                {card.kind === "quote" ? (
                  <>
                    <p className="relative z-10 font-display text-[30px] leading-[1.02] font-extrabold uppercase">
                      {card.big}
                    </p>
                    {card.doodle ? (
                      <Illustration
                        name={card.doodle}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute right-[-6%] bottom-[14%] w-[52%] opacity-40"
                        style={{ rotate: "-10deg" }}
                      />
                    ) : null}
                    <p className="relative z-10 mt-auto text-[13px] leading-[1.5] font-medium">
                      {card.small}
                    </p>
                  </>
                ) : (
                  <PhotoSlot
                    label={card.small}
                    alt={card.imageAlt}
                    src={card.image}
                    fit="contain"
                    className="aspect-3/4 bg-cream text-burgundy shadow-[0_5px_12px_rgba(87,21,31,0.18)]"
                    style={{ rotate: `${index % 4 === 1 ? -3 : 3}deg` }}
                    sizes="(max-width: 359px) 66vw, 237px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
