 "use client";
 
 import Link from "next/link";
 import { useMemo, useState } from "react";
 import type { CatalogCity, CatalogDoctor } from "../../prisma/seed-data";
 import { municipalities, municipalitySlug } from "@/lib/municipalities";

 const cityCoordinates: Record<string, [number, number]> = { București: [44.4268, 26.1025], "Cluj-Napoca": [46.7712, 23.6236], Timișoara: [45.7489, 21.2087], Iași: [47.1585, 27.6014], Brașov: [45.6427, 25.5887] };
 
 export function CountyMap({ cities, doctors }: { cities: CatalogCity[]; doctors: CatalogDoctor[] }) {
   const specialty = "proctologi";
   const all = municipalities.map((name) => ({ name, slug: municipalitySlug(name, specialty) }));
   const [selected, setSelected] = useState(() => { const saved = document.cookie.match(/(?:^|; )specialist-city=([^;]+)/)?.[1]; return all.find((item) => item.slug === decodeURIComponent(saved || "")) || all[0]; });
   const [search, setSearch] = useState("");
   const [locationMessage, setLocationMessage] = useState("");
   const selectCity = (item: typeof all[number]) => { setSelected(item); if (document.cookie.includes("cookie-consent=accepted")) document.cookie = `specialist-city=${encodeURIComponent(item.slug)}; Max-Age=2592000; Path=/; SameSite=Lax`; };
   const useLocation = () => { if (!navigator.geolocation) { setLocationMessage("Locația nu este disponibilă în acest browser."); return; } setLocationMessage("Căutăm specialistul cel mai apropiat…"); navigator.geolocation.getCurrentPosition(({ coords }) => { const nearest = cities.filter((item) => cityCoordinates[item.cityName]).sort((a, b) => { const distance = (city: typeof a) => { const point = cityCoordinates[city.cityName]; return point ? (point[0] - coords.latitude) ** 2 + (point[1] - coords.longitude) ** 2 : Number.POSITIVE_INFINITY; }; return distance(a) - distance(b); })[0]; if (nearest) { selectCity({ name: nearest.cityName, slug: nearest.slug }); setLocationMessage(`Am selectat ${nearest.cityName}, zona cea mai apropiată din catalog.`); } else setLocationMessage("Nu avem încă un oraș disponibil în apropiere. Alege manual localitatea."); }, () => setLocationMessage("Nu am putut accesa locația. Alege manual localitatea.")); };
   const visible = all.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12);
   const city = cities.find((item) => item.slug === selected.slug);
   const matches = useMemo(() => doctors.filter((doctor) => doctor.city === city?.cityName), [city?.cityName, doctors]);
   return <section aria-labelledby="harta-municipiilor" className="section-space">
     <p className="eyebrow">Caută aproape de tine</p>
     <div className="section-heading"><h2 id="harta-municipiilor" className="section-title">Găsește un specialist în municipiul tău</h2><p className="text-sm text-slate-500">Selectează orice municipiu din România pentru a vedea opțiunile disponibile.</p></div>
     <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
       <div><div className="overflow-hidden rounded-3xl border bg-white shadow-sm"><iframe title="Hartă OpenStreetMap a României" src="https://www.openstreetmap.org/export/embed.html?bbox=20.2%2C43.5%2C29.8%2C48.4&layer=mapnik" className="h-72 w-full border-0" loading="lazy" /></div>
         <button type="button" onClick={useLocation} className="mt-3 min-h-10 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Folosește locația mea</button>{locationMessage && <p className="mt-2 text-xs text-slate-600" role="status">{locationMessage}</p>}<details className="mt-3 rounded-xl border bg-slate-50 p-3"><summary className="cursor-pointer text-sm font-semibold text-slate-700">Alege alt județ sau localitate</summary><div className="mt-3"><label htmlFor="municipiu-cauta" className="text-xs font-semibold text-slate-700">Caută localitatea</label><input id="municipiu-cauta" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Începe cu orașul tău" className="mt-2 min-h-10 w-full rounded-lg border bg-white px-3 text-sm" /></div><div className="mt-3 grid max-h-52 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4" role="listbox" aria-label="Municipii din România">{visible.map((item) => <button key={item.slug} type="button" onClick={() => selectCity(item)} role="option" aria-selected={selected.slug === item.slug} tabIndex={selected.slug === item.slug ? 0 : -1} className={`rounded-lg border px-2 py-2 text-left text-xs font-medium transition ${selected.slug === item.slug ? "border-sky-700 bg-sky-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-sky-400"}`}>{item.name}</button>)}</div><p className="mt-2 text-xs text-slate-500">Afișăm primele rezultate pentru căutarea ta. Hartă: OpenStreetMap contributors · {all.length} municipii</p></details>
       </div>
       <div className="rounded-2xl border bg-white p-6"><p className="text-sm font-semibold text-sky-800">Municipiu</p><h3 className="mt-2 text-2xl font-semibold">{selected.name}</h3><p className="mt-2 text-sm text-slate-600">{matches.length ? `${matches.length} profiluri în catalog` : "Nu există încă profiluri publicate în acest municipiu."}</p>{matches.length > 0 && <ul className="mt-5 space-y-3">{matches.slice(0, 3).map((doctor) => <li key={doctor.id}><Link className="font-medium text-sky-800 hover:underline" href={`/medici/${doctor.slug}`}>{doctor.name}</Link><span className="block text-xs text-slate-500">{doctor.title}</span></li>)}</ul>}<Link href={`/${selected.slug}`} className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Vezi pagina municipiului</Link></div>
     </div>
   </section>;
 }
 







