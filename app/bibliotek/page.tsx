import { Suspense } from 'react'
import type { Metadata } from 'next'
import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFooter } from '@/components/lc/demo-footer'
import { KnowledgeLibrary } from '@/components/lc/knowledge-library'

export const metadata: Metadata = {
  title: 'Kunnskapsbibliotek — Kunnskapsfangst',
  description:
    'Alle godkjente erfaringskort samlet ett sted, med søk, filter og kunnskapshull som foreslås i neste ukentlige debrief. Alt innhold er fiktivt.',
}

export default function BibliotekPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <Suspense>
          <KnowledgeLibrary />
        </Suspense>
      </main>
      <DemoFooter />
    </div>
  )
}
