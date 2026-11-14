import { CalendarDays, Handshake, MessageCircle } from "lucide-react";
import { site } from "@/config/site";

export function MobileContactBar({ phone: _phone }: { phone?: string }) {
  const whatsappText = encodeURIComponent("Salut! Aș vrea informații despre un specialist și o programare.");
  return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl gap-2 sm:gap-3 md:justify-end">
      <a href={`https://wa.me/${site.whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer" className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#128c7e] px-3 py-3 text-xs font-semibold text-white shadow-lg shadow-[#128c7e]/20 transition hover:bg-[#0f7b6f] sm:flex-none sm:px-4 sm:text-sm"><MessageCircle className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">Scrie-ne pe WhatsApp</span></a>
      <a href="#programare" className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-3 py-3 text-xs font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 sm:flex-none sm:px-4 sm:text-sm"><CalendarDays className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">Solicită o programare</span></a>
      <a href="/pentru-clinici" className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-800 transition hover:border-teal-600 hover:text-teal-800 sm:flex-none sm:px-4 sm:text-sm"><Handshake className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">Devino partener</span></a>
    </div>
  </div>;
}
