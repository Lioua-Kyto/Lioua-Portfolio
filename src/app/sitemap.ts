import type { MetadataRoute } from "next";
import { content } from "@/content";

/**
 * The homepage plus a page per project.
 *
 * The privacy policy is deliberately absent: it is `noindex`, and listing a
 * page you have asked not to be indexed is a mixed signal, not thoroughness.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${content.site.domain}`;
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    ...content.work.map((item) => ({
      url: `${base}/work/${item.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
