import { embed, embedMany } from 'ai'
import type { Erfaringskort } from '@/lib/data'
import { EMBEDDING_MODELL } from '@/lib/modell'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 30

// Hvor mange kort som sendes videre som kontekst til svarmodellen.
const TOPP_N = 4
// Under denne likheten regnes kortet som irrelevant og tas ikke med.
const MIN_LIKHET = 0.25

// Enkel cache per serverinstans. Kortene endrer seg sjelden, og å embedde
// dem på nytt for hvert spørsmål er sløsing.
const embeddingCache = new Map<string, number[]>()

function kortSomTekst(k: Erfaringskort): string {
  return [
    k.tittel,
    k.prosjekttype,
    k.tags.join(' '),
    k.situasjon,
    k.problem,
    [k.tiltak, ...(k.tiltakPunkter ?? [])].filter(Boolean).join(' '),
    k.observertEffekt,
    k.relevantNaar,
  ]
    .filter(Boolean)
    .join('\n')
}

function cosinus(a: number[], b: number[]): number {
  let prikk = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    prikk += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const nevner = Math.sqrt(normA) * Math.sqrt(normB)
  return nevner === 0 ? 0 : prikk / nevner
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return Response.json(
      { feil: 'For mange forespørsler. Vent et minutt og prøv igjen.' },
      { status: 429 },
    )
  }

  let sporsmal = ''
  let kort: Erfaringskort[] = []
  try {
    const body = await req.json()
    sporsmal = typeof body?.sporsmal === 'string' ? body.sporsmal.trim() : ''
    kort = Array.isArray(body?.kort) ? body.kort : []
  } catch {
    return Response.json({ feil: 'Ugyldig forespørsel.' }, { status: 400 })
  }

  if (!sporsmal) return Response.json({ feil: 'Spørsmålet er tomt.' }, { status: 400 })
  if (kort.length === 0) return Response.json({ treff: [] })

  try {
    // Embed bare kortene vi ikke har fra før.
    const mangler = kort.filter((k) => !embeddingCache.has(k.id))
    if (mangler.length > 0) {
      const { embeddings } = await embedMany({
        model: EMBEDDING_MODELL,
        values: mangler.map(kortSomTekst),
      })
      mangler.forEach((k, i) => embeddingCache.set(k.id, embeddings[i]))
    }

    const { embedding: sporsmalVektor } = await embed({
      model: EMBEDDING_MODELL,
      value: sporsmal,
    })

    const rangert = kort
      .map((k) => ({
        id: k.id,
        tittel: k.tittel,
        skår: cosinus(sporsmalVektor, embeddingCache.get(k.id) ?? []),
      }))
      .sort((a, b) => b.skår - a.skår)

    const valgte = rangert.filter((r) => r.skår >= MIN_LIKHET).slice(0, TOPP_N)

    return Response.json({
      treff: valgte,
      // Beste kort som ble vurdert men forkastet – nyttig for å vise at
      // terskelen faktisk gjør noe.
      forkastet: rangert.filter((r) => !valgte.some((v) => v.id === r.id)).slice(0, 3),
      totalt: kort.length,
    })
  } catch (err) {
    console.log('[lc] hent-feil:', err instanceof Error ? err.message : err)
    return Response.json({ feil: 'Klarte ikke å søke i kunnskapsgrunnlaget.' }, { status: 500 })
  }
}
