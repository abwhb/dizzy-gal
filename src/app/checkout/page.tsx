import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { listProducts } from "@/lib/products";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Checkout");

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const products = await listProducts();
  return (
    <PageShell title={checkoutCopy.checkoutTitle} kicker="Nearly there" doodle="spoon">
      <CheckoutForm products={products} />
    </PageShell>
  );
}
