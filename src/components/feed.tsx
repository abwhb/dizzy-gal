import { PatternBand } from "@/components/decor";
import { Illustration } from "@/components/illustrations";
import { PhotoSlot } from "@/components/photo-slot";
import { SectionRail } from "@/components/section-rail";
import { feed } from "@/lib/content";

export function Feed() {
  return (
    <>
      <PatternBand />
      <section
        id="feed"
        className="grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-strawberry"
      >
        <SectionRail label="Social feel" />
        <div className="rail flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
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
                  src={card.image}
                  className="aspect-3/4 rounded-xl border-[3px] border-burgundy bg-cream text-burgundy"
                  sizes="(max-width: 768px) 78vw, 280px"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
