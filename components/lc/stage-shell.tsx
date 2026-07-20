'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StageStatus = 'upcoming' | 'active' | 'done'

type StageShellProps = {
  nr: number
  tittel: string
  status: StageStatus
  /** Kort oppsummering vist når stadiet er ferdig og sammenslått. */
  sammendrag?: string
  /** Handling for å gå tilbake til et ferdig stadium. */
  onÅpne?: () => void
  children: React.ReactNode
}

export function StageShell({
  nr,
  tittel,
  status,
  sammendrag,
  onÅpne,
  children,
}: StageShellProps) {
  const erAktiv = status === 'active'
  const erFerdig = status === 'done'

  return (
    <section
      aria-current={erAktiv ? 'step' : undefined}
      className={cn(
        'rounded-xl border bg-card transition-colors',
        erAktiv ? 'border-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]' : 'border-border/70',
        status === 'upcoming' && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
            erFerdig && 'border-success bg-success text-success-foreground',
            erAktiv && 'border-primary bg-primary text-primary-foreground',
            status === 'upcoming' && 'border-border bg-muted text-muted-foreground',
          )}
        >
          {erFerdig ? <Check className="size-3.5" aria-hidden="true" /> : nr}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              'text-sm font-semibold',
              erAktiv || erFerdig ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {tittel}
          </h2>
          {erFerdig && sammendrag ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{sammendrag}</p>
          ) : null}
        </div>
        {erFerdig && onÅpne ? (
          <button
            type="button"
            onClick={onÅpne}
            className="shrink-0 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Se
          </button>
        ) : null}
      </div>

      {erAktiv ? <div className="border-t border-border px-5 py-5 sm:px-6">{children}</div> : null}
    </section>
  )
}
