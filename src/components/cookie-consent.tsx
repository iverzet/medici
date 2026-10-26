"use client";
import { useSyncExternalStore } from "react";

function hasCookieChoice() { return document.cookie.includes("cookie-consent=accepted") || document.cookie.includes("cookie-consent=declined"); }
function subscribe(onStoreChange: () => void) { window.addEventListener("cookie-consent-change", onStoreChange); return () => window.removeEventListener("cookie-consent-change", onStoreChange); }

export function CookieConsent() {
  const choiceMade = useSyncExternalStore(subscribe, hasCookieChoice, () => true);
  if (choiceMade) return null;
  const decide = (value: "accepted" | "declined") => { document.cookie = `cookie-consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`; window.dispatchEvent(new Event("cookie-consent-change")); };
  return <aside className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border bg-white p-4 shadow-xl sm:left-auto sm:max-w-md" role="dialog" aria-label="Preferințe cookie"><p className="text-sm text-slate-700">Folosim un cookie opțional pentru a memora orașul ales și a-ți afișa mai repede specialiștii din apropiere. Alegerea pentru statisticile Google este separată și apare după această preferință.</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => decide("accepted")} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white">Accept</button><button type="button" onClick={() => decide("declined")} className="rounded-lg border px-4 py-2 text-sm font-semibold">Refuz</button></div></aside>;
}
