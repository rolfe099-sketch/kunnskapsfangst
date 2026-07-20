import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const STRUKTUR_STEG = [
  'Leser notatet',
  'Identifiserer erfaringen',
  'Strukturerer kunnskapen',
] as const

type ProcessingStateProps = {
  /** Indeks for steget som er aktivt akkurat nå (0-basert). */
  aktivtSteg: number
}

export function ProcessingState({ aktivtSteg }: ProcessingStateProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Behandler
      </p>
      <ol className="mt-4 flex flex-col gap-3">
        {STRUKTUR_STEG.map((steg, i) => {
          const ferdig = i < aktivtSteg
          const aktiv = i === aktivtSteg
          return (
            <li key={steg} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors',
                  ferdig && 'border-success bg-success text-success-foreground',
                  aktiv && 'border-primary bg-primary/10 text-primary',
                  !ferdig && !aktiv && 'border-border bg-muted text-muted-foreground',
                )}
                aria-hidden="true"
              >
                {ferdig ? <Check className="size-3" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-sm transition-colors',
                  aktiv ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {steg}
              </span>
              {aktiv ? (
                <span className="ml-1 flex items-center gap-1" aria-hidden="true">
                  <span className="lc-dot size-1 rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="lc-dot size-1 rounded-full bg-primary [animation-delay:180ms]" />
                  <span className="lc-dot size-1 rounded-full bg-primary [animation-delay:360ms]" />
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
