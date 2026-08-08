import { generateText } from 'ai'
import { SYSTEMPROMPT_AVKLARINGER } from '@/lib/data'
import { MODELL_ID } from '@/lib/modell'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 30

// Fjern eventuelle ```json ... ``` fences og finn den ytterste JSON-listen.
function parseSporsmal(raw: string): string[] {
  let text = raw.trim()
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()

  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1) {
    throw new Error('Fant ingen JSON-liste i svaret')
  }

  const parsed = JSON.parse(text.slice(start, end + 1))
  if (!Array.isArray(parsed)) throw new Error('Svaret var ikke en liste')

  const sporsmal = parsed
    .map((s) => String(s).trim())
    .filter((s) => s.length > 0)
    .slice(0, 3)

  if (sporsmal.length < 2) throw new Error('For få spørsmål i svaret')
  return sporsmal
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
      system: SYSTEMPROMPT_AVKLARINGER,
      prompt: `Feltnotat:\n\n${notat}`,
      temperature: 0.4,
    })

    return Response.json({ sporsmal: parseSporsmal(text) })
  } catch (err) {
    console.log('[v0] avklaringer-feil:', err instanceof Error ? err.message : err)
    return Response.json(
      { feil: 'Klarte ikke å generere utdypingsspørsmål akkurat nå.' },
      { status: 500 },
    )
  }
}
