import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { ShopList } from "@/components/shop-list";
import { sectionPages } from "@/lib/content";
import { listProducts } from "@/lib/products";
import { breadcrumbJsonLd, pageMetadata, productListJsonLd } from "@/lib/seo";

const page = sectionPages.shop;

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/shop",
});

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts();
  return (
    <PageShell title={page.heading} kicker={page.kicker} doodle={page.doodle}>
      <JsonLd data={[breadcrumbJsonLd([{ name: page.title, path: "/shop" }]), productListJsonLd(products)]} />
      <ShopList products={products} />
    </PageShell>
  );
}
