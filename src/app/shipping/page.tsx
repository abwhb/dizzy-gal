import type { Metadata } from "next";

import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { shippingPage } from "@/lib/content";

export const metadata: Metadata = { title: "Shipping — Dizzy Gals" };

export default function ShippingPage() {
  return (
    <PageShell title={shippingPage.title} kicker="Getting it to you" doodle="cake">
      <LegalBody intro={shippingPage.intro} sections={shippingPage.sections} />
    </PageShell>
  );
}
