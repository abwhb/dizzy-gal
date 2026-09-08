import { PageBody } from "@/components/page-shell";
import type { PageSection } from "@/lib/content";

export function LegalBody({ intro, sections }: { intro: string; sections: PageSection[] }) {
  return (
    <PageBody>
      <p
        data-reveal
        className="max-w-2xl font-display text-[clamp(22px,2.6vw,32px)] leading-[1.1] font-extrabold text-dizzy-orange"
      >
        {intro}
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-x-12 sm:gap-y-10">
        {sections.map((section) => (
          // `contents` wrappers have no box, so the reveal hooks go on the children.
          <div key={section.heading} className="contents">
            <h2
              data-reveal
              className="text-[11px] font-semibold tracking-[.24em] text-burgundy uppercase sm:pt-1"
            >
              {section.heading}
            </h2>
            <div
              data-reveal
              className="max-w-2xl space-y-3 text-[15px] leading-[1.6] font-medium sm:text-base"
            >
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageBody>
  );
}
