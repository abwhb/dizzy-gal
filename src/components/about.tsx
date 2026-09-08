import { about } from "@/lib/content";

import { Photo } from "./ui";

export function About() {
  return (
    <section className="border-b border-line">
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-line p-5 sm:p-6 lg:border-r lg:border-b-0">
          <Photo
            label={about.imageLabel}
            src={about.image}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] rounded-[3px] lg:aspect-square"
          />
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <p
            data-reveal
            className="max-w-[520px] text-[17px] leading-[1.35] font-semibold tracking-[-.02em] text-balance sm:text-[19px]"
          >
            {about.text}
          </p>

          <dl data-reveal-group className="mt-12 grid grid-cols-2 gap-6 sm:mt-16">
            {about.stats.map((stat) => {
              // "20+" → counts from 0 to 20 and keeps the "+" suffix.
              const [, number, suffix] = stat.value.match(/^(\d+)(.*)$/) ?? [];
              return (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd
                    {...(number ? { "data-count": number, "data-suffix": suffix } : {})}
                    className="text-[40px] leading-none font-semibold tracking-[-.04em] sm:text-[48px]"
                  >
                    {stat.value}
                  </dd>
                  <p className="mt-3 max-w-[180px] text-[13px] leading-[1.3] font-medium text-white/85">{stat.label}</p>
                </div>
              );
            })}
          </dl>

          <div data-reveal className="mt-auto flex flex-col gap-5 pt-16 sm:flex-row sm:items-center sm:justify-between lg:pt-24">
            <p className="max-w-[240px] text-[12px] leading-[1.4] font-medium text-mist">{about.trusted}</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {about.partners.map((partner) => (
                <li key={partner} className="text-[13px] font-bold tracking-[-.02em] text-white/70">
                  {partner}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
