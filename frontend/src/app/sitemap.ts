import type { MetadataRoute } from "next";
import { guideSlugs, site } from "@/lib/site";
import { legalPages } from "@/lib/legal";

// Written once at build time — the site is exported as plain files.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...guideSlugs().map((slug) => ({
      url: `${site.url}/steps/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/about`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    ...legalPages.map((p) => ({
      url: `${site.url}${p.href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
