import { Feed } from "@/components/feed";
import { Hero } from "@/components/hero";
import { NewsletterModal } from "@/components/newsletter-modal";
import { PromiseStrip } from "@/components/promise-strip";
import { Shop } from "@/components/shop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Story } from "@/components/story";
import { listProducts } from "@/lib/products";

// Products come from the database on every request, so a price or stock
// change in the admin shows up straight away.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <SiteHeader />
      <PromiseStrip />
      <Shop products={products} />
      <Story />
      <Feed />
      <SiteFooter />
      <NewsletterModal />
    </div>
  );
}
