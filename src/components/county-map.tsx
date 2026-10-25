 "use client";
 
 import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
 import type { CatalogCity, CatalogDoctor } from "../../prisma/seed-data";
 import { municipalities, municipalitySlug } from "@/lib/municipalities";

const cityCoordinates: Record<string, [number, number]> = { "Alba Iulia": [46.07, 23.58], Alexandria: [43.97, 25.33], Arad: [46.18, 21.31], Bacău: [46.57, 26.91], "Baia Mare": [47.66, 23.57], Bistrița: [47.13, 24.5], Botoșani: [47.75, 26.67], Brașov: [45.64, 25.59], Brăila: [45.27, 27.96], București: [44.43, 26.1], Buzău: [45.15, 26.82], Călărași: [44.2, 27.33], "Cluj-Napoca": [46.77, 23.62], Constanța: [44.18, 28.65], Craiova: [44.33, 23.79], Deva: [45.88, 22.9], "Drobeta-Turnu Severin": [44.63, 22.66], Focșani: [45.7, 27.18], Galați: [45.44, 28.04], Giurgiu: [43.9, 25.97], Iași: [47.16, 27.6], "Miercurea Ciuc": [46.36, 25.8], Oradea: [47.07, 21.92], "Piatra Neamț": [46.93, 26.37], Pitești: [44.86, 24.87], Ploiești: [44.94, 26.02], "Râmnicu Vâlcea": [45.1, 24.37], Reșița: [45.3, 21.89], "Satu Mare": [47.79, 22.88], "Sfântu Gheorghe": [45.86, 25.79], Sibiu: [45.79, 24.15], Slatina: [44.43, 24.36], Slobozia: [44.56, 27.37], Suceava: [47.65, 26.25], Târgoviște: [44.93, 25.45], "Târgu Jiu": [45.04, 23.27], "Târgu Mureș": [46.54, 24.56], Timișoara: [45.75, 21.21], Tulcea: [45.18, 28.8], Vaslui: [46.64, 27.73], Zalău: [47.19, 23.06] };
function savedCitySlug() { return decodeURIComponent(document.cookie.match(/(?:^|; )specialist-city=([^;]+)/)?.[1] || ""); }
function subscribeToCity(onStoreChange: () => void) { window.addEventListener("specialist-city-change", onStoreChange); return () => window.removeEventListener("specialist-city-change", onStoreChange); }
 
 export function CountyMap({ cities, doctors }: { cities: CatalogCity[]; doctors: CatalogDoctor[] }) {
   const specialty = "proctologi";
   const all = useMemo(() => municipalities.map((name) => ({ name, slug: municipalitySlug(name, specialty) })), [specialty]);
   const savedSlug = useSyncExternalStore(subscribeToCity, savedCitySlug, () => "");
   const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
   const selected = all.find((item) => item.slug === (selectedSlug || savedSlug)) || all[0];
   const [search, setSearch] = useState("");
   const [locationMessage, setLocationMessage] = useState("");
   const selectCity = (item: typeof all[number]) => { setSelectedSlug(item.slug); if (document.cookie.includes("cookie-consent=accepted")) { document.cookie = `specialist-city=${encodeURIComponent(item.slug)}; Max-Age=2592000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`; window.dispatchEvent(new Event("specialist-city-change")); } };
   const useLocation = () => { if (!navigator.geolocation) { setLocationMessage("Locația nu este disponibilă în acest browser."); return; } setLocationMessage("Căutăm specialistul cel mai apropiat…"); navigator.geolocation.getCurrentPosition(({ coords }) => { const nearest = cities.filter((item) => cityCoordinates[item.cityName]).sort((a, b) => { const distance = (city: typeof a) => { const point = cityCoordinates[city.cityName]; return point ? (point[0] - coords.latitude) ** 2 + (point[1] - coords.longitude) ** 2 : Number.POSITIVE_INFINITY; }; return distance(a) - distance(b); })[0]; const option = nearest && all.find((item) => item.slug === nearest.slug); if (nearest && option) { selectCity(option); setLocationMessage(`Am selectat ${nearest.cityName}, zona cea mai apropiată din catalog.`); } else setLocationMessage("Nu avem încă un oraș disponibil în apropiere. Alege manual localitatea."); }, () => setLocationMessage("Nu am putut accesa locația. Alege manual localitatea.")); };
   const visible = all.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12);
   const city = cities.find((item) => item.slug === selected.slug);
   const matches = useMemo(() => doctors.filter((doctor) => doctor.city === city?.cityName), [city?.cityName, doctors]);
   return <section aria-labelledby="harta-municipiilor" className="section-space">
     <p className="eyebrow">Caută aproape de tine</p>
     <div className="section-heading"><h2 id="harta-municipiilor" className="section-title">Găsește un specialist în județul tău</h2><p className="text-sm text-slate-500">Selectează municipiul reședință de județ pentru a vedea opțiunile disponibile.</p></div>
     <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
       <div><div className="overflow-hidden rounded-3xl border bg-white shadow-sm"><iframe title="Hartă OpenStreetMap a României" src="https://www.openstreetmap.org/export/embed.html?bbox=20.2%2C43.5%2C29.8%2C48.4&layer=mapnik" className="h-72 w-full border-0" loading="lazy" /></div>
         <button type="button" onClick={useLocation} className="mt-3 min-h-10 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Folosește locația mea</button>{locationMessage && <p className="mt-2 text-xs text-slate-600" role="status">{locationMessage}</p>}<details className="mt-3 rounded-xl border bg-slate-50 p-3"><summary className="cursor-pointer text-sm font-semibold text-slate-700">Alege alt județ</summary><div className="mt-3"><label htmlFor="municipiu-cauta" className="text-xs font-semibold text-slate-700">Caută județul sau municipiul reședință</label><input id="municipiu-cauta" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Începe cu județul tău" className="mt-2 min-h-10 w-full rounded-lg border bg-white px-3 text-sm" /></div><div className="mt-3 grid max-h-52 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4" role="listbox" aria-label="Municipii reședință de județ">{visible.map((item) => <button key={item.slug} type="button" onClick={() => selectCity(item)} role="option" aria-selected={selected.slug === item.slug} tabIndex={selected.slug === item.slug ? 0 : -1} className={`rounded-lg border px-2 py-2 text-left text-xs font-medium transition ${selected.slug === item.slug ? "border-sky-700 bg-sky-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-sky-400"}`}>{item.name}</button>)}</div><p className="mt-2 text-xs text-slate-500">Afișăm primele rezultate pentru căutarea ta. Hartă: OpenStreetMap contributors · {all.length} reședințe de județ</p></details>
       </div>
       <div className="rounded-2xl border bg-white p-6"><p className="text-sm font-semibold text-sky-800">Municipiu</p><h3 className="mt-2 text-2xl font-semibold">{selected.name}</h3><p className="mt-2 text-sm text-slate-600">{matches.length ? `${matches.length} profiluri în catalog` : "Nu există încă profiluri publicate în acest municipiu."}</p>{matches.length > 0 && <ul className="mt-5 space-y-3">{matches.slice(0, 3).map((doctor) => <li key={doctor.id}><Link className="font-medium text-sky-800 hover:underline" href={`/medici/${doctor.slug}`}>{doctor.name}</Link><span className="block text-xs text-slate-500">{doctor.title}</span></li>)}</ul>}<Link href={`/${selected.slug}`} className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Vezi pagina municipiului</Link></div>
     </div>
   </section>;
 }
 







