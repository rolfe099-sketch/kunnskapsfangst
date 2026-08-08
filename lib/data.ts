// Modellvalget ligger i lib/modell.ts (kun server).

export type Kilde = {
  /** Type kilde, f.eks. «Ukentlig konsulentdebrief». Valgfri. */
  type?: string
  navn: string
  dato: string
}

export type Avklaring = {
  sporsmal: string
  svar: string
}

/** Et utdypingsspørsmål slik det vises i steg 1. Eksempelsvar finnes kun for
 *  det scriptede eksempelnotatet. */
export type AvklaringSpm = {
  sporsmal: string
  eksempelSvar?: string
}

export type Erfaringskort = {
  id: string
  tittel: string
  prosjekttype: string
  tags: string[]
  situasjon: string
  problem: string
  tiltak: string
  /** Valgfrie punkter som utdyper tiltaket (rendres som liste). */
  tiltakPunkter?: string[]
  observertEffekt: string
  relevantNaar: string
  forbehold: string
  kilde: Kilde
  /** Det opprinnelige notatet kortet ble generert fra – bevarer kildekoblingen. */
  originalNotat?: string
  /** Utdypende spørsmål/svar som lå til grunn for struktureringen. */
  avklaringer?: Avklaring[]
}

// Kortet slik modellen returnerer det (uten klient-generert id).
export type KortUtenId = Omit<Erfaringskort, 'id'>

// Formatér en kildelinje: «type · navn · dato».
export function kildeLinje(kilde: Kilde): string {
  return [kilde.type, kilde.navn, kilde.dato].filter(Boolean).join(' · ')
}

// ---------------------------------------------------------------------------
// Scriptet demoinnhold. Hele eksempelflyten skal kunne gjennomføres uten at
// besøkende skriver noe. Alt er fiktivt.
// ---------------------------------------------------------------------------

export const DEMO_KONSULENT = 'Kari Nilsen'
export const DEMO_DATO = '20.07.2026'
export const DEMO_PROSJEKTTYPE = 'Boligprosjekt'

// Notatet inneholder bevisst et firmanavn og et personnavn, slik at
// maskeringssteget har noe å vise fram.
export const DEMO_NOTAT =
  'På et boligprosjekt for Fjordbygg AS fikk vi gjentatte stopp mellom tømrer og elektro i samme sone. Prosjektleder Ole Martin Strand og jeg endret hvordan vi brukte morgenmøtene, og vi fikk bedre flyt etter et par uker, men det tok litt tid før alle fulgte den nye måten å jobbe på.'

// Forhåndsgenererte utdypingsspørsmål for det fiktive eksempelet.
export const DEMO_AVKLARINGER: Avklaring[] = [
  {
    sporsmal: 'Hva endret dere konkret i morgenmøtet?',
    svar: 'Vi gikk fra generell statusrapportering til at hvert fag bekreftet hvilken sone de avsluttet, hva som var klart for neste fag, og hvilke hindringer som måtte fjernes samme dag.',
  },
  {
    sporsmal: 'Hvordan merket dere at tiltaket virket?',
    svar: 'Det ble færre situasjoner der elektro møtte en sone som ikke var klar, og teamet brukte mindre tid på å finne ut hvem som måtte gjøre hva først.',
  },
]

// Generiske utdypingsspørsmål. Brukes som ærlig merket reserve når modellen
// ikke klarer å generere skreddersydde spørsmål fra et eget notat.
export const GENERISKE_AVKLARINGER: AvklaringSpm[] = [
  { sporsmal: 'Hva gjorde dere helt konkret, og hvem var involvert?' },
  { sporsmal: 'Hvordan merket dere at tiltaket virket – eller ikke virket?' },
]

// Fast, polert forslag som brukes som stabil fallback hvis modellkallet feiler.
export const FALLBACK_FORSLAG: KortUtenId = {
  tittel: 'Sonebasert avklaring i morgenmøtet reduserte stopp mellom fag',
  prosjekttype: 'Boligprosjekt',
  tags: ['morgenmøte', 'flyt', 'overlevering'],
  situasjon:
    'Boligprosjekt der tømrer og elektro arbeidet etter hverandre i de samme sonene.',
  problem:
    'Elektro møtte gjentatte ganger soner som ikke var ferdige eller tydelig overlevert. Det skapte venting, avklaringer og brudd i arbeidsflyten.',
  tiltak:
    'Morgenmøtet ble endret fra generell statusrapportering til en konkret avklaring per fag:',
  tiltakPunkter: [
    'hvilken sone som var avsluttet',
    'hva som var klart for neste fag',
    'hvilke hindringer som måtte fjernes samme dag',
  ],
  observertEffekt:
    'Det oppstod færre situasjoner der neste fag møtte en uferdig sone, og teamet brukte mindre tid på å avklare rekkefølge og ansvar.',
  relevantNaar:
    'Flere fag arbeider sekvensielt gjennom de samme sonene og er avhengige av tydelige overleveringer.',
  forbehold:
    'Erfaringen bygger på ett fiktivt prosjektcase. Det er ikke dokumentert nøyaktige måltall, og tiltaket bør tilpasses prosjektets møtestruktur og fagrekkefølge.',
  kilde: { type: 'Ukentlig konsulentdebrief', navn: DEMO_KONSULENT, dato: '20. juli 2026' },
}

