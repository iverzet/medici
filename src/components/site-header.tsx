import Link from "next/link";
import { HeartPulse, ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return <header className="border-b bg-white">
    <div className="site-container flex min-h-22 flex-wrap items-center justify-between gap-4 py-4">
      <Link href="/" aria-label="Proctologi.ro — pagina principală" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-700 text-white"><HeartPulse aria-hidden="true" /></span>
        <span>proctologi<span className="text-sky-700">.ro</span></span>
      </Link>
      <nav aria-label="Navigație principală" className="flex items-center gap-5 text-sm font-medium">
        <Link href="/#orase" className="hover:text-sky-700">Găsește un specialist</Link>
        <Link href="/blog" className="hover:text-sky-700">Blog medical</Link>
        <Link href="/pentru-clinici" className="flex items-center gap-1 hover:text-sky-700">Pentru clinici <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
      </nav>
    </div>
  </header>;
}
