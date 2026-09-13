import { Feed } from "@/components/feed";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { sectionPages } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = sectionPages.feed;

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/feed",
});

export default function FeedPage() {
  return (
    <PageShell title={page.heading} kicker={page.kicker} doodle={page.doodle}>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/feed" }])} />
      <Feed />
    </PageShell>
  );
}
