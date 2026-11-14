import { pageMetadata } from "@/lib/seo";

const medicalDisclaimer = "Informațiile de pe acest site au exclusiv scop general, educațional și informativ. Ele nu constituie consultație medicală, diagnostic, recomandare, prescripție, trimitere sau plan de tratament și nu creează o relație medic–pacient. Deciziile medicale se iau numai împreună cu medicul care te evaluează, pe baza istoricului și investigațiilor complete. Nu începe, modifica sau opri un tratament și nu amâna un consult ori o urgență pe baza unui articol. Platforma nu garantează exactitatea, actualitatea, caracterul complet, rezultatele sau disponibilitatea serviciilor și nu își asumă, în măsura permisă de lege, răspunderea pentru decizii luate exclusiv pe baza conținutului, automedicație, întârzieri, rezultate ori interacțiuni cu furnizorii listați. Nimic din această informare nu exclude răspunderea care nu poate fi exclusă potrivit legii. Pentru urgențe apelează 112. Nu trimite rezultate, diagnostice sau alte date medicale sensibile în formulare generale.";
export const metadata = pageMetadata("Termeni de utilizare", "Informații despre utilizarea portalului Proctologi.ro.", "/termeni");

export default function TermsPage() {
  return <main id="continut" className="site-container max-w-3xl space-y-6 py-12 leading-8">
    <h1 className="text-3xl font-semibold">Termeni de utilizare</h1>
    <p>Proctologi.ro facilitează căutarea unor profiluri și trimiterea cererilor de contact. Platforma nu oferă consultații, diagnostice sau servicii de urgență.</p>
    <h2 className="text-xl font-semibold">Informare medicală și limitarea răspunderii</h2>
    <p>{medicalDisclaimer}</p>
    <h2 className="text-xl font-semibold">Solicitări și programări</h2>
    <p>Trimiterea unui formular înregistrează o solicitare, nu o programare confirmată. Disponibilitatea, medicul, data și costurile se confirmă ulterior. Completează date proprii și corecte; nu trimite documente medicale sau date ale altor persoane fără acordul lor.</p>
    <h2 className="text-xl font-semibold">Surse și actualizarea informațiilor</h2>
    <p>Profilurile sunt publicate pe baza informațiilor disponibile public și a verificărilor efectuate de platformă. Datele se pot schimba, așa că verifică disponibilitatea, tarifele și programul direct la furnizor înainte de deplasare.</p>
    <h2 className="text-xl font-semibold">Parteneriate</h2>
    <p>Formularul pentru clinici inițiază o discuție. Nu constituie un contract sau o obligație de plată. Condițiile, costurile și gestionarea cererilor se stabilesc separat, fără garanția unui număr de pacienți.</p>
    <p>Pentru întrebări: <a className="underline" href="mailto:contact@proctologi.ro">contact@proctologi.ro</a>.</p>
  </main>;
}

