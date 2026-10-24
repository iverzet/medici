export type PublicProviderCandidate = {
  name: string;
  slug: string;
  kind: "CLINIC" | "DOCTOR";
  description: string;
  sourceUrl: string;
  location: { city: string; address: string; phone?: string; email?: string };
  services: string[];
};

// Public sources are retained for verification. Imported candidates stay unpublished.
export const publicProviderCandidates: PublicProviderCandidate[] = [
  {
    name: "Clinica Everest",
    slug: "clinica-everest-bucuresti",
    kind: "CLINIC",
    description: "Clinică din București care prezintă servicii de proctologie, endoscopie și chirurgie generală pe site-ul oficial.",
    sourceUrl: "https://clinicaeverest.ro/",
    location: { city: "București", address: "Aleea Circului nr. 1, bl. 1, sc. B, ap. 104, Sector 2, București", phone: "0787350888", email: "contact@clinicaeverest.ro" },
    services: ["Consultație proctologie", "Anuscopie", "Endoscopie digestivă"],
  },
  {
    name: "Centrul de Excelență în Proctologie MedLife",
    slug: "centrul-excelenta-proctologie-medlife-bucuresti",
    kind: "CLINIC",
    description: "Centru MedLife din București listat pe site-ul oficial cu servicii de proctologie.",
    sourceUrl: "https://www.medlife.ro/centrul-de-excelenta-proctologie",
    location: { city: "București", address: "Șos. București-Ploiești nr. 10, București", phone: "0219646" },
    services: ["Consultație proctologie", "Videoanuscopie", "Tratament hemoroizi"],
  },
];
