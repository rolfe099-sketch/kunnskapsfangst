import type { Metadata } from 'next'
import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFooter } from '@/components/lc/demo-footer'
import { AboutSolution } from '@/components/lc/about-solution'

export const metadata: Metadata = {
  title: 'Om løsningen — Kunnskapsfangst',
  description:
    'Arkitektur, modellvalg, sikkerhet og bevisste avgrensninger bak konseptdemoen for LC-hjernen. Alt innhold er fiktivt.',
}

// Siden leser aktive modellnavn fra miljøet, så den må rendres per forespørsel
// i stedet for å fryses ved bygg.
export const dynamic = 'force-dynamic'

export default function OmPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <AboutSolution />
      </main>
      <DemoFooter />
    </div>
  )
}
