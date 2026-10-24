export const municipalities = [
  "Alba Iulia", "Alexandria", "Arad", "Bacău", "Baia Mare", "Bârlad", "Bistrița", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Calafat", "Caracal", "Călărași", "Câmpia Turzii", "Câmpina", "Câmpulung", "Cluj-Napoca", "Constanța", "Craiova", "Curtea de Argeș", "Dej", "Deva", "Dorohoi", "Drăgășani", "Făgăraș", "Fetești", "Focșani", "Galați", "Gherla", "Giurgiu", "Huși", "Hunedoara", "Iași", "Lugoj", "Mangalia", "Marghita", "Medgidia", "Mediaș", "Miercurea Ciuc", "Moinești", "Motru", "Odorheiu Secuiesc", "Oltenița", "Onești", "Oradea", "Orăștie", "Panciu", "Pașcani", "Petroșani", "Piatra Neamț", "Pitești", "Ploiești", "Rădăuți", "Reghin", "Reșița", "Roman", "Roșiorii de Vede", "Râmnicu Sărat", "Râmnicu Vâlcea", "Salonta", "Satu Mare", "Sebeș", "Săcele", "Sighișoara", "Sibiu", "Sighetu Marmației", "Slatina", "Slobozia", "Sovata", "Suceava", "Târgoviște", "Târgu Jiu", "Târgu Mureș", "Târgu Neamț", "Târgu Secuiesc", "Târgu-Ocna", "Tecuci", "Timișoara", "Toplița", "Tulcea", "Turda", "Turnu Măgurele", "Urziceni", "Vaslui", "Vatra Dornei", "Victoria", "Voluntari", "Zalău"
] as const;

export function isKnownMunicipality(cityName: string) { return municipalities.includes(cityName as typeof municipalities[number]); }

export function municipalitySlug(name: string, specialty: string) {
  return `${specialty}-${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

