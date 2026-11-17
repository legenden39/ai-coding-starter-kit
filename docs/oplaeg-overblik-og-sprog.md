# Oplæg: brugeren skal altid vide, hvor de er, hvad der sker, og hvorfor

Status (16. nov. 2026): ejeren valgte "A, så B". A og B er bygget i kilden og låst med testene `overblik` og `sprog`; C venter. Det, der står herunder, er oplægget, som det så ud før valget. Dette er design af kittet, så opgaven kræver en stærk model (i dag Fable). Selve omskrivningen af tekster bagefter kan en billigere model tage.

## Problemet, med ejerens ord
Testbrugere har "allerede mistet overblikket". De trykker tab og enter og tager det anbefalede svar, fordi de ikke ved, hvor langt de er, hvad de er i gang med, eller hvorfor. Ejeren tror, det skyldes tekniske ord, de ikke forstår.

## Hvad jeg fandt (kun læst; intet afprøvet i en rigtig chat)

### 1. Kittet har fire forskellige "hvor er vi"-tal, og de passer ikke sammen
| Hvor | Hvad brugeren ser | Antal |
|---|---|---|
| `intro.md` ("Hvad skal du igennem") | punktliste | 7 trin |
| `SKILL.md` og `forloeb.skabelon.md` (status) | fase 1, 1b, 2, 2b, 3 ... 9, 9b, 9c | 9 faser, men 12 linjer |
| Interviewet (`interview.md`) | "emne X af 8" | 8 emner inde i fase 3 |
| Kort vej | fase 3, 4, 5 skippes med ⏳ | en anden vej gennem de samme faser |

Brugeren hører altså "7 trin", ser "fase 6" og "fase 2b" i statuslisten og hører "emne 3 af 8". Der er ingen enkelt fælles plan, og nummereringen (2b, 9b, 9c) er AI'ens interne ordning, ikke noget, et menneske kan følge. Det er den vigtigste enkeltårsag til, at man mister overblikket.

### 2. "Hvor er vi" siges kun to steder
- Interviewet: "Emne X af 8" ved hver rundes start (`SKILL.md` fase 3, `interview.md` linje 7).
- Genoptagelse: en liste med ✅ ⬜ ➖ (`SKILL.md`, afsnittet Genoptag).
Alle andre faser (maskintjek, nøglescan, opsætning, prøve, overblik, afslutning) har ingen regel om at sige, hvor man er. Grundregel 10 siger "slut med næste skridt", men ikke "sig hvor langt vi er" eller "sig hvorfor". Grundregel 9 siger "sig hvad du ville vælge og hvorfor", men ikke i hvilket format.

### 3. De mest tekniske ord og steder
Optalt i `SKILL.md`, `intro.md`, `kort-vej.md` og statusskabelonen (mest AI-instruks, men meget når brugeren): git 23, nøgle/nøglescan 15, hook 11, commit 11, Node 10, script 9, JSON 5, sti 6, vagt 8, token 7.

De steder, hvor ordene rammer brugeren direkte:
- **Statuslisten** (`forloeb.skabelon.md`, vises ved genoptagelse): "git, navn og e-mail i git, Node, modelliste", "Nøglescan", "hooks godkendt med /hooks", "første commit". Ingen af dem forklarer hvorfor.
- **Fase 2** (maskinen er klar): `git --version`, `node --version`, `git config`, `git init`. Brugeren bliver bedt om at have det i orden, før de ved, hvad det bruges til.
- **Fase 6 og 7** (fundamentet og prøven): "hooks", "vagt", `--no-verify`, `core.hooksPath`, `/hooks`, "betroet mappe". Her kommer også Claude Codes egne dialoger (om man stoler på mappen, og tilladelse til hver kommando), som kittet ikke kan ændre, kun forberede brugeren på.
- **Beskeder fra programmerne** (`startkit/scripts/projekt/tekster.js`), som brugeren ser eller får læst op:
  - `opsaet` (de linjer, der lister, hvad der sættes op): "hooks", "pre-commit", "nøgletjek og længdelås før commit", "scripts", ".gitignore", "config.json", og slutlinjen "tænd nøgletjekket (git config core.hooksPath .githooks) ... godkend hooks med /hooks".
  - `tjek-opsaetning`: "Node er version 18 eller nyere", "core.hooksPath", "{hookfil} kan læses", "gyldig JSON", "Vagten er koblet til og peger på en fil, der findes", "Statusfilen læses automatisk ind".
  - Vagten (`vagt.*`): "git reset --hard", "stash", "git branch -D", "core.hooksPath", "variabel", som AI'en så skal oversætte. Hvis den ikke gør, står der teknik i chatten. Der står ikke noget i kittet om, at den *skal* oversætte.
  - `ov.*` (overbliksiden): "gren", "commits", "gemmepunkt", "hooks'ene".
