import { generateText } from 'ai'

export const maxDuration = 60

// MIDLERTIDIG diagnoserute. Finner ut hvilke modeller AI Gateway-kontoen
// faktisk har tilgang til. Slettes så snart modellvalget er avklart.
const KANDIDATER = [
  'anthropic/claude-haiku-4.5',
  'anthropic/claude-3-haiku',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-sonnet-4.5',
  'anthropic/claude-opus-5',
  'openai/gpt-4.1-mini',
]

export async function GET() {
  const resultater = await Promise.all(
    KANDIDATER.map(async (modell) => {
      try {
        const { text } = await generateText({
          model: modell,
          prompt: 'Svar med kun ordet: ok',
          temperature: 0,
        })
        return { modell, ok: true, svar: text.trim().slice(0, 20) }
      } catch (err) {
        return {
          modell,
          ok: false,
          feil: (err instanceof Error ? err.message : String(err)).slice(0, 160),
        }
      }
    }),
  )

  return Response.json({ resultater })
}
