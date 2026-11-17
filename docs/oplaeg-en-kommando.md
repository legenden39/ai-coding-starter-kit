# Oplæg: startkit med én kommando

Status: oplæg, intet er bygget. Ejeren vælger, før noget bygges.
Skrevet af en billig model (Sonnet) ud fra ejerens ønsker og en gennemlæsning af kilden. Designet bør gennemgås af en stærk model (Fable), før det bygges.

## Problemet

Opsætningen i dag er for tung: 9 faser, et interview, valg mellem kort og fuld vej. Folk, der er nye til AI, skal igennem meget, før de får gavn af kittet. Det, der virker (hooks, vagt, færdig-tjek, gemmepunkter), skal beholdes. Det, der er bøvlet, er vejen derhen.

## Det ejeren ønsker

1. **Én kommando** (`$startkit` / `/startkit`) og så bygger kittet selv fundamentet. Så få spørgsmål som muligt.
2. **Hjælp med værktøjerne:** Node.js, git, Superpowers og selve kittet. Supabase, Vercel og lignende skal ikke installeres på forhånd, men kittet skal kende dem: ser det, at projektet kræver en database eller hosting, siger det til og guider.
3. **Tilpasset den enkelte**, ikke en kopi af ejerens egen opsætning.
4. **Har personen allerede et projekt:** kittet gennemgår det, finder, hvor nøglerne ligger, og sørger for, at de ikke havner de forkerte steder.
5. **Hold regelfilen (AGENTS.md / CLAUDE.md) kort.** Brug hooks til resten.
6. **Ved hver ny chat:** kittet siger, hvilken model opgaven kræver. Både for ChatGPT/Codex og Claude.
7. **Spar tokens uden at miste kvalitet:** en mindre model laver arbejdet, en større gennemgår det.
8. **Loop-stop:** går den samme fejl igen to-tre gange, stopper det automatisk, og årsagen findes, før der prøves igen.
9. **Et rigtigt overblik som visuelt UI:** hvad er jeg i gang med, hvad venter, hvad kommer; en to-do-liste; anbefalet model pr. opgave. Den nuværende side giver ikke overblik.

### Tilføjet 17. nov. (ejerens næste besked)
10. **Menneskeligt sprog overalt.** Ingen kode eller fagord uden forklaring. Folk ved ikke, hvad Supabase og Vercel er, og bliver skræmt af PowerShell.
11. **AI'en gør selv det, den kan, og siger hvad og hvorfor.** Skal der køres noget i terminalen, så spørger den: "Skal jeg køre det for dig?" og forklarer i en sætning, hvad det gør, og hvorfor. Så trykker folk ikke bare Tab/Enter uden at vide, hvad der sker. Ingen hook må blokere det, AI'en selv kan gøre.
12. **Intet langt interview.** Et par spørgsmål undervejs er fint. Fundamentet bygges først. Bagefter tilbydes interviewet som valgfrit ("vil du fortælle mig mere om dit projekt, så jeg kan hjælpe bedre?").
13. **Kun i de projekter, man vælger.** Nemt at vide, hvordan man tænder det i et nyt projekt.
14. **Kontrolpanel, ikke bare en side:** hvilke sessioner er åbne og hvad laver de, tests live, forbrug og tokens tilbage.
15. **Overtagelse:** alt noteres, så en hvilken som helst AI (anden model, ChatGPT eller Claude) kan tage over uden tab, hvis man løber tør for tokens eller noget går galt.
16. **Forbrugsvurdering:** før en opgave startes, vurderes, hvor meget den cirka kræver kontra, hvad der er tilbage. Store opgaver deles i små bidder, så man ikke brænder alt af og må starte forfra.

17. **Test det relevante, og anbefal en fuld test med mellemrum** (ejerens notat, 17. nov.). Jo flere tests, jo bedre, men en ændring skal kun udløse de tests, der hører til det, der er ændret. Når der er lavet mange rettelser (fx 10-20) siden sidste fulde test, anbefaler kittet selv en fuld test, som tager længere tid.