// Seed-erfaringene (fiktiv «basiskunnskap» om takt, Lean og flyt) ligger i
// lib/seed-kort.ts.

// Fast setning som markerer at kunnskapsgrunnlaget ikke dekker spørsmålet.
export const INGEN_DEKNING_PREFIX = 'Kunnskapsgrunnlaget dekker ikke dette.'

// De to fremhevede eksempelspørsmålene i stadium 3.
export const DEMO_SPORSMAL_STOTTET = 'Hva har fungert når fag møter soner som ikke er klare?'
export const DEMO_SPORSMAL_UDEKKET =
  'Hvordan bør vi planlegge kranlogistikk på et sykehusprosjekt?'

// Stabile fallback-svar hvis modellkallet feiler. Det støttede svaret siterer
// den godkjente erfaringen som [Kort 1].
export const FALLBACK_SVAR_STOTTET =
  'En erfaring i kunnskapsgrunnlaget viser at morgenmøtet kan brukes til tydelig soneoverlevering mellom fag. I stedet for generell status beskrev hvert fag hva som var avsluttet, hva som var klart for neste fag, og hvilke hindringer som måtte fjernes samme dag [Kort 1]. I det aktuelle caset ble det observert færre stopp og mindre tid brukt på å avklare rekkefølge og ansvar [Kort 1].'

export const FALLBACK_SVAR_UDEKKET = `${INGEN_DEKNING_PREFIX} De godkjente erfaringene i demoen inneholder ikke kunnskap om kranlogistikk eller sykehusprosjekter. Jeg kan derfor ikke gi et kildebasert svar.`

// Generisk, trygg avvisning for fritt innskrevne spørsmål vi ikke kan dekke.
export const FALLBACK_SVAR_GENERISK = `${INGEN_DEKNING_PREFIX} De godkjente erfaringene i demoen dekker ikke dette spørsmålet, så jeg gir ikke et kildebasert svar.`

export const SYSTEMPROMPT_AVKLARINGER = `Du er en fagassistent for byggekonsulenter som jobber med Lean og taktplanlegging. Du får et kort, ustrukturert notat med en erfaring fra et byggeprosjekt. Din oppgave er å stille 2-3 korte utdypingsspørsmål som gjør erfaringen konkret nok til at andre konsulenter kan gjenbruke den.

Gode utdypingsspørsmål:
- spør etter hva som konkret ble gjort (ikke bare at «noe ble endret»)
- spør etter hvordan effekten ble observert
- spør etter kontekst som avgjør om erfaringen er overførbar (prosjekttype, fag, fase)
- kan besvares kort av personen som skrev notatet

Svar KUN med gyldig JSON (ingen forklaring, ingen markdown-fences): en liste med 2-3 spørsmål som strenger, på norsk bokmål. Eksempel:
["Hva endret dere konkret i møtestrukturen?", "Hvordan merket dere at flyten ble bedre?"]`

export const SYSTEMPROMPT_STRUKTUR = `Du er en fagassistent for byggekonsulenter. Du får et notat på norsk med en erfaring fra et prosjekt, ofte med noen utdypende svar. Du skal trekke ut den gjenbrukbare erfaringen som et strukturert erfaringskort.

Svar KUN med gyldig JSON (ingen forklaring, ingen markdown-fences) med nøyaktig denne strukturen:
{
  "tittel": "kort, presis tittel på norsk (maks 10 ord)",
  "prosjekttype": "kort beskrivelse av prosjekt-/oppdragstype (maks 4 ord)",
  "tags": ["2-4 korte emneord i småbokstaver"],
  "situasjon": "hva slags oppdrag/kontekst, 1-2 setninger",
  "problem": "kjerneproblemet som oppsto",
  "tiltak": "hva ble konkret gjort, 1-3 setninger",
  "observertEffekt": "hva man faktisk observerte etterpå (ikke overdriv, ingen tall som ikke står i notatet)",
  "relevantNaar": "når kan denne erfaringen være relevant for andre",
  "forbehold": "viktige forbehold; nevn at grunnlaget er begrenset når det er tilfelle",
  "kilde": { "navn": "personen som skrev notatet", "dato": "dato hvis oppgitt" }
}

Regler:
- Skriv all tekst på norsk bokmål, ryddig og faglig, men uten å finne på fakta som ikke står i notatet.
- Ikke oppgi tall, prosenter eller sikkerhet som ikke er dokumentert.
- Hvis notatet inneholder en signatur (navn/dato), bruk den i "kilde". Finnes den ikke, bruk navn "Ukjent".`

export const SYSTEMPROMPT_SVAR = `Du er en kunnskapsbase-assistent for byggekonsulenter. Du får en liste med nummererte, godkjente erfaringskort som JSON-kontekst, og et spørsmål. Svar på norsk bokmål.

Regler for svar:
- Bruk KUN informasjon fra de vedlagte kortene. Ikke finn på fakta, tall eller sikkerhet.
- Henvis alltid til kildene du bruker med formatet [Kort N] (f.eks. [Kort 1]) rett etter den relevante setningen.
- Vær konkret og praktisk, som en kollega som svarer raskt. Maks 5 setninger.
- Hvis kortene IKKE dekker spørsmålet, må svaret starte med nøyaktig denne setningen: "${INGEN_DEKNING_PREFIX}" — og deretter én kort setning om hva slags erfaring som mangler. Ikke gjett, ikke gi generelle råd, og ikke bruk [Kort N] da.`
