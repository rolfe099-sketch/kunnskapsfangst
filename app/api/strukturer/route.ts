import { generateText } from 'ai'
import { SYSTEMPROMPT_STRUKTUR, type KortUtenId } from '@/lib/data'
import { MODELL_ID } from '@/lib/modell'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 30

// Fjern eventuelle ```json ... ``` fences og finn det ytterste JSON-objektet.
function parseKort(raw: string): KortUtenId {
  let text = raw.trim()
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('Fant ingen JSON i svaret')
  }

  const parsed = JSON.parse(text.slice(start, end + 1))

  return {
    tittel: String(parsed.tittel ?? 'Uten tittel'),
    prosjekttype: String(parsed.prosjekttype ?? ''),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 4) : [],
    situasjon: String(parsed.situasjon ?? ''),
    problem: String(parsed.problem ?? ''),
    tiltak: String(parsed.tiltak ?? ''),
    observertEffekt: String(parsed.observertEffekt ?? ''),
    relevantNaar: String(parsed.relevantNaar ?? ''),
    forbehold: String(parsed.forbehold ?? ''),
    kilde: {
      navn: String(parsed?.kilde?.navn ?? 'Ukjent'),
      dato: String(parsed?.kilde?.dato ?? ''),
    },
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return Response.json(
      { feil: 'For mange forespørsler. Vent et minutt og prøv igjen.' },
      { status: 429 },
    )
  }

  let notat = ''
  try {
    const body = await req.json()
    notat = typeof body?.notat === 'string' ? body.notat.trim() : ''
  } catch {
    return Response.json({ feil: 'Ugyldig forespørsel.' }, { status: 400 })
  }

  if (!notat) {
    return Response.json({ feil: 'Notatet er tomt.' }, { status: 400 })
  }

  try {
    const { text } = await generateText({
      model: MODELL_ID,
      system: SYSTEMPROMPT_STRUKTUR,
      prompt: `Feltnotat:\n\n${notat}`,
      temperature: 0.2,
    })

    const kort = parseKort(text)
    return Response.json({ kort })
  } catch (err) {
    console.log('[v0] strukturer-feil:', err instanceof Error ? err.message : err)
    return Response.json(
      { feil: 'Klarte ikke å strukturere notatet akkurat nå. Prøv igjen.' },
      { status: 500 },
    )
  }
}
