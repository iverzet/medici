export const site = {
  name: "Proctologi.ro",
  email: "contact@proctologi.ro",
  indexable: process.env.SITE_INDEXABLE !== "false",
  specialty: "proctologie",
  locale: "ro_RO",
  description: "Găsește medici și clinici de proctologie în orașul tău. Explorează serviciile și tarifele într-un singur loc.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://proctologi.ro",
} as const;
