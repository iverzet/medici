import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { csvRow } from "@/lib/security";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await isAdmin())) return new Response("Autentificare necesară.", { status: 401, headers: { "Cache-Control": "no-store" } });
  await getDb().auditLog.create({ data: { action: "csv_export", targetType: "lead" } });
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode("\uFEFF" + csvRow(["ID","Nume","Telefon","Email","Oraș","Medic","Dată preferată","Mesaj","Status","Data creării"])));
        let cursor: string | undefined;
        for (;;) {
          const rows = await getDb().lead.findMany({ take: 250, ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), orderBy: { id: "asc" }, include: { doctor: { select: { name: true } } } });
          if (!rows.length) break;
          for (const lead of rows) controller.enqueue(encoder.encode(csvRow([lead.id,lead.patientName,lead.patientPhone,lead.patientEmail,lead.city,lead.doctor?.name,lead.preferredDate?.toISOString().slice(0,10),lead.message,lead.status,lead.createdAt.toISOString()])));
          cursor = rows[rows.length-1].id;
        }
        controller.close();
      } catch { controller.error(new Error("Exportul nu a putut fi finalizat.")); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="programari.csv"', "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

