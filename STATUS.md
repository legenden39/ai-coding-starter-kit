# Status: startkittet selv

<!-- AI'en læser denne fil i starten af hver chat og opdaterer den til sidst. Hold den kort (højst ca. 40 linjer). Flyt gamle ting til docs/historik.md. -->

## Nu
- Seneste udgivelse: 0.9.0-beta (modelvalg-reglen, nøglescan-rettelsen, README-rettelsen). Flettet med pull request 23 og 24; tagget `v0.9.0-beta` og en GitHub-udgivelse findes (oprettet af sig selv ved fletningen).
- Kittets hooks på kittet selv (valg c, pull request 25): se nedenfor. Ikke udgivet i en ny version endnu.

## Sidst lavet (26. nov. 2026)
- Forbedringerne bygges i træk på grenen `claude/plan-fra-andet-projekt` (ejerens valg: ét samlet ja; push først til sidst). Ejerens svar: tests i to niveauer; regler + spørgsmål i færdig-tjekket; lås-tjek + hænger-sammen-liste (uden "sidst udløst"); alle tre dele af forbedring 4. **1 færdig:** fuld test én gang om ugen (`bevis.js`, test `fuldtest`).
- Ny gren `claude/fundament-som-standard` fra `main` (lokal, ikke pushet): fundament-sporet (16. nov.) er committet, og grenen med loop-stop (`claude/modest-cannon-81wyft`) er flettet oven på. Koden flettede uden konflikter; kun ændringslogge og denne fil skulle samles i hånden. Mål: en udgivelse, hvor folk installerer hurtigt og får fundamentet med det samme uden det lange interview.
- Hurtig start (to linjer i Claude Code + `/startkit`) øverst i "Kom i gang" i begge README'er. Prøve-vejledning til ejeren: `docs/afproevning-fundament.md`. Grenen er pushet efter ejerens ja (ingen pull request). Derefter: README gjort kort og visuel på begge sprog (tegning, tabel, tre trin; resten foldet sammen); `tests/claude.test.js` leder nu efter den sammenfoldede overskrift. Næste: ejeren kommenterer README på GitHub, derefter pull request til `main`. Tjekket før push: nøglescan (`--scan`) og testen `rent`. Ikke tjekket: hurtig start på Windows og Mac.

## Før det (19. nov. 2026)
- Gennemgang af loop-stop (commit `11c12bb`) med Opus 5.5. Hook-opsætningen passer til den officielle dokumentation (`PostToolUseFailure`, matcher `Bash|PowerShell`, felterne `error` og `is_interrupt`; kun læst, ikke afprøvet i en chat). Højst ét stop pr. fejl: ja. Rettet: (1) uddraget kunne indeholde adgangskoder (`https://bruger:kode@...`, `password=...`), nu skjult, og tællerens fil laves kun læselig for ejeren; (2) en Windows-sti i `rens()` slugte teksten frem til en senere `/`, så to forskellige fejl kunne tælle som én. Nye tests på dansk og engelsk. `node tools/byg.js --tjek` og `node tests/run.js` er grønne. Grenen `claude/modest-cannon-81wyft` ligger på GitHub (den er altså pushet).

## Før det (17. nov. 2026)
- Trin 1 (loop-stop) hentet fra sikkerhedskopien `backup/overdragelse/startkit-en-kommando-trin-1-4eb51f-2` og lagt som ucommittede filer her. Rettet to ting: `rens()` i `loopstop.js` tog stier med mellemrum (`D:/andet sted/...`) forkert, og et testeksempel i `tests/loopstop.test.js` ramte testen `rent` (`C:\\Users`, `/home/`). `node tools/byg.js --tjek` og `node tests/run.js` er grønne. IKKE gjort: gennemgang af vagtens regler af en stærk model, afprøvning i en rigtig chat. Mangler ejerens ja til commit.

## Før det (16. nov. 2026)
- Kittet bygger nu kun fundamentet (ejerens valg A). Faserne er 1, 2, 2b, 3 (lille interview, seks spørgsmål), 4 (fundament), 5 (prøv sikkerhedsnettet), 6 (afslutning); kort/fuld vej er væk. Det grundige interview, kortlægning, undersøgelse og skræddersyet lag ligger i `startkit/references/projekt-trin.md` (og `en/references/project-steps.md`) som valgfrit trin bagefter. `kort-vej.md` er omdøbt til `lille-interview.md`. Intro, forløbsskabelon, README, undervisningsfiler, tekster, tests og ændringslog er rettet på begge sprog. `node tools/byg.js --tjek` og `node tests/run.js` er grønne. IKKE afprøvet: det nye forløb i en rigtig chat. Ikke committet.

## Før det (15. nov. 2026)
- Ejeren valgte (c): gemmepunkter og færdig-tjek på dette repo, vagten kun i registrér-tilstand. Undervejs viste det sig, at gemmepunkter og færdig-tjek kræver vagten (den tager gemmepunktet og husker chattens start), så (c) som skrevet var ikke mulig uden en kontakt. Ny kontakt i `vagt.js` (`.startkit/config.json`: `"vagt": "kun-registrer"`), test på dansk og engelsk værdi, script `tools/hooks-lokalt.js`, `docs/hooks-paa-kittet-selv.md`, ændringslog på begge sprog. `node tools/byg.js --tjek` og `node tests/run.js` er grønne, og vagt og færdig-tjek er prøvet manuelt på Windows. IKKE afprøvet: at skrivebordsappen faktisk kalder hooks her (puls og gemmepunkt skal ses i en ny chat), og Mac/Linux.
- Udgivelsen 0.9.0-beta: `startkit/VERSION`, plugin-kopierne, README-banneret og begge ændringslogge er sat til 0.9.0-beta. `node tools/byg.js --tjek` og `node tests/run.js` er grønne, og nøglescannet (`--scan`) er kørt. Sessioner ryddet op: de tre flettede og to overflødige er arkiveret.

