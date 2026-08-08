'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type VoiceCaptureProps = {
  /** Kalles med transkribert tekst når opptaket er ferdig behandlet. */
  onTekst: (tekst: string) => void
}

type Tilstand = 'klar' | 'tar-opp' | 'behandler'

function formaterTid(sekunder: number): string {
  const m = Math.floor(sekunder / 60)
  const s = sekunder % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VoiceCapture({ onTekst }: VoiceCaptureProps) {
  const [tilstand, setTilstand] = useState<Tilstand>('klar')
  const [feil, setFeil] = useState<string | null>(null)
  const [sekunder, setSekunder] = useState(0)
  const [stottes, setStottes] = useState(true)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const biterRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setStottes(
      typeof window !== 'undefined' &&
        typeof window.MediaRecorder !== 'undefined' &&
        Boolean(navigator.mediaDevices?.getUserMedia),
    )
  }, [])

  const stoppTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Rydd opp hvis komponenten forsvinner mens opptaket går.
  useEffect(() => {
    return () => {
      stoppTimer()
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop())
    }
  }, [stoppTimer])

  async function startOpptak() {
    setFeil(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      biterRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) biterRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        await sendTilTranskripsjon(new Blob(biterRef.current, { type: recorder.mimeType }))
      }

      recorder.start()
      recorderRef.current = recorder
      setTilstand('tar-opp')
      setSekunder(0)
      timerRef.current = setInterval(() => setSekunder((s) => s + 1), 1000)
    } catch {
      setFeil('Fikk ikke tilgang til mikrofonen. Sjekk tillatelsene i nettleseren.')
    }
  }

  function stoppOpptak() {
    stoppTimer()
    setTilstand('behandler')
    recorderRef.current?.stop()
  }

  async function sendTilTranskripsjon(lyd: Blob) {
    if (lyd.size === 0) {
      setFeil('Opptaket ble tomt. Prøv igjen.')
      setTilstand('klar')
      return
    }
    try {
      const form = new FormData()
      // Filnavn med endelse hjelper tjenesten å tolke formatet.
      form.append('lyd', lyd, 'opptak.webm')

      const res = await fetch('/api/transkriber', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.feil ?? 'ukjent feil')

      onTekst(String(data.tekst))
      setTilstand('klar')
    } catch (err) {
      setFeil(
        err instanceof Error && err.message !== 'ukjent feil'
          ? err.message
          : 'Klarte ikke å transkribere opptaket. Prøv igjen, eller skriv i stedet.',
      )
      setTilstand('klar')
    }
  }

  if (!stottes) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        {tilstand === 'tar-opp' ? (
          <Button type="button" variant="outline" size="sm" onClick={stoppOpptak}>
            <Square className="size-3.5 fill-current" aria-hidden="true" />
            Stopp opptak
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startOpptak}
            disabled={tilstand === 'behandler'}
          >
            {tilstand === 'behandler' ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Mic className="size-3.5" aria-hidden="true" />
            )}
            {tilstand === 'behandler' ? 'Transkriberer…' : 'Snakk inn erfaringen'}
          </Button>
        )}

        {tilstand === 'tar-opp' ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="size-2 animate-pulse rounded-full bg-destructive"
              aria-hidden="true"
            />
            <span className="font-mono tabular-nums">{formaterTid(sekunder)}</span>
            Tar opp…
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            Konsulenter i felt skriver ikke — de snakker.
          </span>
        )}
      </div>

      {feil ? (
        <p
          className={cn(
            'rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm',
            'leading-relaxed text-foreground',
          )}
        >
          {feil}
        </p>
      ) : null}
    </div>
  )
}
