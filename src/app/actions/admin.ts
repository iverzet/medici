"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sameSecret } from "@/lib/security";
import { consumeLimit, requestIdentity } from "@/lib/rate-limit";
import { createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { deliverNotification } from "@/lib/notifications";

export async function loginAdmin(_previous: { error: string }, formData: FormData): Promise<{ error: string }> {
  const secret = formData.get("secret");
  if (typeof secret !== "string" || secret.length > 512) return { error: "Date de autentificare incorecte." };
  try {
    if (!(await consumeLimit("admin-login", await requestIdentity(), 8, 900))) return { error: "Prea multe încercări. Revino peste 15 minute." };
    const expected = process.env.ADMIN_SECRET_KEY;
    if (!expected || expected.length < 32 || !sameSecret(secret, expected)) return { error: "Date de autentificare incorecte." };
    await createAdminSession();
  } catch { return { error: "Autentificarea nu este disponibilă momentan." }; }
  redirect("/admin/leads");
}
export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}
export async function changeStatus(form: FormData) {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(100), type: z.enum(["lead", "partner"]), status: z.enum(["NEW", "CONTACTED", "COMPLETED"]) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect("/admin/leads?notice=invalid");
  try {
    if (parsed.data.type === "lead") await getDb().lead.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    else await getDb().partnershipRequest.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    await getDb().auditLog.create({ data: { action: "status_change", targetId: parsed.data.id, targetType: parsed.data.type } });
  } catch { redirect("/admin/leads?notice=failed"); }
  revalidatePath("/admin/leads");
  redirect("/admin/leads?notice=updated");
}
export async function retryNotification(form: FormData) {
  await requireAdmin();
  const id = form.get("id");
  if (typeof id !== "string" || id.length > 100) redirect("/admin/leads?notice=invalid");
  try { await deliverNotification(id); await getDb().auditLog.create({ data: { action: "notification_retry", targetId: id, targetType: "notification" } }); } catch { redirect("/admin/leads?notice=failed"); }
  revalidatePath("/admin/leads");
  redirect("/admin/leads?notice=retried");
}
