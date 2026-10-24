import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { emailConfigured } from "@/lib/notifications";
import { changeStatus, logoutAdmin, retryNotification } from "@/app/actions/admin";

const statuses = { NEW: "Nouă", CONTACTED: "Contactat", COMPLETED: "Finalizată" } as const;
const notificationLabels = { PENDING: "În așteptare", PROCESSING: "În curs", SENT: "Trimis", FAILED: "Eșuat" } as const;
const dateFormat = new Intl.DateTimeFormat("ro-RO", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Bucharest" });
function StatusForm({ id, status, type }: { id: string; status: keyof typeof statuses; type: "lead" | "partner" }) {
  return <form action={changeStatus} className="flex items-center gap-2"><input type="hidden" name="id" value={id} /><input type="hidden" name="type" value={type} /><select name="status" aria-label="Status cerere" defaultValue={status} className="rounded border bg-white p-2 text-xs">{Object.entries(statuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><button type="submit" className="rounded bg-sky-700 px-3 py-2 text-xs font-semibold text-white">Salvează</button></form>;
}
function Notification({ data }: { data: { id: string; status: keyof typeof notificationLabels; attempts: number; lastError: string | null } | null }) {
  if (!data) return <span>—</span>;
  return <div className="space-y-2 text-xs"><p>{notificationLabels[data.status]} · {data.attempts} încercări</p>{data.lastError && <p className="text-red-700">{data.lastError}</p>}{data.status !== "SENT" && <form action={retryNotification}><input type="hidden" name="id" value={data.id} /><button className="font-semibold text-sky-800 underline">Reîncearcă emailul</button></form>}</div>;
}
export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  await requireAdmin();
  const query = await searchParams;
  const page = Math.max(1, Math.min(100000, Number(query.page) || 1));
  const status = typeof query.status === "string" && Object.hasOwn(statuses, query.status) ? query.status as keyof typeof statuses : undefined;
  const where = status ? { status } : {};
  const [leads, partners, count, failed, partnerCount] = await Promise.all([
    getDb().lead.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (Math.floor(page)-1)*50, take: 50, include: { doctor: { select: { name: true } }, provider: { select: { name: true } }, notification: true } }),
    getDb().partnershipRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: (Math.floor(page)-1)*50, take: 50, include: { notification: true } }),
    getDb().lead.count({ where }),
    getDb().notification.count({ where: { status: { in: ["PENDING", "FAILED"] } } }),
    getDb().partnershipRequest.count({ where }),
  ]);
  const notice = typeof query.notice === "string" && ["updated", "retried", "failed", "invalid"].includes(query.notice) ? ({ updated: "Status actualizat.", retried: "Notificarea a fost procesată. Verifică starea emailului.", failed: "Operația nu a putut fi finalizată.", invalid: "Date invalide." } as Record<string,string>)[query.notice] : undefined;
  return <main id="continut" className="site-container py-10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Panou de administrare</p><h1 className="mt-3 text-3xl font-semibold">Cereri și programări</h1></div><form action={logoutAdmin}><button className="rounded-lg border bg-white px-4 py-3 text-sm">Deconectare</button></form></div>
    {notice && <p role="status" className="mt-5 rounded-lg bg-sky-50 p-4">{notice}</p>}
    {!emailConfigured() && <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Emailul necesită RESEND_API_KEY, EMAIL_FROM și ADMIN_EMAIL. Cererile sunt salvate chiar dacă notificările nu pot fi trimise.</p>}
    {failed > 0 && <p className="mt-4 text-sm text-amber-900">{failed} notificări necesită atenție. Folosește „Reîncearcă emailul” după remedierea configurației.</p>}
    <div className="my-6 flex flex-wrap justify-between gap-4"><form className="flex gap-2"><select name="status" aria-label="Filtrează după status" defaultValue={status || ""} className="rounded-lg border bg-white px-3"><option value="">Toate statusurile</option>{Object.entries(statuses).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select><button className="rounded-lg border bg-white px-4 py-3 text-sm">Filtrează</button></form><div className="flex gap-2"><Link href="/admin/providers" className="rounded-lg border bg-white px-4 py-3 text-sm">Furnizori</Link><Link prefetch={false} download href="/admin/leads/export" className="rounded-lg bg-sky-700 px-4 py-3 text-sm font-semibold text-white">Exportă toate programările CSV</Link></div></div>
    <p className="mb-3 text-sm text-slate-600">{count} cereri · pagina {Math.floor(page)} · maximum 50 pe pagină</p>
    <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[1050px] text-left text-sm"><caption className="sr-only">Programările pacienților</caption><thead className="bg-slate-100"><tr>{["Pacient / telefon","Oraș / furnizor","Dată / preferință","Mesaj","Status","Email alertă"].map((title) => <th key={title} scope="col" className="p-4">{title}</th>)}</tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-t align-top"><td className="p-4"><p className="font-semibold">{lead.patientName}</p><p>{lead.patientPhone}</p><p className="break-all text-xs">{lead.patientEmail}</p><p className="mt-2 text-[10px] text-slate-500">{lead.id}</p></td><td className="p-4">{lead.city}<p className="mt-2 text-xs">{lead.provider?.name || lead.doctor?.name || "Nespecificat"}</p></td><td className="p-4 text-xs">{dateFormat.format(lead.createdAt)}<p className="mt-2">Preferată: {lead.preferredDate?.toISOString().slice(0,10) || "—"}</p></td><td className="max-w-xs whitespace-pre-wrap break-words p-4 text-xs">{lead.message || "—"}</td><td className="p-4"><StatusForm id={lead.id} status={lead.status} type="lead" /></td><td className="p-4"><Notification data={lead.notification} /></td></tr>)}</tbody></table>{leads.length === 0 && <p className="p-8 text-center text-slate-500">Nu există cereri pentru filtrul ales.</p>}</div>
    <nav aria-label="Paginare" className="my-6 flex gap-5 text-sm text-sky-800">{page>1 && <Link href={`?page=${Math.floor(page)-1}&status=${status || ""}`}>Pagina anterioară</Link>}{page*50<Math.max(count,partnerCount) && <Link href={`?page=${Math.floor(page)+1}&status=${status || ""}`}>Pagina următoare</Link>}</nav>
    <h2 className="mb-5 mt-12 text-2xl font-semibold">Cereri de parteneriat</h2><div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[850px] text-left text-sm"><caption className="sr-only">Parteneriate clinici</caption><thead className="bg-slate-100"><tr>{["Clinică / oraș","Persoană de contact","Data","Status","Email alertă"].map((title) => <th key={title} className="p-4" scope="col">{title}</th>)}</tr></thead><tbody>{partners.map((partner) => <tr key={partner.id} className="border-t align-top"><td className="p-4">{partner.clinicName}<p className="text-xs">{partner.city}</p></td><td className="p-4">{partner.contactName}<p>{partner.phone}</p><p>{partner.email}</p></td><td className="p-4">{dateFormat.format(partner.createdAt)}</td><td className="p-4"><StatusForm id={partner.id} status={partner.status} type="partner" /></td><td className="p-4"><Notification data={partner.notification} /></td></tr>)}</tbody></table>{partners.length===0 && <p className="p-8 text-center text-slate-500">Nu există cereri de parteneriat pentru pagina și filtrul alese.</p>}</div>
  </main>;
}
