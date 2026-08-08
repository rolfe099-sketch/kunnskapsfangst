'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Lightbulb,
  Search,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExperienceDetailSheet } from '@/components/lc/experience-detail-sheet'
import { KortlisteSkeleton, TellerSkeleton } from '@/components/lc/skeletons'
import { kildeLinje, type Erfaringskort } from '@/lib/data'
import { SEED_KORT } from '@/lib/seed-kort'
import {
  fjernKunnskapshull,
  hentGodkjenteKort,
  hentKunnskapshull,
  type Kunnskapshull,
} from '@/lib/lager'

function formaterDato(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function KnowledgeLibrary() {
  const searchParams = useSearchParams()
  const [fane, setFane] = useState<string>(
    searchParams.get('fane') === 'hull' ? 'hull' : 'kort',
  )

  // localStorage leses først etter mount, så server- og klient-HTML matcher.
  const [lastet, setLastet] = useState(false)
  const [godkjente, setGodkjente] = useState<Erfaringskort[]>([])
  const [hull, setHull] = useState<Kunnskapshull[]>([])

  const [søk, setSøk] = useState('')
  const [valgtType, setValgtType] = useState<string | null>(null)
  const [detaljKort, setDetaljKort] = useState<Erfaringskort | null>(null)
  const [kopiert, setKopiert] = useState(false)

  useEffect(() => {
    setGodkjente(hentGodkjenteKort())
    setHull(hentKunnskapshull())
    setLastet(true)
  }, [])

  const alleKort = useMemo(() => [...godkjente, ...SEED_KORT], [godkjente])

  const prosjekttyper = useMemo(
    () => Array.from(new Set(alleKort.map((k) => k.prosjekttype))).sort(),
    [alleKort],
  )

  const filtrerte = useMemo(() => {
    const q = søk.trim().toLowerCase()
    return alleKort.filter((k) => {
      if (valgtType && k.prosjekttype !== valgtType) return false
      if (!q) return true
      const tekst = [
        k.tittel,
        k.situasjon,
        k.problem,
        k.tiltak,
        k.observertEffekt,
        k.relevantNaar,
        k.prosjekttype,
        ...k.tags,
      ]
        .join(' ')
        .toLowerCase()
      return tekst.includes(q)
    })
  }, [alleKort, søk, valgtType])

  async function kopierDebriefAgenda() {
    const linjer = [
      'Foreslåtte tema til neste konsulentdebrief (fra kunnskapshull i LC-hjernen):',
      '',
      ...hull.map((h, i) => `${i + 1}. ${h.sporsmal}`),
    ]
    try {
      await navigator.clipboard.writeText(linjer.join('\n'))
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      // Utklippstavle kan være blokkert – da skjer det bare ingenting.
    }
  }

  function fjernHull(id: string) {
    setHull(fjernKunnskapshull(id))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-8">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">Kunnskapsbiblioteket</h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Alle godkjente erfaringer, samlet ett sted. Kort du godkjenner i demoen dukker opp
          her — og spørsmål basen ikke kunne svare på blir kunnskapshull som foreslås i neste
          ukentlige debrief.
        </p>
      </div>

      <Tabs value={fane} onValueChange={(v) => setFane(String(v))}>
        <TabsList>
          <TabsTrigger value="kort" className="px-3">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Erfaringskort {lastet ? `(${alleKort.length})` : <TellerSkeleton />}
          </TabsTrigger>
          <TabsTrigger value="hull" className="px-3">
            <Lightbulb className="size-3.5" aria-hidden="true" />
            Kunnskapshull {lastet ? `(${hull.length})` : <TellerSkeleton />}
          </TabsTrigger>
        </TabsList>

        {/* ---- Erfaringskort ---- */}
        <TabsContent value="kort" className="space-y-4 pt-2">
          <div className="space-y-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={søk}
                onChange={(e) => setSøk(e.target.value)}
                placeholder="Søk i titler, tiltak, tags…"
                className="pl-9"
                aria-label="Søk i erfaringskort"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {prosjekttyper.map((type) => {
                const aktiv = valgtType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValgtType(aktiv ? null : type)}
                    className="focus-visible:ring-ring/50 rounded-full focus-visible:ring-[3px] focus-visible:outline-none"
                    aria-pressed={aktiv}
                  >
                    <Badge variant={aktiv ? 'default' : 'outline'} className="cursor-pointer">
                      {type}
                      {aktiv ? <X className="size-3" aria-hidden="true" /> : null}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          {!lastet ? (
            <KortlisteSkeleton />
          ) : filtrerte.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Ingen erfaringer matcher{' '}
                {søk.trim() ? (
                  <>
                    «<span className="text-foreground">{søk.trim()}</span>»
                  </>
                ) : (
                  'filteret'
                )}
                {valgtType ? ` i ${valgtType}` : ''}.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  setSøk('')
                  setValgtType(null)
                }}
              >
                Nullstill søk og filter
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {filtrerte.map((kort) => (
                <li key={kort.id}>
                  <button
                    type="button"
                    onClick={() => setDetaljKort(kort)}
                    className="group w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground/15 hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold leading-snug text-foreground">
                          {kort.tittel}
                        </p>
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {kort.observertEffekt}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">{kort.prosjekttype}</Badge>
                      {kort.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                      <span className="ml-auto text-[11px] text-muted-foreground">
                        {kildeLinje(kort.kilde)}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ---- Kunnskapshull ---- */}
        <TabsContent value="hull" className="space-y-4 pt-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              Spørsmål kunnskapsgrunnlaget ikke kunne besvare. Dette er ikke feil — det er
              bestillingen til neste ukentlige debrief: hjernen vet hva den ikke kan, og ber
              konsulentene om akkurat det.
            </p>
            {hull.length > 0 ? (
              <Button size="sm" variant="outline" onClick={kopierDebriefAgenda}>
                {kopiert ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    Kopier som debrief-agenda
                  </>
                )}
              </Button>
            ) : null}
          </div>

          {!lastet ? (
            <KortlisteSkeleton antall={2} />
          ) : hull.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Ingen kunnskapshull ennå</p>
              <p className="mx-auto mt-1.5 max-w-sm leading-relaxed">
                Still et spørsmål basen ikke dekker i{' '}
                <Link
                  href="/"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  demoen
                </Link>
                , så havner det her — klart til neste ukes debrief.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {hull.map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        {h.sporsmal}
                      </p>
                      {h.detalj ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {h.detalj}
                        </p>
                      ) : null}
                      <p className="text-[11px] text-muted-foreground">
                        Logget {formaterDato(h.dato)} · foreslås i neste debrief
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fjernHull(h.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      aria-label={`Fjern kunnskapshull: ${h.sporsmal}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <ExperienceDetailSheet
        kort={detaljKort}
        onÅpenEndring={(åpen) => {
          if (!åpen) setDetaljKort(null)
        }}
      />
    </div>
  )
}
