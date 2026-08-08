'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy, Lightbulb, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DiagramSkeleton,
  KortlisteSkeleton,
  ListeSkeleton,
  StatRadSkeleton,
} from '@/components/lc/skeletons'
import type { Erfaringskort } from '@/lib/data'
import { SEED_KORT } from '@/lib/seed-kort'
import { hentGodkjenteKort, hentKunnskapshull, type Kunnskapshull } from '@/lib/lager'
import {
  bidragsytere,
  nyeDenneUken,
  registrertDato,
  ukeEtikett,
  ukePeriode,
  ukesvekst,
} from '@/lib/uke'

// Kolonnene får en fast høyde å vokse i, slik at nullverdier fortsatt har plass.
const PLOT_HOYDE = 132

function StatRute({
  merkelapp,
  verdi,
  bunntekst,
}: {
  merkelapp: string
  verdi: number
  bunntekst: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{merkelapp}</p>
      <p className="mt-1 text-3xl font-semibold text-foreground">{verdi}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{bunntekst}</p>
    </div>
  )
}

export function WeeklyDashboard() {
  const [lastet, setLastet] = useState(false)
  const [godkjente, setGodkjente] = useState<Erfaringskort[]>([])
  const [hull, setHull] = useState<Kunnskapshull[]>([])
  const [kopiert, setKopiert] = useState(false)
  const [kopiFeil, setKopiFeil] = useState(false)

  useEffect(() => {
    setGodkjente(hentGodkjenteKort())
    setHull(hentKunnskapshull())
    setLastet(true)
  }, [])

  const alleKort = useMemo(() => [...godkjente, ...SEED_KORT], [godkjente])
  const vekst = useMemo(() => ukesvekst(alleKort, 10), [alleKort])
  const folk = useMemo(() => bidragsytere(alleKort), [alleKort])
  const nye = useMemo(() => nyeDenneUken(alleKort), [alleKort])

  const maks = Math.max(1, ...vekst.map((u) => u.antall))
  const sisteIndeks = vekst.length - 1

  // Uken som leses av over diagrammet: den man peker på, ellers inneværende.
  const [aktivUke, setAktivUke] = useState<number | null>(null)
  const vist = vekst[aktivUke ?? sisteIndeks] ?? vekst[sisteIndeks]

  function agendaTekst(): string {
    return [
      'Agenda – ukentlig konsulentdebrief',
      '',
      'Kunnskapshull hjernen ikke kunne svare på:',
      ...hull.map((h, i) => `${i + 1}. ${h.sporsmal}`),
      '',
      'Har du en erfaring som dekker noe av dette, legg den inn denne uken.',
    ].join('\n')
  }

  async function kopierAgenda() {
    setKopiFeil(false)
    try {
      await navigator.clipboard.writeText(agendaTekst())
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      // Nettleseren kan blokkere utklippstavlen. Å feile stille ville brutt
      // med demoens eget prinsipp – vis teksten så den kan kopieres manuelt.
      setKopiFeil(true)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-8">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">Denne uken</h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Innhentingen er en fast rytme, ikke en kampanje. Her ser du hva basen har fått
          denne uken, hvem som har bidratt, og hva den fortsatt ikke kan svare på.
        </p>
      </div>

      {/* Nøkkeltall */}
      {!lastet ? (
        <StatRadSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatRute
            merkelapp="Erfaringer totalt"
            verdi={alleKort.length}
            bunntekst="godkjent og søkbart"
          />
          <StatRute
            merkelapp="Nye denne uken"
            verdi={nye}
            bunntekst={nye === 0 ? 'ingen ennå denne uken' : 'lagt inn siden mandag'}
          />
          <StatRute
            merkelapp="Bidragsytere"
            verdi={folk.length}
            bunntekst="konsulenter med erfaringer inne"
          />
          <StatRute
            merkelapp="Åpne kunnskapshull"
            verdi={hull.length}
            bunntekst={hull.length === 0 ? 'alt er dekket så langt' : 'spørsmål uten dekning'}
          />
        </div>
      )}

      {/* Vekst over tid */}
      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Nye erfaringer per uke
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Siste ti uker. Jevn tilvekst er poenget — ikke topper.
          </p>
        </div>

        {!lastet ? (
          <DiagramSkeleton />
        ) : (
        <div className="rounded-xl border border-border bg-card p-5">
          {/* Avlesning i stedet for flytende tooltip: den kan ikke gå ut over
              sidebredden, og den virker med tastatur og berøring. */}
          <p className="mb-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {ukePeriode(vist.start)}
            </span>{' '}
            · {vist.antall} {vist.antall === 1 ? 'ny erfaring' : 'nye erfaringer'}
            {aktivUke === null ? ' (denne uken)' : ''}
          </p>

          <div
            className="flex items-end gap-2"
            style={{ height: PLOT_HOYDE }}
            onMouseLeave={() => setAktivUke(null)}
          >
            {vekst.map((u, i) => {
              const høyde = u.antall === 0 ? 2 : Math.round((u.antall / maks) * PLOT_HOYDE)
              const aktiv = aktivUke === i
              return (
                <button
                  key={u.nokkel}
                  type="button"
                  className="flex flex-1 cursor-default flex-col items-center justify-end rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  style={{ height: PLOT_HOYDE }}
                  onMouseEnter={() => setAktivUke(i)}
                  onFocus={() => setAktivUke(i)}
                  onBlur={() => setAktivUke(null)}
                  aria-label={`${ukePeriode(u.start)}: ${u.antall} nye erfaringer`}
                >
                  {/* Verdien merkes kun på nyeste uke – resten leses av over. */}
                  {i === sisteIndeks && u.antall > 0 ? (
                    <span className="mb-1 text-xs font-medium text-foreground tabular-nums">
                      {u.antall}
                    </span>
                  ) : null}
                  <span
                    className={[
                      'w-full max-w-6 transition-opacity',
                      u.antall === 0 ? 'bg-border' : 'rounded-t bg-primary',
                      aktivUke !== null && !aktiv ? 'opacity-45' : 'opacity-100',
                    ].join(' ')}
                    style={{ height: høyde }}
                  />
                </button>
              )
            })}
          </div>

          {/* Etikettene må kunne krympe (min-w-0), ellers presser ti av dem
              siden bredere enn skjermen på mobil. Der vises hver tredje. */}
          <div className="mt-2 flex gap-2">
            {vekst.map((u, i) => {
              const sisteEllerHverAndre = i % 2 === 0 || i === sisteIndeks
              const påMobil = i % 3 === 0 || i === sisteIndeks
              if (!sisteEllerHverAndre) {
                return <span key={u.nokkel} className="min-w-0 flex-1" />
              }
              return (
                <span
                  key={u.nokkel}
                  className={[
                    'min-w-0 flex-1 truncate text-center text-[10px] text-muted-foreground',
                    påMobil ? '' : 'hidden sm:block',
                  ].join(' ')}
                >
                  {ukeEtikett(u.start)}
                </span>
              )
            })}
          </div>

          {/* Tallene finnes også som tabell, ikke bare som grafikk. */}
          <table className="sr-only">
            <caption>Nye erfaringer per uke, siste ti uker</caption>
            <thead>
              <tr>
                <th scope="col">Uke</th>
                <th scope="col">Nye erfaringer</th>
              </tr>
            </thead>
            <tbody>
              {vekst.map((u) => (
                <tr key={u.nokkel}>
                  <th scope="row">{ukePeriode(u.start)}</th>
                  <td>{u.antall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>

      {/* Bidragsytere */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold text-foreground">Hvem har bidratt</h2>
        </div>

        {!lastet ? (
          <ListeSkeleton />
        ) : folk.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
            Ingen bidragsytere registrert ennå.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {folk.map((b) => (
              <li key={b.navn} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-36 shrink-0 truncate text-sm text-foreground">
                  {b.navn}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.round((b.antall / (folk[0]?.antall || 1)) * 100)}%`,
                    }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
                  {b.antall}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bestillingen til neste debrief */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Bestillingen til neste debrief
            </h2>
          </div>
          {hull.length > 0 ? (
            <Button size="sm" variant="outline" onClick={kopierAgenda}>
              {kopiert ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" />
                  Kopiert
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" />
                  Kopier agenda
                </>
              )}
            </Button>
          ) : null}
        </div>

        {kopiFeil ? (
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
            <p className="text-sm leading-relaxed text-foreground">
              Nettleseren blokkerte utklippstavlen. Her er agendaen — merk teksten og
              kopier den manuelt.
            </p>
            <pre className="mt-3 max-h-56 overflow-auto rounded-md border border-border bg-background p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground select-all">
              {agendaTekst()}
            </pre>
          </div>
        ) : null}

        {!lastet ? (
          <KortlisteSkeleton antall={2} />
        ) : hull.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Ingen åpne kunnskapshull</p>
            <p className="mx-auto mt-1.5 max-w-sm leading-relaxed">
              Still et spørsmål basen ikke dekker i{' '}
              <Link
                href="/"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                demoen
              </Link>
              , så blir det bestillingen til neste uke.
            </p>
          </div>
        ) : (
          <ol className="space-y-2">
            {hull.map((h, i) => (
              <li
                key={h.id}
                className="flex gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold text-primary tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {h.sporsmal}
                  </p>
                  {h.detalj ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {h.detalj}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Legg inn ukens erfaring
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/bibliotek"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Se hele biblioteket
        </Link>
      </div>
    </div>
  )
}
