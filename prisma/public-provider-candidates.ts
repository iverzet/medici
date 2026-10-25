export type PublicProviderCandidate = {
  name: string;
  slug: string;
  kind: "CLINIC" | "DOCTOR";
  description: string;
  sourceUrl: string;
  photoUrl?: string;
  publish: boolean;
  location: { city: string; address: string; phone?: string; email?: string };
  services: string[];
};

// Every entry is based on a public page controlled by the provider and retains that source link.
export const publicProviderCandidates: PublicProviderCandidate[] = [
  {
    name: "Dr. Ciprian Silaghi",
    slug: "dr-ciprian-silaghi-proctologie-brasov",
    kind: "DOCTOR",
    description: "Medic primar chirurgie generală prezentat de ProctoLaser Brașov, cu activitate în patologia proctologică.",
    sourceUrl: "https://proctolaser.ro/doctor/",
    photoUrl: "https://proctolaser.ro/wp-content/uploads/2026/07/DSC06820-768x1056.jpg",
    publish: true,
    location: { city: "Brașov", address: "Strada Stadionului 16, Brașov", phone: "+40743507131", email: "contact@proctolaser.ro" },
    services: ["Consultație proctologie", "Tratament hemoroizi", "Tratament fistulă anală"],
  },
  {
    name: "Clinica Everest",
    slug: "clinica-everest-bucuresti",
    kind: "CLINIC",
    description: "Clinică din București care prezintă servicii de proctologie, endoscopie și chirurgie generală pe site-ul oficial.",
    sourceUrl: "https://clinicaeverest.ro/",
    publish: true,
    location: { city: "București", address: "Aleea Circului nr. 1, bl. 1, sc. B, ap. 104, Sector 2, București", phone: "0787350888", email: "contact@clinicaeverest.ro" },
    services: ["Consultație proctologie", "Anuscopie", "Endoscopie digestivă"],
  },
  {
    name: "Centrul de Excelență în Proctologie MedLife",
    slug: "centrul-excelenta-proctologie-medlife-bucuresti",
    kind: "CLINIC",
    description: "Centru MedLife din București listat pe site-ul oficial cu servicii de proctologie.",
    sourceUrl: "https://www.medlife.ro/centrul-de-excelenta-proctologie",
    publish: true,
    location: { city: "București", address: "Șos. București-Ploiești nr. 10, București", phone: "0219646" },
    services: ["Consultație proctologie", "Videoanuscopie", "Tratament hemoroizi"],
  },
  {
    name: "Proctomed Cluj",
    slug: "proctomed-cluj-napoca",
    kind: "CLINIC",
    description: "Centru din Cluj-Napoca care prezintă pe pagina proprie consultații și tratamente de proctologie.",
    sourceUrl: "https://proctomedcluj.ro/contact/",
    publish: true,
    location: { city: "Cluj-Napoca", address: "Strada Emil Racoviță 54, Cluj-Napoca", phone: "+40741442431" },
    services: ["Consultație proctologie", "Tratament hemoroizi", "Tratament fisură anală"],
  },
  {
    name: "Medical On Group Timișoara · Proctoline",
    slug: "medical-on-group-proctoline-timisoara",
    kind: "CLINIC",
    description: "Clinică din Timișoara care listează servicii Proctoline pentru afecțiuni proctologice.",
    sourceUrl: "https://www.medicalongroup.ro/medical-on-group-timisoara/",
    publish: true,
    location: { city: "Timișoara", address: "Bulevardul Simion Bărnuțiu 7, Timișoara", phone: "+40256221219" },
    services: ["Consultație proctologie", "Tratament hemoroizi", "Tratament fisură anală"],
  },
  {
    name: "Centrul Medical Tudor Iași",
    slug: "centrul-medical-tudor-iasi-proctologie",
    kind: "CLINIC",
    description: "Centru medical din Iași care prezintă consultații și proceduri de proctologie pe pagina proprie.",
    sourceUrl: "https://iasi.centrulmedicaltudor.ro/proctologie/",
    publish: true,
    location: { city: "Iași", address: "Șoseaua Ciric 37, Iași", phone: "+40737999000", email: "iasi@centrulmedicaltudor.ro" },
    services: ["Consultație proctologică", "Tratament hemoroizi", "Tratament fistulă perianală"],
  },
  {
    name: "ProctoLaser Brașov",
    slug: "proctolaser-brasov",
    kind: "CLINIC",
    description: "Centru medical din Brașov care prezintă servicii de proctologie și chirurgie generală.",
    sourceUrl: "https://proctolaser.ro/",
    publish: true,
    location: { city: "Brașov", address: "Strada Stadionului 16, Brașov", phone: "+40743507131", email: "contact@proctolaser.ro" },
    services: ["Consultație proctologie", "Tratament hemoroizi", "Tratament fistulă anală"],
  },
  ...[
    ["Constanța", "Strada Tomis 142A, etajul 2, Constanța", "+40241548463"],
    ["Craiova", "Strada Arieș 3, Craiova", "+40251416641"],
    ["Oradea", "Strada Cuza Vodă 61, Oradea", "+40787757782"],
    ["Târgu Mureș", "Strada Revoluției 8, Târgu Mureș", "+40265311701"],
    ["Sibiu", "Strada Călugăreni 23, Sibiu", "+40269225556"],
    ["Baia Mare", "Strada 9 Mai 36, Baia Mare", "+40262212622"],
    ["Piatra Neamț", "Strada Lămâiței 22, Piatra Neamț", "+40233227750"],
    ["Râmnicu Vâlcea", "Calea lui Traian 148A, Râmnicu Vâlcea", "+40725291044"],
    ["Tulcea", "Strada Isaccei 31-34, etajul 1, Tulcea", "+40726676750"],
    ["Vaslui", "Bulevardul Traian 100, Vaslui", "+40729311922"],
    ["Botoșani", "Strada Independenței 5H, Botoșani", "+40729311922"],
  ].map(([city, address, phone]) => ({
    name: `Medical On Group ${city} · Proctoline`,
    slug: `medical-on-group-proctoline-${city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    kind: "CLINIC" as const,
    description: `Clinică Medical On Group din ${city} care prezintă servicii Proctoline pentru afecțiuni proctologice.`,
    sourceUrl: "https://www.medicalongroup.ro/medical-on-group-romania-2/",
    publish: true,
    location: { city, address, phone, email: "office@medicalongroup.ro" },
    services: ["Consultație proctologie", "Tratament hemoroizi", "Tratament fisură anală"],
  })),
];
