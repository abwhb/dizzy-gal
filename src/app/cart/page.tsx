import { CartView } from "@/components/cart-view";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { listProducts } from "@/lib/products";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Your jar");

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const products = await listProducts();
  return (
    <PageShell title={checkoutCopy.cartTitle} kicker="Cart" doodle="jar">
      <CartView products={products} />
    </PageShell>
  );
}
