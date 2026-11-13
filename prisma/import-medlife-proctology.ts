import { loadEnvConfig } from "@next/env";
import dns from "node:dns";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Configurează DATABASE_URL înainte de import.");
if (process.env.ALLOW_PUBLIC_PROVIDER_IMPORT !== "true") throw new Error("Setează ALLOW_PUBLIC_PROVIDER_IMPORT=true pentru a confirma importul din surse publice.");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 2 }) });
const sourceBase = "https://www.medlife.ro";

type JsonLd = Record<string, unknown>;
type Candidate = {
  name: string;
  slug: string;
  description: string;
  sourceUrl: string;
  photoUrl?: string;
  location: { city: string; address: string; phone?: string };
  services: string[];
};

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&icirc;/g, "î")
    .replace(/&acirc;/g, "â")
    .replace(/&atilde;/g, "ă")
    .replace(/&scedil;/g, "ș")
    .replace(/&tcedil;/g, "ț");
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function jsonLdFrom(html: string): JsonLd | null {
  const match = html.match(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as JsonLd;
  } catch {
    return null;
  }
}

function firstString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function getList() {
  const urls = new Map<string, string>();
  for (const page of [0, 1, 2]) {
    const response = await fetch(`${sourceBase}/medici/proctologie?page=${page}`, { headers: { "user-agent": "proctologi-public-catalog/1.0" } });
    if (!response.ok) throw new Error(`MedLife listă indisponibilă (${response.status}).`);
    const data = jsonLdFrom(await response.text());
    const graph = Array.isArray(data?.["@graph"]) ? data?.["@graph"] as JsonLd[] : [];
    const list = graph.find((item) => item["@type"] === "ItemList");
    const items = Array.isArray(list?.itemListElement) ? list?.itemListElement as JsonLd[] : [];
    for (const item of items) {
      const physician = item.item as JsonLd | undefined;
      const name = firstString(physician?.name);
      const url = firstString(physician?.url);
      if (name && url) urls.set(url.replace(/\/$/, ""), name);
    }
  }
  return urls;
}

async function getCandidate(url: string, listedName: string): Promise<Candidate | null> {
  const response = await fetch(url, { headers: { "user-agent": "proctologi-public-catalog/1.0" } });
  if (!response.ok) return null;
  const html = await response.text();
  const data = jsonLdFrom(html);
  if (!data || data["@type"] !== "Physician") return null;
  const name = firstString(data.name) || listedName;
  const address = data.address as JsonLd | undefined;
  const city = firstString(address?.addressLocality);
  const street = firstString(address?.streetAddress);
  if (!city || !street) return null;
  const services = Array.isArray(data.availableService)
    ? (data.availableService as JsonLd[]).map((service) => firstString(service.name)).filter((service): service is string => Boolean(service)).slice(0, 8)
    : [];
  const normalizedServices = Array.from(new Set(["Consultație proctologie", ...services]));
  const displayName = name.startsWith("Dr.") ? name : `Dr. ${name}`;
  const description = firstString(data.description) || `${displayName} este listat(ă) în directorul oficial MedLife cu servicii de proctologie în ${city}.`;
  const image = firstString(data.image);
  const telephone = firstString(data.telephone);
  return {
    name: displayName,
    slug: `${slugify(displayName)}-proctologie-${slugify(city)}`,
    description: decodeHtml(description),
    sourceUrl: url,
    photoUrl: image,
    location: { city, address: street, phone: telephone },
    services: normalizedServices,
  };
}

async function importCandidate(candidate: Candidate, specialtyId: string) {
  const existing = await db.provider.findUnique({ where: { slug: candidate.slug }, select: { id: true, verification: true } });
  if (existing?.verification === "REJECTED") return false;
  const provider = await db.provider.upsert({
    where: { slug: candidate.slug },
    create: {
      name: candidate.name,
      slug: candidate.slug,
      kind: "DOCTOR",
      description: candidate.description,
      photoUrl: candidate.photoUrl,
      sourceUrl: candidate.sourceUrl,
      sourceCollectedAt: new Date(),
      isPublished: true,
      verification: "VERIFIED",
      verifiedAt: new Date(),
      locations: { create: candidate.location },
    },
    update: {
      name: candidate.name,
      description: candidate.description,
      photoUrl: candidate.photoUrl,
      sourceUrl: candidate.sourceUrl,
      sourceCollectedAt: new Date(),
      isPublished: true,
      verification: "VERIFIED",
      verifiedAt: new Date(),
    },
  });
  const locationExists = await db.location.findFirst({ where: { providerId: provider.id, city: candidate.location.city, address: candidate.location.address } });
  if (!locationExists) await db.location.create({ data: { providerId: provider.id, ...candidate.location } });
  await db.providerSpecialty.upsert({ where: { providerId_specialtyId: { providerId: provider.id, specialtyId } }, create: { providerId: provider.id, specialtyId }, update: {} });
  for (const name of candidate.services) {
    const service = await db.service.findFirst({ where: { name } }) ?? await db.service.create({ data: { name } });
    await db.providerService.upsert({ where: { providerId_serviceId: { providerId: provider.id, serviceId: service.id } }, create: { providerId: provider.id, serviceId: service.id }, update: {} });
  }
  return true;
}

async function main() {
  const specialty = await db.specialty.upsert({ where: { code: "proctologie" }, create: { code: "proctologie", name: "Proctologie" }, update: { name: "Proctologie" } });
  const listed = await getList();
  let imported = 0;
  for (const [url, name] of listed) {
    const candidate = await getCandidate(url, name);
    if (candidate && await importCandidate(candidate, specialty.id)) imported += 1;
  }
  console.info(`Import MedLife proctologie finalizat: ${imported} profiluri oficiale procesate din ${listed.size} listate.`);
}

main().finally(() => db.$disconnect());
