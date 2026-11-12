import type { MetadataRoute } from "next";
import { getCities, getDoctors } from "@/lib/catalog";
import { site } from "@/config/site";
import { blogArticles } from "@/lib/blog";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  return [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/pentru-clinici", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
    ...blogArticles.map((article) => ({ path: `/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.55 })),
    ...cities.map((city) => ({ path: `/${city.slug}`, changeFrequency: "weekly" as const, priority: doctors.some((doctor) => doctor.city === city.cityName && !doctor.isDemo) ? 0.8 : 0.55 })),
    ...doctors.filter((doctor) => !doctor.isDemo).map((doctor) => ({ path: `/medici/${doctor.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ].map(({ path, changeFrequency, priority }) => ({ url: new URL(path, site.url).href, changeFrequency, priority }));
}

