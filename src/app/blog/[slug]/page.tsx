import { notFound } from "next/navigation";
import { getArticle } from "@/lib/blog";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import Image from "next/image";

const medicalDisclaimer = "Informațiile de pe acest site au exclusiv scop general, educațional și informativ. Ele nu constituie consultație medicală, diagnostic, recomandare, prescripție, trimitere sau plan de tratament și nu creează o relație medic–pacient. Deciziile medicale se iau numai împreună cu medicul care te evaluează, pe baza istoricului și investigațiilor complete. Nu începe, modifica sau opri un tratament și nu amâna un consult ori o urgență pe baza unui articol. Platforma nu garantează exactitatea, actualitatea, caracterul complet, rezultatele sau disponibilitatea serviciilor și nu își asumă, în măsura permisă de lege, răspunderea pentru decizii luate exclusiv pe baza conținutului, automedicație, întârzieri, rezultate ori interacțiuni cu furnizorii listați. Nimic din această informare nu exclude răspunderea care nu poate fi exclusă potrivit legii. Pentru urgențe apelează 112. Nu trimite rezultate, diagnostice sau alte date medicale sensibile în formulare generale.";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  return article ? pageMetadata(article.title, article.excerpt, `/blog/${article.slug}`) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const articleUrl = new URL(`/blog/${article.slug}`, site.url).href;
  return <main id="continut"><article className="site-container max-w-3xl section-space">
    <p className="eyebrow">{article.category} · {article.readTime} de citit</p>
    <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
    <p className="mt-3 text-sm text-slate-500">Autor: {article.author} · Publicat: <time dateTime={article.publishedAt}>{article.publishedAt}</time> · Actualizat: <time dateTime={article.dateModified}>{article.dateModified}</time>{article.reviewedBy ? ` · Revizuit de ${article.reviewedBy.name}, ${article.reviewedBy.title}` : ""}</p>
    <p className="mt-6 text-lg leading-8 text-slate-600">{article.excerpt}</p>
    <Image className="mt-8 aspect-video w-full rounded-2xl object-cover" src={article.coverImage} width={1680} height={945} alt={article.imageAlt} priority />
    <div className="mt-10 space-y-6 text-lg leading-8 text-slate-700">{article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <div className="mt-8 border-t pt-5 text-sm text-slate-600"><p className="font-semibold">Surse internaționale:</p><ul className="mt-2 list-disc pl-5">{article.sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></div>
    <p className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{medicalDisclaimer}</p>
  </article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, image: [new URL(article.coverImage, site.url).href], datePublished: article.publishedAt, dateModified: article.dateModified, author: { "@type": "Organization", name: article.author, url: site.url }, publisher: { "@type": "Organization", name: site.name, url: site.url }, mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl }, url: articleUrl }) }} /></main>;
}

