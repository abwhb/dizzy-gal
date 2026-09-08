import { Scallop } from "@/components/decor";
import { Illustration, PATHS } from "@/components/illustrations";
import { SectionRail } from "@/components/section-rail";
import { reviews, reviewsSection } from "@/lib/content";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="size-4"
          fill={i < rating ? "#FF6A00" : "none"}
          stroke="#57151F"
          strokeWidth={3}
          strokeLinejoin="round"
        >
          <path d={PATHS.star[0]} />
        </svg>
      ))}
    </span>
  );
}

/** `scallop` is the colour of whatever sits above: the story on the home page, the title band on /reviews. */
export function Reviews({ scallop = "#F2EFE6" }: { scallop?: string }) {
  return (
    <section
      id="reviews"
      className="relative grid grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy bg-lemon"
    >
      <Scallop color={scallop} />
      <SectionRail label="Reviews" />
      <div className="px-5 pt-[clamp(48px,6vw,84px)] pb-[clamp(36px,5vw,72px)]">
        <div className="flex flex-wrap items-end gap-3">
          <h2
            data-split="chars"
            className="font-display text-[clamp(36px,5vw,68px)] leading-[.92] font-extrabold tracking-[-.03em] text-burgundy"
          >
            {reviewsSection.heading}
          </h2>
          <Illustration
            name="smiley"
            data-draw
            strokeWidth={2.6}
            className="mb-[.1em] w-[clamp(36px,4.2vw,56px)] text-dizzy-orange"
            style={{ rotate: "-10deg" }}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <figure
              key={review.name}
              data-reveal="pop"
              className="relative m-0 flex flex-col gap-4 rounded-2xl border-[3px] border-burgundy p-5 pt-6 text-burgundy transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1 sm:p-6"
              style={{ background: review.bg }}
            >
              <span
                className="absolute -top-3 right-4 rounded-full border-2 border-burgundy bg-cream px-2.5 py-1 text-[9px] font-semibold tracking-[.14em] uppercase"
                style={{ rotate: `${i % 2 ? 4 : -4}deg` }}
              >
                {reviewsSection.sticker}
              </span>
              <Stars rating={review.rating} />
              <blockquote className="m-0 font-display text-[clamp(20px,1.8vw,26px)] leading-[1.05] font-extrabold">
                {review.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-2 text-[10px] font-semibold tracking-[.18em] uppercase">
                <Illustration
                  name="smiley"
                  strokeWidth={3}
                  className="size-5 text-dizzy-orange"
                />
                {review.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
