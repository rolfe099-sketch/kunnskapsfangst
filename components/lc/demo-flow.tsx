'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lightbulb, RotateCcw, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoIntro } from '@/components/lc/demo-intro'
import { DemoProgress } from '@/components/lc/demo-progress'
import { StageShell, type StageStatus } from '@/components/lc/stage-shell'
import { ExperienceCapture, type CaptureFelter } from '@/components/lc/experience-capture'
import { ClarificationQuestions } from '@/components/lc/clarification-questions'
import { ProcessingState, STRUKTUR_STEG } from '@/components/lc/processing-state'
import { ApprovalState } from '@/components/lc/approval-state'
import { KnowledgeQuestion } from '@/components/lc/knowledge-question'
import { GroundedAnswer } from '@/components/lc/grounded-answer'
import { InsufficientKnowledge } from '@/components/lc/insufficient-knowledge'
import { HowItWorks } from '@/components/lc/how-it-works'
import { ExperienceDetailSheet } from '@/components/lc/experience-detail-sheet'
import {
  DEMO_AVKLARINGER,
  DEMO_DATO,
  DEMO_KONSULENT,
  DEMO_NOTAT,
  DEMO_PROSJEKTTYPE,
  DEMO_SPORSMAL_STOTTET,
  DEMO_SPORSMAL_UDEKKET,
  FALLBACK_FORSLAG,
  FALLBACK_SVAR_GENERISK,
  FALLBACK_SVAR_STOTTET,
  FALLBACK_SVAR_UDEKKET,
  GENERISKE_AVKLARINGER,
  INGEN_DEKNING_PREFIX,
  type Avklaring,
  type AvklaringSpm,
  type Erfaringskort,
  type KortUtenId,
} from '@/lib/data'
import { SEED_KORT } from '@/lib/seed-kort'
import { lagreGodkjentKort, leggTilKunnskapshull } from '@/lib/lager'
import { DataMasking } from '@/components/lc/data-masking'
import { finnFunn, maskerTekst, type Funn } from '@/lib/maskering'

type Steg1 = 'notat' | 'maskering' | 'avklaring'
type AvklaringKilde = 'eksempel' | 'generert' | 'standard'

const TOM_CAPTURE: CaptureFelter = { konsulent: '', dato: '', prosjekttype: '', notat: '' }

const EKSEMPEL_AVKLARINGER: AvklaringSpm[] = DEMO_AVKLARINGER.map((a) => ({
  sporsmal: a.sporsmal,
  eksempelSvar: a.svar,
}))

function korte(tekst: string, maks = 60) {
  const t = tekst.trim()
  return t.length > maks ? `${t.slice(0, maks)}…` : t
}

