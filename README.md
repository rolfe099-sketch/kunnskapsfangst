# Kunnskapsfangst — konseptdemo for LC-hjernen

En uavhengig konseptdemo bygget i forbindelse med søknaden til KI-ekspert-stillingen
hos Lean Communications. Den viser prinsippet bak en intern kunnskapsbase: praktisk
prosjektkunnskap hentes ut av et rotete konsulentnotat, godkjennes av mennesket, og
gjenbrukes med kildekoblede svar i neste prosjekt — mens spørsmål basen ikke kan
svare på blir kunnskapshull som mater neste ukes debrief.

**Alt innhold er fiktivt. Demoen er ikke tilknyttet, godkjent av eller bestilt av
noe selskap.**

## Prøv den på 90 sekunder

1. Start eksempelet — et kort, ustrukturert konsulentnotat følger med. Du kan også
   skrive ditt eget, eller **snakke det inn** og få det transkribert.
2. **Sjekk hva som sendes:** kunde- og personnavn oppdages lokalt i nettleseren og
   maskeres først når du har godkjent det. Ingenting forlater maskinen før da.
3. Svar på utdypingsspørsmålene — genererte fra ditt eget notat — eller bruk
   eksempelsvarene.
4. Se KI-forslaget til strukturert erfaringskort. Rediger fritt, og godkjenn —
   ingenting deles før konsulenten har godkjent.
5. Still spørsmålene i siste steg. Du ser først **hvilke erfaringer som ble hentet
   og med hvilken likhet**, deretter svaret med kildehenvisning per påstand. Det
   ene spørsmålet dekkes, det andre ligger utenfor — da sier systemet tydelig ifra
   i stedet for å gjette, og spørsmålet logges som et **kunnskapshull**.
6. Åpne **Biblioteket**: alle godkjente erfaringer (16 fiktive seed-kort om takt,
   Lean og flyt, pluss dine egne) med søk og filter — og kunnskapshullene, klare
   som foreslått agenda til neste ukentlige debrief.
7. **Om løsningen** forklarer arkitektur, modellvalg, sikkerhet og hva som bevisst
   ikke er bygget.

## Fire prinsipper

1. **KI foreslår — den bestemmer ikke.** Modellen strukturerer notatet til et
   utkast, uten å legge til fakta som ikke står der, og med eksplisitte forbehold.
2. **Konsulenten godkjenner.** Mennesket leser, redigerer og godkjenner før noe
   deles. Originalnotatet og utdypingssvarene følger kortet, så kildekoblingen
   aldri brytes.
3. **Svar er alltid kildekoblet.** Spørsmål besvares kun ut fra godkjent kunnskap,
   med henvisning per påstand. Mangler grunnlaget, sier systemet det rett ut — en
   kunnskapsbase som dikter, er farligere enn ingen kunnskapsbase.
4. **Hjernen vet hva den ikke kan.** Udekkede spørsmål blir kunnskapshull som
   foreslås som tema i neste ukentlige debrief — slik blir basen smartere for hver
   uke, styrt av det konsulentene faktisk lurer på.

## Arkitektur

Next.js (App Router), skisset i v0 og videreutviklet med Claude Code. Fem
server-ruter går gjennom Vercel AI SDK / AI Gateway: én genererer
utdypingsspørsmål fra notatet, én strukturerer notatet til JSON (med defensiv
parsing), én gjør likhetssøk med embeddings, én svarer strømmende med de hentede
kortene som eneste kontekst, og én transkriberer lydopptak. Alle er rate-limitet
per IP, og modellnøkkelen ligger kun på server. Godkjente kort og kunnskapshull
persisteres i nettleseren (localStorage) — ingen database ennå, med vilje.

**Retrieval:** kortene embeddes (cachet per serverinstans) og rangeres mot
spørsmålet med cosinuslikhet. Utvalget bruker både et absolutt bunnivå og en
relativ terskel på 85 % av beste treff — uten den siste passerte middelmådige
kort og gjorde svarene vage. Finner søket ingenting relevant, kalles ikke
svarmodellen i det hele tatt: vi vet allerede at grunnlaget mangler, og å la
modellen «prøve» ville vært å invitere til gjetting.

Modellen settes med miljøvariabelen `AI_MODELL` (se `lib/modell.ts`), slik at den
kan byttes uten kodeendring. Standard er `openai/gpt-4.1-mini`, som er verifisert
tilgjengelig på AI Gateway sitt gratisnivå. Claude-modellene er verifisert
utilgjengelige der — gatewayen svarer «Free tier users do not have access to this
model» — og krever betalte AI Gateway-kreditter. Med kreditter på plass er Claude
ett miljøvariabel-bytte unna:

```
AI_MODELL=anthropic/claude-sonnet-4.5
```

Feiler modellkallet uansett grunn, later demoen aldri som: den viser enten en
ærlig feilmelding eller tydelig merket reserveinnhold.

Feiler et modellkall, later ikke demoen som noe: eget innhold gir en ærlig
feilmelding med mulighet for nytt forsøk, og kun det uendrede eksempelet kan falle
tilbake på forhåndsskrevet reserveinnhold — tydelig merket som nettopp det. Det
samme gjelder utdypingsspørsmålene: klarer ikke modellen å generere dem, merkes
standardspørsmålene ærlig.

## Bevisste begrensninger

Persistens er klientside (localStorage), ikke en delt database — godt nok til å
vise sløyfen, ikke til flere brukere. Ingen vektordatabase: med noen titalls kort
er likhetssøk i minnet riktig verktøy, og en vektordatabase hører hjemme først ved
vekst. Maskeringen er regelbasert og vil både overdetektere og bomme — derfor er
den bygget som et forslag mennesket godkjenner, aldri som noe automatisk. Ingen
innlogging, roller eller audit-logg.

## Sikkerhet — før ekte kundedata

Maskeringssteget kjører lokalt i nettleseren. Det er et bevisst valg: vi kan ikke
sende teksten til en modell for å finne ut hva som må skjules før den sendes til
en modell. Modellnøkkelen ligger kun på server, og rutene er rate-limitet.

En ekte LC-hjerne krever mer: tilgangsstyring og roller (hvem ser hva),
dataklassifisering per erfaring (offentlig / intern / konfidensiell), logg over
hvem som la inn og endret hva, databehandleravtale og bevisst valg av modell og
region (EU-prosessering), og en tydelig regel for hva som aldri skal inn i basen.
Dette må inn i datamodellen fra start — ikke legges på etterpå.

## Hvis dette var ekte — neste steg

Delt database med eierskap og versjonering per erfaringskort, NER-basert maskering
kjørt on-prem i stedet for regler, tilgangsstyring og audit-logg, og en fast
ukentlig innhentingsflyt der kunnskapshullene automatisk blir debrief-agenda —
slik at kunnskapen blir smartere for hver uke.
