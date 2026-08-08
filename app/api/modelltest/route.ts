import { generateText } from 'ai'

export const maxDuration = 60

// MIDLERTIDIG diagnoserute. Finner ut hvilke modeller AI Gateway-kontoen
// faktisk har tilgang til. Slettes så snart modellvalget er avklart.
// Kjøres sekvensielt med pause, slik at rate-limiting ikke forveksles med
// manglende tilgang.
const KANDIDATER = [
  'anthropic/claude-haiku-4.5',
  'anthropic/claude-sonnet-4.5',
  'anthropic/claude-sonnet-4',
  'openai/gpt-4.1-mini',
]

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function GET() {
  const resultater: unknown[] = []

  for (const modell of KANDIDATER) {
    try {
      const { text } = await generateText({
        model: modell,
        prompt: 'Svar med kun ordet: ok',
        temperature: 0,
        maxRetries: 0,
      })
      resultater.push({ modell, ok: true, svar: text.trim().slice(0, 20) })
    } catch (err) {
      resultater.push({
        modell,
        ok: false,
        feil: (err instanceof Error ? err.message : String(err)).slice(0, 120),
      })
    }
    await pause(3000)
  }

  return Response.json({ resultater })
}
