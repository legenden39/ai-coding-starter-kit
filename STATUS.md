# Status: startkittet selv

<!-- AI'en læser denne fil i starten af hver chat og opdaterer den til sidst. Hold den kort (højst ca. 40 linjer). Flyt gamle ting til docs/historik.md. -->

## Nu
- Seneste udgivelse: 0.8.0-beta (forklar-vane, README-ærlighed, Node 24). Ikke udgivet endnu: modelvalg-reglen og README-rettelsen (begge i `main`, står under "Ikke udgivet endnu" i ændringsloggen).

## Sidst lavet (13. nov. 2026)
- Ny regel i kittets regelfil på begge sprog: AI'en siger ved hver ny opgave, hvilken model den kræver (mindste, mellem eller stærkeste, som i vidensnotatets afsnit 5), følger ejerens modelguide og siger fra ved en for svag. Test og ændringslog på begge sprog.
- Projektet har fået sin egen `CLAUDE.md`, `STATUS.md` og `docs/gentagne-fejl.md`, skrevet i hånden efter kittets skabeloner.
- Prøvet en hook ved modelskift i skrivebordsappen: den blev ikke kaldt. Årsagen er ikke fundet. Ejeren har droppet den indtil videre, og forsøgsscriptet er slettet. Se `docs/modelvalg-som-laas.md`.
- README-afsnittet "Hvem står bag" er gjort mere præcist på begge sprog (flettet ind i `main` med pull request 20).
- Nøglescannet, der "hang" i over to minutter: årsagen er fundet og rettet i `startkit/assets/pre-commit` (flettet ind i `main` med pull request 22). Det hang ikke; det startede `grep` ca. 14 gange pr. fil, og hver start koster ca. 50-70 ms på Windows. Nu forsorteres filerne med få kald. Målt her: 2 min. 24 sek. → ca. 1 sek. Ny test `tests/noeglescan.test.js` tæller programstarter. Afprøvet på Windows og Linux (GitHubs tests), ikke på Mac.
- Gennemgang af grenen: lagt oven på 0.8.0-beta (ændringsloggen har fået et nyt "Ikke udgivet endnu"), og testen `rent` springer nu også `.git` over, når den er en fil, så den er grøn i en worktree.

## Næste skridt
- Ejeren beslutter, hvornår modelvalg-reglen udgives (nyt versionsnummer i `startkit/VERSION`).
- Hvis ejeren vil have en lås: prøv hook'en igen i en ny chat (almindelig kopi, terminal først, med kontrol-hook).
- Ejeren beslutter: skal kittets rigtige opsætning (vagt, færdig-tjek, gemmepunkter) køres på dette repo?

## Åbne problemer
- Nøgletjekket før commit er stadig langsomt i ét tilfælde: en commit med mange filer, hvor der faktisk er en nøgle (så gås alle filerne igennem). Rettelsen er ikke afprøvet på Mac.
- Projektet bruger kun kittets regler som tekst. Kittets hooks er ikke sat op her, fordi opsætningen ville lægge en kopi af `startkit/scripts/projekt/` i `scripts/startkit/` (to udgaver af samme kode i samme repo), og fordi vagten kan stoppe arbejdet med vagtens egne filer. Det kræver et designvalg.
- Modelvalg-reglen er en tekstregel og ikke afprøvet i en rigtig chat. Den hviler på, at også en svag model selv siger fra, og AI'en kan ikke altid se et modelskift.
- Hook'en ved modelskift blev ikke kaldt i skrivebordsappen (2.1.321). Uafklaret hvorfor. Forsøgsfilerne `.claude/settings.local.json` og `.claude/modelskift-log.txt` ligger måske stadig i worktree'en `modelvalg-regel-2b98b3` (ikke i git).
