import { agency, footer } from "@/lib/content";

import { Mark } from "./ui";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-14 border-t border-line">
      <div className="grid gap-10 px-5 pt-10 pb-24 sm:px-6 md:grid-cols-[1fr_1fr_1fr] lg:pb-40">
        <a href="#top" className="flex items-start gap-2 text-[14px] font-bold tracking-[-.02em]">
          <Mark className="mt-0.5 h-3.5 w-3.5" />
          {agency.name}
        </a>

        <nav aria-label="Pied de page">
          <ul>
            {footer.links.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="group inline-flex items-baseline text-[clamp(28px,3vw,34px)] leading-[1.15] font-semibold tracking-[-.04em]"
                >
                  <span className="mr-1 text-mist transition-colors group-hover:text-amber">+</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <address className="flex flex-col gap-2 text-[12px] font-semibold not-italic">
          <a href={agency.phone.href} className="hover:text-amber">
            {agency.phone.label}
          </a>
          <a href={agency.tollFree.href} className="hover:text-amber">
            {agency.tollFree.label}
          </a>
          <a href={agency.email.href} className="hover:text-amber">
            {agency.email.label}
          </a>
          <a href={agency.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 text-white/80 hover:text-amber">
            {agency.address.street}
            <br />
            {agency.address.city}
          </a>
          <p className="text-white/80">{agency.hours}</p>
          <ul className="mt-3 flex gap-4">
            {agency.social.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer" className="text-mist hover:text-amber">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </address>
      </div>

      <div className="flex flex-col gap-1 border-t border-line px-5 py-4 text-[11px] font-medium text-mist sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {agency.name} · {agency.legalName}
        </p>
        <p>{agency.permit}</p>
      </div>
    </footer>
  );
}
