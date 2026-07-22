import type { MetadataRoute } from "next";
import { content } from "@/content";

/** Sitemap: the homepage only until v3 routes exist. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `https://${content.site.domain}`, priority: 1 }];
}
