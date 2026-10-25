import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { publicProviderCandidates } from "./public-provider-candidates";

loadEnvConfig(process.cwd());

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Configurează DATABASE_URL înainte de import.");
if (process.env.ALLOW_PUBLIC_PROVIDER_IMPORT !== "true") throw new Error("Setează ALLOW_PUBLIC_PROVIDER_IMPORT=true pentru a confirma importul candidaților din surse publice.");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 2 }) });
const specialtyCode = "proctologie";
const specialtyName = "Proctologie";

async function main() {
  const specialty = await db.specialty.upsert({ where: { code: specialtyCode }, create: { code: specialtyCode, name: specialtyName }, update: { name: specialtyName } });
  let imported = 0;
  let skipped = 0;
  for (const candidate of publicProviderCandidates) {
    const existing = await db.provider.findUnique({ where: { slug: candidate.slug }, select: { id: true, isPublished: true, verification: true } });
    if (existing?.verification === "REJECTED") { skipped += 1; continue; }
    const provider = await db.provider.upsert({
      where: { slug: candidate.slug },
      create: {
        name: candidate.name, slug: candidate.slug, kind: candidate.kind, description: candidate.description,
        sourceUrl: candidate.sourceUrl, sourceCollectedAt: new Date(), isPublished: candidate.publish, verification: candidate.publish ? "VERIFIED" : "PENDING", verifiedAt: candidate.publish ? new Date() : null,
        locations: { create: candidate.location },
      },
      update: existing?.isPublished ? { sourceCollectedAt: new Date() } : { name: candidate.name, description: candidate.description, sourceUrl: candidate.sourceUrl, sourceCollectedAt: new Date(), isPublished: candidate.publish, verification: candidate.publish ? "VERIFIED" : "PENDING", verifiedAt: candidate.publish ? new Date() : null },
    });
    const locations = await db.location.count({ where: { providerId: provider.id } });
    if (locations === 0) await db.location.create({ data: { providerId: provider.id, ...candidate.location } });
    await db.providerSpecialty.upsert({ where: { providerId_specialtyId: { providerId: provider.id, specialtyId: specialty.id } }, create: { providerId: provider.id, specialtyId: specialty.id }, update: {} });
    for (const name of candidate.services) {
      const service = await db.service.findFirst({ where: { name } }) ?? await db.service.create({ data: { name } });
      await db.providerService.upsert({ where: { providerId_serviceId: { providerId: provider.id, serviceId: service.id } }, create: { providerId: provider.id, serviceId: service.id }, update: {} });
    }
    imported += 1;
  }
  console.info(`Import finalizat: ${imported} candidați actualizați, ${skipped} protejați.`);
}

main().finally(() => db.$disconnect());