### Test af det relevante (om punkt 17)
- **I dag:** `tests/run.js` kører alle testfiler hver gang, og `bevis.js` kører de kommandoer, der står i `.startkit/config.json`, alle sammen. Der er ingen udvælgelse efter, hvad der er ændret, og ingen tæller.
- **Forslag:** et lille kort (en datafil) fra filer/mapper til de tests, der dækker dem. `bevis.js` ser, hvilke filer der er ændret siden sidste grønne bevis, og kører kun de tests. Ved en fil, der ikke står i kortet, kører den alt (hellere for meget end for lidt).
- **Tæller:** kittet tæller ændringer siden sidste fulde grønne test. Ved en tærskel (starter på 10, kan ændres) siger det i almindeligt sprog: "Der er lavet 10 rettelser siden sidste fulde test. Skal vi køre en fuld test nu? Det tager lidt længere tid." Det er en anbefaling, ikke en blokering.
- **Færdig-tjekket:** beviset gælder stadig netop den kode, der er ændret (fingeraftrykket). Et delvist bevis må ikke se ud som et fuldt: bevisfilen skal sige, om det var en delvis eller fuld kørsel, og hvad der ikke blev kørt.
- **Før noget deles** (push, pull request, udgivelse): altid fuld test. Det er ikke til forhandling.
- **Risiko:** et forkert kort giver falsk tryghed (en ændring, der ødelægger noget, som kortet ikke kobler til). Derfor skal den fulde test køre jævnligt, og kortet skal selv have en test: hver testfil skal stå i kortet, og hver kildefil skal høre til mindst én test.
- **Gælder også kittets egen CLAUDE.md:** der står i dag, at "færdig" kræver `byg --tjek` og hele `tests/run.js`. Skal reglen ændres til "relevante tests, og fuld test før deling", er det en ændring af ejerens arbejdsregel, og den kræver et klart ja fra ejeren. Ikke ændret.

## Hvad kilden gør i dag (læst, ikke afprøvet i alt)

| Ønske | I dag |
|---|---|
| Én kommando | Nej. `startkit/SKILL.md` har 9 faser og et interview. Den korte vej er en lille version, men stiller stadig 11 spørgsmål. |
| Installere værktøjer | Delvist. Fase 2 tjekker git og Node og guider efter `references/vaerktoejer.md`. Superpowers: der spørges kun, og der står "du installerer ikke plugins selv". |
| Supabase/Vercel osv. | Nævnes ikke som noget, kittet opdager. |
| Gennemgå et eksisterende projekt | Fase 4 kortlægger (kun læsning). `noeglescan.js` og nøgletjekket før commit finder nøgler i filer. Ingen tjek af, om nøgler ligger de rigtige steder (fx at `.env` er i `.gitignore`). |
| Kort regelfil | Skabelonen er kort, og `start.js` kapper filer ved 60 linjer. Det er ikke en lås mod, at en regelfil vokser. |
| Model ved hver chat | Nej. Det er en tekstregel (se `docs/modelvalg-som-laas.md`). `start.js` sender status og fejlliste, ikke en modelanbefaling. |
| Loop-stop | Kun en tekstregel ("hjælper en rettelse ikke efter to forsøg, så stop"). Færdig-tjekket (`faerdig.js`) beder højst én gang pr. stop. Intet tæller gentagne fejl. |
| Overblik | `overblik.js` (120 linjer) viser `STATUS.md` som lister, git, bevis og fejl. Ingen opdeling i nu/venter/senere, ingen to-do, ingen model pr. opgave. |

Kittet findes i to udgaver, Codex/ChatGPT (`startkit/SKILL.md`) og Claude (`startkit/claude/`, genereret). Alt skal laves i begge og på dansk og engelsk.

## Forslag til designet

