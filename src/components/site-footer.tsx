import Link from "next/link";

export function SiteFooter() {
  return <footer className="mt-16 border-t border-slate-800 bg-[#091522] pb-24 text-slate-300 md:pb-0">
    <div className="site-container grid gap-8 py-14 md:grid-cols-3">
      <div><p className="text-xl font-semibold tracking-[-0.03em] text-white">proctologi<span className="text-teal-300">.ro</span></p><p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">Un director medical clar, construit pentru primul pas către un specialist.</p></div>
      <nav aria-label="Navigație subsol" className="flex flex-col items-start gap-3 text-sm"><Link href="/#orase">Explorează orașele</Link><Link href="/#intrebari">Întrebări frecvente</Link><Link href="/pentru-clinici">Parteneriate pentru clinici</Link></nav>
      <div className="text-sm leading-6"><a href="mailto:contact@proctologi.ro" className="text-teal-200 underline">contact@proctologi.ro</a><p className="mt-3"><Link href="/confidentialitate" className="underline">Confidențialitate</Link> · <Link href="/termeni" className="underline">Termeni de utilizare</Link></p><p className="mt-3 text-slate-400">Informațiile nu înlocuiesc consultația medicală. Pentru urgențe, apelează 112.</p></div>
    </div>
    <div className="site-container border-t border-slate-800 py-5 text-xs text-slate-500">© {new Date().getFullYear()} Proctologi.ro · Catalog actualizat din surse publice.</div>
  </footer>;
}
