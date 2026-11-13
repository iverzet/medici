import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Quote } from "lucide-react";
import { getCities, getDoctors } from "@/lib/catalog";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { CitySelector } from "@/components/city-selector";
import { DoctorCard } from "@/components/doctor-card";
import { LeadForm } from "@/components/lead-form";
import { FAQ } from "@/components/faq";
import { CountyMap } from "@/components/county-map";

export const revalidate = 300;
export const metadata = pageMetadata("Găsește medici proctologi în orașul tău", "Găsește medici și clinici de proctologie în orașul tău. Compară serviciile și cere o programare confidențială.", "/");

export default async function Home() {
  const [cities, doctors] = await Promise.all([getCities(), getDoctors()]);
  const publicDoctors = doctors.filter((doctor) => !doctor.isDemo);
  const featured = publicDoctors.filter((doctor) => doctor.isFeatured);
  const popularCities = [...cities].sort((a, b) => publicDoctors.filter((doctor) => doctor.city === b.cityName).length - publicDoctors.filter((doctor) => doctor.city === a.cityName).length || a.cityName.localeCompare(b.cityName, "ro"));
  return <main id="continut" className="pb-24 md:pb-0">
    <section className="relative isolate overflow-hidden bg-[#091522] text-white"><div className="pointer-events-none absolute -left-32 top-0 -z-10 size-96 rounded-full bg-teal-500/20 blur-3xl" /><div className="pointer-events-none absolute right-0 top-1/3 -z-10 size-[28rem] rounded-full bg-sky-500/15 blur-3xl" /><div className="site-container grid gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-20">
      <div className="flex flex-col justify-center"><div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300"><span className="size-2 rounded-full bg-teal-300 shadow-[0_0_0_6px_rgba(45,212,191,0.12)]" />Sănătate, explicată simplu</div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[4.8rem]">Găsește medicul<br /><span className="bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-300 bg-clip-text text-transparent">potrivit pentru tine.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Medici și clinici de proctologie, organizați pe orașe și servicii. Începe cu locul în care ai nevoie de ajutor.</p>
        <div className="mt-9 max-w-xl"><CitySelector cities={cities} /></div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400"><span>{cities.length} orașe acoperite</span><span>{publicDoctors.length} profiluri din surse publice</span><span>Actualizat periodic</span></div>
      </div>
      <div className="relative order-first lg:order-last"><div className="relative overflow-hidden rounded-[2rem] bg-white/10 p-1 shadow-2xl shadow-slate-950/30"><Image src="/images/hero-proctology-v2.png" alt="Pacient discutând cu un medic proctolog într-un cabinet discret" width={1536} height={1024} sizes="(max-width: 1023px) 100vw, 50vw" priority className="h-full min-h-80 w-full rounded-[1.8rem] object-cover object-top" /><div className="absolute inset-x-7 bottom-7 rounded-[1.5rem] bg-[#f7f3eb] p-5 text-slate-950 shadow-[0_18px_45px_rgba(2,8,23,0.28)] sm:p-6"><span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-teal-500 shadow-[0_0_0_5px_rgba(20,184,166,0.18)]" /><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-800">Proctologie, fără ocolișuri</p><p className="mt-2 text-xl font-semibold leading-7 tracking-tight sm:text-2xl">Înțelege opțiunile. Alege următorul pas.</p><div className="mt-4 grid gap-2 text-xs font-medium text-slate-700 sm:grid-cols-3"><span className="rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-center">Servicii clare</span><span className="rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-center">Opțiuni locale</span><span className="rounded-full border border-slate-300 bg-white/70 px-3 py-2 text-center">Cerere discretă</span></div></div></div></div>
    </div></section>
    <div className="site-container">
      <section id="orase" className="section-space scroll-mt-8"><p className="eyebrow">Aproape de tine</p><div className="section-heading"><h2 className="section-title">Orașe populare</h2><p className="text-sm text-slate-500">Pentru toate celelalte localități, folosește harta de mai jos.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{popularCities.slice(0, 5).map((city, index) => { const count = publicDoctors.filter((doctor) => doctor.city === city.cityName).length; return <Link key={city.slug} href={"/" + city.slug} className="group rounded-[1.3rem] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"><div className="mb-8 flex justify-between"><span className="text-xs font-medium text-slate-400">0{index + 1}</span><ArrowUpRight className="size-5 text-teal-700 transition-transform group-hover:-translate-y-1" aria-hidden="true" /></div><h3 className="font-semibold">{city.cityName}</h3><p className="mt-2 text-xs text-slate-500">{count} {count === 1 ? "profil publicat" : "profiluri publicate"}</p></Link>})}</div>
      </section>
      <CountyMap cities={cities} doctors={publicDoctors} />
      <section className="pb-16"><p className="eyebrow">Explorează catalogul</p><div className="section-heading"><h2 className="section-title">Medici și clinici recomandate</h2><p className="text-xs text-slate-500">Pozițiile promovate sunt etichetate distinct</p></div>
        {publicDoctors.length > 0 ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{(featured.length > 0 ? featured : publicDoctors.slice(0, 3)).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div> : <div className="rounded-2xl border bg-white p-7"><h3 className="text-xl font-semibold">Catalogul se actualizează</h3><p className="mt-3 max-w-2xl leading-7 text-slate-600">Profilurile sunt publicate după verificarea sursei și a datelor de contact. Poți trimite o cerere, iar echipa noastră te poate orienta către o opțiune disponibilă.</p></div>}
      </section>
      <section className="grid gap-10 rounded-3xl bg-sky-50 p-6 sm:p-10 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">În ritmul tău</p><h2 className="section-title">O cerere simplă.<br />O discuție personală.</h2><p className="mt-6 max-w-md leading-8 text-slate-600">Alege orașul și trimite o cerere de contact. Disponibilitatea și detaliile consultației se confirmă ulterior.</p><ol className="mt-8 space-y-5">{["Alegi orașul și profilul potrivit","Trimiți solicitarea de contact","Confirmi detaliile direct cu partenerul"].map((step,index) => <li key={step} className="flex items-center gap-3 text-sm"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white font-semibold text-sky-800">{index+1}</span>{step}</li>)}</ol></div><LeadForm cities={cities.map((city) => city.cityName)} /></section>
      <FAQ />
      <section className="pb-16"><p className="eyebrow">Pentru o alegere informată</p><div className="section-heading"><h2 className="section-title">Mai ușor de ales. Mai simplu de înțeles.</h2></div><div className="grid gap-5 md:grid-cols-3">{[["Date publice", "Fiecare profil trimite către sursa furnizorului, pentru verificarea informațiilor publicate."], ["Alegere locală", "Filtrează după oraș și serviciu, apoi compară opțiunile înainte de contact."], ["Cerere confidențială", "Trimite numai datele necesare pentru a fi contactat; nu include informații medicale în formular."]].map(([title, text]) => <article key={title} className="rounded-2xl border bg-white p-6"><Quote className="mb-5 size-6 text-sky-700" aria-hidden="true" /><h3 className="font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div></section>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-white"><div><h2 className="text-2xl font-semibold">Reprezinți o clinică?</h2><p className="mt-2 text-sm text-slate-300">Descoperă modelul de parteneriat Proctologi.ro.</p></div><Link href="/pentru-clinici" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900">Devino partener <ArrowUpRight className="ml-2 inline size-4" aria-hidden="true" /></Link></section>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", name: site.name, url: site.url, inLanguage: "ro-RO", description: site.description }, { "@type": "Organization", name: site.name, url: site.url, email: site.email }] }) }} />
  </main>;
}

