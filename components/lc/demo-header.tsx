import { Brain } from 'lucide-react'

export function DemoHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-7 items-center justify-center rounded-md bg-primary/12 text-primary"
            aria-hidden="true"
          >
            <Brain className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Kunnskapsfangst</p>
            <p className="text-xs text-muted-foreground">
              Uavhengig konseptdemo for LC-hjernen
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          Kun fiktive demodata
        </span>
      </div>
    </header>
  )
}
