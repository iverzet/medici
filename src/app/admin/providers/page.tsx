import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { publishProvider } from "@/app/actions/admin";

export default async function ProvidersPage() {
  await requireAdmin();
  const providers = await getDb().provider.findMany({ include: { locations: true, specialties: { include: { specialty: true } } }, orderBy: { createdAt: "desc" } });
  return <main id="continut" className="site-container py-10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Panou de administrare</p><h1 className="mt-3 text-3xl font-semibold">Furnizori de verificat</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Publică numai după verificarea sursei, a datelor de contact și a acordului de listare. Publicarea marchează profilul ca verificat și îl face vizibil în catalog.</p></div><Link href="/admin/leads" className="rounded-lg border bg-white px-4 py-3 text-sm">Înapoi la cereri</Link></div>
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-100"><tr>{["Furnizor", "Locație", "Specialitate", "Sursă", "Stare", "Acțiune"].map((heading) => <th key={heading} className="p-4" scope="col">{heading}</th>)}</tr></thead><tbody>{providers.map((provider) => <tr key={provider.id} className="border-t align-top"><td className="p-4 font-semibold">{provider.name}</td><td className="p-4">{provider.locations.map((location) => <p key={location.id}>{location.city} · {location.address}</p>)}</td><td className="p-4">{provider.specialties.map(({ specialty }) => specialty.name).join(", ") || "—"}</td><td className="p-4">{provider.sourceUrl ? <a className="break-all text-sky-800 underline" href={provider.sourceUrl} target="_blank" rel="noreferrer">Sursa publică</a> : "—"}</td><td className="p-4">{provider.isPublished ? "Publicat" : "În verificare"}</td><td className="p-4"><form action={publishProvider}><input type="hidden" name="id" value={provider.id} /><input type="hidden" name="action" value={provider.isPublished ? "unpublish" : "publish"} /><button className="rounded bg-sky-700 px-3 py-2 text-xs font-semibold text-white">{provider.isPublished ? "Retrage" : "Verifică și publică"}</button></form></td></tr>)}</tbody></table>{providers.length === 0 && <p className="p-8 text-center text-slate-500">Nu există furnizori importați.</p>}</div>
  </main>;
}
