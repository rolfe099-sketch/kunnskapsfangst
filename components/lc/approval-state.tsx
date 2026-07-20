'use client'

import { useState } from 'react'
import { Check, Pencil, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StructuredExperience } from '@/components/lc/structured-experience'
import { SourceDisclosure } from '@/components/lc/source-disclosure'
import type { Avklaring, KortUtenId } from '@/lib/data'

type ApprovalStateProps = {
  forslag: KortUtenId
  onEndre: (felter: Partial<KortUtenId>) => void
  notat: string
  konsulent: string
  dato: string
  avklaringer: Avklaring[]
  onGodkjenn: () => void
  onTilbake: () => void
}

const REDIGERBARE: { nokkel: keyof KortUtenId; etikett: string; felt: 'input' | 'area' }[] = [
  { nokkel: 'tittel', etikett: 'Tittel', felt: 'input' },
  { nokkel: 'situasjon', etikett: 'Situasjon', felt: 'area' },
  { nokkel: 'problem', etikett: 'Problem', felt: 'area' },
  { nokkel: 'tiltak', etikett: 'Tiltak', felt: 'area' },
  { nokkel: 'observertEffekt', etikett: 'Observert effekt', felt: 'area' },
  { nokkel: 'relevantNaar', etikett: 'Kan være relevant når', felt: 'area' },
  { nokkel: 'forbehold', etikett: 'Forbehold', felt: 'area' },
]

export function ApprovalState({
  forslag,
  onEndre,
  notat,
  konsulent,
  dato,
  avklaringer,
  onGodkjenn,
  onTilbake,
}: ApprovalStateProps) {
  const [redigerer, setRedigerer] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">
            KI-forslag til gjenbrukbar erfaring
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Språkmodellen foreslår en strukturert tolkning. Du som konsulent er ansvarlig for å
            godkjenne kunnskapen før den deles.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Må godkjennes av konsulenten
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
        {redigerer ? (
          <div className="space-y-4">
            {REDIGERBARE.map(({ nokkel, etikett, felt }) => (
              <div key={nokkel} className="space-y-1.5">
                <Label
                  htmlFor={`felt-${nokkel}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {etikett}
                </Label>
                {felt === 'input' ? (
                  <Input
                    id={`felt-${nokkel}`}
                    value={String(forslag[nokkel] ?? '')}
                    onChange={(e) => onEndre({ [nokkel]: e.target.value })}
                  />
                ) : (
                  <Textarea
                    id={`felt-${nokkel}`}
                    value={String(forslag[nokkel] ?? '')}
                    onChange={(e) => onEndre({ [nokkel]: e.target.value })}
                    rows={2}
                    className="resize-none leading-relaxed"
                  />
                )}
              </div>
            ))}
            {forslag.tiltakPunkter && forslag.tiltakPunkter.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Punktene under «Tiltak» beholdes slik de er i denne demoen.
              </p>
            ) : null}
          </div>
        ) : (
          <StructuredExperience kort={{ ...forslag, id: 'forslag' }} animer />
        )}
      </div>

      <SourceDisclosure
        notat={notat}
        konsulent={konsulent}
        dato={dato}
        avklaringer={avklaringer}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onGodkjenn} className="h-10 px-5">
          <Check className="size-4" aria-hidden="true" />
          Godkjenn og legg til
        </Button>
        <Button variant="outline" onClick={() => setRedigerer((v) => !v)}>
          {redigerer ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Ferdig
            </>
          ) : (
            <>
              <Pencil className="size-4" aria-hidden="true" />
              Rediger
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={onTilbake} className="text-muted-foreground">
          Tilbake
        </Button>
      </div>
    </div>
  )
}
