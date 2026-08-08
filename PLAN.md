# Plan: Kunnskapsfangst → LC-hjernen v2

Mål: løfte prosjektet fra en scriptet 3-stegs konseptdemo til noe som ser og føles
som et ekte internt produkt — og som treffer nøyaktig det stillingsannonsen ber om.
Hvert tiltak under er merket med hvilken del av annonsen det svarer på.

## Hvor prosjektet står i dag

- Én lineær demo-løype: notat → to **faste** utdypingsspørsmål → KI-strukturert
  erfaringskort → godkjenning → spørsmål mot godkjent kunnskap.
- Kunnskapsbasen lever kun i nettleserøkten (ingen database). 2 seed-kort.
- Ingen retrieval — alt sendes i kontekstvinduet.
- Modellen er `openai/gpt-4.1-mini` (annonsen sier de bruker Claude daglig).
- Sikkerhet er beskrevet i README, men ikke demonstrert i produktet.
- Styrker som må bevares: ærlighetsprinsippene (KI foreslår / mennesket godkjenner /
  alltid kildekoblet, aldri late som ved feil). Dette er gull i en intervjusetting.

## Fase 0 — Grunnmur (kort innsats, gjør først)

1. ✅ **Bytt til Claude** som modell — gjort: `anthropic/claude-sonnet-4.5` via
   AI Gateway (verifisert tilgjengelig i gatewayen).
2. **Persistent lagring**: Postgres (Neon eller Supabase, gratis tier) + Drizzle.
   Delvis: godkjente kort + kunnskapshull persisteres nå i localStorage.
   Ekte delt database gjenstår.
3. **Deploy til Vercel** med stabil URL som kan sendes/åpnes i intervjuet.
4. ✅ Småting: prosjektnavn i `package.json` rettet.

## Fase 1 — Fra demo til produkt (kjernen)

5. ✅ **Kunnskapsbibliotek**: /bibliotek med fritekstsøk, prosjekttype-filter og
   gjenbrukt detaljvisning. Godkjente kort fra demoen dukker opp der.
6. ✅ **Modellgenererte utdypingsspørsmål**: ny rute /api/avklaringer genererer
   2–3 spørsmål fra egne notater; eksempelnotatet bruker de forhåndsskrevne, og
   feil gir ærlig merkede standardspørsmål.
7. **Ekte retrieval (RAG)**: embeddings per kort + likhetssøk ved spørsmål.
   Vis åpent i UI *hvilke* kort som ble hentet og hvorfor (score). Behold
   [Kort N]-siteringer.
   → Viser at du kan RAG i praksis, ikke bare si ordet.
8. ✅ **Rikere seed-innhold**: 16 fiktive erfaringskort om taktplanlegging,
   buffere, Last Planner, PPU, hindringslogg, logistikk, sluttfase m.m.
   (lib/seed-kort.ts).

## Fase 2 — Differensiatorene (det som gjør inntrykk)

9. ✅ **Kunnskapshull-sløyfen**: udekkede spørsmål logges som kunnskapshull,
   vises i egen fane i biblioteket og kan kopieres som debrief-agenda.
   (Kan senere kobles til en ekte ukentlig flyt.)
10. **Ukentlig debrief-visning**: «Denne uken»-dashboard — hvem har levert, nye
    kort, basens vekst over tid, hull som ble tettet.
    → Annonsen: «MATER LC-HJERNEN».
11. **Sikkerhetslag som synes**: automatisk deteksjon av person-, kunde- og
    prosjektnavn i notatet, med visuell maskering («Entreprenør A», «Person 1»)
    som konsulenten godkjenner *før* noe sendes til modellen. Klassifisering per
    kort (intern/konfidensiell) og enkel endringslogg.
    → Annonsen: «VOKTER SIKKERHETEN» / «SIKKERHET I RYGGMARGEN». I dag er dette
    bare tekst i README — å *vise* det er langt sterkere.
12. **Lyd som inngang**: les inn notatet muntlig, transkriber (Whisper via
    gateway eller nettleser-API), og send til samme flyt. Konsulenter i felt
    skriver ikke — de snakker. Stor wow-faktor på 30 sekunder i en demo.

## Fase 3 — Presentasjonspolish

13. **«Om løsningen»-side**: arkitekturskisse, modellvalg og hvorfor, hva som
    bevisst er utelatt og hva som måtte på plass før ekte kundedata. (Flytt og
    utvid README-innholdet inn i selve produktet.)
14. **Demo-manus**: en 5-minutters løype du kan kjøre i intervjuet — inkl. hva du
    sier når noe feiler (ærlighetsprinsippet er et poeng, ikke en risiko).
15. Gjennomgang av mobil, lastetilstander, tomtilstander, feilhåndtering.

## Prioritering hvis tiden er knapp

Kjør i denne rekkefølgen: **0 → 6 → 8 → 5 → 9 → 11 → 7 → 10 → 12 → 13**.
Fase 0 + punkt 6, 8, 5 og 9 alene gir en demo som føles som et produkt med en
selvforbedrende sløyfe — det er kjernen i «LC-hjernen» slik annonsen beskriver den.

## Det som IKKE skal bygges (og hvorfor det er et poeng)

Ingen innlogging/brukerhåndtering, ingen fine-tuning, ingen egen vektordatabase i
skala. Si det høyt i intervjuet: annonsen sier selv «Vi bygger ikke teknologi fra
bunnen. Vi er best på å bruke verktøyene som finnes.» Bevisste avgrensninger viser
dømmekraft — det er en konsulentegenskap.
