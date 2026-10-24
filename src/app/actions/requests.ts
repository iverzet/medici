"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { leadSchema, partnershipSchema, submissionSchema, normalizePhone, validPreferredDate, type ActionResult } from "@/lib/validation";
import { consumeLimit, requestIdentity } from "@/lib/rate-limit";
import { deliverNotification } from "@/lib/notifications";
import { demoMode, getCities } from "@/lib/catalog";

const failed = { ok: false, message: "Solicitarea nu a putut fi salvată. Încearcă din nou în câteva momente." };
const invalid = { ok: false, message: "Verifică datele completate și acordul pentru contact." };
const success = (id: string): ActionResult => ({ ok: true, reference: id, message: "Solicitarea a fost înregistrată. Aceasta nu reprezintă o programare confirmată. Echipa te va contacta pentru detalii." });

export async function submitLead(input: unknown, meta: unknown): Promise<ActionResult> {
  const data = leadSchema.safeParse(input);
  const metadata = submissionSchema.safeParse(meta);
  if (!data.success || !metadata.success || metadata.data.website || !validPreferredDate(data.data.preferredDate)) return invalid;
  const { requestId, doctorId } = metadata.data;
  try {
    if (demoMode) return { ok: false, message: "Trimiterea este dezactivată în modul demonstrativ." };
    const db = getDb();
    if (!(await consumeLimit("lead-ip", await requestIdentity(), 10, 900))) return { ok: false, message: "Prea multe solicitări. Te rugăm să revii peste 15 minute." };
    const existing = await db.lead.findUnique({ where: { submissionKey: requestId }, select: { id: true } });
    if (existing) return success(existing.id);
    if (!(await getCities()).some((city) => city.cityName === data.data.city)) return invalid;
    if (doctorId) {
      const doctor = await db.doctor.findUnique({ where: { id: doctorId } });
      if (!doctor || doctor.isDemo || doctor.city !== data.data.city) return { ok: false, message: "Profilul ales nu poate primi programări. Folosește formularul general pentru orașul tău." };
    }
    const phone = normalizePhone(data.data.patientPhone);
    if (!(await consumeLimit("lead-phone", phone, 3, 3600))) return { ok: false, message: "Ai trimis deja mai multe solicitări. Te rugăm să revii mai târziu." };
    const entry = await db.lead.create({
      data: {
        submissionKey: requestId, patientName: data.data.patientName, patientPhone: phone,
        patientEmail: data.data.patientEmail || null, city: data.data.city,
        preferredDate: data.data.preferredDate ? new Date(data.data.preferredDate + "T12:00:00Z") : null,
        message: data.data.message || null, doctorId: doctorId || null,
        consentAt: new Date(), consentVersion: "2026-10-23", notification: { create: {} },
      }, include: { notification: true },
    });
    if (entry.notification) {
      try { await deliverNotification(entry.notification.id); } catch { /* Cererea salvată rămâne disponibilă în admin. */ }
    }
    revalidatePath("/admin/leads");
    return success(entry.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await getDb().lead.findUnique({ where: { submissionKey: requestId }, select: { id: true } });
      if (existing) return success(existing.id);
    }
    return failed;
  }
}
export async function submitPartnership(input: unknown, meta: unknown): Promise<ActionResult> {
  const data = partnershipSchema.safeParse(input);
  const metadata = submissionSchema.safeParse(meta);
  if (!data.success || !metadata.success || metadata.data.website) return invalid;
  try {
    if (demoMode) return { ok: false, message: "Trimiterea este dezactivată în modul demonstrativ." };
    const db = getDb();
    if (!(await consumeLimit("partner-ip", await requestIdentity(), 5, 900))) return { ok: false, message: "Prea multe solicitări. Revino peste 15 minute." };
    const existing = await db.partnershipRequest.findUnique({ where: { submissionKey: metadata.data.requestId } });
    if (existing) return success(existing.id);
    if (!(await getCities()).some((city) => city.cityName === data.data.city)) return invalid;
    const { clinicName, city, contactName, phone, email } = data.data;
    const fields = { clinicName, city, contactName, phone, email };
    const entry = await db.partnershipRequest.create({
      data: { ...fields, phone: normalizePhone(fields.phone), submissionKey: metadata.data.requestId, consentAt: new Date(), notification: { create: {} } },
      include: { notification: true },
    });
    if (entry.notification) {
      try { await deliverNotification(entry.notification.id); } catch { /* Solicitarea rămâne salvată pentru administrare. */ }
    }
    revalidatePath("/admin/leads");
    return { ok: true, reference: entry.id, message: "Cererea de parteneriat a fost înregistrată. Echipa te va contacta pentru detalii." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await getDb().partnershipRequest.findUnique({ where: { submissionKey: metadata.data.requestId } });
      if (existing) return success(existing.id);
    }
    return failed;
  }
}
