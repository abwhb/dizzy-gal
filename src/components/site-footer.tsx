import { Scallop } from "@/components/decor";
import { Illustration } from "@/components/illustrations";
import { footerColumns } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative">
      <Scallop color="#FF8BA7" />

      {/* overflow-wrap: the email addresses are wider than a column on the
          narrowest phones; let them break rather than push the page sideways. */}
      <div className="grid grid-cols-2 gap-7 px-5 pt-[clamp(44px,6vw,80px)] pb-10 text-[13px] leading-[1.7] font-medium [overflow-wrap:anywhere] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
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
      </div>

      {/* Giant wordmark, cut off at the page edge. */}
      <div className="relative overflow-hidden border-t-[3px] border-burgundy px-5 pt-3">
        <Illustration
          name="zzz"
          strokeWidth={3}
          className="absolute top-3 left-[6%] w-8 text-dizzy-orange sm:w-12 md:w-16"
          style={{ rotate: "-12deg" }}
        />
        <p
          data-reveal="pop"
          className="font-display text-center text-[clamp(64px,15.5vw,236px)] leading-[.8] font-extrabold tracking-[-.045em] whitespace-nowrap text-dizzy-orange"
          style={{ translate: "0 12%" }}
        >
          DIZZY GALS!
        </p>
      </div>
    </footer>
  );
}
