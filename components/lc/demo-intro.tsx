'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DemoIntroProps = {
  onStart: () => void
  onForklaring: () => void
}

export function DemoIntro({ onStart, onForklaring }: DemoIntroProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-pretty text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
        Gjør ukens erfaring tilgjengelig i neste prosjekt
      </h1>
      <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        En enkel demonstrasjon av hvordan praktisk prosjektkunnskap kan hentes ut, godkjennes av
        konsulenten og brukes videre av andre.
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <Button onClick={onStart} className="h-10 px-5">
          Start eksempel
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <button
          type="button"
          onClick={onForklaring}
          className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Se hvordan demoen fungerer
        </button>
      </div>
    </section>
  )
}
