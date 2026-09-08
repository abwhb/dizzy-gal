import { services } from "@/lib/content";

import { Arrow, Check, Container, Kicker, Photo, SectionTitle } from "./ui";

export function Services() {
  return (
    <section id="services" className="py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[560px]">
            <Kicker className="text-green">Nos services</Kicker>
            <SectionTitle className="mt-4">Trois façons de voyager avec Cortoba.</SectionTitle>
          </div>
          <p className="max-w-[400px] text-[15px] leading-[1.65] text-ink/70">
            Du pèlerinage encadré au simple billet d&rsquo;avion, une même exigence : vous faire voyager en confiance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-[24px] border border-line bg-paper transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_rgba(20,33,27,.5)]"
            >
              <Photo
                label={service.imageLabel}
                src={service.image}
                tone={index === 1 ? "light" : "dark"}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-[4/3]"
              />
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-[11px] font-semibold tracking-[.2em] text-gold uppercase">{service.kicker}</p>
                <h3 className="mt-2 font-display text-[26px] leading-tight">{service.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink/70">{service.description}</p>
                <ul className="mt-5 flex flex-col gap-2 text-[14px] font-medium">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-green" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <a
                  href={service.cta.href}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-green"
                >
                  {service.cta.label}
                  <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
