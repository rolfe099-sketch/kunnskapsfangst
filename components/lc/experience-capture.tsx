'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export type CaptureFelter = {
  konsulent: string
  dato: string
  prosjekttype: string
  notat: string
}

type ExperienceCaptureProps = {
  verdier: CaptureFelter
  onEndre: (felter: Partial<CaptureFelter>) => void
  onBrukEksempel: () => void
  onNeste: () => void
}

export function ExperienceCapture({
  verdier,
  onEndre,
  onBrukEksempel,
  onNeste,
}: ExperienceCaptureProps) {
  const kanFortsette = verdier.notat.trim().length > 0

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">Hva lærte du denne uken?</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Skriv det slik du ville forklart det til en kollega. Det trenger ikke være ferdig
          strukturert.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="konsulent" className="text-xs font-medium text-muted-foreground">
            Konsulent
          </Label>
          <Input
            id="konsulent"
            value={verdier.konsulent}
            onChange={(e) => onEndre({ konsulent: e.target.value })}
            placeholder="Navn"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dato" className="text-xs font-medium text-muted-foreground">
            Dato
          </Label>
          <Input
            id="dato"
            value={verdier.dato}
            onChange={(e) => onEndre({ dato: e.target.value })}
            placeholder="DD.MM.ÅÅÅÅ"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prosjekttype" className="text-xs font-medium text-muted-foreground">
            Prosjekttype <span className="font-normal">(valgfritt)</span>
          </Label>
          <Input
            id="prosjekttype"
            value={verdier.prosjekttype}
            onChange={(e) => onEndre({ prosjekttype: e.target.value })}
            placeholder="F.eks. boligprosjekt"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="notat" className="text-xs font-medium text-muted-foreground">
            Erfaring / notat
          </Label>
          <button
            type="button"
            onClick={onBrukEksempel}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Bruk eksempel
          </button>
        </div>
        <Textarea
          id="notat"
          value={verdier.notat}
          onChange={(e) => onEndre({ notat: e.target.value })}
          rows={5}
          placeholder="Skriv fritt om noe som fungerte, gikk galt, eller som du løste på en ny måte…"
          className="resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onNeste} disabled={!kanFortsette} className="h-10 px-5">
          Se hva som bør utdypes
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
