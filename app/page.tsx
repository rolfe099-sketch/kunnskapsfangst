import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFlow } from '@/components/lc/demo-flow'
import { DemoFooter } from '@/components/lc/demo-footer'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <DemoFlow />
      </main>
      <DemoFooter />
    </div>
  )
}
