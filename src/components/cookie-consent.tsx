"use client";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState<boolean | null>(null);
  useEffect(() => {
    setVisible(!document.cookie.includes("cookie-consent=accepted") && !document.cookie.includes("cookie-consent=declined"));
  }, []);
  if (visible !== true) return null;
  const decide = (value: "accepted" | "declined") => { document.cookie = `cookie-consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`; setVisible(false); };
  return <aside className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border bg-white p-4 shadow-xl sm:left-auto sm:max-w-md" role="dialog" aria-label="Preferințe cookie"><p className="text-sm text-slate-700">Folosim un cookie opțional pentru a memora orașul ales și a-ți afișa mai repede specialiștii din apropiere. Nu folosim cookie-uri pentru urmărire.</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => decide("accepted")} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Accept</button><button type="button" onClick={() => decide("declined")} className="rounded-lg border px-4 py-2 text-sm font-semibold">Refuz</button></div></aside>;
}
