export type BlogArticle = { slug: string; title: string; excerpt: string; category: string; publishedAt: string; readTime: string; author: string; reviewedBy: string; sources: { label: string; url: string }[]; content: string[]; };
const topics = [
  ["Când este recomandat un consult", "Semnele care merită discutate cu un specialist și cum te pregătești pentru prima vizită."],
  ["Cum te pregătești pentru consultație", "Un checklist simplu pentru o discuție mai clară și mai confortabilă cu medicul."],
  ["Ce întrebări să pui medicului", "Întrebări utile despre evaluare, opțiuni și pașii următori."],
  ["Cum alegi un specialist în orașul tău", "Criterii practice pentru a compara profiluri și a cere o programare."],
  ["Consultație online sau la cabinet", "Ce poate clarifica fiecare variantă și când este necesară evaluarea directă."],
  ["Simptome persistente: când ceri ajutor", "De ce simptomele repetate merită evaluate și cum descrii corect ce simți."],
  ["Investigații medicale: la ce să te aștepți", "Cum se discută recomandările și ce înseamnă rezultatele în contextul tău."],
  ["Prevenție și obiceiuri zilnice", "Pași generali care susțin sănătatea și nu înlocuiesc sfatul medical."],
  ["Mituri frecvente despre specialitate", "Cum separi informațiile utile de afirmațiile fără bază medicală."],
  ["Cum găsești o clinică potrivită", "Ce informații să verifici înainte să trimiți o cerere de contact."],
  ["Prima vizită fără emoții", "Un ghid empatic pentru a transforma îngrijorarea într-o conversație clară."],
  ["Tarife și programări: ce verifici", "Întrebări despre cost, disponibilitate și confirmarea programării."],
  ["Când ceri o a doua opinie", "Situații în care o discuție suplimentară poate ajuta la înțelegerea opțiunilor."],
  ["Cum notezi istoricul simptomelor", "Un model simplu de jurnal pe care îl poți arăta medicului."],
  ["Date medicale și confidențialitate", "Cum folosești formularele online fără să trimiți informații medicale sensibile inutil."],
  ["Specialist sau clinică: diferențe", "Cum alegi tipul de furnizor potrivit nevoii tale."],
  ["Când este o urgență", "Semne pentru care trebuie să apelezi serviciile de urgență, nu să aștepți o programare."],
  ["Cum verifici informațiile medicale online", "Repere pentru surse credibile și întrebări bune pentru medic."],
  ["Consultația pentru bărbați ocupați", "Cum pregătești eficient o programare și ce informații contează."],
  ["După consultație: pașii următori", "Cum urmărești recomandările și când revii cu întrebări."],
] as const;
const variants = ["ghid practic", "întrebări și răspunsuri", "ce merită știut", "explicat simplu", "checklist pentru programare"] as const;
const guidance = ["Descrie când au început simptomele, ce le agravează și ce ai încercat deja.", "Pregătește documentele relevante și o listă scurtă de întrebări pentru consultație.", "Întreabă despre opțiuni, beneficii, riscuri, costuri și semnele pentru care trebuie să revii.", "Compară specialiștii după experiență, servicii, localitate și disponibilitatea confirmată.", "Alege online doar pentru discuții potrivite; unele simptome necesită examinare la cabinet.", "Notează frecvența și intensitatea simptomelor, fără să încerci autodiagnosticarea.", "Investigațiile se recomandă individual; rezultatul trebuie interpretat împreună cu istoricul.", "Obiceiurile zilnice pot susține sănătatea, dar nu înlocuiesc evaluarea unui specialist.", "Verifică sursa și data informației înainte să iei o decizie medicală.", "Confirmă înainte de trimitere ce include consultația și cum se face programarea.", "Poți spune direct ce te îngrijorează; o conversație clară ajută medicul să te ghideze.", "Întreabă dacă tariful include controlul, investigațiile sau o eventuală reevaluare.", "O a doua opinie poate clarifica opțiunile când recomandarea sau diagnosticul rămâne neclar.", "Un jurnal simplu al simptomelor îl ajută pe medic să observe evoluția în timp.", "Trimite doar datele necesare și evită să incluzi rezultate medicale într-un formular general.", "Clinica oferă infrastructură, iar medicul oferă evaluarea; verifică cine va face consultația.", "Pentru agravare bruscă, durere severă sau sângerare importantă, sună la 112.", "Preferă surse medicale și discută orice informație online cu un specialist.", "Pregătește programarea din timp și păstrează confirmarea contactului.", "Respectă recomandările primite și contactează medicul dacă apar schimbări sau întrebări noi."] as const;
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const blogArticles: BlogArticle[] = topics.flatMap(([topic, intro], topicIndex) => variants.map((variant, variantIndex) => {
  const title = `${topic}? – ${variant}`;
  return { slug: `${slugify(topic)}-${variantIndex + 1}`, title, excerpt: intro, category: topicIndex % 2 ? "Prima vizită" : "Ghid medical", publishedAt: `2026-${String(10 - Math.floor(topicIndex / 4)).padStart(2, "0")}-${String(20 - variantIndex).padStart(2, "0")}`, readTime: `${4 + (topicIndex + variantIndex) % 4} min`, author: "Redacția medicală", reviewedBy: "Fără aviz medical individual", sources: [{ label: "NIDDK – informații pentru pacienți", url: "https://www.niddk.nih.gov/health-information" }, { label: "NHS – ghiduri pentru pacienți", url: "https://www.nhs.uk/conditions/" }], content: [
    `${topic} este o întrebare frecventă. Informațiile de mai jos sunt orientative și te ajută să pregătești o discuție cu un medic specialist în proctologie.`,
    guidance[topicIndex],
    `Notează simptomele, momentul apariției și întrebările pe care le ai. Un specialist poate interpreta aceste informații împreună cu istoricul tău și poate recomanda următorii pași.`,
    "Nu trimite diagnostice sau rezultate de analize într-un formular general. Pentru simptome severe sau care se agravează rapid, apelează serviciile de urgență.",
    `Dacă vrei să discuți cu un specialist, alege orașul din catalog și trimite o cerere de contact. Cererea nu reprezintă o programare confirmată; disponibilitatea se confirmă ulterior.`,
  ] };
}));
export function getArticle(slug: string) { return blogArticles.find((article) => article.slug === slug); }




