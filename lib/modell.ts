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
