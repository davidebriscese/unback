import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The API and the spec are for programs, not crawlers — keep them out of the index.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/openapi/"] }],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
