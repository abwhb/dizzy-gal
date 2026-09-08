import { agency, footerColumns } from "@/lib/content";

import { Container, StarMark } from "./ui";

export function Footer() {
  return (
    <footer className="bg-ink text-sand">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <StarMark className="h-5 w-5 text-gold" />
              <span className="font-display text-[24px] leading-none">
                Voyages <span className="italic">Cortoba</span>
              </span>
            </a>
            <p className="mt-4 max-w-[340px] text-[14px] leading-[1.7] text-sand/65">
              Agence de voyages spécialisée dans le Hajj, la Omra et le tourisme éthique. Départs de Montréal,
              accompagnement francophone.
            </p>
            <ul className="mt-6 flex flex-col gap-1.5 text-[14px]">
              <li>
                <a href={agency.phone.href} className="hover:text-gold">
                  {agency.phone.label}
                </a>
                <span className="text-sand/40"> · </span>
                <a href={agency.tollFree.href} className="hover:text-gold">
                  {agency.tollFree.label}
                </a>
              </li>
              <li>
                <a href={agency.email.href} className="hover:text-gold">
                  {agency.email.label}
                </a>
              </li>
              <li className="text-sand/65">
                {agency.address.street}, {agency.address.city}
              </li>
              <li className="text-sand/65">{agency.hours}</li>
            </ul>
            <ul className="mt-6 flex gap-3">
              {agency.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-sand/25 px-4 py-1.5 text-[12px] font-semibold tracking-[.1em] uppercase transition-colors hover:border-gold hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="text-[11px] font-semibold tracking-[.22em] text-gold uppercase">{column.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sand/80 transition-colors hover:text-gold"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-sand/15 pt-6 text-[12px] leading-[1.6] text-sand/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {agency.name} · {agency.legalName}
          </p>
          <p>{agency.permit}</p>
        </div>
      </Container>
    </footer>
  );
}
