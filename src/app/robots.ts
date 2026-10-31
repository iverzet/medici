import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/medici/demo-"] },
    sitemap: new URL("/sitemap.xml", site.url).href,
    host: site.url,
  };
}