export function DemoFlow() {
  const [visIntro, setVisIntro] = useState(true)
  const [visForklaring, setVisForklaring] = useState(false)

  const [stadium, setStadium] = useState<1 | 2 | 3>(1)
  const [steg1, setSteg1] = useState<Steg1>('notat')

  const [capture, setCapture] = useState<CaptureFelter>(TOM_CAPTURE)

  // Maskering: funn foreslås lokalt og godkjennes før noe sendes til modellen.
  const [funn, setFunn] = useState<Funn[]>([])

  const [avklaringer, setAvklaringer] = useState<AvklaringSpm[]>(EKSEMPEL_AVKLARINGER)
  const [avklaringKilde, setAvklaringKilde] = useState<AvklaringKilde>('eksempel')
  const [lagerSporsmal, setLagerSporsmal] = useState(false)
  const [avklaringSvar, setAvklaringSvar] = useState<string[]>(
    EKSEMPEL_AVKLARINGER.map(() => ''),
  )

  const [strukturerer, setStrukturerer] = useState(false)
  const [strukturSteg, setStrukturSteg] = useState(0)
  const [forslag, setForslag] = useState<KortUtenId | null>(null)

  const [godkjentKort, setGodkjentKort] = useState<Erfaringskort | null>(null)
  const [kunnskapsbase, setKunnskapsbase] = useState<Erfaringskort[]>([])

  const [aktivtSpørsmål, setAktivtSpørsmål] = useState<string | null>(null)
  const [svar, setSvar] = useState('')
  const [svarPågår, setSvarPågår] = useState(false)
  const [svarFerdig, setSvarFerdig] = useState(false)

  // Ærlighetsregel: demoen later aldri som et reservesvar er et ekte modellsvar.
  const [strukturFeil, setStrukturFeil] = useState(false)
  const [forslagErReserve, setForslagErReserve] = useState(false)
  const [svarFeil, setSvarFeil] = useState(false)
  const [svarErReserve, setSvarErReserve] = useState(false)

  const [detaljKort, setDetaljKort] = useState<Erfaringskort | null>(null)
  const flytRef = useRef<HTMLDivElement>(null)

  // ---- Handlinger -------------------------------------------------------

  const startEksempel = useCallback(() => {
    setCapture({
      konsulent: DEMO_KONSULENT,
      dato: DEMO_DATO,
      prosjekttype: DEMO_PROSJEKTTYPE,
      notat: DEMO_NOTAT,
    })
    setFunn([])
    setAvklaringer(EKSEMPEL_AVKLARINGER)
    setAvklaringKilde('eksempel')
    setAvklaringSvar(EKSEMPEL_AVKLARINGER.map(() => ''))
    setVisIntro(false)
    setStadium(1)
    setSteg1('notat')
  }, [])

  function endreCapture(felter: Partial<CaptureFelter>) {
    setCapture((prev) => ({ ...prev, ...felter }))
  }

  // Det maskerte notatet er det eneste som forlater nettleseren — og det er
  // også versjonen som lagres i kunnskapsbasen.
  function maskertNotat(): string {
    return maskerTekst(capture.notat.trim(), funn)
  }

  function tilMaskering() {
    setFunn(finnFunn(capture.notat.trim()))
    setSteg1('maskering')
  }

  function vekslefunn(id: string) {
    setFunn((prev) => prev.map((f) => (f.id === id ? { ...f, aktiv: !f.aktiv } : f)))
  }

  function endreAvklaring(indeks: number, verdi: string) {
    setAvklaringSvar((prev) => prev.map((s, i) => (i === indeks ? verdi : s)))
  }

  function brukAvklaringEksempel(indeks: number) {
    setAvklaringSvar((prev) =>
      prev.map((s, i) => (i === indeks ? avklaringer[indeks]?.eksempelSvar ?? s : s)),
    )
  }

  // Steg 1b: finn ut hva som bør utdypes. For det uendrede eksempelnotatet
  // brukes de forhåndsskrevne spørsmålene; for egne notater genererer
  // modellen spørsmålene — med ærlig merket standard-fallback ved feil.
  async function gaTilAvklaring() {
    setSteg1('avklaring')

    if (capture.notat.trim() === DEMO_NOTAT) {
      setAvklaringer(EKSEMPEL_AVKLARINGER)
      setAvklaringKilde('eksempel')
      setAvklaringSvar(EKSEMPEL_AVKLARINGER.map(() => ''))
      return
    }

    setLagerSporsmal(true)
    try {
      const res = await fetch('/api/avklaringer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notat: maskertNotat() }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      const sporsmal: string[] = Array.isArray(data.sporsmal) ? data.sporsmal : []
      if (sporsmal.length < 2) throw new Error('for få spørsmål')
      const nye = sporsmal.map((s) => ({ sporsmal: s }))
      setAvklaringer(nye)
      setAvklaringKilde('generert')
      setAvklaringSvar(nye.map(() => ''))
    } catch {
      setAvklaringer(GENERISKE_AVKLARINGER)
      setAvklaringKilde('standard')
      setAvklaringSvar(GENERISKE_AVKLARINGER.map(() => ''))
    } finally {
      setLagerSporsmal(false)
    }
  }

  function gjeldendeAvklaringer(): Avklaring[] {
    return avklaringer
      .map((a, i) => ({
        sporsmal: a.sporsmal,
        svar: avklaringSvar[i]?.trim() || a.eksempelSvar || '',
      }))
      .filter((a) => a.svar.length > 0)
  }

  async function lagForslag() {
    setStadium(2)
    setStrukturerer(true)
    setStrukturSteg(0)
    setStrukturFeil(false)
    setForslagErReserve(false)

    // Animer stegene mens vi venter på svaret.
    const stegTimer = setInterval(() => {
      setStrukturSteg((s) => Math.min(s + 1, STRUKTUR_STEG.length - 1))
    }, 700)
    const minTid = new Promise((r) => setTimeout(r, 1500))

    const brukteAvklaringer = gjeldendeAvklaringer()

    const samletNotat = [
      maskertNotat(),
      ...brukteAvklaringer.map((a) => `${a.sporsmal} ${a.svar}`),
    ].join('\n\n')

    let resultat: KortUtenId
    try {
      const res = await fetch('/api/strukturer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notat: samletNotat }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      resultat = data.kort as KortUtenId
    } catch {
      if (capture.notat.trim() === DEMO_NOTAT) {
        // Uendret eksempelnotat: forhåndsskrevet reserveforslag – tydelig merket i UI.
        resultat = { ...FALLBACK_FORSLAG }
        setForslagErReserve(true)
      } else {
        // Eget notat: aldri lat som. Vis ærlig feil og la brukeren prøve igjen.
        await minTid
        clearInterval(stegTimer)
        setStrukturerer(false)
        setStrukturFeil(true)
        return
      }
    }

    // Behold konsulentens metadata som kilde – demoen skal føles konsistent.
    resultat = {
      ...resultat,
      prosjekttype: resultat.prosjekttype || capture.prosjekttype || DEMO_PROSJEKTTYPE,
      kilde: {
        type: 'Ukentlig konsulentdebrief',
        navn: capture.konsulent.trim() || DEMO_KONSULENT,
        dato: capture.dato.trim() || DEMO_DATO,
      },
    }

    await minTid
    clearInterval(stegTimer)
    setStrukturSteg(STRUKTUR_STEG.length - 1)
    setForslag(resultat)
    setStrukturerer(false)
  }

  function endreForslag(felter: Partial<KortUtenId>) {
    setForslag((prev) => (prev ? { ...prev, ...felter } : prev))
  }

  function godkjenn() {
    if (!forslag) return
    const nyttKort: Erfaringskort = {
      ...forslag,
      id: `godkjent-${Date.now()}`,
      // Kunnskapsbasen lagrer den maskerte versjonen – kundenavn hører ikke
      // hjemme i en delt base, heller ikke i kildesporet.
      originalNotat: maskertNotat() || DEMO_NOTAT,
      avklaringer: gjeldendeAvklaringer(),
    }
    setGodkjentKort(nyttKort)
    setKunnskapsbase([nyttKort, ...SEED_KORT])
    // Kortet overlever økten og dukker opp i biblioteket.
    lagreGodkjentKort(nyttKort)
    setStadium(3)
  }

  function tilbakeTilAvklaring() {
    setForslag(null)
    setStrukturerer(false)
    setStrukturFeil(false)
    setForslagErReserve(false)
    setStadium(1)
    setSteg1('avklaring')
  }

  async function spør(sporsmal: string) {
    if (svarPågår) return
    setAktivtSpørsmål(sporsmal)
    setSvar('')
    setSvarFerdig(false)
    setSvarFeil(false)
    setSvarErReserve(false)
    setSvarPågår(true)

    let tekst = ''
    try {
      const res = await fetch('/api/sporsmal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sporsmal, kort: kunnskapsbase }),
      })
      if (!res.ok || !res.body) throw new Error(String(res.status))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        tekst += decoder.decode(value, { stream: true })
        setSvar(tekst)
      }
      if (!tekst.trim()) throw new Error('tomt')
    } catch {
      const kjentEksempel =
        sporsmal === DEMO_SPORSMAL_STOTTET || sporsmal === DEMO_SPORSMAL_UDEKKET
      if (kjentEksempel) {
        // Forhåndsskrevet reservesvar for eksempelspørsmålene – merkes i UI.
        tekst = fallbackSvar(sporsmal)
        setSvar(tekst)
        setSvarErReserve(true)
      } else {
        // Fritt spørsmål: aldri lat som. Vis ærlig feil med mulighet for nytt forsøk.
        setSvarPågår(false)
        setSvarFeil(true)
        return
      }
    }

    // Kunnskapshull-sløyfen: udekkede spørsmål logges og blir foreslåtte
    // utdypingsspørsmål i neste ukentlige debrief.
    if (tekst.trim().startsWith(INGEN_DEKNING_PREFIX)) {
      leggTilKunnskapshull(sporsmal, tekst.trim().slice(INGEN_DEKNING_PREFIX.length).trim())
    }

    setSvarPågår(false)
    setSvarFerdig(true)
  }

  function fallbackSvar(sporsmal: string): string {
    if (sporsmal === DEMO_SPORSMAL_STOTTET) return FALLBACK_SVAR_STOTTET
    if (sporsmal === DEMO_SPORSMAL_UDEKKET) return FALLBACK_SVAR_UDEKKET
    return FALLBACK_SVAR_GENERISK
  }

  function nullstill() {
    setVisIntro(true)
    setStadium(1)
    setSteg1('notat')
    setCapture(TOM_CAPTURE)
    setFunn([])
    setAvklaringer(EKSEMPEL_AVKLARINGER)
    setAvklaringKilde('eksempel')
    setLagerSporsmal(false)
    setAvklaringSvar(EKSEMPEL_AVKLARINGER.map(() => ''))
    setStrukturerer(false)
    setStrukturSteg(0)
    setForslag(null)
    setGodkjentKort(null)
    setKunnskapsbase([])
    setAktivtSpørsmål(null)
    setSvar('')
    setSvarPågår(false)
    setSvarFerdig(false)
    setStrukturFeil(false)
    setForslagErReserve(false)
    setSvarFeil(false)
    setSvarErReserve(false)
    setDetaljKort(null)
  }

  // ---- Avledet ----------------------------------------------------------

  function status(stg: number): StageStatus {
    if (stadium === stg) return 'active'
    if (stadium > stg) return 'done'
    return 'upcoming'
  }

  const visErInsufficient = svar.trim().startsWith(INGEN_DEKNING_PREFIX)

  if (visIntro) {
    return (
      <>
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <DemoIntro onStart={startEksempel} onForklaring={() => setVisForklaring(true)} />
        </div>
        <HowItWorks åpen={visForklaring} onÅpenEndring={setVisForklaring} />
      </>
    )
  }

  return (
    <>
      <div ref={flytRef} className="mx-auto max-w-3xl space-y-5 px-5 py-8">
        <div className="flex items-center justify-between gap-4">
          <DemoProgress aktivt={stadium} />
          <button
            type="button"
            onClick={nullstill}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Start på nytt
          </button>
        </div>

        {/* Stadium 1: Fang erfaringen */}
        <StageShell
          nr={1}
          tittel="Fang erfaringen"
          status={status(1)}
          sammendrag={
            capture.notat ? `${capture.konsulent || 'Konsulent'} · ${korte(capture.notat)}` : undefined
          }
        >
          {steg1 === 'notat' ? (
            <ExperienceCapture
              verdier={capture}
              onEndre={endreCapture}
              onBrukEksempel={startEksempel}
              onNeste={tilMaskering}
            />
          ) : steg1 === 'maskering' ? (
            <DataMasking
              notat={capture.notat.trim()}
              funn={funn}
              onVeksle={vekslefunn}
              onTilbake={() => setSteg1('notat')}
              onFortsett={gaTilAvklaring}
            />
          ) : (
            <ClarificationQuestions
              avklaringer={avklaringer}
              svar={avklaringSvar}
              laster={lagerSporsmal}
              kilde={avklaringKilde}
              onEndre={endreAvklaring}
              onBrukEksempel={brukAvklaringEksempel}
              onTilbake={() => setSteg1('maskering')}
              onLagForslag={lagForslag}
            />
          )}
        </StageShell>

        {/* Stadium 2: Godkjenn kunnskapen */}
        <StageShell
          nr={2}
          tittel="Godkjenn kunnskapen"
          status={status(2)}
          sammendrag={godkjentKort?.tittel}
        >
          {strukturFeil ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="flex gap-3">
                <ShieldAlert
                  className="size-4 shrink-0 translate-y-0.5 text-destructive"
                  aria-hidden="true"
                />
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-foreground">
                    Modellkallet feilet, så det finnes ikke noe ekte forslag å vise. Demoen
                    dikter ikke opp et.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" onClick={lagForslag}>
                      Prøv igjen
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={tilbakeTilAvklaring}
                      className="text-muted-foreground"
                    >
                      Tilbake
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : strukturerer || !forslag ? (
            <ProcessingState aktivtSteg={strukturSteg} />
          ) : (
            <div className="space-y-4">
              {forslagErReserve ? (
                <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-foreground">
                  Modellkallet feilet – dette er et forhåndsskrevet reserveforslag for
                  eksempelnotatet, ikke et ekte modellsvar.
                </p>
              ) : null}
              <ApprovalState
                forslag={forslag}
                onEndre={endreForslag}
                notat={maskertNotat() || DEMO_NOTAT}
                konsulent={capture.konsulent || DEMO_KONSULENT}
                dato={capture.dato || DEMO_DATO}
                avklaringer={gjeldendeAvklaringer()}
                onGodkjenn={godkjenn}
                onTilbake={tilbakeTilAvklaring}
              />
            </div>
          )}
        </StageShell>

        {/* Stadium 3: Bruk den i neste prosjekt */}
        <StageShell nr={3} tittel="Bruk den i neste prosjekt" status={status(3)}>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">
                Spør kunnskapsgrunnlaget
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                En kollega på et nytt prosjekt stiller et spørsmål. Svaret bygger kun på godkjent
                kunnskap — ditt nye kort pluss {SEED_KORT.length} tidligere godkjente erfaringer —
                og viser hvor det kommer fra.
              </p>
            </div>

            <KnowledgeQuestion
              onSpør={spør}
              pågår={svarPågår}
              aktivtSpørsmål={aktivtSpørsmål}
            />

            {aktivtSpørsmål ? (
              <div className="space-y-3 border-t border-border pt-5">
                <p className="text-sm font-medium text-foreground">{aktivtSpørsmål}</p>
                {svarFeil ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                    <div className="flex gap-3">
                      <ShieldAlert
                        className="size-4 shrink-0 translate-y-0.5 text-destructive"
                        aria-hidden="true"
                      />
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed text-foreground">
                          Modellkallet feilet, så det finnes ikke noe kildebasert svar å vise.
                          Demoen gjetter ikke.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => spør(aktivtSpørsmål)}
                        >
                          Prøv igjen
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : visErInsufficient && svarFerdig ? (
                  <div className="space-y-3">
                    <InsufficientKnowledge
                      detalj={svar.slice(INGEN_DEKNING_PREFIX.length).trim()}
                    />
                    <p className="flex gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                      <Lightbulb
                        className="mt-0.5 size-3.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>
                        Spørsmålet er logget som et <strong>kunnskapshull</strong> og foreslås
                        som tema i neste ukentlige debrief — slik blir hjernen smartere for
                        hver uke.{' '}
                        <Link
                          href="/bibliotek?fane=hull"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Se kunnskapshullene
                        </Link>
                      </span>
                    </p>
                  </div>
                ) : (
                  <GroundedAnswer
                    svar={svar}
                    kort={kunnskapsbase}
                    onÅpneErfaring={setDetaljKort}
                    strømmer={svarPågår}
                  />
                )}
                {svarErReserve && svarFerdig ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Modellkallet feilet – dette er et forhåndsskrevet reservesvar for
                    eksempelspørsmålet, ikke et ekte modellsvar.
                  </p>
                ) : null}
              </div>
            ) : null}

            {svarFerdig ? (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  render={<Link href="/bibliotek">Utforsk kunnskapsbiblioteket</Link>}
                />
                <Button variant="outline" size="sm" onClick={nullstill}>
                  Kjør demoen på nytt
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        </StageShell>
      </div>

      <HowItWorks åpen={visForklaring} onÅpenEndring={setVisForklaring} />
      <ExperienceDetailSheet
        kort={detaljKort}
        onÅpenEndring={(åpen) => {
          if (!åpen) setDetaljKort(null)
        }}
      />
    </>
  )
}
