import Link from 'next/link'
import type { Metadata } from 'next'
import { Compass } from 'lucide-react'
import { DemoHeader } from '@/components/lc/demo-header'
import { DemoFooter } from '@/components/lc/demo-footer'

export const metadata: Metadata = {
  title: 'Fant ikke siden — Kunnskapsfangst',
}

const STEDER = [
  { href: '/', tittel: 'Demoen', tekst: 'Fang en erfaring og still et spørsmål.' },
  { href: '/uke', tittel: 'Denne uken', tekst: 'Status for innhentingen.' },
  { href: '/bibliotek', tittel: 'Biblioteket', tekst: 'Alle godkjente erfaringer.' },
  { href: '/om', tittel: 'Om løsningen', tekst: 'Arkitektur, modellvalg og avgrensninger.' },
]

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl space-y-6 px-5 py-14">
          <div className="space-y-2">
            <span
              className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary"
              aria-hidden="true"
            >
              <Compass className="size-5" />
            </span>
            <h1 className="text-xl font-semibold text-foreground">Fant ikke siden</h1>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              Adressen finnes ikke i denne demoen. Her er stedene som gjør det:
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {STEDER.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/15 hover:bg-muted/40"
                >
                  <p className="text-sm font-semibold text-foreground">{s.tittel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.tekst}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <DemoFooter />
    </div>
  )
}
