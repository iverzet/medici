import type { Metadata } from "next";
import { site } from "@/config/site";
import type { CatalogDoctor } from "../../prisma/seed-data";

export function pageMetadata(title: string, description: string, path: string, noindex = !site.indexable): Metadata {
  const url = new URL(path, site.url).href;
  return {
    title, description, alternates: { canonical: url },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: { index: !noindex, follow: !noindex, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: { title, description, url, siteName: site.name, locale: site.locale, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
export function providerSchema(doctor: CatalogDoctor) {
  return {
    "@type": doctor.kind === "DOCTOR" ? "Physician" : "MedicalBusiness",
    "@id": new URL(`/medici/${doctor.slug}#provider`, site.url).href,
    name: doctor.name, description: doctor.description,
    url: new URL(`/medici/${doctor.slug}`, site.url).href,
    telephone: doctor.phone,
    address: { "@type": "PostalAddress", streetAddress: doctor.address, addressLocality: doctor.city, addressCountry: "RO" },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
