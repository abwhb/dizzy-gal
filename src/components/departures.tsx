import { departures, departuresCta } from "@/lib/content";

import { CalendarIcon, Photo, PinIcon, Square, Stars, UsersIcon, button, formatPrice } from "./ui";

export function Departures() {
  return (
    <section id="departs" className="scroll-mt-14 border-b border-line">
      <ul data-reveal-group className="grid lg:grid-cols-2">
        {departures.map((departure, index) => (
          <li
            key={departure.id}
            className={`border-b border-line p-5 sm:p-6 lg:[&:nth-child(odd)]:border-r ${
              index >= departures.length - 2 ? "lg:border-b-0" : ""
            } ${index === departures.length - 1 ? "border-b-0" : ""}`}
          >
            <article className="grid gap-6 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col">
                <h3 className="max-w-[300px] text-[22px] leading-[1.05] font-semibold tracking-[-.035em] text-balance">
                  {departure.title}
                </h3>
                <p className="mt-2 text-[12px] font-medium text-mist">
                  {departure.price !== null ? (
                    <>
                      à partir de <span className="text-[15px] font-bold text-white">{formatPrice(departure.price)}</span>
                      {departure.priceNote && <span className="ml-2">{departure.priceNote}</span>}
                    </>
                  ) : (
                    <>
                      tarif <span className="text-[15px] font-bold text-white">à venir</span>
                    </>
                  )}
                </p>

                <dl className="mt-8 flex max-w-[340px] flex-col gap-2 text-[11px] font-medium">
                  <Row icon={<PinIcon />} label="Destination">
                    {departure.location}
                  </Row>
                  <Row icon={<CalendarIcon />} label="Dates">
                    {departure.dates}
                  </Row>
                  <Row icon={<UsersIcon />} label="Groupe">
                    {departure.group}
                  </Row>
                  <Row icon={<Stars count={departure.rating.stars} />} label="Hébergement">
                    {departure.rating.label}
                  </Row>
                </dl>

                <a href={departuresCta.href} className={`${button.block} mt-6 max-w-[340px]`}>
                  {departuresCta.label}
                  <Square />
                </a>
              </div>

              <Photo
                label={departure.imageLabel}
                src={departure.image}
                tone={index % 2 === 1 ? "cool" : "warm"}
                sizes="(max-width: 640px) 100vw, 200px"
                className="aspect-[4/3] w-full rounded-[3px] sm:aspect-[3/4] sm:w-[200px]"
              />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="sr-only">{label}</dt>
      <dd className="text-white/85">{children}</dd>
      {icon}
    </div>
  );
}
