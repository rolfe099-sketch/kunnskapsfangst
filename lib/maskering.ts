// ---------------------------------------------------------------------------
// Maskering av identifiserende opplysninger FØR noe sendes til en språkmodell.
//
// Prinsippet: en erfaring er gjenbrukbar uten at det står hvem kunden var.
// Deteksjonen kjører lokalt i nettleseren — vi kan ikke sende teksten til en
// modell for å finne ut hva som må skjules før den sendes til en modell.
//
// Heuristikken er bevisst enkel og vil både overdetektere og bomme. Derfor er
// den bygget som et forslag konsulenten godkjenner, aldri som noe automatisk.
// I en ekte løsning ville dette vært en dedikert NER-modell kjørt on-prem, med
// menneskelig godkjenning i samme form som her.
// ---------------------------------------------------------------------------

export type FunnType = 'person' | 'firma' | 'prosjekt' | 'epost' | 'telefon' | 'orgnr'

export type Funn = {
  id: string
  type: FunnType
  /** Den opprinnelige teksten som ble funnet. */
  original: string
  /** Foreslått erstatning, f.eks. «Entreprenør A». */
  erstatning: string
  /** Om konsulenten vil maskere dette funnet. */
  aktiv: boolean
}

export const FUNN_ETIKETT: Record<FunnType, string> = {
  person: 'Personnavn',
  firma: 'Firmanavn',
  prosjekt: 'Prosjektnavn',
  epost: 'E-postadresse',
  telefon: 'Telefonnummer',
  orgnr: 'Organisasjonsnummer',
}

// Vanlige norske ord som ofte står med stor forbokstav uten å være navn.
// Uten denne lista blir nesten hver setningsstart foreslått som personnavn.
const STOPPORD = new Set([
  'vi',
  'de',
  'det',
  'den',
  'dette',
  'disse',
  'da',
  'når',
  'etter',
  'før',
  'under',
  'over',
  'ved',
  'med',
  'uten',
  'for',
  'til',
  'fra',
  'på',
  'i',
  'og',
  'men',
  'som',
  'har',
  'ble',
  'var',
  'er',
  'jeg',
  'du',
  'han',
  'hun',
  'man',
  'alle',
  'hver',
  'noen',
  'ingen',
  'her',
  'der',
  'hvor',
  'hva',
  'hvordan',
  'hvorfor',
  'mandag',
  'tirsdag',
  'onsdag',
  'torsdag',
  'fredag',
  'lørdag',
  'søndag',
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
  'lean',
  'takt',
  'taktplanlegging',
  'sone',
  'soner',
  'prosjektet',
  'prosjekt',
  'byggherre',
  'entreprenør',
  'tømrer',
  'elektro',
  'rør',
  'ventilasjon',
  'mur',
  'betong',
  'last',
  'planner',
])

// Faguttrykk som skal overleve maskeringen — de er kunnskap, ikke identitet.
const FAGORD = new Set([
  'last planner',
  'lean construction',
  'takt',
  'ppu',
  'bim',
  'ue',
  'he',
])

const EPOST_RE = /\b[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}\b/g
// Norske telefonnummer: 8 siffer, valgfri landkode og mellomrom/bindestrek.
const TELEFON_RE = /(?:\+47[\s-]?)?(?:\d{2}[\s-]?){3}\d{2}\b/g
const ORGNR_RE = /\b\d{3}[\s]?\d{3}[\s]?\d{3}\b/g
// Firmanavn: ett eller flere store ord etterfulgt av selskapsform.
const FIRMA_RE = /\b([A-ZÆØÅ][\wæøåÆØÅ-]+(?:\s+[A-ZÆØÅ][\wæøåÆØÅ-]+){0,2})\s+(AS|ASA|ANS|DA|BA)\b/g
// Prosjektnavn: «Prosjekt Fjordbyen», «Byggetrinn Nord».
const PROSJEKT_RE =
  /\b(?:Prosjekt(?:et)?|Byggetrinn|Bygg|Felt)\s+([A-ZÆØÅ][\wæøåÆØÅ-]+(?:\s+[A-ZÆØÅ][\wæøåÆØÅ-]+)?)\b/g
