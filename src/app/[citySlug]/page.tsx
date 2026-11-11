import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCities, getCity, getDoctors, filterDoctors, getSuggestedCities, demoMode } from "@/lib/catalog";
import { jsonLd, pageMetadata, providerSchema } from "@/lib/seo";
import { DoctorCard } from "@/components/doctor-card";
import { DoctorFilters } from "@/components/doctor-filters";
import { LeadForm } from "@/components/lead-form";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { site } from "@/config/site";

export const revalidate = 300;
type Props = { params: Promise<{ citySlug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await getCity((await params).citySlug);
  if (!city) return { title: "Oraș negăsit", robots: { index: false, follow: false } };
  const title = `${site.specialistLabel} și clinici de ${site.specialty} în ${city.cityName}`;
  const description = `Cauți un ${site.singularSpecialistLabel} în ${city.cityName}? Compară profiluri publicate, servicii și modalități de contact pentru ${site.specialty}.`;
  return pageMetadata(title, description, "/" + city.slug);
}
export default async function CityPage({ params, searchParams }: Props) {
  const [{ citySlug }, query, cities, doctors] = await Promise.all([params, searchParams, getCities(), getDoctors()]);
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) notFound();
  const kind = typeof query.tip === "string" && ["DOCTOR", "CLINIC"].includes(query.tip) ? query.tip : "";
  const cityDoctors = doctors.filter((doctor) => doctor.city === city.cityName);
  const services = [...new Set(cityDoctors.flatMap((doctor) => doctor.services.map((service) => service.name)))];
  const service = typeof query.serviciu === "string" ? query.serviciu : "";
  const filtered = filterDoctors(cityDoctors, kind, service);
  const realDoctors = cityDoctors.filter((doctor) => !doctor.isDemo);
  const suggestedCities = getSuggestedCities(city, cities, doctors);
  const servicesSummary = [...new Set(realDoctors.flatMap((doctor) => doctor.services.map((item) => item.name)))].slice(0, 4);
  return <main id="continut" className="pb-24 md:pb-0">
    <section className="border-b bg-sky-50"><div className="site-container py-12 sm:py-16">
      <nav aria-label="Fir de navigare" className="mb-6 text-sm text-slate-600"><Link href="/">Acasă</Link><span aria-hidden="true"> / </span><span>{city.cityName}</span></nav>
      <p className="eyebrow">Specialiști în orașul tău</p><h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{site.specialistLabel} și clinici de {site.specialty} în {city.cityName}</h1>
      <p className="mt-6 max-w-3xl leading-8 text-slate-600">{city.contentIntro}</p>
      {realDoctors.length > 0 ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">Cauți un {site.singularSpecialistLabel} în {city.cityName}? Sunt publicate {realDoctors.length} {realDoctors.length === 1 ? "profil verificat" : "profiluri verificate"}{servicesSummary.length > 0 ? `, cu servicii precum ${servicesSummary.join(", ")}.` : "."}</p> : <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">Nu avem încă un profil publicat în {city.cityName}. Îți arătăm opțiuni din orașe apropiate, iar cererea ta poate fi direcționată către un partener disponibil.</p>}
      {(demoMode || cityDoctors.some((doctor) => doctor.isDemo)) && <p className="mt-6 inline-block rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-900">Catalog demonstrativ. Profilurile Demo, adresele și tarifele sunt fictive.</p>}
    </div></section>
    <div className="site-container grid items-start gap-8 py-10 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="rezultate"><DoctorFilters key={kind + service} path={"/" + city.slug} kind={kind} service={service} services={services} />
        <h2 id="rezultate" className="my-6 text-sm font-medium text-slate-600">{filtered.length} {filtered.length === 1 ? "profil găsit" : "profiluri găsite"}</h2>
        <div className="grid gap-5 xl:grid-cols-2">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>
        {filtered.length === 0 && realDoctors.length > 0 && <div className="rounded-2xl border bg-white p-8"><h3 className="text-xl font-semibold">Niciun profil pentru aceste filtre</h3><p className="my-3 text-slate-600">Încearcă un alt serviciu sau afișează toate profilurile din oraș.</p><Link href={"/" + city.slug} className="font-semibold text-sky-800 underline">Resetează filtrele</Link></div>}
        {realDoctors.length === 0 && <div className="rounded-2xl border border-sky-100 bg-white p-8"><h2 className="text-xl font-semibold">Specialiști din orașele apropiate</h2><p className="mt-3 text-slate-600">Pentru {city.cityName}, cele mai apropiate opțiuni publicate sunt:</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{suggestedCities.map((suggestedCity) => <Link key={suggestedCity.slug} href={"/" + suggestedCity.slug} className="rounded-xl border border-slate-200 p-4 font-semibold text-sky-800 hover:border-sky-500">{site.specialistLabel} în {suggestedCity.cityName}<span className="mt-1 block text-xs font-normal text-slate-500">Vezi profilurile disponibile</span></Link>)}</div></div>}
      </section>
      <aside><LeadForm cities={cities.map((item) => item.cityName)} city={city.cityName} /></aside>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", name: `${site.specialistLabel} și clinici de ${site.specialty} în ${city.cityName}`, url: new URL("/" + city.slug, site.url).href, mainEntity: { "@type": "ItemList", numberOfItems: realDoctors.length, itemListElement: realDoctors.map((doctor,index) => ({ "@type": "ListItem", position: index+1, item: providerSchema(doctor) })) } }) }} />
    <MobileContactBar />
  </main>;
}