### 1. Autopilot-forløbet (erstatter interview og fase-valg)
`$startkit` gør dette, i rækkefølge, og beder kun om et ja ved det, der ændrer noget:
1. **Kig først, spørg senere.** Er mappen tom, eller er det et eksisterende projekt? Er der `.startkit/` i forvejen (så genoptag)? Er der et gammelt projekt at hente fra (`nyt-projekt.js`)?
2. **Maskinen:** find, hvad der mangler (git, Node, Superpowers). Vis listen, og få ét ja pr. program. Kittet kører kommandoerne selv, når personen har sagt ja.
3. **Én samlet godkendelse af hooks.** Vis, hvad hver hook beskytter mod, og få ét ja. Hooks er et sikkerhedsvalg og kan ikke springes over.
4. **Skriv fundamentet med forsigtige standardværdier** (regler, vagt, færdig-tjek, nøgletjek, gemmepunkter, status, overblik).
5. **Eksisterende projekt:** læs det (kun læsning), og vis fund: hvor nøgler ligger, om `.env` er ignoreret, om der ligger nøgler eller personoplysninger i regelfilerne.
6. **Åbn overblikket** og sig, hvad næste skridt er.

Interviewet bliver et valgfrit tilvalg ("vil du tilpasse mere?"), ikke en betingelse.

### 2. Spørgsmål, når de betyder noget (i stedet for på forhånd)
De fem sikkerhedsspørgsmål (nøgler, kopi, rigtige brugere, betaling/mails, persondata/login) stilles først, når projektet viser tegn på det:
- `package.json`/filer nævner `@supabase/supabase-js`, `prisma`, `stripe`, `vercel.json`, `.env.example` osv. → kittet siger det, læser `references/virkelige-verden.md` og guider.
- En vagt-regel kan nægte at bygge betaling, login eller persondata, før svarene findes. Det er en lås, ikke en tekstregel.

Hvilke tegn der opdages, skal være en lille, fast liste, der kan udvides (en datafil), ikke gætværk.

### 3. Hold regelfilen kort, lad hooks bære resten
- Regelfilen får et fast loft (fx 45 linjer, som i dette projekts egen regel) og en test, der fejler, hvis den bliver længere.
- `start.js` (hook ved chattens start) leverer det, der skifter: status, fejlliste og modelanbefaling for den opgave, der står øverst i status.

### 4. Loop-stop som lås
En ny hook tæller fejl i den aktuelle chat. Samme fejltekst (normaliseret, uden tal og stier) to gange i træk, og næste handling bliver stoppet med besked: "Samme fejl to gange. Skriv, hvad du har prøvet, og find årsagen, før du prøver igen." Efter tredje gang: skriv i `docs/gentagne-fejl.md` og foreslå en ny chat.
**Usikkert, skal slås op i den officielle dokumentation:** hvilke hook-hændelser Claude Code og Codex hver især giver (fx efter en mislykket kommando), og hvad en hook kan se af fejlteksten. Findes de ikke i begge, kan låsen kun laves i det ene værktøj, og det andet får en tekstregel. Det skal siges ærligt.

### 5. Modelanbefaling og arbejdsdeling
- Ved chattens start (via `start.js`) siger kittet: "Næste opgave er X; den passer til [lille/mellem/stærk] model fordi …". Anbefalingen kommer fra en lille tabel i `.startkit/` (opgavetype → modelstørrelse), ikke fra faste modelnavne, som ændrer sig.
- Arbejdsdelingen "billig model udfører, stærk model gennemgår" er en vane og en anbefaling i overblikket. Kan hooks ikke styre modelvalg (forsøget i november blev ikke kaldt i skrivebordsappen, se `docs/modelvalg-som-laas.md`), så skal vi være ærlige: det er en anbefaling, ikke en lås.
- Hvad der kan automatiseres med underagenter i Claude Code (en gennemgangs-agent på en stærk model) skal undersøges i dokumentationen først.

### 6. Overblik som ordentligt UI
- En struktureret datafil, `.startkit/overblik.json`, med: *nu*, *venter*, *senere*, *to-do* (med status), *anbefalet model pr. opgave*, *sidst bevist*. AI'en opdaterer den via et lille script (så formatet ikke går i stykker), og `STATUS.md` bliver stadig til tekst.
- Siden tegner kort/kolonner (nu / venter / senere), en afkrydsbar to-do og et tydeligt "næste skridt" øverst. Stadig kun lokal (127.0.0.1), ingen internet, kun målte fakta.
- Skal prøves i en browser og ses med skærmbillede, før den kaldes færdig. Det er ikke afprøvet endnu.

