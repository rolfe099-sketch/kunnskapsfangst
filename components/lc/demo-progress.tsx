import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const STADIER = ['Fang erfaringen', 'Godkjenn kunnskapen', 'Bruk den i neste prosjekt'] as const

type DemoProgressProps = {
  /** Aktivt stadium, 1-basert (1, 2 eller 3). */
  aktivt: number
}

export function DemoProgress({ aktivt }: DemoProgressProps) {
  return (
    <nav aria-label="Fremdrift" className="flex items-center gap-2 sm:gap-3">
      {STADIER.map((navn, i) => {
        const nr = i + 1
        const ferdig = nr < aktivt
        const aktiv = nr === aktivt
        return (
          <div key={navn} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                  ferdig && 'border-success bg-success text-success-foreground',
                  aktiv && 'border-primary bg-primary text-primary-foreground',
                  !ferdig && !aktiv && 'border-border bg-muted text-muted-foreground',
                )}
              >
                {ferdig ? <Check className="size-3.5" aria-hidden="true" /> : nr}
              </span>
              <span
                className={cn(
                  'truncate text-xs font-medium transition-colors sm:text-sm',
                  aktiv ? 'text-foreground' : 'text-muted-foreground',
                  !aktiv && 'hidden sm:inline',
                )}
              >
                {navn}
              </span>
            </div>
            {nr < STADIER.length ? (
              <span
                className={cn(
                  'h-px flex-1 transition-colors',
                  ferdig ? 'bg-success/50' : 'bg-border',
                )}
                aria-hidden="true"
              />
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}
