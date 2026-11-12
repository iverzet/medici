import { site } from "@/config/site";

export type BlogArticle = { slug: string; title: string; excerpt: string; category: string; publishedAt: string; readTime: string; coverImage: string; author?: string; reviewedBy?: { name: string; title: string; registration: string }; sources: { label: string; url: string }[]; content: string[]; };
const topics = [
  ["Când este recomandat un consult", "Semnele care merită discutate cu un specialist și cum te pregătești pentru prima vizită."],
  ["Cum te pregătești pentru consultație", "Un checklist simplu pentru o discuție mai clară și mai confortabilă cu medicul."],
  ["Ce întrebări să pui medicului", "Întrebări utile despre evaluare, opțiuni și pașii următori."],
  ["Cum alegi un specialist în orașul tău", "Criterii practice pentru a compara profiluri și a cere o programare."],
  ["Consultație online sau la cabinet", "Ce poate clarifica fiecare variantă și când este necesară evaluarea directă."],
  ["Simptome persistente: când ceri ajutor", "De ce simptomele repetate merită evaluate și cum descrii corect ce simți."],
  ["Investigații medicale: la ce să te aștepți", "Cum se discută recomandările și ce înseamnă rezultatele în contextul tău."],
  ["Prevenție și obiceiuri zilnice", "Pași generali care susțin sănătatea și nu înlocuiesc sfatul medical."],
  ["Mituri frecvente despre specialitate", "Cum separi informațiile utile de afirmațiile fără bază medicală."],
  ["Cum găsești o clinică potrivită", "Ce informații să verifici înainte să trimiți o cerere de contact."],
  ["Prima vizită fără emoții", "Un ghid empatic pentru a transforma îngrijorarea într-o conversație clară."],
  ["Tarife și programări: ce verifici", "Întrebări despre cost, disponibilitate și confirmarea programării."],
  ["Când ceri o a doua opinie", "Situații în care o discuție suplimentară poate ajuta la înțelegerea opțiunilor."],
  ["Cum notezi istoricul simptomelor", "Un model simplu de jurnal pe care îl poți arăta medicului."],
  ["Date medicale și confidențialitate", "Cum folosești formularele online fără să trimiți informații medicale sensibile inutil."],
  ["Specialist sau clinică: diferențe", "Cum alegi tipul de furnizor potrivit nevoii tale."],
  ["Când este o urgență", "Semne pentru care trebuie să apelezi serviciile de urgență, nu să aștepți o programare."],
  ["Cum verifici informațiile medicale online", "Repere pentru surse credibile și întrebări bune pentru medic."],
  ["Consultația pentru bărbați ocupați", "Cum pregătești eficient o programare și ce informații contează."],
  ["După consultație: pașii următori", "Cum urmărești recomandările și când revii cu întrebări."],
] as const;
const variants = ["ghid practic", "întrebări și răspunsuri", "ce merită știut", "explicat simplu", "checklist pentru programare"] as const;
const guidance = ["Descrie când au început simptomele, ce le agravează și ce ai încercat deja.", "Pregătește documentele relevante și o listă scurtă de întrebări pentru consultație.", "Întreabă despre opțiuni, beneficii, riscuri, costuri și semnele pentru care trebuie să revii.", "Compară specialiștii după experiență, servicii, localitate și disponibilitatea confirmată.", "Alege online doar pentru discuții potrivite; unele simptome necesită examinare la cabinet.", "Notează frecvența și intensitatea simptomelor, fără să încerci autodiagnosticarea.", "Investigațiile se recomandă individual; rezultatul trebuie interpretat împreună cu istoricul.", "Obiceiurile zilnice pot susține sănătatea, dar nu înlocuiesc evaluarea unui specialist.", "Verifică sursa și data informației înainte să iei o decizie medicală.", "Confirmă înainte de trimitere ce include consultația și cum se face programarea.", "Poți spune direct ce te îngrijorează; o conversație clară ajută medicul să te ghideze.", "Întreabă dacă tariful include controlul, investigațiile sau o eventuală reevaluare.", "O a doua opinie poate clarifica opțiunile când recomandarea sau diagnosticul rămâne neclar.", "Un jurnal simplu al simptomelor îl ajută pe medic să observe evoluția în timp.", "Trimite doar datele necesare și evită să incluzi rezultate medicale într-un formular general.", "Clinica oferă infrastructură, iar medicul oferă evaluarea; verifică cine va face consultația.", "Pentru agravare bruscă, durere severă sau sângerare importantă, sună la 112.", "Preferă surse medicale și discută orice informație online cu un specialist.", "Pregătește programarea din timp și păstrează confirmarea contactului.", "Respectă recomandările primite și contactează medicul dacă apar schimbări sau întrebări noi."] as const;
const proctologyTopics = [
  ["Hemoroizii pot provoca sângerare fără durere?", "Sângerarea rectală are mai multe cauze, iar un consult clarifică dacă este vorba despre hemoroizi sau altă afecțiune.", "Sângele roșu observat repetat trebuie discutat cu un medic; nu presupune automat că este un hemoroid."],
  ["Când sângerarea rectală trebuie evaluată de un medic?", "Un ghid despre sângerare, semne de alarmă și momentul potrivit pentru evaluare.", "Solicită ajutor rapid dacă sângerarea este abundentă, continuă, însoțită de cheaguri, amețeală sau durere severă."],
  ["Cum diferențiezi orientativ o fisură anală de hemoroizi?", "Simptomele se pot suprapune, iar diagnosticul se stabilește prin examinare, nu doar după o căutare online.", "Durerea la scaun și sângele pot apărea în mai multe afecțiuni; medicul decide ce examinări sunt potrivite."],
  ["Ce faci când te doare la defecație?", "Pași siguri pentru a descrie durerea și pentru a evita amânarea unei evaluări necesare.", "Notează durata, intensitatea și legătura cu scaunul; durerea intensă, febra sau umflarea necesită evaluare medicală."],
  ["De ce apare mâncărimea anală?", "Cauzele pot fi locale, dermatologice sau digestive și nu se tratează toate la fel.", "Evită frecarea și produsele parfumate; dacă pruritul persistă sau apare secreție, cere un consult."],
  ["Constipația poate agrava hemoroizii?", "Legătura dintre scaunul tare, efort și simptomele hemoroidale explicată pe înțelesul tuturor.", "Hidratarea, fibrele și mișcarea pot ajuta, dar schimbările persistente de tranzit merită discutate cu medicul."],
  ["Câtă fibră și apă sunt utile pentru un scaun mai moale?", "Cum pregătești întrebările despre alimentație fără a transforma un articol într-o prescripție personală.", "Crește fibrele treptat și ține cont de bolile sau tratamentele tale; medicul ori farmacistul poate adapta recomandarea."],
  ["Când este necesară anoscopia?", "Ce poate evalua o anoscopie și de ce indicația depinde de simptome și examenul clinic.", "Nu toate simptomele necesită anoscopie; specialistul explică scopul, pregătirea și alternativele înaintea procedurii."],
  ["Cum te pregătești pentru o consultație proctologică?", "Un checklist discret pentru prima vizită și o discuție mai eficientă cu medicul.", "Adu lista medicamentelor, investigațiile relevante și descrierea simptomelor; nu aplica tratamente locale noi chiar înainte fără sfat."],
  ["Ce este tromboza hemoroidală și când e urgentă?", "Durerea și nodulul apărut brusc pot necesita o evaluare rapidă.", "Durerea severă, creșterea rapidă a umflăturii sau febra justifică evaluare urgentă; nu încerca să drenezi leziunea acasă."],
  ["Ce simptome poate da o fistulă anală?", "Secreția repetată, iritația și un orificiu lângă anus trebuie evaluate medical.", "O fistulă nu se confirmă prin fotografii sau simptome izolate; specialistul poate recomanda examinare și investigații."],
  ["Cum se recunoaște un abces perianal?", "Durerea pulsatilă, umflarea și febra pot indica o problemă care nu trebuie amânată.", "Un abces suspect necesită consult rapid; nu îl apăsa și nu aplica antibiotice fără recomandare medicală."],
  ["Hemoroizii reapar după tratament?", "De ce controlul factorilor favorizanți contează chiar și după ameliorarea simptomelor.", "Recidiva este posibilă; discută despre tranzit, efort, greutate și opțiunile de tratament potrivite situației tale."],
  ["Ce opțiuni există înainte de operația pentru hemoroizi?", "Tratamentul depinde de tipul, gradul și severitatea simptomelor.", "Întreabă despre măsuri conservative, proceduri ambulatorii, beneficii, riscuri și criteriile pentru chirurgie."],
  ["Când poate fi recomandată bandarea hemoroizilor?", "O explicație generală despre procedură și despre limitele informațiilor online.", "Bandarea se indică doar pentru anumite hemoroizi interni, după evaluare; medicul explică recuperarea și riscurile."],
  ["Ce înseamnă prolapsul rectal?", "Diferența dintre prolaps și alte umflături și motivele pentru care trebuie evaluat.", "O formațiune care iese prin anus, mai ales repetat, trebuie examinată; nu încerca să o tratezi doar cu creme."],
  ["Sunt normale simptomele proctologice în sarcină?", "Hemoroizii pot apărea în sarcină, dar orice sângerare sau durere trebuie discutată cu medicul.", "În sarcină, confirmă orice medicament sau unguent cu medicul ori moașa și cere ajutor pentru sângerare importantă."],
  ["Cum influențează statul pe toaletă hemoroizii?", "Obiceiurile de toaletă pot întreține efortul și iritația locală.", "Nu forța și nu prelungi timpul pe toaletă; dacă tranzitul este dificil în mod constant, discută cu un specialist."],
  ["Când trebuie investigată durerea anală persistentă?", "Durerea care revine sau nu se ameliorează are nevoie de o evaluare, chiar dacă nu există sângerare.", "Febra, secreția, umflarea, scăderea în greutate sau modificarea tranzitului sunt motive suplimentare pentru consult."],
  ["Ce informații să notezi înainte de consultul proctologic?", "Un jurnal simplu poate ajuta medicul să înțeleagă evoluția simptomelor.", "Notează debutul, frecvența, sângerarea, tranzitul, medicamentele și ce ai încercat; evită autodiagnosticarea."],
] as const;
const andrologyTopics = [
  ["Când este recomandată prima consultație de andrologie?", "Un ghid despre simptome, fertilitate și situațiile în care merită cerută o evaluare.", "Poți cere consult pentru probleme de fertilitate, erecție, ejaculare, libido, durere sau modificări testiculare."],
  ["Ce este spermograma și cum te pregătești?", "Ce măsoară analiza spermei și de ce laboratorul oferă instrucțiuni specifice.", "Urmează exact instrucțiunile laboratorului privind abstinența și recoltarea; nu interpreta singur un singur rezultat."],
  ["De ce se repetă spermograma?", "Un rezultat poate varia, iar evaluarea fertilității nu se bazează pe o singură valoare.", "Dacă primul rezultat este modificat, medicul poate recomanda repetarea și corelarea cu istoricul, examenul și hormonii."],
  ["Ce înseamnă număr scăzut de spermatozoizi?", "Termenii din buletinul de analiză explicați fără concluzii pripite.", "Numărul se interpretează împreună cu motilitatea, morfologia, timpul de recoltare și contextul cuplului."],
  ["Ce este azoospermia?", "Absența spermatozoizilor în ejaculat are cauze diferite și necesită evaluare specializată.", "Medicul poate recomanda repetarea analizei, hormoni, ecografie sau teste genetice în funcție de caz."],
  ["Varicocelul poate afecta fertilitatea?", "Ce este varicocelul și de ce decizia de tratament nu se ia doar după aspect.", "Evaluarea include simptomele, examenul, volumul testicular și spermograma; tratamentul se discută individual."],
  ["Testosteronul scăzut înseamnă automat tratament?", "Diagnosticul se bazează pe simptome și măsurători repetate, nu pe o singură analiză.", "Nu începe testosteron fără evaluare; tratamentul poate reduce producția de spermatozoizi la bărbații care doresc copii."],
  ["Testosteronul poate afecta fertilitatea?", "Relația dintre terapia cu testosteron și producția de spermă explicată prudent.", "Ghidurile EAU nu recomandă testosteronul pentru tratamentul infertilității; discută alternativele cu andrologul."],
  ["Când se recoltează testosteronul?", "De ce momentul recoltării și repetarea pot conta pentru interpretare.", "Medicul poate solicita testosteron total dimineața și poate repeta valoarea înainte de a confirma un deficit."],
  ["Ce analize hormonale pot fi recomandate în infertilitatea masculină?", "Rolul testosteronului, FSH, LH și al altor teste în funcție de simptome.", "Nu toate analizele sunt necesare tuturor; recomandarea depinde de spermogramă, examen și istoricul reproductiv."],
  ["Disfuncția erectilă poate avea cauze medicale?", "Erecția poate fi influențată de vase, hormoni, medicamente, stres sau boli cronice.", "Un consult poate evalua tensiunea, diabetul, medicamentele și riscul cardiovascular, fără rușine sau judecată."],
  ["Erecțiile matinale absente trebuie evaluate?", "Un simptom izolat nu stabilește un diagnostic, dar schimbările persistente merită discutate.", "Notează de când s-a schimbat situația și orice tratament; medicul decide dacă sunt necesare hormoni sau alte teste."],
  ["Ce este ejacularea precoce?", "Definiția clinică este mai complexă decât o durată fixă și implică controlul și disconfortul.", "Discută deschis cu medicul; opțiunile pot include educație, tehnici, consiliere și tratament ales individual."],
  ["Când durerea testiculară este o urgență?", "Durerea apărută brusc poate necesita evaluare imediată.", "Durerea bruscă, intensă, cu greață sau testicul ridicat poate fi o urgență; mergi imediat la camera de gardă."],
  ["Ce simptome poate da prostatita?", "Durerea pelvină, urinarea dificilă și febra au cauze diferite și trebuie evaluate.", "Febra, frisoanele, imposibilitatea de a urina sau starea generală alterată necesită ajutor medical rapid."],
  ["Când o curbură a penisului trebuie evaluată?", "Curbura poate fi normală sau poate apărea după o schimbare; contează durerea și funcția sexuală.", "O curbură nouă, progresivă, dureroasă sau care împiedică contactul sexual merită consult andrologic."],
  ["Ce este priapismul și când este urgență?", "O erecție dureroasă și prelungită nu trebuie tratată acasă.", "O erecție care durează patru ore sau mai mult este o urgență și necesită prezentare imediată la spital."],
  ["Infecțiile cu transmitere sexuală pot afecta fertilitatea?", "Unele infecții pot produce inflamație și complicații dacă nu sunt diagnosticate și tratate.", "Cere testare când există risc sau simptome și informează partenerii conform recomandării medicale."],
  ["Cum influențează fumatul și alcoolul spermograma?", "Stilul de viață poate influența calitatea spermei și sănătatea sexuală.", "Renunțarea la fumat, activitatea fizică și reducerea alcoolului pot fi pași utili, dar nu înlocuiesc evaluarea."],
  ["Când sunt recomandate testele genetice în infertilitate?", "Testarea depinde de concentrația spermatozoizilor, examen și istoricul familial.", "Andrologul poate recomanda cariotip sau microdeleții Y în forme severe, cu consiliere înainte și după rezultat."],
] as const;
const selectedAdditionalTopics = site.name.startsWith("Proctologi") ? proctologyTopics : andrologyTopics;
const articleTopics = [...topics.map(([topic, intro], index) => [topic, intro, guidance[index]] as const), ...selectedAdditionalTopics];
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const blogArticles: BlogArticle[] = articleTopics.flatMap(([topic, intro, topicGuidance], topicIndex) => variants.map((variant, variantIndex) => {
  const title = `${topic}? – ${variant}`;
  return { slug: `${slugify(topic)}-${variantIndex + 1}`, title, excerpt: intro, category: topicIndex % 2 ? "Prima vizită" : "Ghid medical", publishedAt: `2026-${String(10 - Math.floor(topicIndex / 4)).padStart(2, "0")}-${String(20 - variantIndex).padStart(2, "0")}`, readTime: `${4 + (topicIndex + variantIndex) % 4} min`, coverImage: "/images/blog/proctology-consultation-firefly.jpg", sources: [{ label: "NIDDK – informații pentru pacienți", url: "https://www.niddk.nih.gov/health-information" }, { label: "NHS – ghiduri pentru pacienți", url: "https://www.nhs.uk/conditions/" }], content: [
    `${topic} este o întrebare frecventă despre ${site.specialty}. Informațiile sunt orientative și te ajută să pregătești o discuție cu un medic specialist.`,
    topicGuidance,
    `Notează când au apărut simptomele, ce le agravează și ce întrebări ai. Medicul poate interpreta aceste informații împreună cu istoricul tău și poate recomanda următorii pași.`,
    `În timpul consultației, întreabă ce opțiuni există, ce investigații sunt necesare, care sunt beneficiile și riscurile și când trebuie să revii. Nu încerca să stabilești singur un diagnostic pe baza unui articol.`,
    "Nu trimite diagnostice sau rezultate de analize într-un formular general. Pentru simptome severe, agravare rapidă sau o urgență, apelează 112.",
    `Dacă vrei să discuți cu un specialist, alege orașul din catalog și trimite o cerere de contact. Cererea nu reprezintă o programare confirmată; disponibilitatea se confirmă ulterior.`,
    `Sursele internaționale de la final oferă informații generale pentru pacienți. Pentru o decizie potrivită situației tale, discută direct cu un specialist în ${site.specialty}.`,
  ] };
}));
export function getArticle(slug: string) { return blogArticles.find((article) => article.slug === slug); }




