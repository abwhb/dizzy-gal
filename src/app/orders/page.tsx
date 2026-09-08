import type { Metadata } from "next";

import { OrdersList } from "@/components/orders-list";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";

export const metadata: Metadata = { title: "My orders — Dizzy Gals" };

export default function OrdersPage() {
  return (
    <PageShell title={checkoutCopy.ordersTitle} kicker="Orders" doodle="zzz">
      <OrdersList />
    </PageShell>
  );
}
