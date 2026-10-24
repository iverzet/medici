import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const [leads, partnerships] = await Promise.all([
    getDb().lead.deleteMany({ where: { status: "COMPLETED", createdAt: { lt: cutoff } } }),
    getDb().partnershipRequest.deleteMany({ where: { status: "COMPLETED", createdAt: { lt: cutoff } } }),
  ]);
  return NextResponse.json({ deleted: { leads: leads.count, partnerships: partnerships.count } });
}
