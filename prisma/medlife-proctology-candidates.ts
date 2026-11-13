import type { PublicProviderCandidate } from "./public-provider-candidates";

const source = "https://www.medlife.ro/medici/proctologie";

const profiles = [
  ["Dr. Alkadour Abdullah", "București", "Calea Griviței, nr. 359, București", "021 9646", "https://www.medlife.ro/medic-alkadour-abdullah", "https://www.medlife.ro/sites/default/files/poza_profil/abdullah-alkadour.jpg"],
  ["Dr. Ghenea Adrian", "București", "Șos. București Ploiești Nr.10, București", "021 9646", "https://www.medlife.ro/medic-ghenea-adrian", "https://www.medlife.ro/sites/default/files/poza_profil/ghenea-adrian.jpg"],
  ["Dr. Golia Ciprian", "București", "Șos. București Ploiești Nr.10, București", "021 9646", "https://www.medlife.ro/medic-golia-ciprian", "https://www.medlife.ro/sites/default/files/poza_profil/golia-ciprian.jpg"],
  ["Dr. Ionescu Andreea Marilena", "București", "Calea Griviței nr. 365, București", "021 9646", "https://www.medlife.ro/medic-ionescu-andreea-marilena", "https://www.medlife.ro/sites/default/files/poza_profil/ionescu-andreea-marilena-0.jpg"],
  ["Dr. Panfiloiu Aida-Gabriela", "București", "Calea Griviței, nr. 359, București", "021 9646", "https://www.medlife.ro/medic-panfiloiu-aida-gabriela", "https://www.medlife.ro/sites/default/files/poza_profil/panfiloiu-aida-gabriela.jpg"],
  ["Dr. Radu Viorel", "București", "Calea Griviței, nr. 359, București", "021 9646", "https://www.medlife.ro/medic-radu-viorel", "https://www.medlife.ro/sites/default/files/poza_profil/radu-viorel-0.png"],
  ["Dr. Toba Madalina Elena", "București", "Șos. București Ploiești Nr.10, București", "021 9646", "https://www.medlife.ro/medic-toba-madalina-elena", "https://www.medlife.ro/sites/default/files/poza_profil/toba-madalina-elena.jpg"],
  ["Dr. Botezatu Ion", "Arad", "Str. Dr. Cornel Radu nr. 3, Arad", "0257 960", "https://www.medlife.ro/medic-botezatu-ion", "https://www.medlife.ro/sites/default/files/poza_profil/botezatu-ion.jpg"],
  ["Dr. Bud Ioan Andrei", "Arad", "Str. Dr. Cornel Radu nr. 3, Arad", "0257 960", "https://www.medlife.ro/medic-bud-ioan-andrei", "https://www.medlife.ro/sites/default/files/poza_profil/bud-ioan-andrei.jpg"],
  ["Dr. Ciurdariu Daniel Rares", "Arad", "Str. Dr. Cornel Radu nr. 3, Arad", "0257 960", "https://www.medlife.ro/medic-ciurdariu-daniel-rares", "https://www.medlife.ro/sites/default/files/poza_profil/ciurdariu-daniel-rares.jpg"],
  ["Dr. Beznea Adrian", "Galați", "Strada Nicolae Bălcescu Nr. 24A, Galați", "0236 960", "https://www.medlife.ro/medic-beznea-adrian", "https://www.medlife.ro/sites/default/files/poza_profil/beznea-adrian.jpg"],
  ["Dr. Constantin Georgiana Bianca", "Galați", "Strada Nicolae Bălcescu Nr. 24A, Galați", "0236 960", "https://www.medlife.ro/medic-constantin-georgiana-bianca", "https://www.medlife.ro/sites/default/files/poza_profil/constantin-georgiana-bianca.png"],
  ["Dr. Morar Liviu", "Galați", "Strada Nicolae Bălcescu Nr. 24A, Galați", "0236 960", "https://www.medlife.ro/medic-morar-liviu", "https://www.medlife.ro/sites/default/files/poza_profil/morar-liviu.png"],
  ["Dr. Scarlat Valentin", "Galați", "Strada Nicolae Bălcescu Nr. 24A, Galați", "0236 960", "https://www.medlife.ro/medic-scarlat-valentin", "https://www.medlife.ro/sites/default/files/poza_profil/scarlat-valentin.jpg"],
  ["Dr. Trus Constantin", "Galați", "Strada Nicolae Bălcescu Nr. 24A, Galați", "0236 960", "https://www.medlife.ro/medic-trus-constantin", "https://www.medlife.ro/sites/default/files/poza_profil/trus-constantin.jpg"],
  ["Dr. Bolocan Mihai", "Pitești", "Calea Craiovei nr. 44-46, Pitești", "0248 950", "https://www.medlife.ro/medic-bolocan-mihai", "https://www.medlife.ro/sites/default/files/poza_profil/bolocan-mihai.png"],
  ["Dr. Iliescu-Cosma Alexandru Marcel", "Deva", "Bulevardul Iuliu Maniu nr. 2, Deva", "0254 960", "https://www.medlife.ro/medic-iliescu-cosma-alexandru-marcel", "https://www.medlife.ro/sites/default/files/poza_profil/iliescu-cosma-alexandru-marcel.jpg"],
  ["Dr. Zirbo Radu", "Deva", "Bulevardul Iuliu Maniu nr. 2, Deva", "0254 960", "https://www.medlife.ro/medic-zirbo-radu", "https://www.medlife.ro/sites/default/files/poza_profil/zirbo-radu.jpg"],
  ["Dr. Stanca Marius Horatiu", "Cluj-Napoca", "Calea Moților Nr. 32, Cluj-Napoca", "0264 960", "https://www.medlife.ro/medic-stanca-marius-horatiu", "https://www.medlife.ro/sites/default/files/poza_profil/stanca-marius-horatiu.jpg"],
  ["Dr. Marginean Andrei", "Timișoara", "Bdul Eroilor de la Tisa, Nr. 28, Timișoara", "0256 960", "https://www.medlife.ro/medic-marginean-andrei", "https://www.medlife.ro/sites/default/files/poza_profil/marginean-andrei.jpg"],
  ["Dr. Stoica Laurian", "Timișoara", "Bul. Circumvalațiunii nr. 8-10 etaj 1, Timișoara", "0356 911", "https://www.medlife.ro/medic-stoica-laurian", "https://www.medlife.ro/sites/default/files/poza_profil/stoica-laurian.png"],
  ["Dr. Tarta-Marcu Dorin-Cristi", "Timișoara", "Bdul Eroilor de la Tisa, Nr. 28, Timișoara", "0256 960", "https://www.medlife.ro/asistent-tarta-marcu-dorin-cristi", "https://www.medlife.ro/sites/default/files/poza_profil/tarta-marcu-dorin-cristi.jpg"],
  ["Dr. Savin Silvia", "Constanța", "Bulevardul Tomis Nr. 79-81, Constanța", "0241 960", "https://www.medlife.ro/medic-savin-silvia", "https://www.medlife.ro/sites/default/files/poza_profil/savin-silvia.jpg"],
  ["Dr. Mihele Ramona Carmencita", "Oradea", "Piața Cetății nr. 1, Oradea", "0259 960", "https://www.medlife.ro/medic-mihele-ramona-carmencita", "https://www.medlife.ro/sites/default/files/poza_profil/mihele-ramona-carmencita.png"],
  ["Dr. Lepadatu Liana", "Brăila", "Aleea Parcului Nr. 2 Bl. A1 Bis, parter, Brăila", "0239 960", "https://www.medlife.ro/medic-lepadatu-liana", "https://www.medlife.ro/sites/default/files/poza_profil/lepadatu-liana.jpg"],
  ["Dr. Toma Alexandra", "Brăila", "Aleea Parcului Nr. 2 Bl. A1 Bis, parter, Brăila", "0239 960", "https://www.medlife.ro/medic-toma-alexandra"],
] as const;

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const medlifeProctologyCandidates: PublicProviderCandidate[] = profiles.map(([name, city, address, phone, sourceUrl, photoUrl]) => ({
  name,
  slug: `${slugify(name)}-proctologie-${slugify(city)}`,
  kind: "DOCTOR",
  description: `${name} este listat(ă) în directorul oficial MedLife cu servicii de proctologie în ${city}. Informațiile sunt preluate de pe pagina furnizorului și trebuie reconfirmate înainte de programare.`,
  sourceUrl: sourceUrl || source,
  photoUrl,
  publish: true,
  location: { city, address, phone },
  services: ["Consultație proctologie", "Anuscopie", "Tratament hemoroizi"],
}));