// Sammenhengende ord med stor forbokstav – kandidat til personnavn. Tar med
// opptil fire ord, slik at «Prosjektleder Ole Martin Strand» fanges i sin
// helhet og ikke kuttes midt i navnet.
const NAVNERUN_RE =
  /\b([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+){1,3})\b/g

// Titler og roller er nyttig kontekst, ikke identitet. De skal stå igjen i
// teksten, mens selve navnet maskeres.
const TITLER = new Set([
  'prosjektleder',
  'prosjekteringsleder',
  'anleggsleder',
  'byggeleder',
  'driftsleder',
  'formann',
  'bas',
  'basen',
  'ingeniør',
  'arkitekt',
  'rådgiver',
  'konsulent',
  'daglig',
  'leder',
  'kollega',
])

function erStoppord(tekst: string): boolean {
  const ord = tekst.toLowerCase().split(/\s+/)
  // Hvis alle ordene er vanlige ord, er det neppe et navn.
  return ord.every((o) => STOPPORD.has(o))
}

function erFagord(tekst: string): boolean {
  return FAGORD.has(tekst.toLowerCase())
}

function bokstav(indeks: number): string {
  return String.fromCharCode(65 + (indeks % 26))
}

/**
 * Finn identifiserende opplysninger i et notat. Returnerer forslag som
 * konsulenten kan slå av og på — ingenting maskeres automatisk.
 */
export function finnFunn(tekst: string): Funn[] {
  const funn: Funn[] = []
  const settOriginaler = new Set<string>()

  // Rekkefølgen betyr noe: de mest spesifikke mønstrene først, slik at
  // «Byggmester Hansen AS» blir firma og ikke personnavn.
  const tellere: Record<FunnType, number> = {
    firma: 0,
    prosjekt: 0,
    person: 0,
    epost: 0,
    telefon: 0,
    orgnr: 0,
  }

  function leggTil(type: FunnType, original: string, erstatning: string) {
    const rensket = original.trim()
    if (!rensket || settOriginaler.has(rensket) || erFagord(rensket)) return
    settOriginaler.add(rensket)
    funn.push({
      id: `${type}-${funn.length}`,
      type,
      original: rensket,
      erstatning,
      aktiv: true,
    })
  }

  for (const m of tekst.matchAll(EPOST_RE)) {
    leggTil('epost', m[0], '[e-post fjernet]')
  }

  for (const m of tekst.matchAll(FIRMA_RE)) {
    leggTil('firma', m[0], `Entreprenør ${bokstav(tellere.firma++)}`)
  }

  for (const m of tekst.matchAll(PROSJEKT_RE)) {
    // Behold ledeordet («Prosjekt»), masker bare selve navnet.
    leggTil('prosjekt', m[1], `Prosjekt ${bokstav(tellere.prosjekt++)}`)
  }

  for (const m of tekst.matchAll(ORGNR_RE)) {
    leggTil('orgnr', m[0], '[org.nr. fjernet]')
  }

  for (const m of tekst.matchAll(TELEFON_RE)) {
    leggTil('telefon', m[0], '[telefon fjernet]')
  }

  for (const m of tekst.matchAll(NAVNERUN_RE)) {
    // Skrell av ledende titler, slik at «Prosjektleder Ole Martin Strand»
    // gir navnet «Ole Martin Strand» og rollen blir stående i teksten.
    let ord = m[1].split(/\s+/)
    while (ord.length > 0 && TITLER.has(ord[0].toLowerCase())) {
      ord = ord.slice(1)
    }
    // Ett enkelt ord er for usikkert til å kalle et personnavn.
    if (ord.length < 2) continue

    const kandidat = ord.join(' ')
    if (erStoppord(kandidat)) continue
    // Hopp over navn som allerede inngår i et firmanavn vi har funnet.
    if ([...settOriginaler].some((o) => o.includes(kandidat))) continue
    leggTil('person', kandidat, `Person ${tellere.person++ + 1}`)
  }

  return funn
}

/** Bytt ut alle aktive funn i teksten med erstatningene sine. */
export function maskerTekst(tekst: string, funn: Funn[]): string {
  let ut = tekst
  // Lengste først, slik at delstrenger ikke ødelegger lengre treff.
  const aktive = funn
    .filter((f) => f.aktiv)
    .sort((a, b) => b.original.length - a.original.length)

  for (const f of aktive) {
    ut = ut.split(f.original).join(f.erstatning)
  }
  return ut
}
