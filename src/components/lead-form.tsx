"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { submitLead } from "@/app/actions/requests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { leadSchema, type LeadInput, type ActionResult } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LeadForm({ cities, city = "", doctorName, doctorId, isDemo = false }: { cities: string[]; city?: string; doctorName?: string; doctorId?: string; isDemo?: boolean }) {
  const id = useId();
  const cityListId = `${id}-cities`;
  const requestId = useRef<string | null>(null);
  const website = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema), defaultValues: { city, consent: false, message: "", patientEmail: "", preferredDate: "" },
  });
  async function onSubmit(data: LeadInput) {
    requestId.current ??= crypto.randomUUID();
    try { setResult(await submitLead(data, { requestId: requestId.current, website: website.current?.value || "", doctorId })); }
    catch { setResult({ ok: false, message: "Conexiunea a fost întreruptă. Reîncearcă trimiterea." }); }
  }
  return <section id="programare" className="scroll-mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8" aria-labelledby={id + "-title"}>
    <p className="eyebrow"><LockKeyhole className="inline size-4" aria-hidden="true" /> Un pas, în ritmul tău</p>
    <h2 id={id + "-title"} className="mt-3 text-2xl font-semibold">Cere o programare</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">{doctorName ? `Profil selectat: ${doctorName}` : "Alege orașul și lasă-ne datele de contact."}</p>
    <p id={id + "-notice"} className="my-5 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">{isDemo ? "Acesta este un profil fictiv și nu primește programări. Poți folosi formularul general de pe pagina orașului." : doctorName ? "Cererea ta este asociată acestui profil. Programarea este confirmată numai după răspunsul furnizorului." : "Cererea este preluată de echipa platformei pentru a te orienta către un furnizor disponibil. Nu reprezintă o programare confirmată."}</p>
    {result && <div role={result.ok ? "status" : "alert"} className="my-4 rounded-lg bg-sky-50 p-4 text-sm">{result.message}{result.reference && <p className="mt-2 break-all text-xs">Referință: {result.reference}</p>}</div>}
    <form onSubmit={(event) => { void handleSubmit(onSubmit)(event); }} aria-describedby={id + "-notice"}>
      <div className="hidden" aria-hidden="true"><label>Website<input ref={website} name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <fieldset disabled={isDemo || isSubmitting || result?.ok} className="space-y-4 disabled:opacity-65"><legend className="sr-only">Date pentru solicitarea programării</legend>
        <div><Label htmlFor={id + "-name"}>Nume</Label><Input id={id + "-name"} autoComplete="name" aria-invalid={Boolean(errors.patientName)} aria-describedby={errors.patientName ? id + "-name-error" : undefined} {...register("patientName")} /><p id={id + "-name-error"} className="text-sm text-destructive">{errors.patientName?.message}</p></div>
        <div><Label htmlFor={id + "-phone"}>Telefon</Label><Input id={id + "-phone"} type="tel" autoComplete="tel" aria-invalid={Boolean(errors.patientPhone)} aria-describedby={errors.patientPhone ? id + "-phone-error" : undefined} {...register("patientPhone")} /><p id={id + "-phone-error"} className="text-sm text-destructive">{errors.patientPhone?.message}</p></div>
        <div><Label htmlFor={id + "-city"}>Oraș</Label><Input id={id + "-city"} list={cityListId} autoComplete="address-level2" placeholder="Începe să scrii orașul" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? id + "-city-error" : undefined} {...register("city")} /><datalist id={cityListId}>{cities.map((name) => <option key={name} value={name} />)}</datalist><p id={id + "-city-error"} className="text-sm text-destructive">{errors.city?.message}</p></div>
        <div><Label htmlFor={id + "-email"}>Email (opțional)</Label><Input id={id + "-email"} type="email" autoComplete="email" aria-invalid={Boolean(errors.patientEmail)} aria-describedby={errors.patientEmail ? id + "-email-error" : undefined} {...register("patientEmail")} /><p id={id + "-email-error"} className="text-sm text-destructive">{errors.patientEmail?.message}</p></div>
        <div><Label htmlFor={id + "-date"}>Data preferată (opțional)</Label><Input id={id + "-date"} type="date" aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? id + "-date-error" : undefined} {...register("preferredDate")} /><p id={id + "-date-error"} className="text-sm text-destructive">{errors.preferredDate?.message}</p></div>
        <div><Label htmlFor={id + "-message"}>Mesaj scurt (opțional)</Label><textarea id={id + "-message"} rows={3} maxLength={1000} className="field mt-1 h-auto" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? id + "-message-error" : undefined} {...register("message")} /><p id={id + "-message-error"} className="text-sm text-destructive">{errors.message?.message}</p></div>
        <p className="text-xs text-slate-500">Nu include diagnostice, rezultate de analize sau alte informații medicale în mesaj.</p>
        <label className="flex items-start gap-2 text-xs leading-5"><input type="checkbox" className="mt-1" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? id + "-consent-error" : undefined} {...register("consent")} /><span>Sunt de acord cu prelucrarea datelor acestei cereri pentru a fi contactat, conform <Link href="/confidentialitate" className="underline">informării de confidențialitate</Link>.</span></label>
        <p id={id + "-consent-error"} className="text-sm text-destructive">{errors.consent?.message}</p>
        <Button type="submit" className="w-full">{isSubmitting ? "Se trimite…" : result?.ok ? "Cerere înregistrată" : "Trimite cererea"}</Button>
      </fieldset>
    </form>
  </section>;
}
