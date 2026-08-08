import { generateText } from 'ai'

export const maxDuration = 60

// MIDLERTIDIG diagnoserute. Tester én modell av gangen (?i=0..3) slik at
// rate-limiting ikke forveksles med manglende tilgang. Slettes etterpå.
const KANDIDATER = [
  'anthropic/claude-haiku-4.5',
  'anthropic/claude-sonnet-4.5',
  'openai/gpt-4.1-mini',
  'openai/gpt-4o-mini',
]

export async function GET(req: Request) {
  const i = Number(new URL(req.url).searchParams.get('i') ?? 0)
  const modell = KANDIDATER[Number.isFinite(i) ? i : 0] ?? KANDIDATER[0]

  try {
    const { text, usage } = await generateText({
      model: modell,
      prompt: 'Svar med kun ordet: ok',
      temperature: 0,
      maxRetries: 0,
    })
    return Response.json({ modell, ok: true, svar: text.trim().slice(0, 20), usage })
  } catch (err) {
    return Response.json({
      modell,
      ok: false,
      feil: (err instanceof Error ? err.message : String(err)).slice(0, 200),
    })
  }
}
