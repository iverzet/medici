import "server-only";
import { getDb } from "@/lib/db";
import { site } from "@/config/site";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.ADMIN_EMAIL);
}
export async function deliverNotification(id: string) {
  const db = getDb();
  const claimed = await db.notification.updateMany({
    where: { id, OR: [{ status: { in: ["PENDING", "FAILED"] } }, { status: "PROCESSING", lastAttemptAt: { lt: new Date(Date.now() - 120000) } }] },
    data: { status: "PROCESSING", attempts: { increment: 1 }, lastAttemptAt: new Date() },
  });
  if (claimed.count === 0) return;
  try {
    if (!emailConfigured()) throw new Error("EMAIL_NOT_CONFIGURED");
    const entry = await db.notification.findUniqueOrThrow({ where: { id }, include: { lead: { include: { doctor: true } }, partnership: true } });
    const lead = entry.lead;
    const partner = entry.partnership;
    const text = lead ? ["Cerere nouă de programare", "Referință: " + lead.id] : partner ? ["Cerere nouă de parteneriat", "Referință: " + partner.id] : null;
    if (!text) throw new Error("REQUEST_NOT_FOUND");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": "notification/" + id },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM, to: [process.env.ADMIN_EMAIL],
        subject: lead ? `${site.name} — cerere nouă de programare` : `${site.name} — cerere de parteneriat`,
        text: text.join("\n") + "\n\nAdministrare: " + site.url + "/admin/leads",
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("EMAIL_PROVIDER_" + response.status);
    await db.notification.update({ where: { id }, data: { status: "SENT", sentAt: new Date(), lastError: null } });
  } catch (error) {
    const code = error instanceof Error && /^EMAIL_(NOT_CONFIGURED|PROVIDER_\d+)$/.test(error.message) ? error.message : "EMAIL_DELIVERY_FAILED";
    await db.notification.update({ where: { id }, data: { status: "FAILED", lastError: code } });
  }
}
