import { notFound } from "next/navigation";
import { blogArticles, getArticle } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() { return blogArticles.map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const article = getArticle((await params).slug); return article ? { ...pageMetadata(article.title, article.excerpt, `/blog/${article.slug}`), robots: { index: false, follow: false } } : {}; }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug); if (!article) notFound();
  return <main id="continut"><article className="site-container max-w-3xl section-space"><p className="eyebrow">{article.category} · {article.readTime} de citit</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>{article.author && <p className="mt-3 text-sm text-slate-500">Autor: {article.author}{article.reviewedBy ? ` · Revizuit de ${article.reviewedBy.name}, ${article.reviewedBy.title}` : ""}</p>}<p className="mt-6 text-lg leading-8 text-slate-600">{article.excerpt}</p><div className="mt-10 space-y-6 text-lg leading-8 text-slate-700">{article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mt-8 border-t pt-5 text-sm text-slate-600"><p className="font-semibold">Surse internaționale:</p><ul className="mt-2 list-disc pl-5">{article.sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></div><p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Acest articol este informativ. Pentru simptome persistente sau îngrijorătoare, discută cu un medic.</p></article></main>;
}


