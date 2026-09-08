import { footerColumns } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-7 px-5 pt-[clamp(32px,5vw,64px)] pb-7 text-[13px] leading-[1.7] font-medium">
      {footerColumns.map((column) => (
        <div key={column.heading}>
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
