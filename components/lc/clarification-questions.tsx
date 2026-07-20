'use client'

import { ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DEMO_AVKLARINGER } from '@/lib/data'

type ClarificationQuestionsProps = {
  svar: string[]
  onEndre: (indeks: number, verdi: string) => void
  onBrukEksempel: (indeks: number) => void
  onTilbake: () => void
  onLagForslag: () => void
}

export function ClarificationQuestions({
  svar,
  onEndre,
  onBrukEksempel,
  onTilbake,
  onLagForslag,
}: ClarificationQuestionsProps) {
  const alleBesvart = DEMO_AVKLARINGER.every((_, i) => (svar[i] ?? '').trim().length > 0)

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">To ting bør utdypes</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Litt mer kontekst gjør erfaringen tydelig nok til å kunne gjenbrukes av andre.
        </p>
      </div>

      <div className="space-y-4">
        {DEMO_AVKLARINGER.map((a, i) => (
          <div key={a.sporsmal} className="rounded-lg border border-border bg-background p-4">
            <div className="flex gap-2.5">
              <HelpCircle
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground">{a.sporsmal}</p>
            </div>
            <Textarea
              value={svar[i] ?? ''}
              onChange={(e) => onEndre(i, e.target.value)}
              rows={3}
              placeholder="Skriv et kort svar…"
              className="mt-3 resize-none leading-relaxed"
              aria-label={a.sporsmal}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onBrukEksempel(i)}
                className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                Bruk eksempelsvar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onTilbake} className="text-muted-foreground">
          Tilbake
        </Button>
        <Button onClick={onLagForslag} disabled={!alleBesvart} className="h-10 px-5">
          Lag forslag til erfaring
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
