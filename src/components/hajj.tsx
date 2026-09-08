import { hajj } from "@/lib/content";

import { Arrow, Container, Kicker, Photo, SectionTitle, StarMark, button } from "./ui";

export function Hajj() {
  return (
    <section id="hajj" className="scroll-mt-20 py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="relative">
            <Photo
              label={hajj.imageLabel}
              src={hajj.image}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-[4/5] rounded-[28px]"
            />
            <div className="absolute -right-3 -bottom-6 hidden rounded-2xl bg-gold px-5 py-4 text-ink shadow-[0_18px_40px_-20px_rgba(20,33,27,.4)] sm:block lg:-right-8">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase">Accompagnement</p>
              <p className="mt-1 font-display text-[26px] leading-none">Sans frais</p>
              <p className="mt-1 text-[12px] font-medium">supplémentaires</p>
            </div>
          </div>

          <div>
            <Kicker className="text-green">{hajj.kicker}</Kicker>
            <SectionTitle className="mt-4">{hajj.title}</SectionTitle>
            <p className="mt-6 text-[16px] leading-[1.7] text-ink/75">{hajj.lead}</p>

            <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {hajj.inclusions.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <StarMark className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-[15px] font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-[14px] leading-[1.6] text-ink/70">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={hajj.cta.href} className={button.primary}>
                {hajj.cta.label}
                <Arrow />
              </a>
              <a href={hajj.secondary.href} target="_blank" rel="noreferrer" className={button.ghost}>
                {hajj.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
