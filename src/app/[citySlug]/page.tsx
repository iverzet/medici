import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCities, getCity, getDoctors, filterDoctors, demoMode } from "@/lib/catalog";
import { jsonLd, pageMetadata, providerSchema } from "@/lib/seo";
import { DoctorCard } from "@/components/doctor-card";
import { DoctorFilters } from "@/components/doctor-filters";
import { LeadForm } from "@/components/lead-form";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ citySlug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await getCity((await params).citySlug);
  if (!city) return { title: "Oraș negăsit", robots: { index: false, follow: false } };
  const doctors = (await getDoctors()).filter((doctor) => doctor.city === city.cityName && !doctor.isDemo);
  if (doctors.length === 0) return { ...pageMetadata(city.metaTitle, city.metaDescription, "/" + city.slug), robots: { index: false, follow: false } };
  return pageMetadata(city.metaTitle, city.metaDescription, "/" + city.slug);
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
  return <main id="continut">
    <section className="border-b bg-sky-50"><div className="site-container py-12 sm:py-16">
      <nav aria-label="Fir de navigare" className="mb-6 text-sm text-slate-600"><Link href="/">Acasă</Link><span aria-hidden="true"> / </span><span>{city.cityName}</span></nav>
      <p className="eyebrow">Specialiști în orașul tău</p><h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Proctologi și clinici de proctologie în {city.cityName}</h1>
      <p className="mt-6 max-w-3xl leading-8 text-slate-600">{city.contentIntro}</p>
      {(demoMode || cityDoctors.some((doctor) => doctor.isDemo)) && <p className="mt-6 inline-block rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-900">Catalog demonstrativ. Profilurile Demo, adresele și tarifele sunt fictive.</p>}
    </div></section>
    <div className="site-container grid items-start gap-8 py-10 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="rezultate"><DoctorFilters key={kind + service} path={"/" + city.slug} kind={kind} service={service} services={services} />
        <h2 id="rezultate" className="my-6 text-sm font-medium text-slate-600">{filtered.length} {filtered.length === 1 ? "profil găsit" : "profiluri găsite"}</h2>
        <div className="grid gap-5 xl:grid-cols-2">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>
        {filtered.length === 0 && <div className="rounded-2xl border bg-white p-8"><h3 className="text-xl font-semibold">Niciun profil pentru aceste filtre</h3><p className="my-3 text-slate-600">Încearcă un alt serviciu sau afișează toate profilurile din oraș.</p><Link href={"/" + city.slug} className="font-semibold text-sky-800 underline">Resetează filtrele</Link></div>}
      </section>
      <aside><LeadForm cities={cities.map((item) => item.cityName)} city={city.cityName} /></aside>
    </div>
    {realDoctors.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", name: city.metaTitle, url: new URL("/" + city.slug, site.url).href, mainEntity: { "@type": "ItemList", itemListElement: realDoctors.map((doctor,index) => ({ "@type": "ListItem", position: index+1, item: providerSchema(doctor) })) } }) }} />}
    <MobileContactBar />
  </main>;
}
