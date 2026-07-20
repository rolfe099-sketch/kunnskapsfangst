'use client'

import { useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import type { Avklaring } from '@/lib/data'
import { cn } from '@/lib/utils'

type SourceDisclosureProps = {
  notat: string
  konsulent: string
  dato: string
  avklaringer: Avklaring[]
  /** Åpen fra start? */
  startÅpen?: boolean
}

export function SourceDisclosure({
  notat,
  konsulent,
  dato,
  avklaringer,
  startÅpen = false,
}: SourceDisclosureProps) {
  const [åpen, setÅpen] = useState(startÅpen)

  return (
    <div className="rounded-lg border border-border bg-muted/30">
      <button
        type="button"
        onClick={() => setÅpen((v) => !v)}
        aria-expanded={åpen}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
      >
        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="flex-1 text-sm font-medium text-foreground">Se opprinnelig grunnlag</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            åpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {åpen ? (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Opprinnelig notat
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{notat}</p>
            {(konsulent || dato) && (
              <p className="text-xs text-muted-foreground">
                {[konsulent, dato].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>

          {avklaringer.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Utdypende svar
              </p>
              <dl className="space-y-3">
                {avklaringer.map((a) => (
                  <div key={a.sporsmal} className="space-y-0.5">
                    <dt className="text-sm font-medium text-foreground">{a.sporsmal}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{a.svar}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
