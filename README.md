# Kunnskapsfangst — konseptdemo for LC-hjernen

En uavhengig konseptdemo bygget i forbindelse med søknaden til KI-ekspert-stillingen
hos Lean Communications. Den viser prinsippet bak en intern kunnskapsbase: praktisk
prosjektkunnskap hentes ut av et rotete konsulentnotat, godkjennes av mennesket, og
gjenbrukes med kildekoblede svar i neste prosjekt.

**Alt innhold er fiktivt. Demoen er ikke tilknyttet, godkjent av eller bestilt av
noe selskap.**

## Prøv den på 90 sekunder

1. Start eksempelet — et kort, ustrukturert konsulentnotat følger med.
2. Svar på de to utdypingsspørsmålene, eller bruk eksempelsvarene.
3. Se KI-forslaget til strukturert erfaringskort. Rediger fritt, og godkjenn —
   ingenting deles før konsulenten har godkjent.
4. Still spørsmålene i siste steg: det ene dekkes av godkjent kunnskap og besvares
   med kildehenvisning, det andre ligger utenfor — og systemet sier tydelig ifra i
   stedet for å gjette. Skriv gjerne ditt eget spørsmål også.

## Tre prinsipper

1. **KI foreslår — den bestemmer ikke.** Modellen strukturerer notatet til et
   utkast, uten å legge til fakta som ikke står der, og med eksplisitte forbehold.
2. **Konsulenten godkjenner.** Mennesket leser, redigerer og godkjenner før noe
   deles. Originalnotatet og utdypingssvarene følger kortet, så kildekoblingen
   aldri brytes.
3. **Svar er alltid kildekoblet.** Spørsmål besvares kun ut fra godkjent kunnskap,
   med henvisning per påstand. Mangler grunnlaget, sier systemet det rett ut — en
   kunnskapsbase som dikter, er farligere enn ingen kunnskapsbase.

## Arkitektur

Next.js (App Router), skisset i v0 og ferdigstilt med Claude Code. To server-ruter
kaller en språkmodell via Vercel AI SDK: én strukturerer notatet til JSON (med
defensiv parsing), én svarer strømmende på spørsmål med de godkjente kortene som
eneste kontekst. Enkel rate-limiting per IP. Kunnskapsbasen lever i nettleserøkten —
ingen database.

Feiler et modellkall, later ikke demoen som noe: eget innhold gir en ærlig
feilmelding med mulighet for nytt forsøk, og kun det uendrede eksempelet kan falle
tilbake på et forhåndsskrevet reservesvar — tydelig merket som nettopp det.

## Bevisste begrensninger

Utdypingsspørsmålene er faste i demoen; i en ekte løsning ville modellen generert
dem fra notatet. Ingen retrieval eller vektorsøk — med få kort går alt i
kontekstvinduet, og i skala ville jeg lagt på retrieval. Ingen innlogging, roller,
maskering eller audit-logg — se neste avsnitt for hvorfor de måtte på plass før
ekte bruk.

## Sikkerhet — før ekte kundedata

Modellnøkkelen ligger kun på server, og rutene er rate-limitet. En ekte LC-hjerne
krever mer: tilgangsstyring og roller (hvem ser hva), dataklassifisering per
erfaring (offentlig / intern / konfidensiell), maskering av person- og kundenavn
før noe sendes til en modell, logg over hvem som la inn og endret hva,
databehandleravtale og bevisst valg av modell og region (EU-prosessering), og en
tydelig regel for hva som aldri skal inn i basen. Dette må inn i datamodellen fra
start — ikke legges på etterpå.

## Hvis dette var ekte — neste steg

Modellgenererte utdypingsspørsmål, lyd og transkripsjon som inngang, retrieval ved
vekst, eierskap og versjonering per erfaringskort, og en fast ukentlig
innhentingsflyt — slik at kunnskapen blir smartere for hver uke.
