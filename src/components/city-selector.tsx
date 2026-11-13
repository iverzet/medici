"use client";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CitySelector({ cities }: { cities: { cityName: string; slug: string }[] }) {
  const router = useRouter();
  const id = useId();
  return <form className="rounded-[1.35rem] border border-slate-200/80 bg-white p-3 text-slate-900 shadow-2xl shadow-slate-950/20" onSubmit={(event) => {
    event.preventDefault();
    const slug = new FormData(event.currentTarget).get("city");
    if (typeof slug === "string" && cities.some((city) => city.slug === slug)) router.push("/" + slug);
  }}>
    <label htmlFor={id} className="mb-2 block px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">În ce oraș cauți un specialist?</label>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3"><MapPin className="size-5 shrink-0 text-teal-700" aria-hidden="true" /><select id={id} name="city" required defaultValue="" className="min-h-11 w-full min-w-0 bg-transparent text-base"><option value="" disabled>Alege orașul</option>{cities.map((city) => <option key={city.slug} value={city.slug}>{city.cityName}</option>)}</select></div><Button type="submit" size="lg" className="rounded-xl bg-teal-700 px-5 shadow-lg shadow-teal-700/20 hover:bg-teal-800">Caută <ArrowRight aria-hidden="true" /></Button></div>
  </form>;
}
