import { faq } from "@/lib/content";

import { Container, Kicker, SectionTitle } from "./ui";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-y border-line bg-paper py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <Kicker className="text-green">Questions fréquentes</Kicker>
            <SectionTitle className="mt-4">Tout ce qu&rsquo;il faut savoir avant de partir.</SectionTitle>
            <p className="mt-5 text-[15px] leading-[1.65] text-ink/70">
              Une question qui n&rsquo;est pas ici? Appelez-nous, un conseiller vous répond en français ou en arabe.
            </p>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {faq.map((item, index) => (
              <details key={item.q} className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-green transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="pr-14 pb-6 text-[15px] leading-[1.7] text-ink/75">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
