import Link from "next/link";
import { ArrowUpRight, HeartPulse, Menu, Search } from "lucide-react";
import { site } from "@/config/site";

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#091522]/95 text-white backdrop-blur-xl">
    <div className="site-container flex min-h-20 items-center justify-between gap-4">
      <Link href="/" aria-label={`${site.name} — pagina principală`} className="group flex items-center gap-3">
        <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20"><span className="absolute inset-1 rounded-[13px] border border-teal-300/50" /><HeartPulse className="relative size-5 text-teal-300" aria-hidden="true" /></span>
        <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">{site.name.replace(".ro", "")}<span className="text-teal-300">.ro</span></span>
      </Link>
      <nav aria-label="Navigație principală" className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 text-sm font-medium md:flex">
        <Link href="/#orase" className="rounded-full px-4 py-2.5 text-slate-200 transition hover:bg-white/15 hover:text-white">Găsește un specialist</Link>
        <Link href="/blog" className="rounded-full px-4 py-2.5 text-slate-200 transition hover:bg-white/15 hover:text-white">Blog medical</Link>
        <Link href="/pentru-clinici" className="flex items-center gap-1 rounded-full px-4 py-2.5 text-slate-200 transition hover:bg-white/15 hover:text-white">Pentru clinici <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/#orase" className="hidden items-center gap-2 rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 sm:flex"><Search className="size-4" aria-hidden="true" />Caută un medic</Link>
        <details className="relative md:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-white/20 bg-white/10 text-white"><Menu className="size-5" aria-hidden="true" /><span className="sr-only">Deschide meniul</span></summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-white/15 bg-[#0d2233] p-2 text-white shadow-2xl shadow-slate-950/30">
            <Link href="/#orase" className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-white/10">Găsește un specialist</Link>
            <Link href="/blog" className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-white/10">Blog medical</Link>
            <Link href="/pentru-clinici" className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-white/10">Pentru clinici</Link>
          </div>
        </details>
      </div>
    </div>
  </header>;
}
