import "server-only";
import { cache } from "react";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { site } from "@/config/site";
import { municipalities, municipalitySlug } from "@/lib/municipalities";
import { seedCities, seedDoctors, type CatalogCity, type CatalogDoctor } from "../../prisma/seed-data";

export const demoMode = process.env.DEMO_MODE === "true";
const servicesSchema = z.array(z.object({ name: z.string(), price: z.number().nonnegative() }));
const municipalityCities: CatalogCity[] = municipalities.map((cityName) => ({
  id: `municipality-${cityName}`,
  cityName,
  slug: municipalitySlug(cityName, site.name.startsWith("Andrologi") ? "andrologi" : "proctologi"),
  metaTitle: `${site.name} în ${cityName}`,
  metaDescription: `Găsește informații și opțiuni de programare pentru ${site.specialty} în ${cityName}.`,
  contentIntro: `Explorează opțiunile disponibile pentru ${site.specialty} în ${cityName} și cere o programare confidențială.`,
}));
function withMunicipalities(cities: CatalogCity[]) {
  const known = new Set(cities.map((city) => city.slug));
  return [...cities, ...municipalityCities.filter((city) => !known.has(city.slug))];
}
export const getCities = cache(async (): Promise<CatalogCity[]> => {
  if (demoMode) return withMunicipalities(seedCities);
  try {
    return withMunicipalities(await getDb().cityPage.findMany({ orderBy: { cityName: "asc" } }));
  } catch (error) {
    console.warn("[catalog] Database unavailable, using seed cities", error);
    return withMunicipalities(seedCities);
  }
});
export const getDoctors = cache(async (): Promise<CatalogDoctor[]> => {
  if (demoMode) return seedDoctors;
  let doctors;
  try {
    doctors = await getDb().doctor.findMany({ orderBy: [{ isFeatured: "desc" }, { name: "asc" }] });
  } catch (error) {
    console.warn("[catalog] Database unavailable, using seed doctors", error);
    return seedDoctors;
  }
  return doctors.flatMap((doctor) => {
    const services = servicesSchema.safeParse(doctor.services);
    if (!services.success) {
      console.warn(`[catalog] Ignoring doctor ${doctor.id}: invalid services JSON`);
      return [];
    }
    return [{ ...doctor, rating: doctor.rating === null ? null : Number(doctor.rating), services: services.data }];
  });
});
export const getCity = cache(async (slug: string) => (await getCities()).find((city) => city.slug === slug));
export const getDoctor = cache(async (slug: string) => (await getDoctors()).find((doctor) => doctor.slug === slug));
export function filterDoctors(doctors: CatalogDoctor[], kind: string, service: string) {
  return doctors.filter((doctor) => (!kind || doctor.kind === kind) && (!service || doctor.services.some((item) => item.name === service)));
}
