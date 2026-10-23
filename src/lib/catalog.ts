import "server-only";
import { cache } from "react";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { seedCities, seedDoctors, type CatalogCity, type CatalogDoctor } from "../../prisma/seed-data";

export const demoMode = process.env.DEMO_MODE === "true";
const servicesSchema = z.array(z.object({ name: z.string(), price: z.number().nonnegative() }));
export const getCities = cache(async (): Promise<CatalogCity[]> => {
  if (demoMode) return seedCities;
  return getDb().cityPage.findMany({ orderBy: { cityName: "asc" } });
});
export const getDoctors = cache(async (): Promise<CatalogDoctor[]> => {
  if (demoMode) return seedDoctors;
  const doctors = await getDb().doctor.findMany({ orderBy: [{ isFeatured: "desc" }, { name: "asc" }] });
  return doctors.flatMap((doctor) => {
    const services = servicesSchema.safeParse(doctor.services);
    if (!services.success) {
      console.warn(`[catalog] Ignoring doctor ${doctor.id}: invalid services JSON`);
      return [];
    }
    return [{ ...doctor, rating: doctor.rating === null ? null : Number(doctor.rating), services: services.data }];
  });
});
export const getCity = cache(async (slug: string) => (await getCities()).find((city) => city.slug === slug));
export const getDoctor = cache(async (slug: string) => (await getDoctors()).find((doctor) => doctor.slug === slug));
export function filterDoctors(doctors: CatalogDoctor[], kind: string, service: string) {
  return doctors.filter((doctor) => (!kind || doctor.kind === kind) && (!service || doctor.services.some((item) => item.name === service)));
}
