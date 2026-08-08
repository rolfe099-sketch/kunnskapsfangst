import { experimental_transcribe as transcribe } from 'ai'
import { TRANSKRIPSJON_MODELL } from '@/lib/modell'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 60

// Lydopptak fra nettleseren er små, men vi setter et tak uansett.
const MAKS_BYTES = 12 * 1024 * 1024

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return Response.json(
      { feil: 'For mange forespørsler. Vent et minutt og prøv igjen.' },
      { status: 429 },
    )
  }

  let lyd: ArrayBuffer
  try {
    const form = await req.formData()
    const fil = form.get('lyd')
    if (!(fil instanceof Blob)) {
      return Response.json({ feil: 'Fant ingen lyd i forespørselen.' }, { status: 400 })
    }
    if (fil.size === 0) {
      return Response.json({ feil: 'Lydopptaket er tomt.' }, { status: 400 })
    }
    if (fil.size > MAKS_BYTES) {
      return Response.json({ feil: 'Lydopptaket er for stort.' }, { status: 413 })
    }
    lyd = await fil.arrayBuffer()
  } catch {
    return Response.json({ feil: 'Ugyldig forespørsel.' }, { status: 400 })
  }

  try {
    const { text } = await transcribe({
      model: TRANSKRIPSJON_MODELL,
      audio: new Uint8Array(lyd),
      providerOptions: { openai: { language: 'no' } },
    })

    const tekst = text.trim()
    if (!tekst) {
      return Response.json(
        { feil: 'Fikk ingen tekst ut av opptaket. Prøv å snakke litt lenger.' },
        { status: 422 },
      )
    }

    return Response.json({ tekst })
  } catch (err) {
    console.log('[lc] transkriber-feil:', err instanceof Error ? err.message : err)
    return Response.json(
      { feil: 'Klarte ikke å transkribere opptaket akkurat nå.' },
      { status: 500 },
    )
  }
}
