import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck, HeartHandshake, Search, Quote } from "lucide-react";
import { getCities, getDoctors, demoMode } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import { CitySelector } from "@/components/city-selector";
import { DoctorCard } from "@/components/doctor-card";
import { LeadForm } from "@/components/lead-form";
import { FAQ } from "@/components/faq";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { CountyMap } from "@/components/county-map";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Găsește cei mai buni medici proctologi din orașul tău", "Găsește medici și clinici de proctologie în orașul tău. Compară serviciile și cere o programare confidențială.", "/");

export default async function Home() {
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const featured = doctors.filter((doctor) => doctor.isFeatured);
  return <main id="continut">
    <section className="bg-slate-950 text-white"><div className="site-container grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-22">
      <div><p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Sănătatea ta merită atenție</p>
        <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">Găsește cei mai buni medici proctologi<br /><span className="text-sky-300">din orașul tău.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Găsește medici și clinici de proctologie în orașul tău. Compară opțiunile, înțelege serviciile și alege informat.</p>
        <div className="mt-9"><CitySelector cities={cities} /></div>
        <p className="mt-4 text-xs leading-5 text-slate-400">{cities.length} orașe · {doctors.length} profiluri{demoMode || doctors.some((doctor) => doctor.isDemo) ? " · Catalog cu date demonstrative" : ""}</p>
      </div>
      <div className="relative flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
        <span className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-sky-300/10 text-sky-200"><HeartHandshake aria-hidden="true" className="size-9" strokeWidth={1.5} /></span>
        <p className="text-2xl font-medium leading-9 tracking-tight">Unele conversații sunt delicate.<br />Primul pas poate fi simplu.</p>
        <div className="mt-8 space-y-5 border-t border-white/15 pt-7">{[[ShieldCheck,"Respect pentru intimitatea ta"],[MapPin,"Caută în orașul tău"],[Search,"Informații clare, într-un singur loc"]].map(([Icon,text],index) => { const Symbol = Icon as typeof Search; return <p key={index} className="flex items-center gap-3 text-sm text-slate-200"><Symbol className="size-5 text-sky-300" aria-hidden="true" />{text as string}</p>; })}</div>
      </div>
    </div></section>
    <div className="site-container">
      <section id="orase" className="section-space scroll-mt-8"><p className="eyebrow">Aproape de tine</p><div className="section-heading"><h2 className="section-title">Începe cu orașul tău</h2><p className="text-sm text-slate-500">Explorează serviciile disponibile local</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cities.map((city, index) => <Link key={city.slug} href={"/" + city.slug} className="group rounded-2xl border bg-white p-5 hover:border-sky-500"><div className="mb-8 flex justify-between"><span className="text-xs font-medium text-slate-400">0{index + 1}</span><ArrowUpRight className="size-5 text-sky-700 transition-transform group-hover:-translate-y-1" aria-hidden="true" /></div><h3 className="font-semibold">{city.cityName}</h3><p className="mt-2 text-xs text-slate-500">{doctors.filter((doctor) => doctor.city === city.cityName).length} profiluri în catalog</p></Link>)}</div>
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
