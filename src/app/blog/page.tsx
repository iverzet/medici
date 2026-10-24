import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogArticles } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = { ...pageMetadata("Blog medical despre proctologie", "Ghiduri medicale clare despre simptome, prevenție și prima consultație proctologică.", "/blog"), robots: { index: false, follow: false } };

export default function BlogPage() {
  return <main id="continut"><div className="site-container section-space">
    <p className="eyebrow">Blog medical</p><h1 className="section-title mt-3 max-w-3xl">Informații clare pentru decizii mai liniștite</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Articole orientative despre sănătatea proctologică, scrise într-un limbaj ușor de înțeles.</p>
    <div className="mt-12 grid gap-5 md:grid-cols-3">{blogArticles.map((article) => <article key={article.slug} className="flex flex-col rounded-2xl border bg-white p-6"><p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{article.category}</p><h2 className="mt-4 text-xl font-semibold leading-7">{article.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p><div className="mt-6 flex items-center justify-between text-xs text-slate-500"><span>{article.readTime} de citit</span><Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-sky-800">Citește <ArrowUpRight className="size-4" aria-hidden="true" /></Link></div></article>)}</div>
    <p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Conținutul are scop informativ și nu înlocuiește consultul, diagnosticul sau tratamentul recomandat de un medic.</p>
  </div></main>;
}
