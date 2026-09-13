import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { Reviews } from "@/components/reviews";
import { sectionPages } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const page = sectionPages.reviews;

export const metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <PageShell title={page.heading} kicker={page.kicker} doodle={page.doodle}>
      <JsonLd data={breadcrumbJsonLd([{ name: page.title, path: "/reviews" }])} />
      <Reviews scallop="#FF6A00" />
    </PageShell>
  );
}
