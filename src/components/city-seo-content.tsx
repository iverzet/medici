import { site } from "@/config/site";
import { COUNTIES } from "@/lib/romania-counties";
import { blogArticles } from "@/lib/blog";

type Props = { cityName: string; countyCode?: string; isMunicipality?: boolean; suggestedNames: string[] };

export function CitySeoContent({ cityName, countyCode, isMunicipality, suggestedNames }: Props) {
  const nearby = suggestedNames.length > 0 ? suggestedNames.join(", ") : "orașele apropiate disponibile în catalog";
  const county = COUNTIES.find((item) => item.code === countyCode);
  const localityLabel = isMunicipality ? "municipiul" : "orașul";
  const relatedArticles = blogArticles.slice(0, 3);
  const topics = site.name.startsWith("Proctologi")
    ? ["consultație proctologică", "evaluarea simptomelor anorectale", "anoscopie și investigații recomandate de medic"]
    : ["consultație de andrologie", "evaluarea sănătății masculine", "investigații recomandate de medic în funcție de simptome"];
  return <section className="site-container space-y-10 py-12">
    <div className="max-w-3xl">
      <p className="eyebrow">Ghid local</p>
      <h2 className="section-title">Cum găsești un {site.singularSpecialistLabel} în {cityName}</h2>
      <p className="mt-5 leading-8 text-slate-600">Când cauți un {site.singularSpecialistLabel} în {cityName}, începe cu informațiile care pot fi verificate: specialitatea, localizarea, serviciile publicate și modalitatea de contact. {localityLabel.charAt(0).toUpperCase() + localityLabel.slice(1)} {cityName} se află în județul {county?.name ?? "din România"}, în regiunea {county?.region ?? "România"}; de aceea, atunci când nu există o opțiune în localitate, are sens să verifici și centrele medicale din județ. Platforma te ajută să compari opțiunile disponibile și să trimiți o cerere de contact fără să publici date medicale.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Servicii de urmărit", `${topics.join(", ")}. În ${cityName}, întreabă furnizorul ce servicii sunt disponibile efectiv și dacă este nevoie de trimitere.`],
        ["Întrebări utile", `Întreabă în ${cityName} despre disponibilitate, pregătirea pentru consultație, costul final și ce documente trebuie să aduci.`],
        ["Alegere informată", "Verifică sursa profilului și confirmă direct cu clinica adresa, programul și detaliile consultației înainte de deplasare."]
      ].map(([title, text]) => <article key={title} className="rounded-2xl border bg-white p-6"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}
    </div>
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl bg-sky-50 p-6"><h3 className="text-xl font-semibold">Dacă nu există încă un profil în {cityName}</h3><p className="mt-3 leading-7 text-slate-600">Poți solicita contactul unui partener din apropiere. În prezent, opțiunile publicate din zona ta includ: {nearby}.</p></div>
      <div className="divide-y rounded-2xl border bg-white px-6">
        {[
          [`Cum găsesc un ${site.singularSpecialistLabel} în ${cityName}?`, `Folosește lista de profiluri și filtrele după serviciu. Dacă ${localityLabel} ${cityName} nu are încă un profil publicat, consultă sugestiile din ${county?.name ? `județul ${county.name}` : "orașele apropiate"}.`],
          ["Ce trebuie să confirm înainte de programare?", "Confirmă direct cu furnizorul disponibilitatea, tariful, adresa, durata consultației și eventualele instrucțiuni de pregătire."],
          [`Pot cere o recomandare din ${cityName} către alt oraș?`, `Da. Formularul de contact poate porni de la ${cityName}, iar platforma îți poate indica opțiuni publicate în zona apropiată.`]
        ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer pr-4 font-semibold">{question}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p></details>)}
      </div>
    </div>
    <div className="rounded-2xl border bg-white p-6"><p className="eyebrow">Resurse pentru pacienți</p><h3 className="mt-2 text-xl font-semibold">Întrebări frecvente despre {site.specialty}</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{relatedArticles.map((article) => <a key={article.slug} href={`/blog/${article.slug}`} className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-sky-800 hover:border-sky-500">{article.title}<span className="mt-2 block text-xs font-normal text-slate-500">Citește ghidul</span></a>)}</div></div>
  </section>;
}

