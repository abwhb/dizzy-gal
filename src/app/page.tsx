import { Feed } from "@/components/feed";
import { Hero } from "@/components/hero";
import { Motion } from "@/components/motion";
import { NewsletterModal } from "@/components/newsletter-modal";
import { PromiseStrip } from "@/components/promise-strip";
import { Shop } from "@/components/shop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Story } from "@/components/story";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <SiteHeader />
      <PromiseStrip />
      <Shop />
      <Story />
      <Feed />
      <SiteFooter />
      <NewsletterModal />
      <Motion />
    </div>
  );
}
