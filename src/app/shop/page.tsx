import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { ShopList } from "@/components/shop-list";
import { sectionPages } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata, productListJsonLd } from "@/lib/seo";

const page = sectionPages.shop;

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/shop",
});

export default function ShopPage() {
  return (
    <PageShell title={page.heading} kicker={page.kicker} doodle={page.doodle}>
      <JsonLd data={[breadcrumbJsonLd([{ name: page.title, path: "/shop" }]), productListJsonLd()]} />
      <ShopList />
    </PageShell>
  );
}
