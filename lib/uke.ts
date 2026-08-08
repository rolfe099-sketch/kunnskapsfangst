import type { Erfaringskort } from '@/lib/data'

// ---------------------------------------------------------------------------
// Datohåndtering for ukesvisningen. Erfaringene bærer datoer skrevet på to
// måter: «8. mai 2026» (seed-kortene) og «20.07.2026» (skjemaet). Begge må
// kunne plasseres i en uke.
// ---------------------------------------------------------------------------

const MANEDER: Record<string, number> = {
  januar: 0,
  februar: 1,
  mars: 2,
  april: 3,
  mai: 4,
  juni: 5,
  juli: 6,
  august: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
}

const KORTE_MANEDER = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mai',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'des',
]

/** Tolk «8. mai 2026» eller «20.07.2026». Returnerer null hvis den ikke går. */
export function parseNorskDato(tekst: string): Date | null {
  const t = tekst.trim().toLowerCase()
  if (!t) return null

  // dd.mm.yyyy
  const numerisk = t.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/)
  if (numerisk) {
    const [, d, m, y] = numerisk
    const dato = new Date(Number(y), Number(m) - 1, Number(d))
    return Number.isNaN(dato.getTime()) ? null : dato
  }

  // «8. mai 2026»
  const skrevet = t.match(/^(\d{1,2})\.?\s+([a-zæøå]+)\s+(\d{4})$/)
  if (skrevet) {
    const [, d, manedsnavn, y] = skrevet
    const m = MANEDER[manedsnavn]
    if (m === undefined) return null
    const dato = new Date(Number(y), m, Number(d))
    return Number.isNaN(dato.getTime()) ? null : dato
  }

  return null
}

/** Mandagen i uken datoen ligger i, normalisert til midnatt. */
export function ukeStart(dato: Date): Date {
  const d = new Date(dato.getFullYear(), dato.getMonth(), dato.getDate())
  // getDay(): 0 = søndag. Vi vil ha mandag som ukestart.
  const forskyvning = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - forskyvning)
  return d
}

export function ukeNokkel(dato: Date): string {
  const start = ukeStart(dato)
  return `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`
}

/** Kort merkelapp under kolonnen, f.eks. «3. aug». */
export function ukeEtikett(ukestart: Date): string {
  return `${ukestart.getDate()}. ${KORTE_MANEDER[ukestart.getMonth()]}`
}

/**
 * Full periode til skjermleser og tooltip, f.eks. «3.–9. august».
 * Krysser uken et månedsskifte, tas begge månedene med: «29. juni–5. juli».
 */
export function ukePeriode(ukestart: Date): string {
  const slutt = new Date(ukestart)
  slutt.setDate(slutt.getDate() + 6)

  const navn = Object.keys(MANEDER)
  const sluttNavn = navn[slutt.getMonth()]

  if (ukestart.getMonth() !== slutt.getMonth()) {
    return `${ukestart.getDate()}. ${navn[ukestart.getMonth()]}–${slutt.getDate()}. ${sluttNavn}`
  }
  return `${ukestart.getDate()}.–${slutt.getDate()}. ${sluttNavn}`
}

/**
 * Når kortet kom inn i basen. Godkjente kort får et eget registreringstidspunkt;
 * seed-kortene bruker datoen i kilden.
 */
export function registrertDato(kort: Erfaringskort): Date | null {
  if (kort.registrert) {
    const d = new Date(kort.registrert)
    if (!Number.isNaN(d.getTime())) return d
  }
  return parseNorskDato(kort.kilde.dato)
}

export type Ukepunkt = {
  nokkel: string
  start: Date
  antall: number
}

/** Antall nye erfaringer per uke for de siste `antallUker` ukene, eldst først. */
export function ukesvekst(kort: Erfaringskort[], antallUker = 10): Ukepunkt[] {
  const telling = new Map<string, number>()
  for (const k of kort) {
    const d = registrertDato(k)
    if (!d) continue
    const nokkel = ukeNokkel(d)
    telling.set(nokkel, (telling.get(nokkel) ?? 0) + 1)
  }

  const punkter: Ukepunkt[] = []
  const denneUken = ukeStart(new Date())
  for (let i = antallUker - 1; i >= 0; i--) {
    const start = new Date(denneUken)
    start.setDate(start.getDate() - i * 7)
    punkter.push({
      nokkel: ukeNokkel(start),
      start,
      antall: telling.get(ukeNokkel(start)) ?? 0,
    })
  }
  return punkter
}

export type Bidragsyter = {
  navn: string
  antall: number
}

export function bidragsytere(kort: Erfaringskort[]): Bidragsyter[] {
  const telling = new Map<string, number>()
  for (const k of kort) {
    const navn = k.kilde.navn?.trim()
    if (!navn || navn.toLowerCase() === 'ukjent') continue
    telling.set(navn, (telling.get(navn) ?? 0) + 1)
  }
  return [...telling.entries()]
    .map(([navn, antall]) => ({ navn, antall }))
    .sort((a, b) => b.antall - a.antall || a.navn.localeCompare(b.navn, 'nb'))
}

/** Antall kort registrert i inneværende uke. */
export function nyeDenneUken(kort: Erfaringskort[]): number {
  const denne = ukeNokkel(new Date())
  return kort.filter((k) => {
    const d = registrertDato(k)
    return d ? ukeNokkel(d) === denne : false
  }).length
}
