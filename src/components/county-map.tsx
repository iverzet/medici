"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { CatalogCity, CatalogDoctor } from "../../prisma/seed-data";
import { COUNTIES as counties, MAP_VIEWBOX, type County } from "@/lib/romania-counties";

const cityCoordinates: Record<string, [number, number]> = {
  "Alba Iulia": [46.07, 23.58], Alexandria: [43.97, 25.33], Arad: [46.18, 21.31],
  Bacău: [46.57, 26.91], "Baia Mare": [47.66, 23.57], Bistrița: [47.13, 24.5],
  Botoșani: [47.75, 26.67], Brașov: [45.64, 25.59], Brăila: [45.27, 27.96],
  București: [44.43, 26.1], Buzău: [45.15, 26.82], Călărași: [44.2, 27.33],
  "Cluj-Napoca": [46.77, 23.62], Constanța: [44.18, 28.65], Craiova: [44.33, 23.79],
  Deva: [45.88, 22.9], "Drobeta-Turnu Severin": [44.63, 22.66], Focșani: [45.7, 27.18],
  Galați: [45.44, 28.04], Giurgiu: [43.9, 25.97], Iași: [47.16, 27.6],
  "Miercurea Ciuc": [46.36, 25.8], Oradea: [47.07, 21.92], "Piatra Neamț": [46.93, 26.37],
  Pitești: [44.86, 24.87], Ploiești: [44.94, 26.02], "Râmnicu Vâlcea": [45.1, 24.37],
  Reșița: [45.3, 21.89], "Satu Mare": [47.79, 22.88], "Sfântu Gheorghe": [45.86, 25.79],
  Sibiu: [45.79, 24.15], Slatina: [44.43, 24.36], Slobozia: [44.56, 27.37],
  Suceava: [47.65, 26.25], Târgoviște: [44.93, 25.45], "Târgu Jiu": [45.04, 23.27],
  "Târgu Mureș": [46.54, 24.56], Timișoara: [45.75, 21.21], Tulcea: [45.18, 28.8],
  Vaslui: [46.64, 27.73], Zalău: [47.19, 23.06],
};

function savedCitySlug() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )specialist-city=([^;]+)/)?.[1] || "");
}

function subscribeToCity(onStoreChange: () => void) {
  window.addEventListener("specialist-city-change", onStoreChange);
  return () => window.removeEventListener("specialist-city-change", onStoreChange);
}

