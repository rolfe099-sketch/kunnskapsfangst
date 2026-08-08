import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  CircleCheck,
  FileText,
  Lightbulb,
  Lock,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SEED_KORT } from '@/lib/seed-kort'
import { EMBEDDING_MODELL, MODELL_ID, TRANSKRIPSJON_MODELL } from '@/lib/modell'

const FLYT = [
  {
    ikon: FileText,
    tittel: 'Notat',
    tekst: 'Konsulenten skriver fritt om noe som fungerte eller gikk galt.',
  },
  {
    ikon: Lock,
    tittel: 'Maskering',
    tekst: 'Kunde- og personnavn oppdages lokalt og godkjennes før noe sendes.',
    fremhev: true,
  },
  {
    ikon: Sparkles,
    tittel: 'Modellen foreslår',
    tekst: 'Utdypingsspørsmål og et strukturert erfaringskort — som utkast.',
  },
  {
    ikon: CircleCheck,
    tittel: 'Mennesket godkjenner',
    tekst: 'Konsulenten redigerer og godkjenner. Ingenting deles før det.',
  },
  {
    ikon: Brain,
    tittel: 'Kunnskapsbasen',
    tekst: 'Kortet blir søkbart og gjenbrukbart for alle andre.',
  },
  {
    ikon: MessageSquareQuote,
    tittel: 'Kildekoblet svar',
    tekst: 'Spørsmål besvares kun fra godkjent kunnskap, med henvisning.',
  },
  {
    ikon: Lightbulb,
    tittel: 'Kunnskapshull',
    tekst: 'Det basen ikke kan, blir bestillingen til neste ukes debrief.',
    fremhev: true,
  },
]

const PRINSIPPER = [
  {
    tittel: 'KI foreslår — den bestemmer ikke',
    tekst:
      'Modellen strukturerer notatet til et utkast uten å legge til fakta som ikke står der, og skriver eksplisitte forbehold. Et forslag er et forslag.',
  },
  {
    tittel: 'Konsulenten godkjenner',
    tekst:
      'Mennesket leser, redigerer og godkjenner før noe deles. Originalnotatet og utdypingssvarene følger kortet, så kildekoblingen aldri brytes.',
  },
  {
    tittel: 'Svar er alltid kildekoblet',
    tekst:
      'Spørsmål besvares kun ut fra godkjent kunnskap, med henvisning per påstand. En kunnskapsbase som dikter er farligere enn ingen kunnskapsbase.',
  },
  {
    tittel: 'Hjernen vet hva den ikke kan',
    tekst:
      'Udekkede spørsmål blir kunnskapshull som foreslås som tema i neste debrief. Innhentingen styres av det konsulentene faktisk lurer på.',
  },
]

const AVGRENSNINGER = [
  {
    tittel: 'Ingen innlogging eller roller',
    tekst:
      'Demoen skal kunne prøves på 90 sekunder uten konto. En ekte LC-hjerne trenger tilgangsstyring fra dag én.',
  },
  {
    tittel: 'Klientside-lagring, ikke database',
    tekst:
      'Godkjente kort og kunnskapshull ligger i nettleseren din. Godt nok til å vise sløyfen — ikke til å dele mellom folk.',
  },
  {
    tittel: 'Ingen vektordatabase',
    tekst: `Med ${SEED_KORT.length} kort går alt i kontekstvinduet. Retrieval hører hjemme først når basen vokser.`,
  },
  {
    tittel: 'Heuristisk maskering',
    tekst:
      'Deteksjonen er regelbasert og vil både overdetektere og bomme. Derfor er den bygget som et forslag mennesket godkjenner — aldri som noe automatisk.',
  },
]

const FOR_EKTE_BRUK = [
  'Tilgangsstyring og roller — hvem får se hva',
  'Dataklassifisering per erfaring: offentlig, intern, konfidensiell',
  'Logg over hvem som la inn og endret hva',
  'Databehandleravtale og bevisst valg av modell og region (EU-prosessering)',
  'En tydelig regel for hva som aldri skal inn i basen',
]

