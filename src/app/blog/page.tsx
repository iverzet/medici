import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishedArticles } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMetadata("Blog medical despre proctologie", "Ghiduri medicale clare despre simptome, prevenție și prima consultație proctologie.", "/blog");

function groupArticles() {
  const groups = new Map<string, { question: string; excerpt: string; category: string; articles: typeof publishedArticles }>();
  for (const article of publishedArticles) {
    const question = article.title.split(" – ")[0];
    const current = groups.get(question);
    groups.set(question, current ? { ...current, articles: [...current.articles, article] } : { question, excerpt: article.excerpt, category: article.category, articles: [article] });
  }
  return [...groups.values()];
}

export default function BlogPage() {
  const groups = groupArticles();
  return <main id="continut"><div className="site-container section-space">
    <p className="eyebrow">Blog medical</p>
    <h1 className="section-title mt-3 max-w-3xl">Informații clare pentru decizii mai liniștite</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Articole orientative despre sănătatea proctologie, scrise într-un limbaj ușor de înțeles.</p>
    <div className="mt-12 grid gap-5 md:grid-cols-2">{groups.map((group) => <article key={group.question} className="flex flex-col rounded-2xl border bg-white p-6"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{group.category}</p><span className="text-xs text-slate-500">{group.articles.length} variante</span></div><h2 className="mt-4 text-xl font-semibold leading-7">{group.question}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{group.excerpt}</p><div className="mt-6 flex flex-wrap gap-2">{group.articles.map((article) => <Link key={article.slug} href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 rounded-full border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-50">{article.title.split(" – ")[1] || "Citește"}<ArrowUpRight className="size-3" aria-hidden="true" /></Link>)}</div></article>)}</div>
    <p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Informațiile de pe acest site au exclusiv scop general, educațional și informativ. Ele nu constituie consultație medicală, diagnostic, recomandare, prescripție, trimitere sau plan de tratament și nu creează o relație medic–pacient. Deciziile medicale se iau numai împreună cu medicul care te evaluează, pe baza istoricului și investigațiilor complete. Nu începe, modifica sau opri un tratament și nu amâna un consult ori o urgență pe baza unui articol. Platforma nu garantează exactitatea, actualitatea, caracterul complet, rezultatele sau disponibilitatea serviciilor și nu își asumă, în măsura permisă de lege, răspunderea pentru decizii luate exclusiv pe baza conținutului, automedicație, întârzieri, rezultate ori interacțiuni cu furnizorii listați. Nimic din această informare nu exclude răspunderea care nu poate fi exclusă potrivit legii. Pentru urgențe apelează 112. Nu trimite rezultate, diagnostice sau alte date medicale sensibile în formulare generale.</p>
  </div></main>;
}

