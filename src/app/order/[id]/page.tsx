import { OrderConfirmation } from "@/components/order-confirmation";
import { PageShell } from "@/components/page-shell";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Order confirmed");

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell title="Ordered." kicker="Confirmation" doodle="cake">
      <OrderConfirmation id={id} />
    </PageShell>
  );
}
