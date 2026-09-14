import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Written once at build time — the site is exported as plain files.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
