# Status: startkittet selv

<!-- AI'en læser denne fil i starten af hver chat og opdaterer den til sidst. Hold den kort (højst ca. 40 linjer). Flyt gamle ting til docs/historik.md. -->

## Nu
- Seneste udgivelse: 0.9.0-beta (modelvalg-reglen, nøglescan-rettelsen, README-rettelsen). Flettet med pull request 23 og 24; tagget `v0.9.0-beta` og en GitHub-udgivelse findes (oprettet af sig selv ved fletningen).
- Kittets hooks på kittet selv (valg c, pull request 25): se nedenfor. Ikke udgivet i en ny version endnu.

## Sidst lavet (17. nov. 2026)
- Trin 1 (loop-stop) hentet fra sikkerhedskopien `backup/overdragelse/startkit-en-kommando-trin-1-4eb51f-2` og lagt som ucommittede filer her. Rettet to ting: `rens()` i `loopstop.js` tog stier med mellemrum (`D:/andet sted/...`) forkert, og et testeksempel i `tests/loopstop.test.js` ramte testen `rent` (`C:\\Users`, `/home/`). `node tools/byg.js --tjek` og `node tests/run.js` er grønne. IKKE gjort: gennemgang af vagtens regler af en stærk model, afprøvning i en rigtig chat. Mangler ejerens ja til commit.

## Sidst lavet (15. nov. 2026)
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
- Gennemgang af loop-stop (commit `11c12bb`, lokalt, ikke pushet) af Opus 5.5: `vagt.js`, `regler.js`, `loopstop.js`, `fejl.js`. Fable kan ikke længere bruges. Bagefter: ret "i dag Fable" til Opus i `CLAUDE.md`, og spørg ejeren om push.
- Hvis ejeren vil have en lås: prøv hook'en igen i en ny chat (almindelig kopi, terminal først, med kontrol-hook).
- Ejeren fletter pull requesten (hooks lokalt) og kører `node tools/hooks-lokalt.js`. Start en ny chat og tjek, at hooks kører: `.startkit/vagt-puls.json` får nyt tidspunkt, og `git for-each-ref refs/startkit` viser et gemmepunkt.

## Åbne problemer
- Nøgletjekket før commit er stadig langsomt i ét tilfælde: en commit med mange filer, hvor der faktisk er en nøgle (så gås alle filerne igennem). Rettelsen er ikke afprøvet på Mac.
- Med vagten i registrér-tilstand kan AI'en ændre hook-filer og kittets scripts uden at blive stoppet; beskyttelsen er ejerens gennemgang af pull requests. Se `docs/hooks-paa-kittet-selv.md`.
- Modelvalg-reglen er en tekstregel og ikke afprøvet i en rigtig chat. Den hviler på, at også en svag model selv siger fra, og AI'en kan ikke altid se et modelskift.
- Hook'en ved modelskift blev ikke kaldt i skrivebordsappen (2.1.321). Uafklaret hvorfor. Forsøgsfilerne `.claude/settings.local.json` og `.claude/modelskift-log.txt` ligger måske stadig i worktree'en `modelvalg-regel-2b98b3` (ikke i git).
