import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/story"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/reviews"), lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/feed"), lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: absoluteUrl("/shipping"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
