import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Star, Stethoscope } from "lucide-react";
import type { CatalogDoctor } from "../../prisma/seed-data";

export function DoctorCard({ doctor }: { doctor: CatalogDoctor }) {
  const Icon = doctor.kind === "DOCTOR" ? Stethoscope : Building2;
  return <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-lg hover:shadow-slate-200/50">
    <div className="flex items-start justify-between bg-slate-100 p-6">
      {doctor.photoUrl ? <img src={doctor.photoUrl} alt={`Fotografie publicată pentru ${doctor.name}`} loading="lazy" referrerPolicy="no-referrer" className="size-18 rounded-2xl border border-white bg-white object-cover" /> : <div className="flex size-18 items-center justify-center rounded-2xl border border-white bg-white text-sky-700"><Icon className="size-9" aria-hidden="true" strokeWidth={1.5} /></div>}
      <div className="flex flex-col items-end gap-2">{doctor.isDemo && <span className="tag bg-amber-100 text-amber-900">Demo</span>}{doctor.isFeatured && <span className="tag bg-white text-sky-800">{doctor.isDemo ? "Promovare demo" : "Partener promovat"}</span>}</div>
    </div>
    <div className="flex flex-1 flex-col p-6">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600"><MapPin className="size-3.5" aria-hidden="true" />{doctor.city}</p>
      <h3 className="text-lg font-semibold leading-7"><Link href={`/medici/${doctor.slug}`} className="hover:text-sky-700">{doctor.name}</Link></h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{doctor.title}</p>
      {doctor.rating !== null && <p className="mt-4 flex items-center gap-1.5 text-sm"><Star className="size-4 text-amber-600" aria-hidden="true" />{doctor.rating.toFixed(1)}<span className="text-xs text-slate-500">{doctor.isDemo ? "scor fictiv" : "scor afișat de partener"}</span></p>}
      <div className="mt-auto flex items-end justify-between gap-3 border-t pt-5 mt-5">
        <div><span className="text-xs text-slate-500">Consultație{doctor.isDemo ? " · tarif demo" : " · orientativ"}</span><p className="text-lg font-semibold">{doctor.services[0]?.price !== null && doctor.services[0]?.price !== undefined ? `${doctor.services[0].price} lei` : "La cerere"}</p></div>
        <Link href={`/medici/${doctor.slug}`} className="flex items-center gap-1 text-sm font-semibold text-sky-800">Vezi profilul <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </div>
  </article>;
}
