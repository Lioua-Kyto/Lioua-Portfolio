import type { MetadataRoute } from "next";
import { content } from "@/content";

/** The homepage plus a page per project. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${content.site.domain}`;
  return [
    { url: base, priority: 1 },
    ...content.work.map((item) => ({
      url: `${base}/work/${item.slug}`,
      priority: 0.8,
    })),
  ];
}
