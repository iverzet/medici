import type { MetadataRoute } from "next";
import { getCities, getDoctors } from "@/lib/catalog";
import { site } from "@/config/site";
import { blogArticles } from "@/lib/blog";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const paths = ["/", "/blog", ...blogArticles.map((article) => "/blog/" + article.slug), "/pentru-clinici", "/confidentialitate", "/termeni", ...cities.map((city) => "/" + city.slug), ...doctors.filter((doctor) => !doctor.isDemo).map((doctor) => "/medici/" + doctor.slug)];
  return paths.map((path) => ({ url: new URL(path, site.url).href, changeFrequency: "weekly", priority: path === "/" ? 1 : 0.7 }));
}
