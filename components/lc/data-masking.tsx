'use client'

import { ArrowRight, Check, ShieldCheck, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FUNN_ETIKETT, maskerTekst, type Funn } from '@/lib/maskering'
import { cn } from '@/lib/utils'

type DataMaskingProps = {
  notat: string
  funn: Funn[]
  onVeksle: (id: string) => void
  onTilbake: () => void
  onFortsett: () => void
}

export function DataMasking({
  notat,
  funn,
  onVeksle,
  onTilbake,
  onFortsett,
}: DataMaskingProps) {
  const aktive = funn.filter((f) => f.aktiv)
  const maskert = maskerTekst(notat, funn)

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">
          Hva sendes til modellen?
        </h3>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Erfaringen er verdt å dele. Det er ikke navnet på kunden. Teksten sjekkes lokalt
          i nettleseren din for identifiserende opplysninger — før noe forlater maskinen.
        </p>
      </div>

      {funn.length === 0 ? (
        <div className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Ingen identifiserende opplysninger funnet
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sjekken er en enkel heuristikk, ikke en garanti. Du er fortsatt ansvarlig for
              at det du sender inn kan deles.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {aktive.length} av {funn.length} forslag blir maskert. Klikk for å slå av og på.
          </p>
          <ul className="space-y-2">
            {funn.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onVeksle(f.id)}
                  aria-pressed={f.aktiv}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                    f.aktiv
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-background hover:bg-muted/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded border',
                      f.aktiv
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    {f.aktiv ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-muted-foreground">
                        {FUNN_ETIKETT[f.type]}
                      </Badge>
                      <span className="font-mono text-sm text-foreground">{f.original}</span>
                      <ArrowRight
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-sm text-primary">{f.erstatning}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Dette sendes til modellen
        </p>
        <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {maskert}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onTilbake} className="text-muted-foreground">
          Tilbake
        </Button>
        <Button onClick={onFortsett} className="h-10 px-5">
          Send maskert tekst
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
