// ---------------------------------------------------------------------------
// Modellvalg for API-rutene (Vercel AI Gateway-format). Importeres kun fra
// server-ruter, aldri fra klientkomponenter.
//
// Settes med miljøvariabelen AI_MODELL, slik at modell kan byttes i Vercel
// uten kodeendring:
//
//   AI_MODELL=anthropic/claude-sonnet-4.5
//
// Standard er gpt-4.1-mini fordi den er verifisert tilgjengelig på AI
// Gateway sitt gratisnivå. Claude-modellene er verifisert utilgjengelige der
// («Free tier users do not have access to this model») og krever betalte
// AI Gateway-kreditter. Så snart kreditter er på plass er Claude ett
// miljøvariabel-bytte unna — se README.
// ---------------------------------------------------------------------------

export const MODELL_ID = process.env.AI_MODELL?.trim() || 'openai/gpt-4.1-mini'

// Embedding-modell for likhetssøket i /api/hent. Settes med EMBEDDING_MODELL.
// Anthropic tilbyr ikke embeddings, så denne står uavhengig av modellvalget
// over — et poeng i seg selv: riktig verktøy til hver oppgave.
export const EMBEDDING_MODELL =
  process.env.EMBEDDING_MODELL?.trim() || 'openai/text-embedding-3-small'

// Transkripsjonsmodell for lydinngang. Konsulenter i felt skriver ikke —
// de snakker. Settes med TRANSKRIPSJON_MODELL.
export const TRANSKRIPSJON_MODELL =
  process.env.TRANSKRIPSJON_MODELL?.trim() || 'openai/whisper-1'
