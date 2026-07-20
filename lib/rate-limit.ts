// Enkel in-memory rate-limiting per IP. Nok for en offentlig demo-lenke;
// nullstilles ved kaldstart og deles ikke mellom instanser.
const WINDOW_MS = 60_000
const MAX_CALLS = 10

const buckets = new Map<string, number[]>()

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'ukjent'
}

/** Returnerer true hvis kallet er innenfor grensen, false hvis det skal blokkeres. */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const recent = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_CALLS) {
    buckets.set(ip, recent)
    return false
  }

  recent.push(now)
  buckets.set(ip, recent)
  return true
}