### 7. Sprogregel (gælder alt, hvad kittet skriver)
- Hver besked fra kittet og fra vagten siger: **hvad der sker, hvorfor, og hvad personen skal gøre** (eller "ingenting"). Fagord forklares første gang ("Supabase er stedet, hvor din apps data gemmes").
- Kommandoer vises ikke som første ting. AI'en siger først i ord, hvad den vil gøre, og tilbyder at gøre det selv. Kommandoen kan stå bagefter til de nysgerrige.
- En test kan hjælpe: alle tekster i `tekster.js` tjekkes for fagord uden forklaring og for beskeder, der kun er en kommando. Det er en støtte, ikke et bevis for, at sproget er forståeligt; det skal prøves på folk.

### 7b. Hvad ejeren så i testen (17. nov.)
Efter interviewet byggede kittet fundamentet op i baggrunden, og der kom mange PowerShell-kommandoer og beskeder, som for en almindelig person var volapyk. Det blev til mange stop, pauser og "fortsæt", og folk trykkede Tab/Enter uden at vide, hvad de godkendte. **Årsagen er ikke fundet.** Jeg har ikke læst testchatten. Det kan være, at (a) der kom for meget information, som ingen forstod, eller (b) nogle af stoppene var rigtige stop (hooks skal godkendes, vagten stopper noget), men var ikke til at kende fra støjen. Det skal afgøres ud fra selve chatten, før der rettes.

Forslag til en fast regel for al kittets tale, uanset årsag. Hver handling hører til én af tre slags:
1. **Stille:** almindeligt, ufarligt arbejde (oprette filer i projektet, læse, køre test). Gøres uden at spørge. Én linje i almindeligt sprog i chatten om, hvad der er sket, og detaljerne (kommandoerne) skrives i en logfil til de nysgerrige.
2. **Sig det, og gør det:** ændringer, der kan fortrydes (installere et værktøj, rette en fil). Én sætning om hvad og hvorfor, og så et enkelt ja/nej.
3. **Rigtigt stop:** ting, der ikke kan fortrydes, eller som kun personen selv kan (godkende hooks, oprette konto, lægge en nøgle ind, betaling). Markeres tydeligt som "Her skal du gøre noget", med trin for trin og uden kode, hvis det kan undgås.

Så ved personen, at et stop betyder noget, fordi almindeligt arbejde ikke stopper. Er det nødvendigt at vise en kommando, står den efter forklaringen, aldrig først.

**Opdatering 17. nov.:** testsessionerne er slettet af testeren og kan ikke læses. Det, vi har, er ejerens og testerens beskrivelse: der kom mange tekniske ord og koder, som man ikke forstår, og ejeren siger, at han selv ignorerer dem og følger anbefalingerne. Årsagen kan altså ikke måles på selve chatten; det er en brugerbeskrivelse. Næste test bør gemme rapporter med `docs/test-rapport-opskrift.md`, før sessioner slettes.