function saveCity(slug: string) {
  if (!document.cookie.includes("cookie-consent=accepted")) return;
  document.cookie = `specialist-city=${encodeURIComponent(slug)}; Max-Age=2592000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event("specialist-city-change"));
}

export function CountyMap({ cities, doctors }: { cities: CatalogCity[]; doctors: CatalogDoctor[] }) {
  const savedSlug = useSyncExternalStore(subscribeToCity, savedCitySlug, () => "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const cityByName = useMemo(() => new Map(cities.map((city) => [city.cityName, city])), [cities]);
  const countyBySeat = useMemo(() => new Map(counties.map((county) => [county.seat, county])), []);
  const savedCounty = countyBySeat.get(cities.find((city) => city.slug === savedSlug)?.cityName ?? "");
  const selected = counties.find((county) => county.id === selectedId) ?? savedCounty ?? null;
  const profileCountBySeat = useMemo(() => new Map(counties.map((county) => [county.seat, doctors.filter((doctor) => doctor.city === county.seat && !doctor.isDemo).length])), [doctors]);
  const matches = useMemo(() => new Set(counties.filter((county) => (profileCountBySeat.get(county.seat) ?? 0) > 0).map((county) => county.id)), [profileCountBySeat]);
  const filtered = useMemo(() => counties.filter((county) => [county.name, county.code, county.seat].some((value) => value.toLocaleLowerCase("ro").includes(query.toLocaleLowerCase("ro")))), [query]);

  const selectCounty = (county: County) => {
    setSelectedId(county.id);
    const city = cityByName.get(county.seat);
    if (city) saveCity(city.slug);
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Locația nu este disponibilă în acest browser.");
      return;
    }
    setLocationMessage("Căutăm județul cel mai apropiat…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const available = counties.filter((county) => cityCoordinates[county.seat] && matches.has(county.id));
        const nearest = available.sort((left, right) => {
          const distance = (county: County) => {
            const point = cityCoordinates[county.seat];
            return (point[0] - coords.latitude) ** 2 + (point[1] - coords.longitude) ** 2;
          };
          return distance(left) - distance(right);
        })[0];
        if (nearest) {
          selectCounty(nearest);
          setLocationMessage(`Am selectat ${nearest.seat}, cea mai apropiată zonă cu profiluri verificate.`);
        } else {
          setLocationMessage("Nu avem încă un municipiu disponibil în apropiere. Alege manual localitatea.");
        }
      },
      () => setLocationMessage("Nu am putut accesa locația. Alege manual localitatea."),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  };

  const selectedCity = selected ? cityByName.get(selected.seat) : undefined;
  const selectedDoctors = selected ? doctors.filter((doctor) => doctor.city === selected.seat) : [];

  return (
    <section aria-labelledby="harta-judetelor" className="section-space">
      <p className="eyebrow">Aproape de tine</p>
      <div className="section-heading">
        <h2 id="harta-judetelor" className="section-title">Alege județul tău</h2>
        <p className="text-sm text-slate-500">Apasă pe hartă sau caută după județ, cod ori municipiul reședință.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="relative">
              <label htmlFor="county-search" className="sr-only">Caută județ</label>
              <input id="county-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="Caută județ, cod sau oraș"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none ring-sky-700 transition focus:ring-2" />
            </div>

            <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 md:block">
              <svg viewBox={MAP_VIEWBOX} className="h-auto w-full" role="group" aria-label="Harta interactivă a României pe județe">
                {counties.map((county) => {
                  const active = county.id === selected?.id;
                  return <path key={county.id} d={county.d} role="button" tabIndex={0}
                    aria-label={county.isCapital ? `Municipiul ${county.name} (${county.code})` : `Județul ${county.name} (${county.code})`}
                    aria-pressed={active} data-match={matches.has(county.id)}
                    onClick={() => selectCounty(county)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectCounty(county);
                      }
                    }}
                    className={`cursor-pointer stroke-white stroke-[1.2] outline-none transition focus:stroke-slate-950 focus:stroke-[2.5] ${active ? "fill-sky-700" : matches.has(county.id) ? "fill-sky-100 hover:fill-sky-300" : "fill-slate-100 hover:fill-slate-200"}`} />;
                })}
                {counties.map((county) => <text key={`label-${county.id}`} x={county.cx} y={county.cy + (county.code === "IF" ? -12 : 4)}
                  textAnchor="middle" aria-hidden="true"
                  className={`pointer-events-none select-none text-[11px] font-semibold ${county.id === selected?.id ? "fill-white" : "fill-slate-600"} ${county.isCapital ? "text-[8px]" : ""}`}>
                  {county.code}
                </text>)}
              </svg>
              <p className="mt-3 text-xs text-slate-500">Harta include toate județele și municipiul București. Navigare: Tab și Enter.</p>
            </div>

            <div className="mt-4 md:hidden">
              <ul className="max-h-72 divide-y overflow-y-auto rounded-2xl border border-slate-200 bg-white" aria-label="Lista județelor">
                {filtered.map((county) => <li key={county.id}>
                  <button type="button" onClick={() => selectCounty(county)} aria-pressed={county.id === selected?.id}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-sky-50 aria-pressed:bg-sky-100">
                    <span><span className="font-medium">{county.name}</span><span className="ml-2 text-xs text-slate-500">{county.seat}</span></span>
                    <span className="text-right text-xs font-semibold text-sky-800"><span className="block">{county.code}</span><span className="font-normal text-slate-500">{profileCountBySeat.get(county.seat) ?? 0} profiluri</span></span>
                  </button>
                </li>)}
                {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">Niciun județ găsit.</li>}
              </ul>
            </div>

            <button type="button" onClick={useLocation} className="mt-4 min-h-10 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800">
              Folosește locația mea
            </button>
            {locationMessage && <p className="mt-2 text-xs text-slate-600" role="status">{locationMessage}</p>}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            {!selected ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <p className="font-semibold text-slate-800">Niciun județ selectat</p>
              <p className="mt-2 text-sm text-slate-500">Alege un județ de pe hartă sau din căutare.</p>
            </div> : <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sky-100 font-semibold text-sky-900">{selected.code}</span>
                <div><p className="text-xs font-medium uppercase tracking-wider text-slate-500">{selected.isCapital ? "Municipiu" : "Județ"} · {selected.region}</p><h3 className="text-2xl font-semibold">{selected.name}</h3></div>
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-3"><dt className="text-slate-500">Reședință</dt><dd className="font-medium">{selected.seat}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Profiluri în catalog</dt><dd className="font-medium">{selectedDoctors.length}</dd></div>
              </dl>
              {selectedDoctors.length > 0 && <ul className="mt-5 space-y-3">{selectedDoctors.slice(0, 3).map((doctor) => <li key={doctor.id}><Link className="font-medium text-sky-800 hover:underline" href={`/medici/${doctor.slug}`}>{doctor.name}</Link><span className="block text-xs text-slate-500">{doctor.title}</span></li>)}</ul>}
              {selectedCity && selectedDoctors.length > 0 ? <Link href={`/${selectedCity.slug}`} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Vezi specialiștii</Link> :
                <p className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Nu există încă profiluri verificate în această zonă. Caută un județ apropiat.</p>}
            </div>}
          </aside>
        </div>
      </div>
    </section>
  );
}

