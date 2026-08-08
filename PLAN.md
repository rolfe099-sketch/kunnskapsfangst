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
7. ✅ **Ekte retrieval (RAG)**: /api/hent embedder kortene og spørsmålet,
   rangerer med cosinuslikhet og viser åpent i UI hvilke kort som ble hentet,
   med score — og hvilke som ble forkastet. [Kort N] peker inn i utvalget.
8. ✅ **Rikere seed-innhold**: 16 fiktive erfaringskort om taktplanlegging,
   buffere, Last Planner, PPU, hindringslogg, logistikk, sluttfase m.m.
   (lib/seed-kort.ts).

## Fase 2 — Differensiatorene (det som gjør inntrykk)

9. ✅ **Kunnskapshull-sløyfen**: udekkede spørsmål logges som kunnskapshull,
   vises i egen fane i biblioteket og kan kopieres som debrief-agenda.
   (Kan senere kobles til en ekte ukentlig flyt.)
10. ✅ **Ukentlig debrief-visning**: /uke med nøkkeltall, tilvekst per uke,
    bidragsytere og kunnskapshullene som kopierbar debrief-agenda.
11. ✅ **Sikkerhetslag som synes**: lokal deteksjon av person-, firma- og
    prosjektnavn med maskering («Entreprenør A», «Person 1») som konsulenten
    godkjenner *før* noe sendes til modellen (lib/maskering.ts).
    Klassifisering per kort og endringslogg gjenstår.
12. ✅ **Lyd som inngang**: opptak i nettleseren, transkribert via /api/transkriber
    og inn i samme flyt — inkludert maskeringssteget.

## Fase 3 — Presentasjonspolish

13. ✅ **«Om løsningen»-side**: /om med flyten som sløyfe, prinsipper, teknisk
    oppsett, sikkerhet og bevisste avgrensninger.
14. ✅ **Demo-manus**: skrevet, men ligger bevisst utenfor repoet — de som
    vurderer søknaden leser koden, og interne notater om hva man skal si i et
    intervju hører ikke hjemme der.
15. Gjennomgang av mobil, lastetilstander, tomtilstander, feilhåndtering.

## Status

Gjort: 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14.
Claude kjører i produksjon (`AI_MODELL`), og alle rutene er verifisert der.
Gjenstår: delt database med tilgangsstyring (2), og en siste gjennomgang av
lastetilstander og feilhåndtering (15).

## Det som IKKE skal bygges (og hvorfor det er et poeng)

Ingen innlogging/brukerhåndtering, ingen fine-tuning, ingen egen vektordatabase i
skala. Si det høyt i intervjuet: annonsen sier selv «Vi bygger ikke teknologi fra
bunnen. Vi er best på å bruke verktøyene som finnes.» Bevisste avgrensninger viser
dømmekraft — det er en konsulentegenskap.