### 7c. Arbejdsblokke: "alt det næste er bare mig, der bygger"
Ejerens idé: når AI'en går i gang med et stykke arbejde, siger den det først, så alt, der popper op bagefter, kan forstås som en del af arbejdet og ikke som støj.
- **Start af blok (kort, ét sted, almindeligt sprog):** "Nu bygger jeg [hjemmesiden]. Det tager et stykke tid. Du får en del spørgsmål om tilladelse (fx at jeg må skrive filer eller åbne en mappe). De hører alle til det her, og du behøver ikke forstå dem; det er bare mig, der bygger. Har jeg brug for noget fra dig, spørger jeg tydeligt og for sig selv. Jeg siger klart til, når jeg er færdig."
- **Under blokken:** ingen forklaring af hver enkelt handling. Kun en kort linje, hvis noget uventet sker, og et tydeligt "Her skal du svare på noget" ved de rigtige spørgsmål (se tre slags handlinger i 7b).
- **Slut på blok:** en klar besked: "Nu er jeg færdig med [hjemmesiden]. Det er lavet, det er afprøvet, det er ikke afprøvet, og det her skal du se på."
- **Hvis der kommer noget, der ikke hører til blokken** (en ny slags tilladelse, noget farligt): AI'en bryder ud og siger det klart, så "bare godkend" ikke gælder blindt.
- **Ærlig risiko:** "tryk bare godkend" er farligt, hvis personen lærer at trykke blindt på alt. Tilladelserne kommer fra værktøjet (Codex/Claude Code), ikke fra kittet, og AI'en kan ikke selv fjerne dem. Derfor: (1) vagten stopper stadig det, der er farligt, og forklarer det i almindeligt sprog; (2) rigtige stop markeres tydeligt og adskilt; (3) AI'en skal sige, at "bare godkend" kun gælder det, den lige har forklaret.
- **Færre tilladelser (ikke undersøgt):** kittet kan måske, med ejerens ja, foreslå en tilladelsesliste for de ufarlige kommandoer i projektet (læse, køre test), så der popper færre op. Det er en ændring af indstillinger, så det kræver et ja, og det skal slås op i dokumentationen, hvordan det virker i Codex og Claude Code.
- **Test:** kan ikke bevises i en testfil, om en besked er forståelig. Prøves på folk, og mængden af beskeder pr. blok kan tælles.

### 7d. Eksempel fra ejerens eget projekt (skærmbillede, 17. nov.)
Et rigtigt eksempel på støj, set i ejerens garderobeprojekt (hans egen opsætning, ikke kittets standardtekst). To ting i samme billede:
1. **Chatbeskeden:** "main er pushet efter 132 grønne pakker, men produktionen kører acfe97f, og 23 nyere commits venter stadig på udrulning … ingen ændringer i databasen (supabase/) … ingen migration mangler i drift." Ejeren forstår den; en nybegynder forstår hvert andet ord ikke (main, pushet, pakker, produktion, commit, udrulning, migration, supabase). Det skræmmer.
2. **Tilladelsesboksen:** "Allow Claude to run this command?" med en lang kommando (`cd … && git diff --stat … | cut … ; echo …; git log …`). Over den en besked fra vagten: "Kommandoen rører en kontrol (vagt, port, indstilling, pakkefil, bevis eller en eksisterende test). Det kræver [ejerens navn]s ok." Den fortæller ikke, hvad kommandoen gør, og hvorfor den bliver spurgt om.

Hvad vi kan se, og hvad vi ikke ved:
- Kommandoen ser ud til kun at **læse** (`git diff`, `git log`), men vagten stopper den og kalder den en "kontrol". Det kan være, fordi `package.json` står i kommandoen. **Det er en antagelse.** Vagtteksten i billedet er ikke kittets standardtekst (kittets står i `tekster.js` og lyder anderledes; kittet har også en undtagelse for kommandoer, der kun læser, `kunLaesning` i `regler.js`). Ejerens projekt har sin egen vagt, som jeg ikke har set. Jeg ved derfor ikke, om fejlen også findes i kittet.
- Vagtteksten er selv fyldt med fagord (kontrol, port, pakkefil, bevis) og nævner personen ved navn, som ikke hører hjemme i en tekst, der skal kunne deles.

Det, kittet bør gøre i stedet (eksempel):
- Beskeden i chatten: "Jeg tjekker lige, hvad der er nyt, siden hjemmesiden sidst blev lagt ud på nettet. Det er kun at læse; der ændres ingenting." Teknikken (23 commits, supabase/) står i en detalje-fil, ikke i svaret, medmindre personen spørger.
- Tilladelsesboksen kan kittet ikke ændre (den er værktøjets), men kittet kan skrive én almindelig sætning lige før: "Nu beder værktøjet om lov til at se, hvad der er ændret. Det er sikkert at tillade."
- Er en læsekommando alligevel stoppet af vagten, er det en fejl i vagten, ikke et rigtigt stop. Vagten bør kun stoppe det, der ændrer noget farligt. En test: kør kendte, ufarlige læsekommandoer (`git diff`, `git log`, `git status`) mod vagten med forskellige filnavne i, og kræv, at ingen stoppes.
- Vagtens beskeder skrives uden fagord, og uden navne på personer.

