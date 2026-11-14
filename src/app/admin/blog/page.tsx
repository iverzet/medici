import { requireAdmin } from "@/lib/auth";
import { blogArticles, isArticlePublished, pendingArticles, publishBatchSize, publishedArticles } from "@/lib/blog";
import { site } from "@/config/site";

export default async function BlogReportPage() {
  await requireAdmin();
  const batches = Array.from({ length: Math.ceil(blogArticles.length / publishBatchSize) }, (_, index) => {
    const articles = blogArticles.slice(index * publishBatchSize, (index + 1) * publishBatchSize);
    const published = articles.filter(isArticlePublished).length;
    return { date: articles[0]?.scheduledFor, total: articles.length, published, pending: articles.length - published };
  });
  const nextBatch = batches.find((batch) => batch.pending > 0);
  return <main id="continut" className="site-container py-10">
    <p className="eyebrow">Raport editorial</p>
    <h1 className="mt-3 text-3xl font-semibold">Calendar blog · {site.name}</h1>
    <p className="mt-4 max-w-2xl text-slate-600">Sunt generate 100 de articole de specialitate, cu surse medicale internaționale. Publicarea este etapizată automat în loturi de câte {publishBatchSize} articole pe zi.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">Total articole</p><p className="mt-2 text-3xl font-semibold">{blogArticles.length}</p></div>
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">Publicate</p><p className="mt-2 text-3xl font-semibold">{publishedArticles.length}</p></div>
      <div className="rounded-xl border bg-white p-5"><p className="text-sm text-slate-500">În pending</p><p className="mt-2 text-3xl font-semibold">{pendingArticles.length}</p></div>
    </div>
    <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">{nextBatch ? <>Următorul lot: <strong>{nextBatch.date}</strong> · {nextBatch.pending} articole în așteptare.</> : "Toate loturile programate sunt publicate."} Conținutul rămâne informativ și necesită verificare medicală editorială înainte de a fi folosit ca recomandare individuală.</p>
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><caption className="sr-only">Loturi de publicare blog</caption><thead className="bg-slate-100"><tr><th className="p-4">Data programată</th><th className="p-4">Total</th><th className="p-4">Publicate</th><th className="p-4">Pending</th><th className="p-4">Stare</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.date} className="border-t"><td className="p-4">{batch.date}</td><td className="p-4">{batch.total}</td><td className="p-4">{batch.published}</td><td className="p-4">{batch.pending}</td><td className="p-4">{batch.pending === 0 ? "Publicat" : batch.published === 0 ? "Pending" : "Parțial"}</td></tr>)}</tbody></table></div>
  </main>;
}

