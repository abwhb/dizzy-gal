import { Scallop } from "@/components/decor";
import { Illustration } from "@/components/illustrations";
import { NewsletterForm } from "@/components/newsletter-form";
import { footer, footerColumns } from "@/lib/content";

/** Emails get a break opportunity after the @, so a narrow column wraps there. */
function Breakable({ text }: { text: string }) {
  const at = text.indexOf("@");
  if (at <= 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at + 1)}
      <wbr />
      {text.slice(at + 1)}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-cream">
      <Scallop color="#FF8BA7" />

      {/* minmax(0,…) on every track: a nested grid otherwise sizes the column
          to its max-content and pushes the page sideways on phones. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 px-5 pt-[clamp(48px,7vw,96px)] pb-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,2.4fr)] lg:gap-14">
        {/* Brand block: the one line of copy that sums the brand up, and the signup. */}
        <div data-reveal className="max-w-md">
          <p className="font-display text-[clamp(30px,3.6vw,46px)] leading-[.95] font-extrabold text-dizzy-orange">
            {footer.headline[0]}
            <br />
            {footer.headline[1]}
          </p>
          <p className="mt-4 text-sm leading-[1.55] font-medium">{footer.blurb}</p>
          <NewsletterForm className="mt-5 max-w-sm" />
        </div>

        {/* overflow-wrap: the email addresses are wider than a column on the
            narrowest phones; let them break rather than push the page sideways. */}
        <div className="grid grid-cols-2 gap-7 text-[13px] leading-[1.7] font-medium [overflow-wrap:anywhere] sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.heading} data-reveal>
              <div className="mb-2.5 text-[10px] font-semibold tracking-[.24em] text-burgundy uppercase">
                {column.heading}
              </div>
              {column.links.map((link) =>
                link.href ? (
                  <span key={link.label} className="block">
                    <a href={link.href}>
                      <Breakable text={link.label} />
                    </a>
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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t-[3px] border-burgundy px-5 py-4 text-[11px] font-semibold tracking-[.18em] uppercase">
        <span>{footer.legal}</span>
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footer.bottomLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#top" className="flex items-center gap-2">
            Back to top
            <Illustration name="star" strokeWidth={3.5} className="size-3.5 text-dizzy-orange" />
          </a>
        </span>
      </div>

      {/* Giant wordmark, full-bleed orange, cut off at the page edge. Letters
          rise out of a mask as it scrolls in and wobble under the pointer. */}
      <div className="relative overflow-hidden border-t-[3px] border-burgundy bg-dizzy-orange px-5 pt-4">
        <Illustration
          name="zzz"
          data-draw
          strokeWidth={3}
          className="absolute top-4 left-[5%] w-8 text-cream sm:w-12 md:w-16"
          style={{ rotate: "-12deg" }}
        />
        <div data-rise>
          <p
            data-split="chars"
            data-wobble
            className="font-display text-center text-[clamp(64px,15.5vw,236px)] leading-[.82] font-extrabold tracking-[-.045em] whitespace-nowrap text-cream"
            style={{ translate: "0 10%" }}
          >
            DIZZY GALS!
          </p>
        </div>
      </div>
    </footer>
  );
}
