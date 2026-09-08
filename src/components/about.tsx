import { about, stats } from "@/lib/content";

import { Container, Kicker, Photo, SectionTitle } from "./ui";

export function About() {
  return (
    <section id="a-propos" className="scroll-mt-20 border-y border-line bg-paper py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <Kicker className="text-green">{about.kicker}</Kicker>
            <SectionTitle className="mt-4">{about.title}</SectionTitle>
            <div className="mt-6 flex flex-col gap-4 text-[16px] leading-[1.75] text-ink/75">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[10px] font-semibold tracking-[.2em] text-muted uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pt-10">
            <Photo
              label={about.imageLabel}
              src={about.image}
              tone="light"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-[5/4] rounded-[28px]"
            />
          </div>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <p className="font-display text-[52px] leading-none text-green">
                {stat.value}
                <span className="ml-1 text-[28px] text-gold">{stat.suffix}</span>
              </p>
              <p className="mt-3 max-w-[220px] text-[14px] leading-[1.6] text-ink/70">{stat.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
