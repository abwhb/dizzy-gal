import { Illustration } from "@/components/illustrations";
import { JsonLd } from "@/components/json-ld";
import { PageBody, PageShell } from "@/components/page-shell";
import { WholesaleForm } from "@/components/wholesale-form";
import { site, wholesalePage } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: wholesalePage.title,
  description: wholesalePage.description,
  path: "/wholesale",
});

export default function WholesalePage() {
  const domain = site.email.split("@")[1];
  return (
    <PageShell title={wholesalePage.heading} kicker={wholesalePage.kicker} doodle={wholesalePage.doodle}>
      <JsonLd data={breadcrumbJsonLd([{ name: wholesalePage.title, path: "/wholesale" }])} />
      <PageBody className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
        <div>
          <p data-reveal className="text-[clamp(17px,1.6vw,21px)] leading-[1.4] font-medium text-pretty">
            {wholesalePage.intro}
          </p>
          <ul className="m-0 mt-8 flex list-none flex-col gap-3 p-0">
            {wholesalePage.perks.map((perk) => (
              <li
                key={perk.label}
                data-reveal
                className="group flex items-center gap-4 rounded-2xl border-[3px] border-burgundy bg-white px-4 py-3"
              >
                <span
                  data-draw
                  className="flex size-11 flex-none items-center justify-center rounded-full border-2 border-dizzy-orange text-dizzy-orange transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                >
                  <Illustration name={perk.illustration} className="size-6" strokeWidth={2.6} />
                </span>
                <span className="font-display text-lg leading-tight font-extrabold">{perk.label}</span>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-8 text-sm font-medium text-burgundy/80">
            Prefer email? <a href={`mailto:wholesale@${domain}`} className="underline hover:text-dizzy-orange">wholesale@{domain}</a>
          </p>
        </div>

        <div className="rounded-2xl border-[3px] border-burgundy bg-strawberry/40 p-6 sm:p-8">
          <WholesaleForm />
        </div>
      </PageBody>
    </PageShell>
  );
}