export function AboutSolution() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-5 py-10">
      {/* Intro */}
      <section className="space-y-3">
        <Badge variant="outline" className="text-muted-foreground">
          Om løsningen
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Hvorfor den er bygget slik
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Dette er en uavhengig konseptdemo, laget i forbindelse med søknaden til
          KI-ekspert-stillingen hos Lean Communications. Den er bevisst liten på funksjoner og
          tydelig på prinsipper — for en kunnskapsbase i et konsulentselskap står og faller på
          om folk kan stole på den. Alt innhold er fiktivt.
        </p>
      </section>

      {/* Flyten */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">Slik henger det sammen</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            En sløyfe, ikke en rett linje. Siste steg mater det første.
          </p>
        </div>

        <ol className="space-y-2">
          {FLYT.map((steg, i) => {
            const Ikon = steg.ikon
            return (
              <li
                key={steg.tittel}
                className={
                  steg.fremhev
                    ? 'flex gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4'
                    : 'flex gap-3 rounded-xl border border-border bg-card p-4'
                }
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary"
                  aria-hidden="true"
                >
                  <Ikon className="size-4" />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-muted-foreground tabular-nums">{i + 1}. </span>
                    {steg.tittel}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{steg.tekst}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="flex gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Steg 7 lukker sirkelen: kunnskapshullene blir agendaen for neste ukes
            innhenting, og basen blir smartere for hver uke — styrt av reelle spørsmål.
          </span>
        </p>
      </section>

      {/* Prinsipper */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Fire prinsipper</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRINSIPPER.map((p) => (
            <div key={p.tittel} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{p.tittel}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teknisk */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Teknisk oppsett</h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Next.js med App Router, skisset i v0 og videreutviklet med Claude Code. Tre
            server-ruter kaller en språkmodell gjennom Vercel AI SDK og AI Gateway: én
            genererer utdypingsspørsmål fra notatet, én strukturerer notatet til JSON med
            defensiv parsing, og én svarer strømmende på spørsmål med de godkjente kortene som
            eneste kontekst. Modellnøkkelen ligger kun på server, og rutene er rate-limitet
            per IP.
          </p>
          <p>
            Modellene settes med miljøvariabler, slik at de kan byttes uten kodeendring. Ulike
            oppgaver får ulikt verktøy — Anthropic tilbyr ikke embeddings, så søket bruker en
            annen leverandør enn svarene. Slik ser oppsettet ut akkurat nå:
          </p>
          <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {[
              { rolle: 'Spørsmål, strukturering og svar', modell: MODELL_ID },
              { rolle: 'Likhetssøk (embeddings)', modell: EMBEDDING_MODELL },
              { rolle: 'Transkripsjon av lyd', modell: TRANSKRIPSJON_MODELL },
            ].map((r) => (
              <div
                key={r.rolle}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
              >
                <dt className="text-sm text-muted-foreground">{r.rolle}</dt>
                <dd className="font-mono text-xs text-foreground">{r.modell}</dd>
              </div>
            ))}
          </dl>
          <p>
            Claude krever betalte AI Gateway-kreditter — gratisnivået gir ikke tilgang til
            Claude-modellene, og struper dessuten forespørslene. Det er verdt å vite før man
            demonstrerer noe for noen.
          </p>
          <p className="rounded-lg border border-border bg-muted/40 px-4 py-3">
            <strong className="font-medium text-foreground">Når noe feiler:</strong> demoen
            later aldri som. Eget innhold gir en ærlig feilmelding med mulighet for nytt
            forsøk. Kun det uendrede eksempelet kan falle tilbake på forhåndsskrevet
            reserveinnhold — og da står det tydelig at det er nettopp det. En demo som skjuler
            feil, lærer deg ingenting om hvordan systemet oppfører seg i praksis.
          </p>
        </div>
      </section>

      {/* Sikkerhet */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">Sikkerhet</h2>
        </div>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Maskeringssteget kjører lokalt i nettleseren. Det er et bevisst valg: vi kan ikke
          sende teksten til en modell for å finne ut hva som må skjules før den sendes til en
          modell. Erfaringen er verdt å dele — navnet på kunden er det ikke.
        </p>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">
            Dette måtte på plass før ekte kundedata
          </p>
          <ul className="mt-2 space-y-1.5">
            {FOR_EKTE_BRUK.map((krav) => (
              <li key={krav} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {krav}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Dette hører hjemme i datamodellen fra start — det lar seg ikke legge på etterpå.
          </p>
        </div>
      </section>

      {/* Avgrensninger */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">Bevisste avgrensninger</h2>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            Det som ikke er bygget, er like mye en beslutning som det som er bygget.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {AVGRENSNINGER.map((a) => (
            <div key={a.tittel} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{a.tittel}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Prøv demoen
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/bibliotek"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Se kunnskapsbiblioteket
        </Link>
      </section>
    </div>
  )
}