### 8. Gør det selv i stedet for at blokere
- Skal der køres noget i terminalen, så er standarden: AI'en spørger, forklarer og kører det selv efter et ja.
- Vagten må kun stoppe det, der er farligt eller ikke kan fortrydes (nøgler, sletning, upload, ændring af sikkerhedsindstillinger). Den må ikke stoppe almindeligt arbejde. I dag stopper den fx `node tools/hooks-lokalt.js`, og AI'en måtte bede ejeren køre det. Det bør gennemgås: hvad skal stadig være ejerens, og hvad kan AI'en gøre efter et ja?
- Når vagten stopper noget, skal beskeden sige i almindeligt sprog, hvorfor, og hvad der er den sikre vej.
- Ærlig grænse: hooks godkendes af personen selv i værktøjet, konti og nøgler oprettes af personen, og betalinger gør AI'en aldrig. Det forklares enkelt, og AI'en guider trin for trin.

### 9. Tænd det kun i det projekt, man vælger
- Kittet virker kun i mapper, hvor det er tændt (`.startkit/` findes). Ingen global virkning.
- Én fast sætning at huske: i et nyt projekt skriver man `$startkit` (Codex) eller `/startkit` (Claude). Afsnittet "Nyt projekt" i `SKILL.md` bruges til at hente det personlige fra et tidligere projekt.

### 10. Kontrolpanel
Overblikket udvides til et kontrolpanel på ejerens egen computer (kun 127.0.0.1):
- **Opgaver:** nu / venter / senere og en to-do (se punkt 6).
- **Sessioner:** hvilke chats er åbne, og hvad laver de. **Ikke undersøgt:** om der findes en pålidelig kilde i Codex og Claude Code. Kan kittet ikke se sessionerne selv, kan hver chat skrive sin egen linje i en fælles fil via start-hooken ("jeg er i gang med …"), og panelet viser dem.
- **Tests live:** panelet viser, når `bevis.js` kører, og resultatet bagefter. Live-visning kræver, at testkørslen skriver løbende til en fil. Skal laves.
- **Forbrug og tokens tilbage:** i dag gemmer ejeren selv tal med `forbrug-gem.js`. **Ikke undersøgt:** om værktøjerne giver tallene til scripts. Kan de ikke det, vises de tal, personen har gemt, med datoen, og siden siger tydeligt, at det ikke er live.
- Alt vises som kort og farver, ikke som lister. Skal ses i en browser med skærmbillede, før det kaldes færdigt.

### 11. Overtagelse af en anden AI
- Én overleveringsfil, `.startkit/overtag.md`, opdateres automatisk ved hvert gemmepunkt og ved chattens slutning: hvad er målet, hvad er gjort (med bevis), hvad er i gang, hvad er næste skridt, hvilke beslutninger er taget og hvorfor, hvilke fejl må ikke ske igen, og hvilke filer der er rørt.
- Er skrevet, så en anden AI kun skal læse den ene fil. Samme indhold for Codex og Claude.
- Test: en ny chat uden forhistorie får kun den fil og skal kunne sige, hvad næste skridt er.

### 12. Forbrugsvurdering og opdeling
- Ved opgavens start skriver AI'en en grov vurdering: lille, mellem eller stor, ud fra antal filer og trin, og sammenligner med det forbrug, personen har oplyst.
- Er opgaven stor, deles den i bidder, som hver kan færdiggøres og bevises på sig selv (og gemmes), så en afbrydelse midt i koster så lidt som muligt.
- Ærlig grænse: AI'en kan ikke måle tokens præcist på forhånd. Vurderingen er et skøn, og den skal sige det. Den skal ikke love tal.

