import type { Metadata } from 'next'
import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFooter } from '@/components/lc/demo-footer'
import { WeeklyDashboard } from '@/components/lc/weekly-dashboard'

export const metadata: Metadata = {
  title: 'Denne uken — Kunnskapsfangst',
  description:
    'Ukentlig status for LC-hjernen: nye erfaringer, hvem som har bidratt, og hvilke kunnskapshull som er bestillingen til neste debrief. Alt innhold er fiktivt.',
}

export default function UkePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <WeeklyDashboard />
      </main>
      <DemoFooter />
    </div>
  )
}
