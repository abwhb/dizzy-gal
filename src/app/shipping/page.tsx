import { JsonLd } from "@/components/json-ld";
import { LegalBody } from "@/components/legal-page";
import { PageShell } from "@/components/page-shell";
import { shippingPage, store } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Delivery in DHA ${store.city}`,
  description: `Dizzy Gals delivers cake in a jar across DHA ${store.city} (${store.areas[0]} to ${store.areas[store.areas.length - 1]}) on ${store.deliveryDays.map((d) => `${d}s`).join(" and ")}. Delivery ${store.currency} ${store.deliveryFee}, free on ${store.freeDeliveryFrom}+ jars, cash on delivery.`,
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <PageShell title={shippingPage.title} kicker="Getting it to you" doodle="cake">
      <JsonLd data={breadcrumbJsonLd([{ name: "Shipping", path: "/shipping" }])} />
      <LegalBody intro={shippingPage.intro} sections={shippingPage.sections} />
    </PageShell>
  );
}
