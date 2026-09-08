import { destinations } from "@/lib/content";

import { Arrow, Container, Kicker, Photo, SectionTitle } from "./ui";

export function Destinations() {
  return (
    <section id="destinations" className="scroll-mt-20 border-y border-line bg-paper py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[560px]">
            <Kicker className="text-green">Destinations</Kicker>
            <SectionTitle className="mt-4">Des lieux saints aux médinas.</SectionTitle>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 text-[14px] font-semibold text-green">
            Demander un programme sur mesure
            <Arrow />
          </a>
        </div>

        <ul className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px]">
          {destinations.map((destination, index) => (
            <li
              key={destination.name}
              className={`group relative overflow-hidden rounded-[22px] ${
                destination.span === "wide" ? "lg:col-span-2" : destination.span === "tall" ? "lg:row-span-2" : ""
              }`}
            >
              <Photo
                label={destination.imageLabel}
                src={destination.image}
                tone={index % 3 === 1 ? "light" : "dark"}
                caption="top"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-sand">
                <div>
                  <p className="text-[10px] font-semibold tracking-[.2em] text-sand/70 uppercase">
                    {destination.country}
                  </p>
                  <p className="mt-1 font-display text-[22px] leading-tight">{destination.name}</p>
                </div>
                <span className="shrink-0 rounded-full border border-sand/30 px-3 py-1 text-[11px] font-semibold whitespace-nowrap">
                  {destination.note}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
