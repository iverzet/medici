import { site } from "@/config/site";

type Props = { cityName: string; suggestedNames: string[] };

export function CitySeoContent({ cityName, suggestedNames }: Props) {
  const nearby = suggestedNames.length > 0 ? suggestedNames.join(", ") : "orașele apropiate disponibile în catalog";
  const topics = site.name.startsWith("Proctologi")
    ? ["consultație proctologică", "evaluarea simptomelor anorectale", "anoscopie și investigații recomandate de medic"]
    : ["consultație de andrologie", "evaluarea sănătății masculine", "investigații recomandate de medic în funcție de simptome"];
  return <section className="site-container space-y-10 py-12">
    <div className="max-w-3xl">
      <p className="eyebrow">Ghid local</p>
      <h2 className="section-title">Cum găsești un {site.singularSpecialistLabel} în {cityName}</h2>
      <p className="mt-5 leading-8 text-slate-600">Când cauți un {site.singularSpecialistLabel} în {cityName}, începe cu informațiile care pot fi verificate: specialitatea, localizarea, serviciile publicate și modalitatea de contact. Platforma te ajută să compari opțiunile disponibile și să trimiți o cerere de contact fără să publici date medicale.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Servicii de urmărit", topics.join(", ") + "."],
        ["Întrebări utile", "Întreabă despre disponibilitate, pregătirea pentru consultație, costul final și ce documente trebuie să aduci."],
        ["Alegere informată", "Verifică sursa profilului și confirmă direct cu clinica adresa, programul și detaliile consultației."]
      ].map(([title, text]) => <article key={title} className="rounded-2xl border bg-white p-6"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}
    </div>
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl bg-sky-50 p-6"><h3 className="text-xl font-semibold">Dacă nu există încă un profil în {cityName}</h3><p className="mt-3 leading-7 text-slate-600">Poți solicita contactul unui partener din apropiere. În prezent, opțiunile publicate din zona ta includ: {nearby}.</p></div>
      <div className="divide-y rounded-2xl border bg-white px-6">
        {[
          [`Cum găsesc un ${site.singularSpecialistLabel} în ${cityName}?`, `Folosește lista de profiluri și filtrele după serviciu. Dacă orașul nu are încă un profil publicat, consultă sugestiile din orașele apropiate.`],
          ["Ce trebuie să confirm înainte de programare?", "Confirmă direct cu furnizorul disponibilitatea, tariful, adresa, durata consultației și eventualele instrucțiuni de pregătire."],
          [`Pot cere o recomandare din ${cityName} către alt oraș?`, `Da. Formularul de contact poate porni de la ${cityName}, iar platforma îți poate indica opțiuni publicate în zona apropiată.`]
        ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer pr-4 font-semibold">{question}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p></details>)}
      </div>
    </div>
  </section>;
}

