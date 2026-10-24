 "use client";
 
 import Link from "next/link";
 import { useMemo, useState } from "react";
 import type { CatalogCity, CatalogDoctor } from "../../prisma/seed-data";
 import { municipalities, municipalitySlug } from "@/lib/municipalities";
 
 export function CountyMap({ cities, doctors }: { cities: CatalogCity[]; doctors: CatalogDoctor[] }) {
   const specialty = "proctologi";
   const all = municipalities.map((name) => ({ name, slug: municipalitySlug(name, specialty) }));
   const [selected, setSelected] = useState(all[0]);
   const city = cities.find((item) => item.slug === selected.slug);
   const matches = useMemo(() => doctors.filter((doctor) => doctor.city === city?.cityName), [city?.cityName, doctors]);
   return <section aria-labelledby="harta-municipiilor" className="section-space">
     <p className="eyebrow">Caută aproape de tine</p>
     <div className="section-heading"><h2 id="harta-municipiilor" className="section-title">Găsește un specialist în municipiul tău</h2><p className="text-sm text-slate-500">Selectează orice municipiu din România pentru a vedea opțiunile disponibile.</p></div>
     <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
       <div><div className="overflow-hidden rounded-3xl border bg-white shadow-sm"><iframe title="Hartă OpenStreetMap a României" src="https://www.openstreetmap.org/export/embed.html?bbox=20.2%2C43.5%2C29.8%2C48.4&layer=mapnik" className="h-72 w-full border-0" loading="lazy" /></div>
         <div className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4" role="listbox" aria-label="Municipii din România">{all.map((item) => <button key={item.slug} type="button" onClick={() => setSelected(item)} aria-selected={selected.slug === item.slug} className={`rounded-lg border px-2 py-2 text-left text-xs font-medium transition ${selected.slug === item.slug ? "border-sky-700 bg-sky-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-sky-400"}`}>{item.name}</button>)}</div><p className="mt-2 text-xs text-slate-500">Hartă: OpenStreetMap contributors · {all.length} municipii</p>
       </div>
       <div className="rounded-2xl border bg-white p-6"><p className="text-sm font-semibold text-sky-800">Municipiu</p><h3 className="mt-2 text-2xl font-semibold">{selected.name}</h3><p className="mt-2 text-sm text-slate-600">{matches.length ? `${matches.length} profiluri în catalog` : "Nu există încă profiluri publicate în acest municipiu."}</p>{matches.length > 0 && <ul className="mt-5 space-y-3">{matches.slice(0, 3).map((doctor) => <li key={doctor.id}><Link className="font-medium text-sky-800 hover:underline" href={`/medici/${doctor.slug}`}>{doctor.name}</Link><span className="block text-xs text-slate-500">{doctor.title}</span></li>)}</ul>}<Link href={`/${selected.slug}`} className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Vezi pagina municipiului</Link></div>
     </div>
   </section>;
 }
 
