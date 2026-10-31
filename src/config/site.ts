export const site = {
  name: "Proctologi.ro",
  email: "contact@proctologi.ro",
  // Production is indexable by default. Set SITE_INDEXABLE=false only for a
  // staging environment or while an incident requires temporary de-indexing.
  indexable: process.env.SITE_INDEXABLE !== "false",
  specialty: "proctologie",
  specialistLabel: "Proctologi",
  locale: "ro_RO",
  description: "Găsește medici și clinici de proctologie în orașul tău. Compară servicii și trimite o cerere de contact în siguranță.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://proctologi.ro",
} as const;
