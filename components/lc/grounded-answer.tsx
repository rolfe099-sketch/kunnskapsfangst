'use client'

import { ArrowUpRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Erfaringskort } from '@/lib/data'
import { kildeLinje } from '@/lib/data'

type GroundedAnswerProps = {
  svar: string
  kort: Erfaringskort[]
  onÅpneErfaring: (kort: Erfaringskort) => void
  /** Skjuler kildekort mens svaret fortsatt strømmer inn. */
  strømmer?: boolean
}

const SITAT = /\[(?:Kort\s*)?(\d+)\]/g

// Del svarteksten i tekst + siteringschips ([N]).
function renderMedSitat(tekst: string) {
  const deler: React.ReactNode[] = []
  let sisteIndeks = 0
  let m: RegExpExecArray | null
  let key = 0
  SITAT.lastIndex = 0
  while ((m = SITAT.exec(tekst)) !== null) {
    if (m.index > sisteIndeks) {
      deler.push(tekst.slice(sisteIndeks, m.index))
    }
    deler.push(
      <sup
        key={`c-${key++}`}
        className="ml-0.5 inline-flex -translate-y-0.5 items-center rounded bg-primary/12 px-1 text-[10px] font-semibold text-primary"
      >
        {m[1]}
      </sup>,
    )
    sisteIndeks = m.index + m[0].length
  }
  if (sisteIndeks < tekst.length) {
    deler.push(tekst.slice(sisteIndeks))
  }
  return deler
}

// Hvilke kortnumre ([Kort N]) refereres, i rekkefølge og unikt.
function siterteNumre(tekst: string): number[] {
  const sett = new Set<number>()
  const orden: number[] = []
  let m: RegExpExecArray | null
  SITAT.lastIndex = 0
  while ((m = SITAT.exec(tekst)) !== null) {
    const n = Number(m[1])
    if (!sett.has(n)) {
      sett.add(n)
      orden.push(n)
    }
  }
  return orden
}

export function GroundedAnswer({ svar, kort, onÅpneErfaring, strømmer }: GroundedAnswerProps) {
  const numre = siterteNumre(svar).filter((n) => kort[n - 1])
  // Mellom at søket er ferdig og første token kommer, er svaret tomt. En tom
  // ramme med markør ser ut som en feil – vis at noe er på vei.
  const venterPåFørsteToken = strømmer && svar.trim().length === 0

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        {venterPåFørsteToken ? (
          <div aria-live="polite" aria-label="Skriver svar">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="mt-2 h-3.5 w-11/12" />
            <Skeleton className="mt-2 h-3.5 w-3/5" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">
            {renderMedSitat(svar)}
            {strømmer ? (
              <span
                className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-primary/60"
                aria-hidden="true"
              />
            ) : null}
          </p>
        )}
      </div>

      {!strømmer && numre.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {numre.length === 1 ? 'Kilde' : 'Kilder'}
          </p>
          {numre.map((n) => {
            const k = kort[n - 1]
            return (
              <div
                key={k.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold text-primary">
                    {n}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        {k.tittel}
                      </p>
                      <p className="text-xs text-muted-foreground">{kildeLinje(k.kilde)}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {k.observertEffekt || k.situasjon}
                    </p>
                    <button
                      type="button"
                      onClick={() => onÅpneErfaring(k)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                    >
                      Åpne erfaring
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
