import { steps } from "@/lib/content";

import { Container, Kicker, SectionTitle } from "./ui";

export function Steps() {
  return (
    <section className="py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="max-w-[620px]">
          <Kicker className="text-green">Comment ça marche</Kicker>
          <SectionTitle className="mt-4">Quatre étapes, et vous êtes en route.</SectionTitle>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col bg-paper p-7">
              <span className="font-display text-[40px] leading-none text-gold italic">
                {step.number}
              </span>
              <h3 className="mt-6 text-[18px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-ink/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
