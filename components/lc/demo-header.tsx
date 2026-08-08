import Link from 'next/link'
import { Brain } from 'lucide-react'

const LENKER = [
  { href: '/', tekst: 'Demo' },
  { href: '/uke', tekst: 'Denne uken', kort: 'Uken' },
  { href: '/bibliotek', tekst: 'Bibliotek' },
  { href: '/om', tekst: 'Om' },
]

export function DemoHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary"
            aria-hidden="true"
          >
            <Brain className="size-4" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">Kunnskapsfangst</p>
            <p className="truncate text-xs text-muted-foreground">
              Uavhengig konseptdemo for LC-hjernen
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav
            className="flex items-center gap-3 text-sm sm:gap-3.5"
            aria-label="Hovednavigasjon"
          >
            {LENKER.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
              >
                {/* Lang tittel når det er plass, kort på smal skjerm. */}
                {l.kort ? (
                  <>
                    <span className="hidden sm:inline">{l.tekst}</span>
                    <span className="sm:hidden">{l.kort}</span>
                  </>
                ) : (
                  l.tekst
                )}
              </Link>
            ))}
          </nav>
          <span className="hidden rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground lg:inline-block">
            Kun fiktive demodata
          </span>
        </div>
      </div>
    </header>
  )
}
