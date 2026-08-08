# Kunnskapsfangst — konseptdemo for LC-hjernen

En uavhengig konseptdemo bygget i forbindelse med søknaden til KI-ekspert-stillingen
hos Lean Communications. Den viser prinsippet bak en intern kunnskapsbase: praktisk
prosjektkunnskap hentes ut av et rotete konsulentnotat, godkjennes av mennesket, og
gjenbrukes med kildekoblede svar i neste prosjekt — mens spørsmål basen ikke kan
svare på blir kunnskapshull som mater neste ukes debrief.

**Alt innhold er fiktivt. Demoen er ikke tilknyttet, godkjent av eller bestilt av
noe selskap.**

## Prøv den på 90 sekunder

1. Start eksempelet — et kort, ustrukturert konsulentnotat følger med. (Skriver du
   ditt eget notat, genererer modellen utdypingsspørsmålene fra det du skrev.)
2. Svar på utdypingsspørsmålene, eller bruk eksempelsvarene.
3. Se KI-forslaget til strukturert erfaringskort. Rediger fritt, og godkjenn —
   ingenting deles før konsulenten har godkjent.
4. Still spørsmålene i siste steg: det ene dekkes av godkjent kunnskap og besvares
   med kildehenvisning, det andre ligger utenfor — og systemet sier tydelig ifra i
   stedet for å gjette. Det udekkede spørsmålet logges som et **kunnskapshull**.
5. Åpne **Biblioteket**: alle godkjente erfaringer (16 fiktive seed-kort om takt,
   Lean og flyt, pluss dine egne) med søk og filter — og kunnskapshullene, klare
   som foreslått agenda til neste ukentlige debrief.

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

Next.js (App Router), skisset i v0 og videreutviklet med Claude Code. Tre
server-ruter kaller Claude (Sonnet 4.5) via Vercel AI SDK / AI Gateway: én
genererer utdypingsspørsmål fra notatet, én strukturerer notatet til JSON (med
defensiv parsing), én svarer strømmende på spørsmål med de godkjente kortene som
eneste kontekst. Enkel rate-limiting per IP. Godkjente kort og kunnskapshull
persisteres i nettleseren (localStorage) — ingen database ennå, med vilje.

Feiler et modellkall, later ikke demoen som noe: eget innhold gir en ærlig
feilmelding med mulighet for nytt forsøk, og kun det uendrede eksempelet kan falle
tilbake på forhåndsskrevet reserveinnhold — tydelig merket som nettopp det. Det
samme gjelder utdypingsspørsmålene: klarer ikke modellen å generere dem, merkes
standardspørsmålene ærlig.

## Bevisste begrensninger

Ingen retrieval eller vektorsøk — med noen titalls kort går alt i kontekstvinduet,
og i skala ville jeg lagt på retrieval. Persistens er klientside (localStorage),
ikke en delt database — godt nok til å vise sløyfen, ikke til flere brukere.
Ingen innlogging, roller, maskering eller audit-logg — se neste avsnitt for
hvorfor de måtte på plass før ekte bruk.

## Sikkerhet — før ekte kundedata

Modellnøkkelen ligger kun på server, og rutene er rate-limitet. En ekte LC-hjerne
krever mer: tilgangsstyring og roller (hvem ser hva), dataklassifisering per
erfaring (offentlig / intern / konfidensiell), maskering av person- og kundenavn
før noe sendes til en modell, logg over hvem som la inn og endret hva,
databehandleravtale og bevisst valg av modell og region (EU-prosessering), og en
tydelig regel for hva som aldri skal inn i basen. Dette må inn i datamodellen fra
start — ikke legges på etterpå.

## Hvis dette var ekte — neste steg

Delt database med eierskap og versjonering per erfaringskort, retrieval ved vekst,
maskering av kunde- og personnavn som synlig steg før modellkall, lyd og
transkripsjon som inngang, og en fast ukentlig innhentingsflyt der kunnskapshullene
automatisk blir debrief-agenda — slik at kunnskapen blir smartere for hver uke.
