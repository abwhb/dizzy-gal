import { OrdersList } from "@/components/orders-list";
import { PageShell } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("My orders");

export default function OrdersPage() {
  return (
    <PageShell title={checkoutCopy.ordersTitle} kicker="Orders" doodle="zzz">
      <OrdersList />
    </PageShell>
  );
}
