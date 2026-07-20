import { ShieldAlert } from 'lucide-react'

type InsufficientKnowledgeProps = {
  /** Tilleggstekst etter standardsetningen (hva slags kunnskap som mangler). */
  detalj?: string
}

/**
 * Vises når kunnskapsgrunnlaget ikke dekker spørsmålet.
 * Skal føles ansvarlig og til å stole på – ikke som en feilmelding.
 * Bruker dempet teglrød kun her.
 */
export function InsufficientKnowledge({ detalj }: InsufficientKnowledgeProps) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
          <ShieldAlert className="size-4" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">
            Kunnskapsgrunnlaget dekker ikke dette.
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {detalj?.trim()
              ? detalj
              : 'De godkjente erfaringene i demoen inneholder ikke kunnskap som gir et forsvarlig svar. Jeg kan derfor ikke gi et kildebasert svar.'}
          </p>
        </div>
      </div>
    </div>
  )
}
