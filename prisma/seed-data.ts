export type Service = { name: string; price: number | null };
export type CatalogDoctor = {
  id: string; name: string; slug: string; title: string; kind: "DOCTOR" | "CLINIC";
  city: string; address: string; phone: string; email: string; description: string;
  sourceUrl?: string | null;
  photoUrl: string | null; rating: number | null; isFeatured: boolean; isDemo: boolean; services: Service[];
};
export type CatalogCity = { id: string; cityName: string; slug: string; metaTitle: string; metaDescription: string; contentIntro: string };

const cities = [
  ["București", "bucuresti"], ["Cluj-Napoca", "cluj"], ["Timișoara", "timisoara"],
  ["Iași", "iasi"], ["Brașov", "brasov"],
] as const;

export const seedCities: CatalogCity[] = cities.map(([cityName, slug]) => ({
  id: `demo-city-${slug}`, cityName, slug: `proctologi-${slug}`,
  metaTitle: `Proctologi și clinici de proctologie în ${cityName}`,
  metaDescription: `Descoperă specialiști și clinici de proctologie în ${cityName}. Compară serviciile, tarifele orientative și informațiile despre consultații.`,
  contentIntro: `Alegerea unui specialist începe cu informații clare. Explorează opțiunile de proctologie din ${cityName}, serviciile disponibile și tarifele orientative, într-un singur loc.`,
}));

export const seedDoctors: CatalogDoctor[] = seedCities.flatMap((city, index) => {
  const cityKey = cities[index][1];
  return [0, 1].map((position) => ({
    id: `demo-provider-${cityKey}-${position + 1}`,
    slug: `demo-${position === 0 ? "medic" : "clinica"}-${cityKey}`,
    name: position === 0 ? `Dr. Alex Exemplu — ${city.cityName}` : `Clinica Exemplu — ${city.cityName}`,
    title: position === 0 ? "Medic specialist chirurgie generală · profil demonstrativ" : "Centru de proctologie · profil demonstrativ",
    kind: position === 0 ? "DOCTOR" as const : "CLINIC" as const,
    city: city.cityName,
    address: `Strada Exemplului nr. ${index + position + 1}, ${city.cityName} (adresă fictivă)`,
    phone: "000 000 0000", email: `demo-${cityKey}-${position + 1}@example.invalid`,
    description: "Acesta este un profil fictiv, creat exclusiv pentru prezentarea platformei. Ilustrează modul în care pot fi afișate experiența, serviciile și tarifele unui partener. Nu reprezintă un profesionist sau o unitate medicală reală și nu poate primi programări.",
    photoUrl: null, rating: position === 0 ? 4.9 : 4.8,
    isFeatured: position === 0, isDemo: true,
    services: [
      { name: "Consultație inițială", price: 300 + index * 25 + position * 50 },
      { name: "Consultație de control", price: 200 + index * 20 },
      { name: "Anoscopie — tarif demonstrativ", price: 250 + position * 50 },
    ],
  }));
});