### 13. Nem slukning uden tab
Ejerens ønske: man skal nemt kunne slå kittet fra igen i et projekt, uden at filer eller arbejde går tabt, og kunne arbejde videre uden kittet.
- **I dag:** der findes ingen afinstallation. Jeg har søgt i kilden og fundet intet. Hooks (`.codex/hooks.json` eller `.claude/settings.local.json`), `scripts/startkit/`, `.githooks/pre-commit` (tændt med `core.hooksPath`), `.startkit/`, og kittets blok i regelfilen ligger spredt.
- **Forslag:** én kommando, `$startkit sluk` (og et script, `afinstaller.js`, med `--toer` som de andre), som i almindeligt sprog viser, hvad der fjernes, og hvad der bliver. Efter et ja:
  - **Fjernes:** hooks-indgangene, kittets scripts, `core.hooksPath` for nøgletjekket (sættes tilbage til det, det var), kittets blok i regelfilen (kun mellem de to mærker; personens egne linjer røres ikke).
  - **Bliver:** al personens kode og alle filer, `STATUS.md`, `docs/`, git-historikken og gemmepunkterne. `.startkit/` flyttes til `.startkit-gemt/`, så intet slettes, og kittet kan tændes igen med alt, som det var.
  - Sletter aldrig noget uden et ja, og kun filer, kittet selv har skrevet (kendes fra en liste, som opsætningen gemmer).
- **Sluk også midlertidigt:** en kontakt ("pause"), der gør hooks til ingen ting uden at fjerne dem. Der er allerede en kontakt i `vagt.js` (`"vagt": "kun-registrer"`), som kan bygges videre på.
- **Test (kan laves):** sæt kittet op i en prøvemappe, sluk, og tjek at (1) personens filer og git-historik er uændrede, (2) ingen hook kaldes, (3) `git commit` virker som uden kittet, (4) tænd igen giver det samme som før.
- **Ikke undersøgt:** om værktøjerne selv gemmer noget (fx godkendelser af hooks), som skal ryddes, og hvordan det ser ud i Codex kontra Claude Code. Mac/Linux.

## Mulige veje

**A. Alt på én gang.** Ét stort byggeri. Hurtigst færdigt på papiret, men størst risiko og svært at teste.

**B. Trin for trin (anbefalet).** Rækkefølge efter nytte pr. arbejde:
1. Autopilot-forløbet, sprogreglen og "gør det selv i stedet for at blokere" + tegnene på Supabase/Vercel (løser "for bøvlet" og "skræmmende").
2. Loop-stop som lås (løser "kører i loop"). Ejeren siger, at det er det vigtigste; det kan tages først, hvis det ønskes.
3. Overtagelsesfilen og forbrugsvurderingen (løser "løber tør midt i").
4. Modelanbefaling ved chattens start.
5. Kontrolpanel som UI.
6. Gennemgang af eksisterende projekter (placering af nøgler).
7. Nem slukning uden tab (punkt 13). Kan med fordel komme tidligt (efter trin 1), så ingen er bange for at tænde kittet.
Hvert trin er sin egen chat, med test på dansk og engelsk og ændringslog.

**C. Kun overblikket først,** fordi det er det, ejeren ser. Men det løser ikke opsætningen.

Anbefaling: **B**, og trin 1 først.

## Hvad der ikke er undersøgt
- Hvilke hook-hændelser Claude Code og Codex giver, og om samme hooks virker i begge (påvirker loop-stop og modelanbefaling).
- Om kittet kan køre installationer af Node/git/Superpowers selv på alle systemer. Windows er kendt; Mac og Linux er ikke undersøgt.
- Hvordan Superpowers installeres fra en kommando i Codex og i Claude Code (i dag guides det kun i et menu-flow).
- Om autopilot uden interview giver dårligere regler. Det kan kun ses ved at prøve det på nye folk.
- Hvor meget det koster i tokens, før og efter.

## Beslutning, der skal tages
1. Vej A, B eller C?
2. Må interviewet blive et tilvalg, og må de fem sikkerhedsspørgsmål flyttes til "når det betyder noget"?
3. Skal loop-stop være en hård lås (stopper handlingen) eller en påmindelse, der kun skriver en besked?
