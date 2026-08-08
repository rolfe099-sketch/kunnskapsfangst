import { streamText } from 'ai'
import { SYSTEMPROMPT_SVAR, type Erfaringskort } from '@/lib/data'
import { MODELL_ID } from '@/lib/modell'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 30

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return new Response('For mange forespørsler. Vent et minutt og prøv igjen.', {
      status: 429,
    })
  }

  let sporsmal = ''
  let kort: Erfaringskort[] = []
  try {
    const body = await req.json()
    sporsmal = typeof body?.sporsmal === 'string' ? body.sporsmal.trim() : ''
    kort = Array.isArray(body?.kort) ? body.kort : []
  } catch {
    return new Response('Ugyldig forespørsel.', { status: 400 })
  }

  if (!sporsmal) {
    return new Response('Spørsmålet er tomt.', { status: 400 })
  }

  // Nummerer kortene Kort 1..N og send dem som JSON-kontekst.
  const kontekst = kort.map((k, i) => ({
    referanse: `Kort ${i + 1}`,
    tittel: k.tittel,
    prosjekttype: k.prosjekttype,
    tags: k.tags,
    situasjon: k.situasjon,
    problem: k.problem,
    tiltak: [k.tiltak, ...(k.tiltakPunkter ?? [])].filter(Boolean).join(' '),
    observertEffekt: k.observertEffekt,
    relevantNaar: k.relevantNaar,
    forbehold: k.forbehold,
    kilde: k.kilde,
  }))

  try {
    const result = streamText({
      model: MODELL_ID,
      system: SYSTEMPROMPT_SVAR,
      prompt: `Erfaringskort (JSON-kontekst):\n${JSON.stringify(kontekst, null, 2)}\n\nSpørsmål: ${sporsmal}`,
      temperature: 0.3,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.log('[v0] sporsmal-feil:', err instanceof Error ? err.message : err)
    return new Response('Klarte ikke å svare akkurat nå. Prøv igjen.', { status: 500 })
  }
}
