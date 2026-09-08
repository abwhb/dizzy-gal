import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";

export const metadata: Metadata = { title: "Checkout — Dizzy Gals" };

export default function CheckoutPage() {
  return (
    <PageShell title={checkoutCopy.checkoutTitle} kicker="Nearly there" doodle="spoon">
      <CheckoutForm />
    </PageShell>
  );
}
