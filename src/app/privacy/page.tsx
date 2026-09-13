import { JsonLd } from "@/components/json-ld";
import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { privacyPage } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "What Dizzy Gals collects when you order or join the newsletter, what it's used for, and how to have it removed. No tracking cookies, nothing sold.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell title={privacyPage.title} kicker="Your details" doodle="heart">
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy", path: "/privacy" }])} />
      <LegalBody intro={privacyPage.intro} sections={privacyPage.sections} />
    </PageShell>
  );
}
