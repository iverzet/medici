import type { MetadataRoute } from "next";
import { getCities, getDoctors } from "@/lib/catalog";
import { site } from "@/config/site";
import { blogArticles } from "@/lib/blog";
import { municipalities, municipalitySlug } from "@/lib/municipalities";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const activeCities = cities.filter((city) => doctors.some((doctor) => doctor.city === city.cityName && !doctor.isDemo));
  const paths = ["/", "/blog", ...blogArticles.map((article) => "/blog/" + article.slug), "/pentru-clinici", "/confidentialitate", "/termeni", ...activeCities.map((city) => "/" + city.slug), ...doctors.filter((doctor) => !doctor.isDemo).map((doctor) => "/medici/" + doctor.slug)];
  return paths.map((path) => ({ url: new URL(path, site.url).href, changeFrequency: "weekly", priority: path === "/" ? 1 : 0.7 }));
}

