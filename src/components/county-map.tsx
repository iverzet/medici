"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogCity, CatalogDoctor } from "../../prisma/seed-data";

const counties = [
  { name: "București", slug: "proctologi-bucuresti", position: "col-span-2 row-span-2" },
  { name: "Cluj", slug: "proctologi-cluj", position: "col-span-2" },
  { name: "Timiș", slug: "proctologi-timisoara", position: "row-span-2" },
  { name: "Iași", slug: "proctologi-iasi", position: "col-span-2" },
  { name: "Brașov", slug: "proctologi-brasov", position: "col-span-2" },
];

export function CountyMap({ cities, doctors }: { cities: CatalogCity[]; doctors: CatalogDoctor[] }) {
  const [selected, setSelected] = useState(counties[0].slug);
  const county = counties.find((item) => item.slug === selected) ?? counties[0];
  const city = cities.find((item) => item.slug === county.slug);
  const matches = useMemo(() => doctors.filter((doctor) => doctor.city === city?.cityName), [city?.cityName, doctors]);
  return <section aria-labelledby="harta-judetelor" className="section-space">
    <p className="eyebrow">Caută aproape de tine</p><div className="section-heading"><h2 id="harta-judetelor" className="section-title">Alege un județ</h2><p className="text-sm text-slate-500">Selectează o zonă pentru a vedea medicii disponibili.</p></div>
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center"><div><div className="overflow-hidden rounded-3xl border bg-white shadow-sm"><iframe title="Hartă OpenStreetMap cu județele disponibile" src="https://www.openstreetmap.org/export/embed.html?bbox=20.2%2C43.5%2C29.8%2C48.4&layer=mapnik" className="h-72 w-full border-0" loading="lazy" /></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Județe disponibile">{counties.map((item) => <button key={item.slug} type="button" onClick={() => setSelected(item.slug)} aria-pressed={selected === item.slug} className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition ${selected === item.slug ? "border-orange-700 bg-orange-700 text-white shadow-lg" : "border-slate-200 bg-white text-slate-700 hover:border-orange-400"}`}><span className="block text-xs font-normal opacity-70">Județ</span>{item.name}</button>)}</div><p className="mt-2 text-xs text-slate-500">Hartă: OpenStreetMap contributors</p></div><div className="rounded-2xl border bg-white p-6"><p className="text-sm font-semibold text-orange-800">{county.name}</p><h3 className="mt-2 text-2xl font-semibold">{city?.cityName ?? ""}</h3><p className="mt-2 text-sm text-slate-600">{matches.length} profiluri în catalog</p><ul className="mt-5 space-y-3">{matches.slice(0, 3).map((doctor) => <li key={doctor.id}><Link className="font-medium text-orange-800 hover:underline" href={`/medici/${doctor.slug}`}>{doctor.name}</Link><span className="block text-xs text-slate-500">{doctor.title}</span></li>)}</ul><Link href={`/${county.slug}`} className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Vezi toți specialiștii</Link></div></div>
  </section>;
}
