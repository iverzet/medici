import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deliverNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const retentionWhere = { OR: [{ closedAt: { lt: cutoff } }, { closedAt: null, createdAt: { lt: cutoff } }] };
  const [leads, partnerships] = await Promise.all([
    db.lead.deleteMany({ where: retentionWhere }),
    db.partnershipRequest.deleteMany({ where: retentionWhere }),
  ]);
  await db.auditLog.create({ data: { action: "RETENTION_RUN", targetType: "retention", targetId: `${cutoff.toISOString()}:${leads.count}:${partnerships.count}` } });
  const retryBefore = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const notifications = await db.notification.findMany({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      attempts: { lt: 5 },
      OR: [{ lastAttemptAt: null }, { lastAttemptAt: { lt: retryBefore } }],
    },
    select: { id: true },
    take: 25,
    orderBy: { createdAt: "asc" },
  });
  await Promise.allSettled(notifications.map((notification) => deliverNotification(notification.id)));
  return NextResponse.json({ deleted: { leads: leads.count, partnerships: partnerships.count }, retriedNotifications: notifications.length });
}
