import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { site } from "@/config/site";
import { urbanCities } from "@/lib/romanian-cities";
import { seedCities, seedDoctors, type CatalogCity, type CatalogDoctor } from "../../prisma/seed-data";

export function isDemoMode() { return process.env.DEMO_MODE === "true"; }
export const demoMode = isDemoMode();
const urbanLocalityCities: CatalogCity[] = urbanCities.map((city) => ({
  id: `urban-city-${city.slug}`,
  cityName: city.name,
  slug: `${site.name.startsWith("Andrologi") ? "andrologi" : "proctologi"}-${city.slug}`,
  countyCode: city.countyCode,
  metaTitle: `${site.name} în ${city.name}`,
  metaDescription: `Găsește informații și opțiuni de programare pentru ${site.specialty} în ${city.name}.`,
  contentIntro: `Explorează opțiunile disponibile pentru ${site.specialty} în ${city.name} și cere o programare confidențială.`,
  isMunicipality: city.isMunicipality,
}));

function cityKey(cityName: string) {
  return cityName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ro-RO");
}

function publicRomanianPhone(value: string | null) {
  if (!value) return "";
  const compact = value.replace(/[ ()-]/g, "");
  if (/^0040[2-9]\d{8}$/.test(compact)) return `+40${compact.slice(4)}`;
  if (/^0[2-9]\d{8}$/.test(compact)) return `+40${compact.slice(1)}`;
  return /^\+40[2-9]\d{8}$/.test(compact) ? compact : "";
}

function withMunicipalities(cities: CatalogCity[]) {
  const knownNames = new Set(cities.map((city) => cityKey(city.cityName)));
  const metadata = new Map(urbanLocalityCities.map((city) => [cityKey(city.cityName), city]));
  const existing = cities.map((city) => ({ ...city, countyCode: city.countyCode ?? metadata.get(cityKey(city.cityName))?.countyCode, isMunicipality: city.isMunicipality ?? metadata.get(cityKey(city.cityName))?.isMunicipality }));
  return [...existing, ...urbanLocalityCities.filter((city) => !knownNames.has(cityKey(city.cityName)))];
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
        phone: publicRomanianPhone(location.phone), email: location.email || "", description: provider.description, sourceUrl: provider.sourceUrl,
        photoUrl: provider.photoUrl, rating: null, isFeatured: false, isDemo: false,
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

export function getSuggestedCities(city: CatalogCity, cities: CatalogCity[], doctors: CatalogDoctor[], limit = 3) {
  const providerCities = new Set(doctors.filter((doctor) => !doctor.isDemo).map((doctor) => cityKey(doctor.city)));
  const candidates = cities.filter((candidate) => candidate.cityName !== city.cityName && providerCities.has(cityKey(candidate.cityName)));
  const sameCounty = candidates.filter((candidate) => candidate.countyCode && candidate.countyCode === city.countyCode);
  return (sameCounty.length > 0 ? sameCounty : candidates).slice(0, limit);
}
