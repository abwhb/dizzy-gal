import { process } from "@/lib/content";

import { Photo } from "./ui";

export function Process() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Photo label={process.imageLabel} src={process.image} tone="cool" fill sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/10 via-night/45 to-night" />

      <div className="relative grid min-h-[520px] items-end lg:grid-cols-[1.1fr_2fr]">
        <p
          data-reveal
          className="max-w-[300px] px-5 pt-40 pb-8 text-[15px] leading-[1.35] font-semibold tracking-[-.02em] sm:px-6 lg:pb-10"
        >
          {process.text}
        </p>

        <ol data-reveal-group className="grid grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step) => (
            <li
              key={step.number}
              className="flex min-h-[200px] flex-col justify-between border-t border-l border-white/15 px-5 pt-5 pb-8 sm:px-6 lg:min-h-[240px] lg:border-t-0 lg:pb-10"
            >
              <div>
                <p className="text-[34px] leading-none font-semibold tracking-[-.04em]">{step.number}</p>
                <p className="mt-2 text-[10px] font-medium text-mist">Étape</p>
              </div>
              <h3 className="mt-10 max-w-[130px] text-[14px] leading-[1.25] font-bold tracking-[-.02em]">{step.title}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
