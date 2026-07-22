import type { MetadataRoute } from "next";
import { content } from "@/content";

/** Robots: everything crawlable, sitemap advertised (§7, Phase 6). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${content.site.domain}/sitemap.xml`,
  };
}
