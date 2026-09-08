import { footerColumns } from "@/lib/content";

export function SiteFooter() {
  return (
    // overflow-wrap: the email addresses are wider than a column on the
    // narrowest phones; let them break rather than push the page sideways.
    <footer className="grid grid-cols-2 gap-7 px-5 pt-[clamp(32px,5vw,64px)] pb-7 text-[13px] leading-[1.7] font-medium [overflow-wrap:anywhere] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
      {footerColumns.map((column) => (
        <div key={column.heading} data-reveal>
          <div className="mb-2.5 text-[10px] font-semibold tracking-[.24em] text-burgundy uppercase">
            {column.heading}
          </div>
          {column.links.map((link) =>
            link.href ? (
              <span key={link.label} className="block">
                <a href={link.href}>{link.label}</a>
              </span>
            ) : (
              <span key={link.label} className="block">
                {link.label}
              </span>
            ),
          )}
        </div>
      ))}
    </footer>
  );
}
