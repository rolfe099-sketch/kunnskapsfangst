import { Suspense } from 'react'
import type { Metadata } from 'next'
import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFooter } from '@/components/lc/demo-footer'
import { KnowledgeLibrary } from '@/components/lc/knowledge-library'
import { KortlisteSkeleton } from '@/components/lc/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Kunnskapsbibliotek — Kunnskapsfangst',
  description:
    'Alle godkjente erfaringskort samlet ett sted, med søk, filter og kunnskapshull som foreslås i neste ukentlige debrief. Alt innhold er fiktivt.',
}

// Biblioteket leser fanevalget fra URL-en og må derfor stå bak en
// Suspense-grense. Den trenger en ekte fallback: uten den står siden tom
// til grensen løser seg, og det ser ut som en feil.
function BibliotekSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-8" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-full max-w-prose" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-8 w-72 rounded-lg" />
      <Skeleton className="h-9 w-full rounded-lg" />
      <KortlisteSkeleton />
    </div>
  )
}

export default function BibliotekPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <Suspense fallback={<BibliotekSkeleton />}>
          <KnowledgeLibrary />
        </Suspense>
      </main>
      <DemoFooter />
    </div>
  )
}
