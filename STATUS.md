# Status: startkittet selv

<!-- AI'en læser denne fil i starten af hver chat og opdaterer den til sidst. Hold den kort (højst ca. 40 linjer). Flyt gamle ting til docs/historik.md. -->

## Nu
- Seneste udgivelse: 0.8.0-beta (forklar-vane, README-ærlighed, Node 24). Ikke udgivet endnu: modelvalg-reglen (lokal gren, ikke pushet, gennemgået 13. nov. 2026).

## Sidst lavet (13. nov. 2026)
- Ny regel i kittets regelfil på begge sprog: AI'en siger ved hver ny opgave, om den kræver stærk eller billig model, og siger fra ved en for svag. Test og ændringslog på begge sprog.
- Projektet har fået sin egen `CLAUDE.md`, `STATUS.md` og `docs/gentagne-fejl.md`, skrevet i hånden efter kittets skabeloner.
- Prøvet en hook ved modelskift (`tools/modelskift.js`, et forsøg uden for kittet) i skrivebordsappen: den blev ikke kaldt. Årsagen er ikke fundet. Se `docs/modelvalg-som-laas.md`.
- Gennemgang af grenen: lagt oven på 0.8.0-beta (ændringsloggen har fået et nyt "Ikke udgivet endnu"), og testen `rent` springer nu også `.git` over, når den er en fil, så den er grøn i en worktree.

## Næste skridt
- Ejeren beslutter: skal grenen pushes og have en pull request?
- Ejeren beslutter: hook'en droppes (anbefalet), eller prøves én gang til i en almindelig kopi med kontrol-hook. Droppes den, skal `tools/modelskift.js` slettes eller blive som forsøg.
- Ejeren beslutter: skal modelvalg-reglen pege på personens egen modelguide og nævne mellemmodellen? Se åbne problemer.
- Ejeren beslutter: tekstforslag til README-afsnittet "Hvem står bag" (givet i chatten 13. nov. 2026, ikke rettet).
- Ejeren beslutter: skal kittets rigtige opsætning (vagt, færdig-tjek, gemmepunkter) køres på dette repo?

## Åbne problemer
- Projektet bruger kun kittets regler som tekst. Kittets hooks er ikke sat op her, fordi opsætningen ville lægge en kopi af `startkit/scripts/projekt/` i `scripts/startkit/` (to udgaver af samme kode i samme repo), og fordi vagten kan stoppe arbejdet med vagtens egne filer. Det kræver et designvalg.
- Modelvalg-reglen er en tekstregel og ikke afprøvet i en rigtig chat. Den hviler på, at også en svag model selv siger fra, og AI'en kan ikke altid se et modelskift.
- Modelvalg-reglen har to trin (stærk/billig), mens vidensnotatets afsnit 5 har tre (mindste, mellem, stærkeste). Almindelig bygning efter en plan står ikke i reglen, og reglen peger ikke på personens egen modelguide.
- Hook'en ved modelskift blev ikke kaldt i skrivebordsappen (2.1.321). Uafklaret hvorfor. Forsøgsfilerne `.claude/settings.local.json` og `.claude/modelskift-log.txt` ligger måske stadig i worktree'en `modelvalg-regel-2b98b3` (ikke i git).