## Før det (13. nov. 2026)
- Ny regel i kittets regelfil på begge sprog: AI'en siger ved hver ny opgave, hvilken model den kræver (mindste, mellem eller stærkeste, som i vidensnotatets afsnit 5), følger ejerens modelguide og siger fra ved en for svag. Test og ændringslog på begge sprog.
- Projektet har fået sin egen `CLAUDE.md`, `STATUS.md` og `docs/gentagne-fejl.md`, skrevet i hånden efter kittets skabeloner.
- Prøvet en hook ved modelskift i skrivebordsappen: den blev ikke kaldt. Årsagen er ikke fundet. Ejeren har droppet den indtil videre, og forsøgsscriptet er slettet. Se `docs/modelvalg-som-laas.md`.
- README-afsnittet "Hvem står bag" er gjort mere præcist på begge sprog (flettet ind i `main` med pull request 20).
- Nøglescannet, der "hang" i over to minutter: årsagen er fundet og rettet i `startkit/assets/pre-commit` (flettet ind i `main` med pull request 22). Det hang ikke; det startede `grep` ca. 14 gange pr. fil, og hver start koster ca. 50-70 ms på Windows. Nu forsorteres filerne med få kald. Målt her: 2 min. 24 sek. → ca. 1 sek. Ny test `tests/noeglescan.test.js` tæller programstarter. Afprøvet på Windows og Linux (GitHubs tests), ikke på Mac.
- Gennemgang af grenen: lagt oven på 0.8.0-beta (ændringsloggen har fået et nyt "Ikke udgivet endnu"), og testen `rent` springer nu også `.git` over, når den er en fil, så den er grøn i en worktree.

## Næste skridt
- Prøv hele forløbet i en rigtig chat i et testprojekt (`docs/afproevning-fundament.md`).
- Forbedringer fra ejerens andet projekt (gennemgået 26. nov.; kun idéerne, intet om projektet). Ejeren har valgt alle fire; én opgave pr. chat, i denne rækkefølge:
  1. Kun relevante tests ved en ændring; fuld test én gang om ugen (markør for seneste grønne fulde kørsel). Opus.
  2. Ét samlet ja (saml spørgsmål, vis plan, ét ja dækker hele vejen; stop kun ved fejl eller afvigelse) og ingen stilstand (hver tur slutter med arbejde, der kører, eller ét spørgsmål på en knap øverst). Opus.
  3. Stærkere fejlliste (låsens sti står i listen og tjekkes af en test; "sidst udløst"; spørg om fjernelse efter måneder) og bevis som bruger ("færdig" kræver også, at funktionen er prøvet som bruger). Opus.
  4. Statuslinje med hvor fuld chatten er (skift ved ca. 70 %), forbud mod direkte udrulning og skrivning uden for projektmappen, ugentligt sikkerhedstjek (kun læsning). Opus til forbuddene, Sonnet til resten.
  5. Passer det nye ind i resten? Når noget nyt tilføjes, skal AI'en se på ting af samme slags ("søskende") og sige, hvad de har, som det nye mangler (fx en gennemgang, et menupunkt, en oversættelse, en linje i README). Tre trin: (a) søskende-tjek før "færdig", med forslag, som ejeren siger ja eller nej til; (b) en "hænger sammen"-liste i projektet, som AI'en foreslår nye linjer til, når den ser et mønster; (c) en lås med en test, når det er vigtigt ("alle steder har en gennemgang"). Ejerens valg 26. nov.: alle tre trin. Opus.
- Ejeren sætter version og udgiver. Sprog-sporet (`confident-jones-ecb9ed`) kan komme bagefter.
- `interview.md` (8 runder) og `research.md` bruges nu kun af projekttrinnet; overvej senere, om de skal kortes.
- Hvis ejeren vil have en lås: prøv hook'en igen i en ny chat (almindelig kopi, terminal først, med kontrol-hook).
- Ejeren fletter pull requesten (hooks lokalt) og kører `node tools/hooks-lokalt.js`. Start en ny chat og tjek, at hooks kører: `.startkit/vagt-puls.json` får nyt tidspunkt, og `git for-each-ref refs/startkit` viser et gemmepunkt.

## Åbne problemer
- Loop-stop, små fund fra gennemgangen (ikke rettet): to handlinger på samme tid kan give to stop for én fejl eller en tabt optælling (`loopstop.js`, læs og skriv uden lås); `hvorfor-blev-jeg-stoppet.md` / `why-was-i-stopped.md` forklarer ikke loop-stoppet, selv om beskeden peger dertil; tællerens filer i systemets midlertidige mappe slettes aldrig.
- Nøgletjekket før commit er stadig langsomt i ét tilfælde: en commit med mange filer, hvor der faktisk er en nøgle (så gås alle filerne igennem). Rettelsen er ikke afprøvet på Mac.
- Med vagten i registrér-tilstand kan AI'en ændre hook-filer og kittets scripts uden at blive stoppet; beskyttelsen er ejerens gennemgang af pull requests. Se `docs/hooks-paa-kittet-selv.md`.
- Modelvalg-reglen er en tekstregel og ikke afprøvet i en rigtig chat. Den hviler på, at også en svag model selv siger fra, og AI'en kan ikke altid se et modelskift.
- Hook'en ved modelskift blev ikke kaldt i skrivebordsappen (2.1.321). Uafklaret hvorfor. Forsøgsfilerne `.claude/settings.local.json` og `.claude/modelskift-log.txt` ligger måske stadig i worktree'en `modelvalg-regel-2b98b3` (ikke i git).
