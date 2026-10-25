import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { site } from "@/config/site";
import { municipalities, municipalitySlug } from "@/lib/municipalities";
import { seedCities, seedDoctors, type CatalogCity, type CatalogDoctor } from "../../prisma/seed-data";

export function isDemoMode() { return process.env.DEMO_MODE === "true"; }
export const demoMode = isDemoMode();
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
    console.warn("[catalog] Database unavailable, serving municipality directory without profiles", error);
    return withMunicipalities([]);
  }
});
export const getDoctors = cache(async (): Promise<CatalogDoctor[]> => {
  if (demoMode) return seedDoctors;
  try {
    const providers = await getDb().provider.findMany({
      where: { isPublished: true, verification: "VERIFIED" },
      include: { locations: { orderBy: { city: "asc" }, take: 1 }, services: { include: { service: true } } },
      orderBy: { name: "asc" },
    });
    return providers.flatMap((provider): CatalogDoctor[] => {
      const location = provider.locations[0];
      if (!location) {
        console.warn(`[catalog] Ignoring provider ${provider.id}: no public location`);
        return [];
      }
      return [{
        id: provider.id, name: provider.name, slug: provider.slug,
        title: provider.kind === "DOCTOR" ? "Medic" : "Clinică",
        kind: provider.kind, city: location.city, address: location.address,
        phone: location.phone || "", email: location.email || "", description: provider.description, sourceUrl: provider.sourceUrl,
        photoUrl: null, rating: null, isFeatured: false, isDemo: false,
        services: provider.services.map(({ service, minPrice }) => ({ name: service.name, price: minPrice ?? service.minPrice ? Number(minPrice ?? service.minPrice) : null })),
      }];
    });
  } catch (error) {
    console.warn("[catalog] Database unavailable, serving no profiles", error);
    return [];
  }
});
export const getCity = cache(async (slug: string) => (await getCities()).find((city) => city.slug === slug));
export const getDoctor = cache(async (slug: string) => (await getDoctors()).find((doctor) => doctor.slug === slug));
export function filterDoctors(doctors: CatalogDoctor[], kind: string, service: string) {
  return doctors.filter((doctor) => (!kind || doctor.kind === kind) && (!service || doctor.services.some((item) => item.name === service)));
}
