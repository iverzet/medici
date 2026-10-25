export const municipalities = [
  "Alba Iulia", "Alexandria", "Arad", "Bacău", "Baia Mare", "Bistrița", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Călărași", "Cluj-Napoca", "Constanța", "Craiova", "Deva", "Drobeta-Turnu Severin", "Focșani", "Galați", "Giurgiu", "Iași", "Miercurea Ciuc", "Oradea", "Piatra Neamț", "Pitești", "Ploiești", "Râmnicu Vâlcea", "Reșița", "Satu Mare", "Sfântu Gheorghe", "Sibiu", "Slatina", "Slobozia", "Suceava", "Târgoviște", "Târgu Jiu", "Târgu Mureș", "Timișoara", "Tulcea", "Vaslui", "Zalău"
] as const;

export function isKnownMunicipality(cityName: string) { return municipalities.includes(cityName as typeof municipalities[number]); }

export function municipalitySlug(name: string, specialty: string) {
  return `${specialty}-${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

