import type { Metadata } from "next";

import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { privacyPage } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy — Dizzy Gals" };

export default function PrivacyPage() {
  return (
    <PageShell title={privacyPage.title} kicker="Your details" doodle="heart">
      <LegalBody intro={privacyPage.intro} sections={privacyPage.sections} />
    </PageShell>
  );
}
