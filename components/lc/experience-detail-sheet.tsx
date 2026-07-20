'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { StructuredExperience } from '@/components/lc/structured-experience'
import { SourceDisclosure } from '@/components/lc/source-disclosure'
import type { Erfaringskort } from '@/lib/data'

type ExperienceDetailSheetProps = {
  kort: Erfaringskort | null
  onÅpenEndring: (åpen: boolean) => void
}

export function ExperienceDetailSheet({ kort, onÅpenEndring }: ExperienceDetailSheetProps) {
  return (
    <Sheet open={kort !== null} onOpenChange={onÅpenEndring}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-base">Godkjent erfaring</SheetTitle>
        </SheetHeader>
        {kort ? (
          <div className="space-y-5 p-5">
            <StructuredExperience kort={kort} />
            {kort.originalNotat ? (
              <SourceDisclosure
                notat={kort.originalNotat}
                konsulent={kort.kilde.navn}
                dato={kort.kilde.dato}
                avklaringer={kort.avklaringer ?? []}
              />
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
