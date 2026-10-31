# Proctologi.ro

Portal Next.js / App Router în repository-ul public `iverzet/medici`, găzduit în Vercel, cu PostgreSQL Neon prin Vercel Marketplace.

## Funcționalități

- Homepage, căutare după oraș, profiluri promovate, FAQ și exemple editoriale marcate ca demonstrative.
- Cinci orașe și zece profiluri fictive marcate Demo, populate prin seed idempotent. Filtrare după tip și serviciu, pagini de oraș și profil cu metadata și Schema.org pentru furnizori reali.
- Formulare generale și B2B conectate la Server Actions: validare server, acord explicit, deduplicare și limitarea abuzurilor. Profilurile Demo nu primesc programări.
- `/admin/leads`: autentificare, sesiuni revocabile de opt ore, statusuri, parteneriate și export CSV cu protecție împotriva formulelor injectate.
- Notificări Resend persistate separat; eșecul emailului nu pierde cererea. Reîncercare din panoul admin.
- `/confidentialitate`, `/termeni`, sitemap dinamic, robots și canonical/OpenGraph.

## Instalare și verificare

Node.js 24, npm. Rulează `npm ci`, copiază `.env.example` în `.env.local` și completează valorile. Nu publica secrete, exporturi sau date personale în Git.

- `npm run db:migrate` — aplică migrațiile versionate.
- `npm run db:seed` — necesită temporar `ALLOW_DEMO_SEED=true`; nu rulează automat la build.
- `npm run db:import-public-providers` — necesită temporar `ALLOW_PUBLIC_PROVIDER_IMPORT=true`; importă numai candidați nepublicați din surse oficiale.
- `npm test` — validare, date calendaristice, acord, CSV și verificarea secretului.
- `npm run lint`
- `npm run type-check`
- `npm run db:validate`
- `npm run build`
- `npm run start -- --port 3107`

Pentru verificarea integrată, după build și pornirea serverului local, setează `RUN_INTEGRATION_TESTS=true` și rulează `npx tsx --conditions=react-server tests/flows.integration.ts`. Testul creează o cerere fictivă, verifică salvarea, deduplicarea, autentificarea, statusul, CSV-ul, CSRF și logout-ul, apoi elimină strict cererea creată. Folosește o bază dedicată testării dacă există date reale. Serverul și testul trebuie să folosească aceeași configurație.

## Baza de date și catalogul demo

Proiect Vercel: `invitatii/medici`. Neon `medici-db`, regiune Frankfurt. Configurația Prisma încarcă mediul prin `@next/env`; migrațiile preferă `DIRECT_URL`, apoi `DATABASE_URL_UNPOOLED`, apoi `DATABASE_URL`. Serverul folosește conexiunea cu pooling.

Cu `DEMO_MODE=false`, catalogul citește PostgreSQL; dacă baza de date nu este disponibilă, nu servește profiluri demonstrative. `DEMO_MODE=true` activează catalogul local fără bază de date și dezactivează trimiterea formularelor. Seed-ul folosește tranzacție și upsert, refuză suprascrierea profilurilor reale și nu șterge cereri. Revino la `ALLOW_DEMO_SEED=false` după populare.

Importul de surse publice păstrează URL-ul și data colectării, dar creează numai furnizori `PENDING` și nepublicați. Publicarea, revendicarea profilului și recenziile se fac după verificare administrativă.

Orașe: `/proctologi-bucuresti`, `/proctologi-cluj`, `/proctologi-timisoara`, `/proctologi-iasi`, `/proctologi-brasov`. Exemplu de profil: `/medici/demo-medic-bucuresti`. Datele fictive nu generează entități medicale în JSON-LD și sunt excluse din sitemap. Nu există apeluri sau hărți pentru adrese fictive.

`SITE_INDEXABLE=true` menține indexarea activă pentru catalogul cu date reale. Setează explicit `false` numai pentru staging sau oprire temporară. Profilurile Demo și paginile fără profiluri reale rămân noindex; articolele de blog rămân noindex până la revizuire editorială medicală individuală. Adaugă `GOOGLE_SITE_VERIFICATION` după verificarea proprietății în Google Search Console.

## Administrare și email

Configurează `ADMIN_SECRET_KEY` cu minimum 32 de caractere aleatoare, exclusiv server-side. Rotirea secretului invalidează sesiunile existente. Păstrează parola într-un manager de parole. CSV-ul necesită aceeași sesiune ca panoul admin; parola nu este transmisă în URL.

Configurează `RESEND_API_KEY`, `EMAIL_FROM` pe un domeniu verificat și `ADMIN_EMAIL`. Integrarea utilizează API-ul oficial prin fetch, fără SDK suplimentar. Alertarea trimite numai referința cererii și linkul spre panoul protejat. Datele pacientului rămân în PostgreSQL. Furnizorul păstrează cheile de idempotență 24 de ore; verifică jurnalul furnizorului înainte de reîncercarea unui rezultat ambiguu după această perioadă.

Planul gratuit Resend din Vercel Marketplace nu este disponibil pentru acest cont; nu a fost activat un abonament plătit. Se poate configura un cont Resend direct gratuit sau un serviciu SMTP existent. Redirecționarea emailului de contact este separată de trimiterea alertelor automate.

Identitatea publică este centralizată în `src/config/site.ts`. Nu publica date de firmă inventate. Jobul zilnic protejat de `CRON_SECRET` elimină cererile finalizate după 90 de zile și reîncearcă notificările email eșuate. Nu stoca diagnostice sau documente medicale în acest portal.

## Dependențe

Nu s-au adăugat biblioteci pentru administrare, email sau CSV. ESLint 9 și `@hookform/resolvers` 5 sunt păstrate pentru compatibilitatea proiectului. Auditul inițial de producție a avut zero vulnerabilități; auditul complet a indicat cinci alerte în lanțul dev `eslint-config-next → fast-glob → micromatch → braces`. Nu aplica `npm audit fix --force` fără verificarea schimbărilor majore.
