import type { MetadataRoute } from "next";
import { getCities, getDoctors } from "@/lib/catalog";
import { site } from "@/config/site";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const activeCities = cities.filter((city) => doctors.some((doctor) => doctor.city === city.cityName && !doctor.isDemo));
  const now = new Date();
  return [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/pentru-clinici", changeFrequency: "monthly" as const, priority: 0.5 },
    ...activeCities.map((city) => ({ path: `/${city.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...doctors.filter((doctor) => !doctor.isDemo).map((doctor) => ({ path: `/medici/${doctor.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ].map(({ path, changeFrequency, priority }) => ({ url: new URL(path, site.url).href, lastModified: now, changeFrequency, priority }));
}

