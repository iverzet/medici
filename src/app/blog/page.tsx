import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pendingArticles, publishedArticles } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = pageMetadata("Blog medical despre proctologie", "Ghiduri medicale clare despre simptome, prevenție și prima consultație proctologie.", "/blog");

export default function BlogPage() {
  return <main id="continut"><div className="site-container section-space">
    <p className="eyebrow">Blog medical</p>
    <h1 className="section-title mt-3 max-w-3xl">Informații clare pentru decizii mai liniștite</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Articole orientative despre sănătatea proctologie, scrise într-un limbaj ușor de înțeles.</p>
    {publishedArticles.length === 0 && <p className="mt-12 rounded-xl border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-950">Calendarul editorial este pregătit. Primele articole vor fi publicate începând cu {pendingArticles[0]?.scheduledFor}, câte 10 pe zi.</p>}
    <div className="mt-12 grid gap-5 md:grid-cols-3">{publishedArticles.map((article) => <article key={article.slug} className="flex flex-col rounded-2xl border bg-white p-6"><p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{article.category}</p><h2 className="mt-4 text-xl font-semibold leading-7">{article.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p><div className="mt-6 flex items-center justify-between text-xs text-slate-500"><span>{article.readTime} de citit</span><Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-sky-800">Citește <ArrowUpRight className="size-4" aria-hidden="true" /></Link></div></article>)}</div>
    <p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Informațiile de pe acest site au exclusiv scop general, educațional și informativ. Ele nu constituie consultație medicală, diagnostic, recomandare, prescripție, trimitere sau plan de tratament și nu creează o relație medic–pacient. Deciziile medicale se iau numai împreună cu medicul care te evaluează, pe baza istoricului și investigațiilor complete. Nu începe, modifica sau opri un tratament și nu amâna un consult ori o urgență pe baza unui articol. Platforma nu garantează exactitatea, actualitatea, caracterul complet, rezultatele sau disponibilitatea serviciilor și nu își asumă, în măsura permisă de lege, răspunderea pentru decizii luate exclusiv pe baza conținutului, automedicație, întârzieri, rezultate ori interacțiuni cu furnizorii listați. Nimic din această informare nu exclude răspunderea care nu poate fi exclusă potrivit legii. Pentru urgențe apelează 112. Nu trimite rezultate, diagnostice sau alte date medicale sensibile în formulare generale.</p>
  </div></main>;
}

