import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Checkout");

export default function CheckoutPage() {
  return (
    <PageShell title={checkoutCopy.checkoutTitle} kicker="Nearly there" doodle="spoon">
      <CheckoutForm />
    </PageShell>
  );
}
