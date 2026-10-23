export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  content: string[];
};

export const blogArticles: BlogArticle[] = [
  { slug: "cand-este-recomandat-consultul-proctologic", title: "Când este recomandat consultul proctologic?", excerpt: "Semnele pentru care merită să discuți cu un specialist și cum te pregătești pentru prima vizită.", category: "Ghid medical", publishedAt: "2026-10-20", readTime: "5 min", content: ["Un consult proctologic poate clarifica simptome care persistă sau se repetă. Sângerarea, durerea, mâncărimea și modificările tranzitului merită discutate cu un medic.", "Consultația începe cu o discuție despre simptome și istoricul medical. Medicul decide apoi dacă este nevoie de examinare sau investigații suplimentare.", "Informațiile de pe această pagină sunt generale și nu înlocuiesc o consultație medicală."] },
  { slug: "cum-te-pregatesti-pentru-prima-consultatie", title: "Cum te pregătești pentru prima consultație", excerpt: "Un checklist simplu pentru o discuție mai clară și mai confortabilă cu medicul.", category: "Prima vizită", publishedAt: "2026-10-15", readTime: "4 min", content: ["Notează când au început simptomele, cât de des apar și ce le agravează sau le ameliorează.", "Ia cu tine lista tratamentelor curente și rezultatele investigațiilor relevante. Nu este nevoie să amâni consultația din cauza emoțiilor.", "Medicul îți va explica pașii următori și opțiunile potrivite situației tale."] },
  { slug: "hemoroizi-factori-de-risc-si-preventie", title: "Hemoroizi: factori de risc și prevenție", excerpt: "Obiceiuri zilnice care pot susține sănătatea digestivă și când este nevoie de evaluare medicală.", category: "Prevenție", publishedAt: "2026-10-08", readTime: "6 min", content: ["Constipația, efortul la toaletă și statul prelungit pe scaun pot favoriza apariția simptomelor hemoroidale.", "Hidratarea, fibrele și mișcarea regulată pot ajuta, dar nu înlocuiesc evaluarea atunci când simptomele persistă.", "Sângerarea rectală trebuie evaluată medical, mai ales dacă este nouă, abundentă sau asociată cu alte simptome."] },
];

export function getArticle(slug: string) { return blogArticles.find((article) => article.slug === slug); }
