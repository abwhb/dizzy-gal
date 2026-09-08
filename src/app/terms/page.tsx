import { JsonLd } from "@/components/json-ld";
import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { termsPage } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description:
    "How ordering from Dizzy Gals works: delivery days, cash on delivery, cancellations, replacements and allergens.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell title={termsPage.title} kicker="The small print" doodle="star">
      <JsonLd data={breadcrumbJsonLd([{ name: "Terms", path: "/terms" }])} />
      <LegalBody intro={termsPage.intro} sections={termsPage.sections} />
    </PageShell>
  );
}
