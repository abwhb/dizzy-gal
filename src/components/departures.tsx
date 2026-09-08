import { agency, departures } from "@/lib/content";

import { Arrow, Container, Kicker, Photo, SectionTitle, button, formatPrice } from "./ui";

export function Departures() {
  return (
    <section id="departs" className="scroll-mt-20 bg-green py-[clamp(64px,9vw,120px)] text-sand">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[600px]">
            <Kicker className="text-gold">Départs Omra 2026 – 2027</Kicker>
            <SectionTitle className="mt-4">Choisissez votre départ de Montréal.</SectionTitle>
          </div>
          <p className="max-w-[400px] text-[15px] leading-[1.65] text-sand/70">
            Formules directes, combinées ou économiques, toujours avec un guide et un imam francophones. Les tarifs
            marqués « à venir » sont confirmés par téléphone.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departures.map((departure) => (
            <article
              key={departure.id}
              className={`group flex flex-col overflow-hidden rounded-[24px] bg-paper text-ink transition-transform duration-300 hover:-translate-y-1 ${
                departure.featured ? "ring-2 ring-gold ring-offset-4 ring-offset-green" : ""
              }`}
            >
              <div className="relative">
                <Photo
                  label={departure.imageLabel}
                  src={departure.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="aspect-[3/2]"
                />
                <span className="absolute top-4 left-4 rounded-full bg-paper/95 px-3 py-1 text-[11px] font-semibold tracking-[.16em] text-green uppercase">
                  {departure.tag}
                </span>
                {departure.featured && (
                  <span className="absolute top-4 right-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold tracking-[.16em] text-ink uppercase">
                    Places limitées
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[24px] leading-tight">{departure.title}</h3>
                    <p className="mt-1 text-[14px] font-medium text-ink/70">{departure.dates}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {departure.price !== null ? (
                      <>
                        <p className="text-[10px] font-semibold tracking-[.18em] text-muted uppercase">
                          À partir de
                        </p>
                        <p className="font-display text-[24px] leading-none text-green">
                          {formatPrice(departure.price)}
                        </p>
                      </>
                    ) : (
                      <p className="rounded-full bg-mint px-3 py-1.5 text-[12px] font-semibold text-green">
                        Tarif à venir
                      </p>
                    )}
                  </div>
                </div>

                {departure.priceNote && (
                  <p className="mt-2 text-[12px] text-muted">{departure.priceNote}</p>
                )}

                <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-line py-4 text-[13px]">
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[.18em] text-muted uppercase">Durée</dt>
                    <dd className="mt-0.5 font-medium">{departure.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[.18em] text-muted uppercase">Départ</dt>
                    <dd className="mt-0.5 font-medium">{departure.from}</dd>
                  </div>
                </dl>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {departure.highlights.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-green"
                >
                  {departure.price !== null ? "Réserver ma place" : "Être informé du tarif"}
                  <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[24px] border border-sand/15 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-display text-[22px]">Une Omra à la carte, aux dates de votre choix?</p>
            <p className="mt-1 text-[15px] text-sand/70">
              Nous montons des séjours individuels ou familiaux : vols, hôtels et visa, sans encadrement de groupe.
            </p>
          </div>
          <a href={agency.phone.href} className={`${button.outlineLight} shrink-0`}>
            Appeler le {agency.phone.label}
          </a>
        </div>
      </Container>
    </section>
  );
}
