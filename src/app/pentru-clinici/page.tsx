import { ArrowUpRight, Building2, ChartNoAxesCombined, Handshake, MapPin } from "lucide-react";
import { getCities } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
import { PartnershipForm } from "@/components/partnership-form";

export const revalidate = 300;
export const metadata = pageMetadata("Parteneriate pentru clinici și medici", "Prezintă serviciile clinicii tale pe Proctologi.ro. Descoperă opțiunile de listare și modelul de parteneriat.", "/pentru-clinici");
export default async function ClinicsPage() {
  const cities = await getCities();
  return <main id="continut"><section className="bg-slate-950 text-white"><div className="site-container grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
    <div><p className="eyebrow text-sky-300">Pentru clinici și medici</p><h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">Fii mai aproape de oamenii care caută <span className="text-sky-300">expertiza ta.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Un portal dedicat proctologiei, construit pentru a face serviciile locale mai ușor de găsit și de înțeles.</p><a href="#parteneriat" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-slate-900">Descoperă parteneriatul <ArrowUpRight className="size-4" aria-hidden="true" /></a></div>
    <div className="rounded-3xl border border-white/15 bg-white/5 p-9"><Building2 className="mb-8 size-12 text-sky-300" strokeWidth={1.5} aria-hidden="true" /><h2 className="text-2xl font-semibold">Servicii prezentate clar.<br />Prezență locală relevantă.</h2><p className="mt-5 leading-7 text-slate-300">Profilul clinicii, tarifele orientative și modalitățile de contact, reunite într-o experiență simplă pentru pacient.</p></div>
  </div></section><div className="site-container"><section className="section-space grid gap-5 md:grid-cols-3">{[{Icon:MapPin,title:"Vizibilitate locală",text:"Prezență în pagina orașului și un profil dedicat serviciilor tale."},{Icon:ChartNoAxesCombined,title:"Poziționare promovată",text:"Opțiuni de listare prioritară, marcate transparent pentru vizitatori."},{Icon:Handshake,title:"Solicitări relevante",text:"Un model de colaborare pentru preluarea cererilor, cu acordul persoanei care solicită contactul."}].map(({Icon,title,text}) => <article key={title} className="rounded-2xl border bg-white p-7"><Icon className="mb-6 size-7 text-sky-700" aria-hidden="true" /><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</section>
    <section className="grid items-start gap-10 lg:grid-cols-2"><div><p className="eyebrow">Construim împreună</p><h2 className="section-title">Un parteneriat clar,<br />de la prima conversație.</h2><p className="mt-6 leading-8 text-slate-600">Trimite cererea pentru a discuta un parteneriat. Condițiile de listare, costurile și preluarea solicitărilor vor fi stabilite individual. Nu garantăm un număr de pacienți sau de programări.</p><p className="mt-5 text-sm leading-7 text-slate-500">Datele pacienților nu sunt publice. Accesul partenerilor la solicitări va fi limitat la scopul pentru care pacientul a cerut contactul.</p></div><PartnershipForm cities={cities.map((city) => city.cityName)} /></section>
  </div></main>;
}

