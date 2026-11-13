import type { PublicProviderCandidate } from "./public-provider-candidates";

const profiles = [
  ["Dr. Cristian Bogdan Barta", "București", "https://www.reginamaria.ro/medici/dr-barta-cristian-bogdan"],
  ["Dr. Victor Grama", "București", "https://www.reginamaria.ro/medici/dr-grama-victor"],
  ["Dr. Alexandru Ilco", "București", "https://www.reginamaria.ro/medici/dr-ilco-alexandru"],
  ["Dr. Daniel Staniloaie", "București", "https://www.reginamaria.ro/medici/dr-staniloaie-daniel"],
  ["Dr. Petru Petrisor", "București", "https://www.reginamaria.ro/medici/dr-petrisor-petru"],
  ["Dr. Bogdan Popescu", "București", "https://www.reginamaria.ro/medici/dr-popescu-bogdan"],
  ["Dr. Silviu Makkai-Popa", "Brașov", "https://www.reginamaria.ro/medici/dr-makkai-popa-silviu"],
  ["Dr. Decebal Fodor", "Brașov", "https://www.reginamaria.ro/medici/dr-fodor-decebal"],
  ["Dr. Catalin Dumitrache", "Brașov", "https://www.reginamaria.ro/medici/dr-dumitrache-catalin"],
] as const;

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const reginaProctologyCandidates: PublicProviderCandidate[] = profiles.map(([name, city, sourceUrl]) => ({
  name,
  slug: `${slugify(name)}-proctologie-${slugify(city)}`,
  kind: "DOCTOR",
  description: `${name} este listat(ă) pe pagina oficială Regina Maria cu competență în chirurgie proctologică și consultații în ${city}. Locația exactă se confirmă prin programarea rețelei.`,
  sourceUrl,
  publish: true,
  location: { city, address: `Regina Maria ${city} — locația exactă se confirmă la programare`, phone: "+40219268" },
  services: ["Consultație proctologie", "Control proctologie", "Chirurgie proctologică"],
}));
