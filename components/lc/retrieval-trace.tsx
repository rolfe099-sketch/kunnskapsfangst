'use client'

import { useState } from 'react'
import { ChevronDown, Loader2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Treff = {
  id: string
  tittel: string
  skår: number
}

type RetrievalTraceProps = {
  laster: boolean
  treff: Treff[]
  forkastet: Treff[]
  totalt: number
  /** Søket feilet – alle kort ble sendt som kontekst i stedet. */
  hoppetOver?: boolean
}

function prosent(skår: number): number {
  return Math.max(0, Math.min(100, Math.round(skår * 100)))
}

function Rad({ t, dempet }: { t: Treff; dempet?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-sm',
          dempet ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {t.tittel}
      </span>
      <span className="flex w-24 shrink-0 items-center gap-2">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className={cn('block h-full rounded-full', dempet ? 'bg-border' : 'bg-primary')}
            style={{ width: `${prosent(t.skår)}%` }}
          />
        </span>
        <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
          {t.skår.toFixed(2)}
        </span>
      </span>
    </li>
  )
}

export function RetrievalTrace({
  laster,
  treff,
  forkastet,
  totalt,
  hoppetOver,
}: RetrievalTraceProps) {
  const [visForkastet, setVisForkastet] = useState(false)

  if (laster) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Søker i kunnskapsgrunnlaget…</p>
      </div>
    )
  }

  if (hoppetOver) {
    return (
      <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-foreground">
        Søket feilet, så hele kunnskapsgrunnlaget ble sendt som kontekst i stedet. Svaret er
        fortsatt kildekoblet, men uten utvalg.
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <Search className="size-3.5 text-primary" aria-hidden="true" />
        <p className="text-sm text-foreground">
          Søkte i <strong className="font-medium">{totalt}</strong> erfaringer — hentet{' '}
          <strong className="font-medium">{treff.length}</strong> som kontekst
        </p>
      </div>

      {treff.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {treff.map((t) => (
            <Rad key={t.id} t={t} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ingen erfaringer var like nok til å brukes som grunnlag.
        </p>
      )}

      {forkastet.length > 0 ? (
        <div className="mt-3 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setVisForkastet((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-expanded={visForkastet}
          >
            <ChevronDown
              className={cn('size-3.5 transition-transform', visForkastet && 'rotate-180')}
              aria-hidden="true"
            />
            {visForkastet ? 'Skjul' : 'Vis'} de nærmeste som ikke ble brukt
          </button>
          {visForkastet ? (
            <ul className="mt-2.5 space-y-2">
              {forkastet.map((t) => (
                <Rad key={t.id} t={t} dempet />
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
