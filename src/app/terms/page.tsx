import type { Metadata } from "next";

import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { termsPage } from "@/lib/content";

export const metadata: Metadata = { title: "Terms — Dizzy Gals" };

export default function TermsPage() {
  return (
    <PageShell title={termsPage.title} kicker="The small print" doodle="star">
      <LegalBody intro={termsPage.intro} sections={termsPage.sections} />
    </PageShell>
  );
}