- **Fase 9:** "første commit", "sikkerhedskopi på GitHub", "feedback-tjek" i samme besked som tre vaner og en startbesked: mange nye ting på én gang til sidst.

### 4. Tab+enter-fælden: giver spørgsmålene nok til at forstå valget?
Kort sagt: nej, der er ingen regel om det.
- Kittet siger kun "læg mulighederne frem, sig hvad du ville vælge, og vælg ikke for personen" (grundregel 9). Det siger intet om, at hvert valg skal sige *hvad det betyder*, og *hvad der sker, hvis man vælger det andet*.
- Kittet siger ikke noget om selve spørgsmålsformatet. Stiller AI'en spørgsmål som en knapliste med et "anbefalet" øverst (det gør Claude Code), er det første svar det, man rammer med tab+enter. Der er ingen regel om, at en anbefaling kun må stå der med en begrundelse på én linje.
- Værst er de valg, hvor det anbefalede svar ikke er ufarligt at tage blindt: "godkend hooks", "stol på mappen", "tænd nøgletjekket" (fase 6), og "ja til sikkerhedskopi på GitHub" (fase 9). Dér bør AI'en altid sige først, hvad det er, og hvad man siger ja til, i almindelige ord.
- Hvad kittet ikke kan: Claude Codes egne tilladelses- og tillidsdialoger kan ikke ændres. Kittet kan kun sige til forhånd, "nu kommer Claude Code og spørger X; det betyder Y".

## Mulighederne

### A. En fast "hvor er vi"-ramme og en valgregel (anbefalet som første trin)
Hvad: Én fælles plan med få, almindelige navne (fx 6 trin: "Gør computeren klar", "Lær dig at kende", "Find det rigtige til dig", "Sæt sikkerhedsnettet op", "Prøv det af", "Afslut og gem"), som afløser både faserne, de 7 trin og 2b/9b/9c i alt, hvad brugeren ser. Fasenumrene kan blive i filerne som AI'ens interne mærkater.
- Hver besked, der begynder eller afslutter et trin, har tre korte linjer: **Hvor er vi** (trin 3 af 6, og hvad der er gjort), **Hvad sker der nu**, **Hvorfor**. Ikke i hver eneste lille besked: kun ved trinskift og efter længere pauser, ellers bliver det støj.
- **Valgregel (D):** hvert spørgsmål med et valg har to linjer før svarene: hvad valget betyder, og hvad der sker ved det andet. En anbefaling skal have én sætnings begrundelse, og må ikke stå øverst, hvis valget er svært at fortryde (hooks, tillid til mappen, noget på nettet).
- **Status (C):** `forloeb.skabelon.md` får samme plan og én linje "Lige nu: ... Næste: ...", som AI'en opdaterer efter hvert trin og viser ved genoptagelse.
Rører: `SKILL.md`, `claude/SKILL.claude.md`, `en/SKILL.en.md` (som genereres/vedligeholdes parallelt), `intro.md`, `kort-vej.md`, `interview.md` (emne X af 8 bliver "trin 2 af 6, spørgsmål-runde 3 af 8"), `forloeb.skabelon.md` og engelsk `short-path.md` og tilsvarende. Plugin- og claude-kopierne genereres: ret kilden, kør `node tools/byg.js`. Dansk og engelsk skal laves begge steder.
Kan låses med test: *delvist*. En test kan tjekke, at planen står ens i SKILL, intro og statusskabelonen (samme trin, samme rækkefølge, samme tal), at "hvor er vi"/"hvorfor"-reglen og valgreglen står i alle tre SKILL-filer, og at der er en engelsk modstykke. Det fanger, at tallene driver fra hinanden. En test kan IKKE afgøre, om AI'en faktisk skriver linjerne i en rigtig chat.
Ikke afprøvet uden en rigtig chat: om AI'en følger reglen hver gang, og om den bliver for fyldig. Det er tekstregler.
Omfang: mellem. Cirka 8-10 filer plus tests, dansk og engelsk.

