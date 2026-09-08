import type { Metadata } from "next";

import { CartView } from "@/components/cart-view";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";

export const metadata: Metadata = { title: "Your jar — Dizzy Gals" };

export default function CartPage() {
  return (
    <PageShell title={checkoutCopy.cartTitle} kicker="Cart" doodle="jar">
      <CartView />
    </PageShell>
  );
}
