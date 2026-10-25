import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, Phone, Stethoscope, Star } from "lucide-react";
import { getCities, getDoctor } from "@/lib/catalog";
import { jsonLd, pageMetadata, providerSchema } from "@/lib/seo";
import { LeadForm } from "@/components/lead-form";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { site } from "@/config/site";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = await getDoctor((await params).slug);
  if (!doctor) return { title: "Profil negăsit", robots: { index: false, follow: false } };
  return pageMetadata(doctor.name, `${doctor.title}. Servicii și tarife orientative în ${doctor.city}.`, "/medici/" + doctor.slug, doctor.isDemo || !site.indexable);
}
export default async function DoctorPage({ params }: Props) {
  const [doctor, cities] = await Promise.all([getDoctor((await params).slug), getCities()]);
  if (!doctor) notFound();
  const city = cities.find((item) => item.cityName === doctor.city);
  const Icon = doctor.kind === "DOCTOR" ? Stethoscope : Building2;
  return <main id="continut" className="site-container pb-24 md:pb-0">
    <nav aria-label="Fir de navigare" className="flex flex-wrap gap-2 py-7 text-sm text-slate-600"><Link href="/">Acasă</Link><span aria-hidden="true">/</span>{city && <><Link href={"/" + city.slug}>{city.cityName}</Link><span aria-hidden="true">/</span></>}<span>Profil</span></nav>
    {doctor.isDemo && <div className="mb-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Profil demonstrativ.</strong> Toate datele sunt fictive. Acest profil nu reprezintă un medic sau o clinică reală și nu primește programări.</div>}
    <section className="flex flex-col gap-6 rounded-3xl bg-sky-50 p-7 sm:flex-row sm:items-center sm:p-10">
      <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700"><Icon className="size-12" aria-hidden="true" strokeWidth={1.5} /></div>
      <div><p className="eyebrow">{doctor.city} · {doctor.kind === "DOCTOR" ? "Medic" : "Clinică"}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{doctor.name}</h1><p className="mt-3 leading-7 text-slate-600">{doctor.title}</p>{doctor.rating !== null && <p className="mt-3 flex items-center gap-2 text-sm"><Star className="size-4 text-amber-600" aria-hidden="true" />{doctor.rating.toFixed(1)} · {doctor.isDemo ? "rating demonstrativ, fără recenzii reale" : "scor afișat de partener"}</p>}</div>
    </section>
    <div className="grid items-start gap-10 py-10 lg:grid-cols-[1fr_360px]"><div className="space-y-9">
      <section><h2 className="text-2xl font-semibold">Despre {doctor.kind === "DOCTOR" ? "specialist" : "clinică"}</h2><p className="mt-5 whitespace-pre-line leading-8 text-slate-600">{doctor.description}</p>{doctor.sourceUrl && <p className="mt-4 text-sm text-slate-600">Date publice preluate de la <a className="text-sky-800 underline" href={doctor.sourceUrl} target="_blank" rel="noreferrer">pagina furnizorului</a>.</p>}</section>
      <section><h2 className="text-2xl font-semibold">Servicii și tarife</h2><p className="mt-3 text-sm text-slate-500">{doctor.isDemo ? "Exemple de servicii și prețuri fictive pentru prezentarea platformei." : "Prețuri orientative. Confirmă tarifele direct cu partenerul."}</p><dl className="mt-5 divide-y rounded-xl border bg-white px-5">{doctor.services.map((service,index) => <div key={service.name + index} className="flex items-center justify-between gap-4 py-5"><dt className="text-sm">{service.name}</dt><dd className="shrink-0 font-semibold">{service.price} lei</dd></div>)}</dl>{doctor.services.length === 0 && <p className="mt-4 text-sm">Tarife disponibile la cerere.</p>}</section>
      <section><h2 className="text-2xl font-semibold">Locație și contact</h2><p className="mt-5 flex gap-2 text-sm leading-6 text-slate-600"><MapPin className="size-5 shrink-0" aria-hidden="true" />{doctor.address}</p>
        {doctor.isDemo ? <div className="mt-5 rounded-xl border border-dashed bg-slate-100 p-8 text-sm leading-7 text-slate-600"><p>Harta nu este afișată pentru o adresă fictivă.</p><p>Telefon demonstrativ: {doctor.phone}</p><p className="break-all">Email demonstrativ: {doctor.email}</p></div> : <><a href={`tel:${doctor.phone.replace(/[^+0-9]/g, "")}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-700 px-5 py-3 font-medium text-white"><Phone className="size-4" aria-hidden="true" />{doctor.phone}</a><p className="mt-3 text-sm"><a href={`mailto:${doctor.email}`} className="text-sky-800 underline">{doctor.email}</a></p><details className="mt-6 rounded-xl border bg-white p-5"><summary className="cursor-pointer font-medium">Afișează locația pe Google Maps</summary><p className="my-3 text-xs leading-5 text-slate-500">Harta este furnizată de Google. La încărcare, browserul se conectează la acest serviciu.</p><iframe title={`Locația ${doctor.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(doctor.address + ", România")}&output=embed`} loading="lazy" referrerPolicy="no-referrer" className="h-72 w-full rounded-lg border-0" /></details></>}
      </section>
    </div><aside><LeadForm cities={cities.map((item) => item.cityName)} city={doctor.city} doctorName={doctor.name} doctorId={doctor.id} isDemo={doctor.isDemo} /></aside></div>
    {!doctor.isDemo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...providerSchema(doctor) }) }} />}
    <MobileContactBar phone={doctor.isDemo ? undefined : doctor.phone} />
  </main>;
}

