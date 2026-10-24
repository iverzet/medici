export type BlogArticle = { slug: string; title: string; excerpt: string; category: string; publishedAt: string; readTime: string; content: string[]; };
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
const slugify = (value: string) => value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const blogArticles: BlogArticle[] = topics.flatMap(([topic, intro], topicIndex) => variants.map((variant, variantIndex) => {
  const title = `${topic}: ${variant}`;
  return { slug: `${slugify(topic)}-${variantIndex + 1}`, title, excerpt: intro, category: topicIndex % 2 ? "Prima vizită" : "Ghid medical", publishedAt: `2026-${String(10 - Math.floor(topicIndex / 4)).padStart(2, "0")}-${String(20 - variantIndex).padStart(2, "0")}`, readTime: `${4 + (topicIndex + variantIndex) % 4} min`, content: [
    `${topic} este o întrebare frecventă. Informațiile de mai jos sunt orientative și te ajută să pregătești o discuție cu un medic specialist în proctologie.`,
    `Notează simptomele, momentul apariției și întrebările pe care le ai. Un specialist poate interpreta aceste informații împreună cu istoricul tău și poate recomanda următorii pași.`,
    "Nu trimite diagnostice sau rezultate de analize într-un formular general. Pentru simptome severe sau care se agravează rapid, apelează serviciile de urgență.",
    `Dacă vrei să discuți cu un specialist, alege orașul din catalog și trimite o cerere de contact. Cererea nu reprezintă o programare confirmată; disponibilitatea se confirmă ulterior.`,
  ] };
}));
export function getArticle(slug: string) { return blogArticles.find((article) => article.slug === slug); }


