"use client";

import { useState } from "react";

import { agency, contact } from "@/lib/content";

import { Arrow, Container, Kicker, Photo, SectionTitle, button } from "./ui";

const input =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-green";
const label = "mb-1.5 block text-[11px] font-semibold tracking-[.18em] text-muted uppercase";

export function Contact() {
  const [sent, setSent] = useState(false);

  /**
   * There is no form backend yet: the submission opens the visitor's mail
   * client with the request pre-filled and addressed to the agency.
   */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const subject = `Demande d'information — ${get("type")}`;
    const body = [
      `Nom : ${get("nom")}`,
      `Courriel : ${get("courriel")}`,
      `Téléphone : ${get("telephone")}`,
      `Type de voyage : ${get("type")}`,
      "",
      get("message"),
    ].join("\n");
    window.open(`${agency.email.href}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_self");
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-20 py-[clamp(64px,9vw,120px)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div>
            <Kicker className="text-green">{contact.kicker}</Kicker>
            <SectionTitle className="mt-4">{contact.title}</SectionTitle>
            <p className="mt-5 text-[16px] leading-[1.7] text-ink/75">{contact.lead}</p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <Detail term="Téléphone">
                <a href={agency.phone.href} className="font-semibold hover:text-green">
                  {agency.phone.label}
                </a>
                <br />
                <a href={agency.tollFree.href} className="hover:text-green">
                  {agency.tollFree.label} <span className="text-muted">(sans frais)</span>
                </a>
              </Detail>
              <Detail term="Courriel">
                <a href={agency.email.href} className="font-semibold hover:text-green">
                  {agency.email.label}
                </a>
              </Detail>
              <Detail term="Bureau">
                <a href={agency.address.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-green">
                  {agency.address.street}
                  <br />
                  {agency.address.city}
                </a>
              </Detail>
              <Detail term="Heures">{agency.hours}</Detail>
            </dl>

            <a
              href={agency.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 block"
              aria-label="Ouvrir l'adresse dans Google Maps"
            >
              <Photo label={contact.mapLabel} tone="light" className="aspect-[16/7] rounded-[22px]" />
            </a>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[28px] border border-line bg-mint/60 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-nom" className={label}>
                  Nom complet
                </label>
                <input id="c-nom" name="nom" required autoComplete="name" className={input} placeholder="Votre nom" />
              </div>
              <div>
                <label htmlFor="c-tel" className={label}>
                  Téléphone
                </label>
                <input id="c-tel" name="telephone" type="tel" autoComplete="tel" className={input} placeholder="514 000-0000" />
              </div>
              <div>
                <label htmlFor="c-courriel" className={label}>
                  Courriel
                </label>
                <input id="c-courriel" name="courriel" type="email" required autoComplete="email" className={input} placeholder="vous@exemple.com" />
              </div>
              <div>
                <label htmlFor="c-type" className={label}>
                  Type de voyage
                </label>
                <select id="c-type" name="type" className={`${input} cursor-pointer`} defaultValue={contact.form.tripTypes[0]}>
                  {contact.form.tripTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className={label}>
                  Votre demande
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  className={input}
                  placeholder="Dates souhaitées, nombre de voyageurs, type de chambre…"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className={button.primary}>
                {contact.form.submit}
                <Arrow />
              </button>
              <p className="text-[12px] leading-[1.5] text-muted sm:max-w-[260px]" aria-live="polite">
                {sent ? "Merci! Votre courriel est prêt à être envoyé." : contact.form.note}
              </p>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold tracking-[.2em] text-muted uppercase">{term}</dt>
      <dd className="mt-1.5 text-[15px] leading-[1.6]">{children}</dd>
    </div>
  );
}
