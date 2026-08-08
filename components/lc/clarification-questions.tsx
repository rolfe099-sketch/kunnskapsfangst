'use client'

import { ArrowRight, HelpCircle, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { AvklaringSpm } from '@/lib/data'

type ClarificationQuestionsProps = {
  avklaringer: AvklaringSpm[]
  svar: string[]
  /** Spørsmålene genereres av modellen akkurat nå. */
  laster: boolean
  /** Kilden til spørsmålene – styrer den ærlige merkingen. */
  kilde: 'eksempel' | 'generert' | 'standard'
  onEndre: (indeks: number, verdi: string) => void
  onBrukEksempel: (indeks: number) => void
  onTilbake: () => void
  onLagForslag: () => void
}

const KILDE_TEKST: Record<ClarificationQuestionsProps['kilde'], string> = {
  eksempel: 'Forhåndsskrevne utdypinger for eksempelnotatet.',
  generert: 'Spørsmålene er generert av modellen ut fra notatet ditt.',
  standard:
    'Modellkallet feilet – dette er standardspørsmål, ikke spørsmål generert fra notatet ditt.',
}

export function ClarificationQuestions({
  avklaringer,
  svar,
  laster,
  kilde,
  onEndre,
  onBrukEksempel,
  onTilbake,
  onLagForslag,
}: ClarificationQuestionsProps) {
  const alleBesvart =
    avklaringer.length > 0 && avklaringer.every((_, i) => (svar[i] ?? '').trim().length > 0)

  if (laster) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">Leser notatet…</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Modellen finner ut hva som bør utdypes for at erfaringen skal kunne gjenbrukes.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-5">
          <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Genererer utdypingsspørsmål…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">
          {avklaringer.length === 2 ? 'To ting bør utdypes' : 'Dette bør utdypes'}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Litt mer kontekst gjør erfaringen tydelig nok til å kunne gjenbrukes av andre.
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          {KILDE_TEKST[kilde]}
        </p>
      </div>

      <div className="space-y-4">
        {avklaringer.map((a, i) => (
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
            {a.eksempelSvar ? (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onBrukEksempel(i)}
                  className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
                >
                  Bruk eksempelsvar
                </button>
              </div>
            ) : null}
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
