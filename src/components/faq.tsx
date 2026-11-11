import { site } from "@/config/site";

export function FAQ() {
  const questions = [
    [`Cum aleg un ${site.singularSpecialistLabel}?`, "Compară specialitatea, localizarea, serviciile și sursa profilului. Confirmă direct cu furnizorul experiența, disponibilitatea și condițiile consultației."],
    ["Cum aflu prețul consultației?", "Tarifele publicate pot fi orientative. Clinica îți confirmă prețul final și eventualele costuri suplimentare înainte de consultație."],
    [`Ce servicii pot căuta în ${site.specialty}?`, site.name.startsWith("Proctologi") ? "Poți căuta consultații, controale și investigații proctologice publicate de furnizori. Medicul stabilește ce este potrivit pentru situația ta." : "Poți căuta consultații de andrologie și investigații publicate de furnizori. Medicul stabilește ce este potrivit pentru situația ta."],
    ["Pot trimite o cerere de contact?", "Da. Formularul înregistrează orașul și datele minime necesare pentru a fi contactat. Programarea se confirmă ulterior direct cu furnizorul."],
  ];
  return <section id="intrebari" className="section-space scroll-mt-8"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="eyebrow">Întrebări frecvente</p><h2 className="section-title">Mai multă claritate.<br />Mai puține griji.</h2><p className="mt-4 max-w-sm text-slate-600 leading-7">Câteva răspunsuri despre alegerea unui specialist și folosirea platformei.</p></div><div className="divide-y rounded-2xl border bg-white px-6">{questions.map(([q,a]) => <details key={q} className="group py-5"><summary className="cursor-pointer pr-4 font-semibold">{q}</summary><p className="mt-4 text-sm leading-7 text-slate-600">{a}</p></details>)}</div></div></section>;
}
