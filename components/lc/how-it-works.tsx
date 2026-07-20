'use client'

import { ShieldCheck, Sparkles, Link2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type HowItWorksProps = {
  åpen: boolean
  onÅpenEndring: (åpen: boolean) => void
}

const PUNKTER = [
  {
    ikon: Sparkles,
    tittel: 'KI foreslår – den bestemmer ikke',
    tekst: 'En språkmodell strukturerer det rå notatet til et utkast. Den fyller ikke inn fakta som ikke står der, og markerer forbehold.',
  },
  {
    ikon: ShieldCheck,
    tittel: 'Konsulenten godkjenner',
    tekst: 'Ingenting deles før mennesket har lest gjennom og godkjent. Du kan redigere forslaget fritt før det legges til.',
  },
  {
    ikon: Link2,
    tittel: 'Svar er alltid kildekoblet',
    tekst: 'Når andre spør, svarer systemet kun ut fra godkjent kunnskap – med henvisning til kilden. Mangler grunnlaget, sier det tydelig ifra.',
  },
]

export function HowItWorks({ åpen, onÅpenEndring }: HowItWorksProps) {
  return (
    <Dialog open={åpen} onOpenChange={onÅpenEndring}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Slik fungerer demoen</DialogTitle>
          <DialogDescription>
            En uavhengig konseptdemo som viser prinsippet bak «LC-hjernen». Alt innhold er
            fiktivt.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-4 pt-1">
          {PUNKTER.map(({ ikon: Ikon, tittel, tekst }) => (
            <li key={tittel} className="flex gap-3">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary"
                aria-hidden="true"
              >
                <Ikon className="size-4" />
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{tittel}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{tekst}</p>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
