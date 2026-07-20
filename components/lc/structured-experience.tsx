import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Erfaringskort } from '@/lib/data'
import { kildeLinje } from '@/lib/data'
import { cn } from '@/lib/utils'

type StructuredExperienceProps = {
  kort: Erfaringskort
  /** Animer seksjonene inn (brukes rett etter strukturering). */
  animer?: boolean
  /** Vis kildelinjen nederst. */
  visKilde?: boolean
}

const SEKSJONER: { nokkel: keyof Erfaringskort; etikett: string }[] = [
  { nokkel: 'situasjon', etikett: 'Situasjon' },
  { nokkel: 'problem', etikett: 'Problem' },
  { nokkel: 'tiltak', etikett: 'Tiltak' },
  { nokkel: 'observertEffekt', etikett: 'Observert effekt' },
  { nokkel: 'relevantNaar', etikett: 'Kan være relevant når' },
]

export function StructuredExperience({
  kort,
  animer = false,
  visKilde = true,
}: StructuredExperienceProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        {kort.prosjekttype ? (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {kort.prosjekttype}
          </span>
        ) : null}
        <h3 className="text-pretty text-lg font-semibold leading-snug text-foreground">
          {kort.tittel}
        </h3>
        {kort.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {kort.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      <dl className="space-y-5">
        {SEKSJONER.map((s, i) => {
          const verdi = kort[s.nokkel]
          if (!verdi || typeof verdi !== 'string') return null
          const erTiltak = s.nokkel === 'tiltak'
          return (
            <div
              key={s.nokkel}
              className={cn('space-y-1.5', animer && 'lc-reveal')}
              style={animer ? { animationDelay: `${60 + i * 60}ms` } : undefined}
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.etikett}
              </dt>
              <dd className="text-sm leading-relaxed text-foreground">{verdi}</dd>
              {erTiltak && kort.tiltakPunkter && kort.tiltakPunkter.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {kort.tiltakPunkter.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                        aria-hidden="true"
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </dl>

      {kort.forbehold ? (
        <div
          className={cn(
            'flex gap-3 rounded-lg border border-border bg-muted/50 p-4',
            animer && 'lc-reveal',
          )}
          style={animer ? { animationDelay: `${60 + SEKSJONER.length * 60}ms` } : undefined}
        >
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Forbehold
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{kort.forbehold}</p>
          </div>
        </div>
      ) : null}

      {visKilde ? (
        <footer className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Kilde:</span> {kildeLinje(kort.kilde)}
          </p>
        </footer>
      ) : null}
    </article>
  )
}
