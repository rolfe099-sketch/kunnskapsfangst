import type { Erfaringskort } from '@/lib/data'

// ---------------------------------------------------------------------------
// Fiktiv «basiskunnskap» i demoen: erfaringer om taktplanlegging, Lean og
// hvordan man får et byggeprosjekt til å flyte. Alt innhold er oppdiktet og
// tydelig merket som det — poenget er å vise hvordan en voksende, godkjent
// kunnskapsbase føles i bruk.
// ---------------------------------------------------------------------------

const DEBRIEF = 'Ukentlig konsulentdebrief'

export const SEED_KORT: Erfaringskort[] = [
  {
    id: 'seed-takttog-oppstart',
    tittel: 'Kortere takter i oppstartsfasen ga raskere læring',
    prosjekttype: 'Boligblokk',
    tags: ['taktplanlegging', 'oppstart', 'læring'],
    situasjon:
      'Taktplanlagt boligblokk der teamet startet rett på fem dagers takt over hele planen.',
    problem:
      'De første taktene sprakk fordi arbeidsmengden per sone var feilestimert, og det tok flere uker før planen ble justert.',
    tiltak:
      'Neste prosjekt startet med tre korte «kalibreringstakter» der tidsbruk per fag ble målt per sone, før taktlengden ble låst for resten av toget.',
    observertEffekt:
      'Taktplanen som ble låst etter kalibreringen holdt vesentlig bedre, og diskusjonene om taktlengde stilnet fordi de bygget på målte tider.',
    relevantNaar:
      'Taktplanlagte prosjekter med repeterende soner der arbeidsmengden per sone er usikker ved oppstart.',
    forbehold:
      'Fiktivt eksempel. Kalibreringstakter koster litt fremdrift tidlig og passer best når det er mange repetisjoner å hente gevinsten på.',
    kilde: { type: DEBRIEF, navn: 'Anders Holm', dato: '8. mai 2026' },
  },
  {
    id: 'seed-taktbuffer',
    tittel: 'Buffersone i takttoget i stedet for buffer i hver takt',
    prosjekttype: 'Boligblokk',
    tags: ['taktplanlegging', 'buffer', 'flyt'],
    situasjon:
      'Takttog der hvert fag hadde lagt inn egen slakk i sin takt «for sikkerhets skyld».',
    problem:
      'Summen av skjult slakk gjorde toget langsomt, samtidig som forsinkelser likevel forplantet seg fordi ingen buffer var felles.',
    tiltak:
      'Fjernet individuell slakk og la inn én felles buffersone i toget, synlig i planen, som togleder disponerte ved avvik.',
    observertEffekt:
      'Totaltiden gikk ned, og avvik ble håndtert i bufferen i stedet for å skyve hele toget. Diskusjonen flyttet seg fra «min takt» til «vårt tog».',
    relevantNaar:
      'Takttog der fagene estimerer konservativt hver for seg og forsinkelser likevel smitter mellom takter.',
    forbehold:
      'Fiktivt eksempel. Krever en togleder med mandat til å disponere bufferen, ellers fylles den opp av første og beste avvik.',
    kilde: { type: DEBRIEF, navn: 'Ingrid Aas', dato: '15. mai 2026' },
  },
  {
    id: 'seed-utkikksplan',
    tittel: 'Seks ukers utkikksplan med hindringsanalyse per aktivitet',
    prosjekttype: 'Skolebygg',
    tags: ['last planner', 'hindringer', 'planlegging'],
    situasjon:
      'Prosjekt der basmøtene handlet om neste uke, mens hindringer som materiell og tegninger krevde lengre horisont.',
    problem:
      'Aktiviteter ble trukket inn i ukeplanen uten at forutsetningene var på plass, og stoppet midt i uken.',
    tiltak:
      'Innførte rullerende seks ukers utkikksplan der hver aktivitet ble sjekket mot sju forutsetninger (mannskap, materiell, utstyr, tegninger, plass, forutgående arbeid, ytre forhold) før den fikk gå inn i ukeplanen.',
    observertEffekt:
      'Flere hindringer ble fjernet før de traff produksjonen, og ukeplanene ble mer realistiske fordi bare «sunne» aktiviteter slapp inn.',
    relevantNaar:
      'Prosjekter der ukeplaner sprekker på forutsetninger som kunne vært avdekket uker i forveien.',
    forbehold:
      'Fiktivt eksempel. Disiplinen i forutsetningssjekken avgjør alt — en utkikksplan som bare er en liste gir lite.',
    kilde: { type: DEBRIEF, navn: 'Kristian Berge', dato: '22. mai 2026' },
  },
  {
    id: 'seed-ppu-maling',
    tittel: 'PPU-måling med årsakskoder endret ukeplanmøtet',
    prosjekttype: 'Kontorbygg',
    tags: ['last planner', 'ppu', 'kontinuerlig forbedring'],
    situasjon:
      'Ukeplanmøter der lag etter lag rapporterte status uten at planpåliteligheten ble målt.',
    problem:
      'De samme årsakene til at aktiviteter ikke ble ferdige gikk igjen uke etter uke uten å bli adressert.',
    tiltak:
      'Begynte å måle prosent planlagt utført (PPU) per uke, og registrerte en enkel årsakskode for hver aktivitet som ikke ble ferdig. Topp tre årsaker ble gjennomgått i møtet.',
    observertEffekt:
      'PPU steg over noen uker, og tiltak ble rettet mot de faktiske gjengangerne (uklart underlag og venting på forutgående fag) i stedet for mot symptomer.',
    relevantNaar:
      'Prosjekter med ukeplaner der «nesten ferdig» er normalen og årsakene aldri samles systematisk.',
    forbehold:
      'Fiktivt eksempel uten dokumenterte måltall. Målingen må brukes til læring, ikke til å henge ut lag — ellers pyntes tallene.',
    kilde: { type: DEBRIEF, navn: 'Maria Lunde', dato: '29. mai 2026' },
  },
  {
    id: 'seed-tegningsbehov',
    tittel: 'Tidlig avklaring av tegningsbehov før oppstart i sone',
    prosjekttype: 'Næringsbygg',
    tags: ['tegninger', 'planlegging', 'oppstart'],
    situasjon:
      'Prosjekt der arbeidet startet i en ny sone før alt nødvendig tegningsunderlag var avklart.',
    problem:
      'Fag oppdaget manglende eller uklare tegninger først etter oppstart, noe som ga stopp og omarbeid.',
    tiltak:
      'Innførte en kort tegningsgjennomgang per sone i uken før oppstart, der hvert fag bekreftet at underlaget var komplett.',
    observertEffekt:
      'Færre avbrudd tidlig i sonen og mindre omarbeid knyttet til uavklart underlag.',
    relevantNaar:
      'Arbeidet planlegges sone for sone og er avhengig av at tegningsunderlaget er avklart før oppstart.',
    forbehold:
      'Fiktivt eksempel uten dokumenterte måltall. Omfanget av gjennomgangen må tilpasses prosjektets størrelse.',
    kilde: { type: DEBRIEF, navn: 'Anders Holm', dato: '13. juni 2026' },
  },
  {
    id: 'seed-beslutningseier',
    tittel: 'Kortere beslutningstid gjennom tydelig agenda og beslutningseier',
    prosjekttype: 'Rehabiliteringsprosjekt',
    tags: ['møteledelse', 'beslutninger', 'agenda'],
    situasjon:
      'Prosjektmøter der beslutninger ofte ble utsatt fordi det var uklart hvem som eide dem.',
    problem:
      'Saker ble diskutert uten å lande, og de samme temaene kom opp igjen uke etter uke.',
    tiltak:
      'Innførte en fast agenda med tydelig beslutningseier og frist per sak, og skilte diskusjonssaker fra beslutningssaker.',
    observertEffekt:
      'Beslutninger ble tatt raskere, og færre saker ble gjentatt i påfølgende møter.',
    relevantNaar:
      'Faste prosjektmøter der beslutninger drar ut og ansvaret for å lande dem er uklart.',
    forbehold:
      'Fiktivt eksempel. Effekten avhenger av at beslutningseier faktisk har mandat til å beslutte.',
    kilde: { type: DEBRIEF, navn: 'Ingrid Aas', dato: '27. juni 2026' },
  },
  {
    id: 'seed-soneoverlevering',
    tittel: 'Sjekkliste for soneoverlevering mellom fag',
    prosjekttype: 'Boligblokk',
    tags: ['overlevering', 'soner', 'kvalitet'],
    situasjon:
      'Takttog der neste fag jevnlig overtok soner som ikke var reelt ferdige fra forrige fag.',
    problem:
      '«Ferdig» betydde forskjellige ting for ulike fag, og småfeil ble oppdaget først når neste fag var i gang.',
    tiltak:
      'Laget en énsides sjekkliste per soneoverlevering, definert sammen av avgivende og mottakende fag, som ble kvittert ut ved taktskifte.',
    observertEffekt:
      'Færre diskusjoner om hva «ferdig» betyr, og feil ble tatt før neste fag rigget seg til i sonen.',
    relevantNaar:
      'Sekvensielt arbeid i soner der overleveringskvaliteten avgjør neste fags flyt.',
    forbehold:
      'Fiktivt eksempel. Sjekklisten må være kort nok til å faktisk brukes — én side var et bevisst valg.',
    kilde: { type: DEBRIEF, navn: 'Kristian Berge', dato: '5. juni 2026' },
  },
  {
    id: 'seed-materiallogistikk',
    tittel: 'Soneadresserte leveranser fjernet leting og flytting av materiell',
    prosjekttype: 'Kontorbygg',
    tags: ['logistikk', 'materiell', 'flyt'],
    situasjon:
      'Prosjekt der materiell ble levert i store partier til én rigg-sone og flyttet internt etter behov.',
    problem:
      'Håndverkere brukte mye tid på å lete etter og flytte materiell, og gangbaner ble sperret av mellomlagring.',
    tiltak:
      'La om til mindre, soneadresserte leveranser merket per takt og sone, koordinert i utkikksplanen, slik at materiellet sto der arbeidet skulle skje.',
    observertEffekt:
      'Mindre intern flytting og leting, ryddigere soner, og færre skader på materiell som før lå lagret i ukevis.',
    relevantNaar:
      'Trange byggeplasser og taktplanlagte prosjekter der intern logistikk stjeler produksjonstid.',
    forbehold:
      'Fiktivt eksempel. Krever leverandører som kan levere hyppigere og mer presist — det bør inn i kontraktene tidlig.',
    kilde: { type: DEBRIEF, navn: 'Maria Lunde', dato: '12. juni 2026' },
  },
  {
    id: 'seed-visuell-taktplan',
    tittel: 'Fysisk taktplan i brakka som alle faggrupper oppdaterer selv',
    prosjekttype: 'Skolebygg',
    tags: ['visuell styring', 'taktplanlegging', 'eierskap'],
    situasjon:
      'Taktplan som levde i planleggerens verktøy og ble vist frem i møter som statiske utskrifter.',
    problem:
      'Fagene forholdt seg passivt til planen — den var «prosjektlederens plan», ikke deres, og avvik ble meldt sent.',
    tiltak:
      'Hengte opp taktplanen fysisk i brakka med magneter per fag og sone. Hver bas flyttet egne magneter og markerte avvik med rød brikke ved dagens slutt.',
    observertEffekt:
      'Avvik ble synlige samme dag, og fagene begynte å løse kollisjoner seg imellom foran tavla før de eskalerte.',
    relevantNaar:
      'Prosjekter der planen oppleves som noe som skjer i møter, ikke ute i produksjonen.',
    forbehold:
      'Fiktivt eksempel. Fysisk tavle og digital plan må holdes i synk — én må være master, hos oss var det tavla.',
    kilde: { type: DEBRIEF, navn: 'Sofie Dahl', dato: '19. juni 2026' },
  },
  {
    id: 'seed-morgenmote-15min',
    tittel: 'Stående morgenmøte på maks 15 minutter med fast struktur',
    prosjekttype: 'Rehabiliteringsprosjekt',
    tags: ['morgenmøte', 'møteledelse', 'flyt'],
    situasjon:
      'Morgenmøter som est ut til 40 minutter med detaljdiskusjoner mens halve laget ventet.',
    problem:
      'Møtet stjal produksjonstid, og de viktige avklaringene druknet i diskusjoner som bare angikk to personer.',
    tiltak:
      'Kuttet til 15 minutter stående foran tavla med tre faste punkter per fag: hva ble ferdig i går, hva gjøres i dag, hva hindrer oss. Diskusjoner ble parkert til egne avklaringer rett etter møtet med kun de berørte.',
    observertEffekt:
      'Møtet holdt tiden, flere hindringer ble meldt fordi terskelen ble lavere, og detaljavklaringene ble bedre av å tas med riktig folk.',
    relevantNaar:
      'Alle prosjekter med daglige koordineringsmøter som har vokst seg lange og ufokuserte.',
    forbehold:
      'Fiktivt eksempel. Strukturen må håndheves vennlig men konsekvent de første ukene, ellers glir møtet tilbake.',
    kilde: { type: DEBRIEF, navn: 'Sofie Dahl', dato: '3. juli 2026' },
  },
  {
    id: 'seed-hindringslogg',
    tittel: 'Felles hindringslogg med ansvarlig og frist per hindring',
    prosjekttype: 'Næringsbygg',
    tags: ['hindringer', 'oppfølging', 'last planner'],
    situasjon:
      'Hindringer ble meldt muntlig i møter og husket av den som tilfeldigvis skrev referat.',
    problem:
      'Samme hindring ble meldt flere ganger uten at noen eide den, og småting ble stående til de stoppet produksjonen.',
    tiltak:
      'Én synlig hindringslogg for hele prosjektet der hver hindring fikk ansvarlig person og frist. Loggen ble åpnet som første punkt i hvert basmøte.',
    observertEffekt:
      'Hindringer ble lukket raskere, og «gjengangerne» ble synlige som mønster i loggen i stedet for å være anekdoter.',
    relevantNaar:
      'Prosjekter der hindringer meldes, glemmes og gjenoppstår uten tydelig eierskap.',
    forbehold:
      'Fiktivt eksempel. Loggen dør hvis den blir en kirkegård — gamle hindringer må lukkes eller eskaleres, ikke bli liggende.',
    kilde: { type: DEBRIEF, navn: 'Jonas Vik', dato: '26. juni 2026' },
  },
  {
    id: 'seed-forpliktende-plan',
    tittel: 'Bas-ene lager ukeplanen selv — forpliktelse fremfor tildeling',
    prosjekttype: 'Boligblokk',
    tags: ['last planner', 'eierskap', 'ukeplan'],
    situasjon:
      'Ukeplaner ble laget av prosjektledelsen og delt ut til fagene som oppgavelister.',
    problem:
      'Planene ble behandlet som ledelsens ønskeliste. Ingen følte eierskap, og avvik ble forklart med «planen var urealistisk».',
    tiltak:
      'Snudde prosessen: bas-ene planla egen uke selv innenfor takten og forutsetningene, og forpliktet seg til planen i fellesmøtet.',
    observertEffekt:
      'Planene ble mer realistiske, og tonen endret seg fra å forsvare avvik til å løse dem — det var deres egen plan som skulle holdes.',
    relevantNaar:
      'Prosjekter der ukeplaner konsekvent sprekker og fagene omtaler planen som «deres», ikke «vår».',
    forbehold:
      'Fiktivt eksempel. Krever at ledelsen faktisk aksepterer bas-enes estimater — overstyres de, forsvinner eierskapet umiddelbart.',
    kilde: { type: DEBRIEF, navn: 'Jonas Vik', dato: '10. juli 2026' },
  },
  {
    id: 'seed-forsering-takt',
    tittel: 'Forsering ved å legge inn ekstra togsett — ikke ved å korte ned takter',
    prosjekttype: 'Kontorbygg',
    tags: ['taktplanlegging', 'forsering', 'fremdrift'],
    situasjon:
      'Prosjekt som lå etter og fikk krav om forsering fra byggherre.',
    problem:
      'Første refleks var å korte taktene fra fem til fire dager, noe som ville stresset alle fag samtidig og truet kvaliteten i hver sone.',
    tiltak:
      'Beholdt taktlengden, men satte inn et ekstra «togsett» — flere lag som kjørte samme sekvens i en parallell sonerekke — der bygget tillot det.',
    observertEffekt:
      'Fremdriften økte uten at kvaliteten i hver enkelt sone ble presset, og fagene beholdt en rytme de allerede mestret.',
    relevantNaar:
      'Taktprosjekter med forseringskrav og nok fysisk adskilte soner til å kjøre parallelt.',
    forbehold:
      'Fiktivt eksempel. Parallelle tog krever mer mannskap, mer logistikk og en byggherre som betaler for forseringen — ikke gratis.',
    kilde: { type: DEBRIEF, navn: 'Kristian Berge', dato: '17. juli 2026' },
  },
  {
    id: 'seed-prosjektoppstart-lean',
    tittel: 'Felles Lean-oppstartssamling med alle fag før første takt',
    prosjekttype: 'Skolebygg',
    tags: ['oppstart', 'samhandling', 'taktplanlegging'],
    situasjon:
      'Prosjekt der underentreprenørene møtte taktplanen første gang da de startet på plassen.',
    problem:
      'Fagene forsto ikke logikken i toget, planla internt på tvers av den, og de første ukene gikk med til brannslukking.',
    tiltak:
      'Kjørte en halvdags oppstartssamling der alle fag bygde taktplanen sammen: sonedeling, sekvens og taktlengde ble utfordret og justert av dem som skulle utføre arbeidet.',
    observertEffekt:
      'Fagene kjente planen som sin egen fra dag én, og flere sekvensfeil ble luket ut på samlingen i stedet for ute i produksjonen.',
    relevantNaar:
      'Alle taktprosjekter med flere underentreprenører — spesielt der UE-ene ikke har kjørt takt før.',
    forbehold:
      'Fiktivt eksempel. Samlingen må ligge tett nok på oppstart til at riktige folk deltar — basene, ikke bare kalkulatørene.',
    kilde: { type: DEBRIEF, navn: 'Maria Lunde', dato: '24. juli 2026' },
  },
  {
    id: 'seed-avviksregel',
    tittel: 'Takt-avvik meldes samme dag etter «stopp toget»-regelen',
    prosjekttype: 'Boligblokk',
    tags: ['avvik', 'taktplanlegging', 'kultur'],
    situasjon:
      'Takttog der fag som lå etter jobbet stille videre i håp om å ta igjen det tapte.',
    problem:
      'Avvik ble synlige først ved taktskifte, når neste fag sto klart — for sent til å gjøre noe annet enn å skyve toget.',
    tiltak:
      'Innførte regel om at et fag som ser at takten ryker skal melde det samme dag, uten skyld — og togleder omdisponerte buffer eller mannskap før taktskiftet.',
    observertEffekt:
      'Avvik ble håndtert mens de fortsatt var små, og kulturen flyttet seg fra å skjule etterslep til å be om hjelp tidlig.',
    relevantNaar:
      'Taktprosjekter der avvik konsekvent oppdages ved taktskifte i stedet for underveis.',
    forbehold:
      'Fiktivt eksempel. Fungerer bare hvis tidlig melding faktisk møtes med hjelp og ikke kritikk — én sur reaksjon setter kulturen tilbake.',
    kilde: { type: DEBRIEF, navn: 'Sofie Dahl', dato: '31. juli 2026' },
  },
  {
    id: 'seed-sluttfase-takt',
    tittel: 'Egen kort-takt for sluttfasen i stedet for å la toget dø ut',
    prosjekttype: 'Kontorbygg',
    tags: ['sluttfase', 'taktplanlegging', 'ferdigstillelse'],
    situasjon:
      'Prosjekt der takttoget fungerte godt i råbygg og tett bygg, men ble oppgitt i innredning og ferdigstillelse.',
    problem:
      'Sluttfasen ble en uoversiktlig punchliste-jakt der alle fag var overalt samtidig og ingen soner ble helt ferdige.',
    tiltak:
      'Definerte et eget sluttfasetog med kortere takter (2-3 dager), mindre soner og egen sekvens for komplettering, test og utbedring — sone for sone til reell ferdigstillelse.',
    observertEffekt:
      'Soner ble faktisk lukket fortløpende i stedet for at alt sto «nesten ferdig» til slutt, og overlevering gikk roligere enn på tilsvarende prosjekter.',
    relevantNaar:
      'Prosjekter der taktdisiplinen historisk kollapser når innredningsfasen starter.',
    forbehold:
      'Fiktivt eksempel. Sluttfasetoget krever at forutgående tog leverer reelt ferdige soner — ellers arver det bare etterslepet.',
    kilde: { type: DEBRIEF, navn: 'Jonas Vik', dato: '31. juli 2026' },
  },
]
