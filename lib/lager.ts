import type { Erfaringskort } from '@/lib/data'

// ---------------------------------------------------------------------------
// Enkel klientside-persistens (localStorage). Godkjente erfaringskort og
// kunnskapshull overlever dermed økten i denne demoen. I en ekte løsning
// ville dette vært en database med tilgangsstyring — se README.
// ---------------------------------------------------------------------------

const KORT_NOKKEL = 'lc-godkjente-kort'
const HULL_NOKKEL = 'lc-kunnskapshull'

/** Et spørsmål kunnskapsgrunnlaget ikke kunne besvare. Blir foreslått som
 *  utdypingsspørsmål i neste ukentlige debrief. */
export type Kunnskapshull = {
  id: string
  sporsmal: string
  /** Modellens korte beskrivelse av hva slags erfaring som mangler. */
  detalj?: string
  dato: string // ISO-streng
}

function lesListe<T>(nokkel: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(nokkel)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function skrivListe<T>(nokkel: string, liste: T[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(nokkel, JSON.stringify(liste))
  } catch {
    // Full/blokkert lagring skal aldri knekke demoen.
  }
}

// ---- Godkjente erfaringskort ----------------------------------------------

export function hentGodkjenteKort(): Erfaringskort[] {
  return lesListe<Erfaringskort>(KORT_NOKKEL)
}

export function lagreGodkjentKort(kort: Erfaringskort) {
  const eksisterende = hentGodkjenteKort().filter((k) => k.id !== kort.id)
  skrivListe(KORT_NOKKEL, [kort, ...eksisterende])
}

// ---- Kunnskapshull ---------------------------------------------------------

export function hentKunnskapshull(): Kunnskapshull[] {
  return lesListe<Kunnskapshull>(HULL_NOKKEL)
}

export function leggTilKunnskapshull(sporsmal: string, detalj?: string): Kunnskapshull[] {
  const eksisterende = hentKunnskapshull()
  // Samme spørsmål logges bare én gang.
  if (eksisterende.some((h) => h.sporsmal.trim().toLowerCase() === sporsmal.trim().toLowerCase())) {
    return eksisterende
  }
  const nytt: Kunnskapshull = {
    id: `hull-${Date.now()}`,
    sporsmal: sporsmal.trim(),
    detalj: detalj?.trim() || undefined,
    dato: new Date().toISOString(),
  }
  const oppdatert = [nytt, ...eksisterende]
  skrivListe(HULL_NOKKEL, oppdatert)
  return oppdatert
}

export function fjernKunnskapshull(id: string): Kunnskapshull[] {
  const oppdatert = hentKunnskapshull().filter((h) => h.id !== id)
  skrivListe(HULL_NOKKEL, oppdatert)
  return oppdatert
}
