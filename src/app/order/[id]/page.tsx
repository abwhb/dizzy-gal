import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/order-confirmation";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Order confirmed — Dizzy Gals" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell title="Ordered." kicker="Confirmation" doodle="cake">
      <OrderConfirmation id={id} />
    </PageShell>
  );
}
