import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Star, Stethoscope } from "lucide-react";
import type { CatalogDoctor } from "../../prisma/seed-data";

export function DoctorCard({ doctor }: { doctor: CatalogDoctor }) {
  const Icon = doctor.kind === "DOCTOR" ? Stethoscope : Building2;
  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/10">
    <div className="flex items-start justify-between bg-gradient-to-br from-slate-100 to-teal-50 p-6">
      {doctor.photoUrl ? <img src={doctor.photoUrl} alt={`Fotografie publicată pentru ${doctor.name}`} loading="lazy" referrerPolicy="no-referrer" className="size-18 rounded-2xl border-4 border-white bg-white object-cover shadow-md" /> : <div className="flex size-18 items-center justify-center rounded-2xl border-4 border-white bg-white text-teal-700 shadow-md"><Icon className="size-9" aria-hidden="true" strokeWidth={1.5} /></div>}
      <div className="flex flex-col items-end gap-2">{doctor.isFeatured && <span className="tag bg-slate-950 text-teal-200">Partener promovat</span>}<span className="tag bg-white/80 text-slate-600">Sursă publică</span></div>
    </div>
    <div className="flex flex-1 flex-col p-6">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600"><MapPin className="size-3.5" aria-hidden="true" />{doctor.city}</p>
      <h3 className="text-lg font-semibold leading-7"><Link href={`/medici/${doctor.slug}`} className="hover:text-sky-700">{doctor.name}</Link></h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{doctor.title}</p>
      {doctor.rating !== null && <p className="mt-4 flex items-center gap-1.5 text-sm"><Star className="size-4 text-amber-600" aria-hidden="true" />{doctor.rating.toFixed(1)}<span className="text-xs text-slate-500">scor afișat de partener</span></p>}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-5 mt-5">
        <div><span className="text-xs text-slate-500">Serviciu disponibil</span><p className="max-w-[12rem] truncate text-sm font-semibold text-slate-800">{doctor.services[0]?.name || "Detalii pe profil"}</p></div>
        <Link href={`/medici/${doctor.slug}`} className="flex items-center gap-1 text-sm font-semibold text-teal-800 transition group-hover:text-teal-600">Vezi profilul <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </div>
  </article>;
}
