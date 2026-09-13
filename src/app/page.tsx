import { Feed } from "@/components/feed";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { FallingMascot } from "@/components/mascot";
import { Motion } from "@/components/motion";
import { PromiseStrip } from "@/components/promise-strip";
import { Reviews } from "@/components/reviews";
import { Shop } from "@/components/shop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Story } from "@/components/story";
import { productListJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={productListJsonLd()} />
      <Hero />
      <SiteHeader />
      <main>
        <PromiseStrip />
        <Shop />
        <Story />
        <Reviews />
        <Feed />
      </main>
      <SiteFooter />
      <FallingMascot />
      <Motion />
    </div>
  );
}
