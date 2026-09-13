import { Illustration } from "@/components/illustrations";
import { Motion } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { IllustrationName } from "@/lib/content";

/**
 * Frame for every page that isn't the home page: header, a short orange
 * title band, the content, footer. Carries its own <Motion/> so reveals
 * work on client-side navigation too.
 */
export function PageShell({
  title,
  kicker,
  doodle = "star",
  children,
}: {
  title: string;
  kicker?: string;
  doodle?: IllustrationName;
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader />
      <section className="relative overflow-hidden border-b-[3px] border-burgundy bg-dizzy-orange px-5 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Illustration
          name={doodle}
          data-draw
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 right-[6%] w-20 -translate-y-1/2 text-cream/90 sm:w-28 md:w-36"
          style={{ rotate: "-10deg" }}
        />
        <div className="mx-auto max-w-5xl">
          {kicker ? (
            <p className="mb-2 text-[11px] font-semibold tracking-[.24em] text-burgundy uppercase">
              {kicker}
            </p>
          ) : null}
          <h1
            data-split="chars"
            className="font-display text-[clamp(44px,8vw,110px)] leading-[.85] font-extrabold tracking-[-.04em] text-cream"
          >
            {title}
          </h1>
        </div>
      </section>
      <main className="flex-1 bg-cream">{children}</main>
      <SiteFooter />
      <Motion />
    </div>
  );
}

/** Consistent content width and padding for page bodies. */
export function PageBody({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-5xl px-5 py-10 sm:py-14 ${className}`}>{children}</div>
  );
}

/** Pill button styles shared by the pages. */
export const pillPrimary =
  "inline-flex cursor-pointer items-center justify-center rounded-full bg-burgundy px-7 py-3.5 text-sm font-semibold tracking-[.16em] text-cream uppercase transition-[scale,background-color] duration-200 hover:scale-[1.04] hover:bg-dizzy-orange hover:text-cream active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-burgundy";
export const pillSecondary =
  "inline-flex cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy bg-cream px-6 py-3 text-sm font-semibold tracking-[.16em] text-burgundy uppercase transition-[scale,background-color,color] duration-200 hover:scale-[1.04] hover:bg-burgundy hover:text-cream active:scale-[.97]";