### B. Sprog-lås: ordliste, omskrivning af programmernes tekster og en test
Hvad: Kittet får en kort ordliste (`startkit/references/sprog.md`): de ord, brugeren *ikke* må møde uden forklaring (hook, vagt, commit, git, nøgle-scan, JSON, script, sti, token, gren, worktree, `core.hooksPath` ...), med en almindelig erstatning ("gemme en version" for commit, "sikkerhedsvagt" i stedet for hook). SKILL's grundregel 1 ("forklar et fagord første gang") udvides: "brug erstatningen, og forklar kun fagordet, hvis brugeren selv skal bruge det". Teksterne i `tekster.js` og `intro.md`/statusskabelonen omskrives, så de brugerrettede linjer (opsætning, tjek-opsætning, status, overblik) ikke bruger ordene; teknikken flyttes til en parentes.
- Vigtigt skel: nogle tekster er til AI'en (`vagt.*`) og nogle til brugeren (`ops.*`, `tj.*`, `ov.*`). Kun de sidste omskrives; for `vagt.*` skal reglen i stedet være "oversæt til almindeligt sprog, før du siger det til brugeren" (kan ikke låses).
Rører: `tekster.js` (dansk og engelsk værdi side om side), intro, statusskabelon, `opsaet`/`tjek-opsaetning`-tests, der i dag kigger efter bestemte ord, og `overblik.js`.
Kan låses med test: *ja, godt*. En test går alle brugerrettede strenge i `TEKSTER.da` og `TEKSTER.en` plus intro og statusskabelon igennem og fejler, hvis et forbudt ord står uden for en tilladt liste (fx i en parentes). Projektet foretrækker lås frem for tekstregel, så det er det stærkeste her. Risiko: flere eksisterende tests tjekker for ord i teksterne og skal rettes med; falske alarmer kræver en tilladelsesliste.
Hjælper ikke alene på tab+enter-problemet og på "hvor er jeg": det er stadig mulighed A's job.
Ikke afprøvet uden en rigtig chat: om brugeren *forstår* de nye ord. Det kan kun testes ved at lade en ny bruger prøve.
Omfang: stort pga. mange strenge og tests, men det meste er mekanisk og kan gøres med en billigere model efter en stærk model har lavet ordlisten.

### C. Kittet viser selv "hvor er vi" i stedet for, at AI'en husker det
Hvad: Et lille program (`startkit/scripts/projekt/hvor.js`) læser `.startkit/status.md` og skriver tre faste linjer: trin x af y, hvad der er gjort, hvad der kommer nu og hvorfor. AI'en kører det ved hvert trinskift og klistrer resultatet ind. Samme program kan ligge bag overbliksiden og kaldes ved genoptagelse.
Fordel: teksten er den samme hver gang og kan testes helt (inddata: statusfil, uddata: præcis tekst, dansk og engelsk). Det er den eneste mulighed, hvor "hvor er vi"-linjen er en lås og ikke en tekstregel.
Ulempe: AI'en skal stadig huske at køre det, og det koster en ekstra kommando og tilladelse ved hvert trinskift (flere tilladelsesdialoger, som brugeren tab+enter'er; muligvis værre). Brugeren ser en ekstra kommando i stedet for en pæn besked. Kræver også, at statusfilens format er fast, og så lander vi alligevel på planen fra A.
Kan låses med test: *ja, helt*, men kun selve programmets uddata.
Omfang: mellem; bygger oven på A.

## Anbefaling
**A først, derefter B i en ny runde. C venter.**
Begrundelse: Mest af problemet er, at der slet ikke er en fælles, forståelig plan (fire forskellige tal), og at spørgsmål mangler en forklaring. Det løser A direkte og billigt, og A er forudsætningen for B (ordlisten skal vide, hvilke trin og tekster der findes). B er den stærkeste lås, men er en stor omskrivning, og den skal først laves, når planens ord er på plads, så de ikke skal laves to gange. C giver kun en fast tekst og tilføjer en ekstra kommando for hvert trin; det er værd at overveje, hvis A viser sig ikke at holde i testchats.

Tre ting, jeg ikke kan love:
1. At AI'en altid følger A's regler i en rigtig chat. De er tekstregler. Den eneste rigtige lås, jeg kender, er at lade en Stop-hook kontrollere sidste besked; om Claude Code og Codex giver hooken selve beskeden, er ikke slået op, så det er ikke nævnt som en mulighed her, før det er læst i den officielle dokumentation.
2. At Claude Codes egne tillids- og tilladelsesdialoger bliver forståelige; de kan kittet kun forberede brugeren på.
3. At det hjælper testbrugerne, før en ny testbruger har prøvet det. Foreslå derfor en kort test med 1-2 nye brugere efter A.

## Det, ejeren skal vælge
1. A først, så B (anbefalet)?
2. Kun A?
3. Kun B (hvis ejeren hellere vil have låsen først)?
4. C i stedet?
Sig også, om planen skal have 6 trin (mit forslag) eller færre/flere, og om navnene ("Gør computeren klar" osv.) skal være dine egne.

## Spørgsmål til dig, som ændrer valget
- Er det "alle beskeder" eller "ved hvert trinskift", du vil have hvor-er-vi-linjerne i? Alle beskeder giver mere støj; trinskift giver færre, men kan lade nogen stadig fare vild midt i et langt trin (fx interviewet).
- Må kittet kalde den korte vej "den hurtige vej" eller lignende, så alt bliver almindeligt dansk, eller skal navnene blive?
