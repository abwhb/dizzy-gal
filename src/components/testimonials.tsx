import { partners, testimonials } from "@/lib/content";

import { Container, Kicker, SectionTitle, StarMark } from "./ui";

export function Testimonials() {
  return (
    <section className="py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="max-w-[620px]">
          <Kicker className="text-green">Témoignages</Kicker>
          <SectionTitle className="mt-4">Ils ont voyagé avec Cortoba.</SectionTitle>
        </div>

        <ul className="rail mt-12 flex snap-x gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {testimonials.map((item, index) => (
            <li
              key={index}
              className="flex w-[85vw] shrink-0 snap-start flex-col rounded-[24px] border border-line bg-paper p-7 sm:w-[420px] md:w-auto"
            >
              <div className="flex gap-1 text-gold" aria-label="Cinq étoiles">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarMark key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-[19px] leading-[1.5] text-ink/85">
                « {item.quote} »
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint font-display text-[16px] text-green">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="text-[14px] font-semibold">{item.name}</p>
                  <p className="text-[12px] text-muted">{item.detail}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-center gap-6 border-t border-line pt-10">
          <p className="text-[11px] font-semibold tracking-[.22em] text-muted uppercase">
            Nous voyageons avec les grandes compagnies
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((partner) => (
              <li
                key={partner}
                className="font-display text-[20px] tracking-[-.01em] text-ink/55 italic"
              >
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
