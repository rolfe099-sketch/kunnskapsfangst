'use client'

import { useState } from 'react'
import { ArrowUp, Check, CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEMO_SPORSMAL_STOTTET, DEMO_SPORSMAL_UDEKKET } from '@/lib/data'
import { cn } from '@/lib/utils'

type KnowledgeQuestionProps = {
  onSpør: (sporsmal: string) => void
  pågår: boolean
  /** Spørsmålet som er stilt / stilles nå (for markering). */
  aktivtSpørsmål: string | null
}

const FORSLAG = [
  { tekst: DEMO_SPORSMAL_STOTTET, hint: 'Dekkes av godkjent erfaring' },
  { tekst: DEMO_SPORSMAL_UDEKKET, hint: 'Utenfor kunnskapsgrunnlaget' },
]

export function KnowledgeQuestion({ onSpør, pågår, aktivtSpørsmål }: KnowledgeQuestionProps) {
  const [tekst, setTekst] = useState('')

  function send() {
    const q = tekst.trim()
    if (!q || pågår) return
    onSpør(q)
    setTekst('')
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {FORSLAG.map((f) => {
          const aktiv = aktivtSpørsmål === f.tekst
          return (
            <button
              key={f.tekst}
              type="button"
              disabled={pågår}
              onClick={() => onSpør(f.tekst)}
              className={cn(
                'group flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70',
                aktiv
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-card hover:border-foreground/15 hover:bg-muted/40',
              )}
            >
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CircleHelp className="size-3.5" aria-hidden="true" />
                {f.hint}
              </span>
              <span className="text-sm font-medium leading-snug text-foreground">{f.tekst}</span>
              {aktiv ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary">
                  <Check className="size-3.5" aria-hidden="true" />
                  Valgt
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="…eller skriv ditt eget spørsmål"
          disabled={pågår}
          aria-label="Skriv et spørsmål"
        />
        <Button
          onClick={send}
          disabled={pågår || tekst.trim().length === 0}
          size="icon"
          className="size-10 shrink-0"
          aria-label="Send spørsmål"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
