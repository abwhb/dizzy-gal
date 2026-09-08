import { hero, search, trustPoints } from "@/lib/content";

import { Arrow, Container, Kicker, Photo, StarMark, button } from "./ui";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-6 sm:pt-10">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div className="max-w-[600px]">
            <Kicker className="text-green">{hero.eyebrow}</Kicker>
            <h1 className="mt-5 font-display text-[clamp(40px,6.2vw,76px)] leading-[1.02] font-medium tracking-[-.02em] text-balance">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.65] text-ink/75">{hero.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={hero.primaryCta.href} className={button.primary}>
                {hero.primaryCta.label}
                <Arrow />
              </a>
              <a href={hero.secondaryCta.href} className={button.outline}>
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="relative">
            <Photo
              label={hero.image.label}
              src={hero.image.src}
              priority
              caption="top"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-[4/5] w-full rounded-[28px] sm:aspect-[5/6] lg:aspect-[4/5]"
            />
            <div className="absolute -bottom-5 left-5 flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 pr-6 shadow-[0_18px_40px_-20px_rgba(20,33,27,.35)] sm:left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-green">
                <StarMark className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold tracking-[.2em] text-muted uppercase">
                  {hero.floatingCard.eyebrow}
                </p>
                <p className="mt-0.5 font-display text-[18px] leading-tight">{hero.floatingCard.title}</p>
                <p className="text-[13px] text-ink/70">{hero.floatingCard.meta}</p>
              </div>
            </div>
          </div>
        </div>

        <SearchBar />
      </Container>

      <TrustStrip />
    </section>
  );
}

function SearchBar() {
  const field = "flex flex-col gap-1.5 px-5 py-4 sm:px-6";
  const label = "text-[10px] font-semibold tracking-[.2em] text-muted uppercase";
  const select =
    "w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-medium text-ink outline-none";

  return (
    <form
      action="#departs"
      className="relative z-10 mt-14 grid overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_30px_60px_-40px_rgba(20,33,27,.45)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <Select name="type" label="Type de voyage" options={search.types} className={`${field} border-b border-line sm:border-r`} labelClass={label} selectClass={select} />
      <Select name="periode" label="Période" options={search.periods} className={`${field} border-b border-line lg:border-r`} labelClass={label} selectClass={select} />
      <Select name="voyageurs" label="Voyageurs" options={search.travellers} className={`${field} border-b border-line sm:border-r lg:border-b-0`} labelClass={label} selectClass={select} />
      <div className="flex items-center p-3 sm:p-4">
        <button type="submit" className={`${button.gold} w-full lg:w-auto`}>
          {search.cta}
          <Arrow />
        </button>
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  options,
  className,
  labelClass,
  selectClass,
}: {
  name: string;
  label: string;
  options: string[];
  className: string;
  labelClass: string;
  selectClass: string;
}) {
  const id = `search-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select id={id} name={name} className={selectClass} defaultValue={options[0]}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-muted"
        >
          <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="mt-12 border-y border-line bg-paper/60">
      <Container>
        <ul className="rail flex snap-x gap-x-8 overflow-x-auto py-4 text-[12px] font-semibold tracking-[.14em] whitespace-nowrap text-ink/70 uppercase sm:justify-between sm:gap-x-6">
          {trustPoints.map((point) => (
            <li key={point} className="flex snap-start items-center gap-2.5">
              <StarMark className="h-3 w-3 text-gold" />
              {point}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
