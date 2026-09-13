import { CartView } from "@/components/cart-view";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Your jar");

export default function CartPage() {
  return (
    <PageShell title={checkoutCopy.cartTitle} kicker="Cart" doodle="jar">
      <CartView />
    </PageShell>
  );
}
