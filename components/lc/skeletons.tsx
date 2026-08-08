import { Skeleton } from '@/components/ui/skeleton'

// ---------------------------------------------------------------------------
// Delte skjeletter. Bibliotek og ukesvisning leser fra nettleserlagringen etter
// mount, og uten disse hopper innholdet — først seed-kortene, så de godkjente.
// Formene her har omtrent samme høyde som det ekte innholdet, slik at siden
// ikke rykker når det kommer.
// ---------------------------------------------------------------------------

/**
 * Liten teller-plassholder i en fane-etikett.
 * Må være et <span>: den står inne i en <button>, og en <div> der er ugyldig
 * HTML. Nettleseren flytter den da ut av knappen, hydreringen feiler, og React
 * river hele treet – uten at serverrenderingen viser noe galt.
 */
export function TellerSkeleton() {
  return (
    <span
      className="inline-block h-3.5 w-6 animate-pulse rounded bg-muted align-middle"
      aria-hidden="true"
    />
  )
}

export function KortlisteSkeleton({ antall = 4 }: { antall?: number }) {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {Array.from({ length: antall }).map((_, i) => (
        <li key={i} className="rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2.5 h-3.5 w-full" />
          <Skeleton className="mt-1.5 h-3.5 w-4/5" />
          <div className="mt-3 flex gap-1.5">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function StatRadSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="mt-2 h-8 w-12" />
          <Skeleton className="mt-2 h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

export function DiagramSkeleton() {
  // Faste høyder, ikke tilfeldige – ellers endrer skjelettet seg ved hver render.
  const høyder = [40, 70, 55, 85, 45, 60, 50, 75, 65, 30]
  return (
    <div className="rounded-xl border border-border bg-card p-5" aria-hidden="true">
      <Skeleton className="mb-3 h-4 w-48" />
      <div className="flex items-end gap-2" style={{ height: 132 }}>
        {høyder.map((h, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <Skeleton className="w-full max-w-6 rounded-t" style={{ height: h }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {høyder.map((_, i) => (
          <div key={i} className="flex flex-1 justify-center">
            {i % 2 === 0 ? <Skeleton className="h-2.5 w-8" /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListeSkeleton({ antall = 5 }: { antall?: number }) {
  return (
    <div
      className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden="true"
    >
      {Array.from({ length: antall }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
          <Skeleton className="h-3.5 w-32 shrink-0" />
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-3.5 w-4 shrink-0" />
        </div>
      ))}
    </div>
  )
}
