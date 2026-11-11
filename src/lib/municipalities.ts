import { urbanCities } from "@/lib/romanian-cities";

export const municipalities = urbanCities.map((city) => city.name);

export function isKnownMunicipality(cityName: string) { return municipalities.includes(cityName as typeof municipalities[number]); }

export function municipalitySlug(name: string, specialty: string) {
  return `${specialty}-${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

