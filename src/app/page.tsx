import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Quote } from "lucide-react";
import { getCities, getDoctors, demoMode } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import { CitySelector } from "@/components/city-selector";
import { DoctorCard } from "@/components/doctor-card";
import { LeadForm } from "@/components/lead-form";
import { FAQ } from "@/components/faq";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { CountyMap } from "@/components/county-map";

export const revalidate = 300;
export const metadata = pageMetadata("Găsește medici proctologi în orașul tău", "Găsește medici și clinici de proctologie în orașul tău. Compară serviciile și cere o programare confidențială.", "/");

export default async function Home() {
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const featured = doctors.filter((doctor) => doctor.isFeatured);
  return <main id="continut" className="pb-24 md:pb-0">
    <section className="bg-[#f4e8df] text-[#292522]"><div className="site-container grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
      <div className="flex flex-col justify-center"><p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">Sănătatea ta merită atenție</p>
        <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">Găsește medici proctologi<br /><span className="text-sky-300">în orașul tău.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">Găsește medici și clinici de proctologie în orașul tău. Compară opțiunile, înțelege serviciile și alege informat.</p>
        <div className="mt-9"><CitySelector cities={cities} /></div>
        <p className="mt-4 text-xs leading-5 text-stone-600">{cities.length} orașe · {doctors.length} profiluri{demoMode || doctors.some((doctor) => doctor.isDemo) ? " · Catalog cu date demonstrative" : ""}</p>
      </div>
      <div className="relative order-first overflow-hidden rounded-3xl border border-orange-200 bg-[#f4e8df] p-3 text-slate-900 shadow-2xl shadow-orange-950/20 lg:order-last"><Image src="/images/editorial-medical.png" alt="Medic într-un cabinet medical modern" width={1536} height={1024} priority className="h-full min-h-80 w-full rounded-2xl object-cover object-top" /><div className="absolute inset-x-8 bottom-8 rounded-xl bg-[#292522]/90 p-5 text-white backdrop-blur-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Un început mai simplu</p><p className="mt-2 text-xl font-medium leading-7">Informații clare pentru o conversație importantă.</p></div></div>
    </div></section>
    <div className="site-container">
      <section id="orase" className="section-space scroll-mt-8"><p className="eyebrow">Aproape de tine</p><div className="section-heading"><h2 className="section-title">Începe cu orașul tău</h2><p className="text-sm text-slate-500">Explorează serviciile disponibile local</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cities.slice(0, 5).map((city, index) => <Link key={city.slug} href={"/" + city.slug} className="group rounded-2xl border bg-white p-5 hover:border-sky-500"><div className="mb-8 flex justify-between"><span className="text-xs font-medium text-slate-400">0{index + 1}</span><ArrowUpRight className="size-5 text-sky-700 transition-transform group-hover:-translate-y-1" aria-hidden="true" /></div><h3 className="font-semibold">{city.cityName}</h3><p className="mt-2 text-xs text-slate-500">{doctors.filter((doctor) => doctor.city === city.cityName).length} profiluri în catalog</p></Link>)}</div>
        {cities.length > 5 && <details className="mt-4 rounded-2xl border bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-700">Alege alt oraș sau localitate</summary><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cities.slice(5).map((city) => <Link key={city.slug} href={"/" + city.slug} className="rounded-xl border bg-white p-3 text-sm hover:border-sky-500"><span className="font-medium">{city.cityName}</span><span className="mt-1 block text-xs text-slate-500">{doctors.filter((doctor) => doctor.city === city.cityName).length} profiluri</span></Link>)}</div></details>}
      </section>
      <CountyMap cities={cities} doctors={doctors} />
      <section className="pb-16"><p className="eyebrow">Explorează catalogul</p><div className="section-heading"><h2 className="section-title">Medici și clinici recomandate</h2><p className="text-xs text-slate-500">Pozițiile promovate sunt etichetate distinct</p></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featured.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>
        {featured.length === 0 && <p className="rounded-xl border p-6">Nu există încă profiluri promovate. Explorează orașele pentru catalogul complet.</p>}
      </section>
      <section className="grid gap-10 rounded-3xl bg-sky-50 p-6 sm:p-10 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">În ritmul tău</p><h2 className="section-title">O cerere simplă.<br />O discuție personală.</h2><p className="mt-6 max-w-md leading-8 text-slate-600">Alege orașul și trimite o cerere de contact. Disponibilitatea și detaliile consultației trebuie confirmate ulterior. Profilurile Demo sunt exemple fictive.</p><ol className="mt-8 space-y-5">{["Alegi orașul și profilul potrivit","Trimiți solicitarea de contact","Confirmi detaliile direct cu partenerul"].map((step,index) => <li key={step} className="flex items-center gap-3 text-sm"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white font-semibold text-sky-800">{index+1}</span>{step}</li>)}</ol></div><LeadForm cities={cities.map((city) => city.cityName)} /></section>
      <FAQ />
      <section className="pb-16"><p className="eyebrow">Experiența pe care o pregătim</p><div className="section-heading"><h2 className="section-title">Mai ușor de ales. Mai simplu de înțeles.</h2></div><p className="mb-6 text-sm text-amber-900">Exemple editoriale demonstrative — nu sunt testimoniale ale unor pacienți reali.</p><div className="grid gap-5 md:grid-cols-3">{["Aș vrea să găsesc toate opțiunile din orașul meu într-un singur loc.","M-ar ajuta să înțeleg serviciile și tarifele înainte să aleg o clinică.","Pentru mine contează o prezentare clară și o abordare discretă."].map((text,index) => <figure key={text} className="rounded-2xl border bg-white p-6"><Quote className="mb-5 size-6 text-sky-700" aria-hidden="true" /><blockquote className="leading-7">{text}</blockquote><figcaption className="mt-6 text-xs text-slate-500">Scenariu ilustrativ {index+1} · fără atribuire unui pacient</figcaption></figure>)}</div></section>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-white"><div><h2 className="text-2xl font-semibold">Reprezinți o clinică?</h2><p className="mt-2 text-sm text-slate-300">Descoperă modelul de parteneriat Proctologi.ro.</p></div><Link href="/pentru-clinici" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900">Devino partener <ArrowUpRight className="ml-2 inline size-4" aria-hidden="true" /></Link></section>
    </div><MobileContactBar />
  </main>;
}

