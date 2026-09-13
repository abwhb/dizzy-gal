import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Story } from "@/components/story";
import { sectionPages } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = sectionPages.story;

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/story",
});

export default function StoryPage() {
  return (
    <PageShell title={page.heading} kicker={page.kicker} doodle={page.doodle}>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/story" }])} />
      <Story scallop="#FF6A00" />
    </PageShell>
  );
}
