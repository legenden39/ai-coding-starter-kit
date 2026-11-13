# Status: startkittet selv

<!-- AI'en læser denne fil i starten af hver chat og opdaterer den til sidst. Hold den kort (højst ca. 40 linjer). Flyt gamle ting til docs/historik.md. -->

## Nu
- Seneste udgivelse: 0.7.0-beta. Ikke udgivet endnu: forklar-vanen (pull request 13, åben) og modelvalg-reglen (egen gren, ikke pushet).

## Sidst lavet (13. nov. 2026)
- Ny regel i kittets regelfil på begge sprog: AI'en siger ved hver ny opgave, om den kræver stærk eller billig model, og siger fra ved en for svag. Test og ændringslog på begge sprog.
- Projektet har fået sin egen `CLAUDE.md`, `STATUS.md` og `docs/gentagne-fejl.md`, skrevet i hånden efter kittets skabeloner.
- Undersøgt, om modelvalget kan blive en lås: se `docs/modelvalg-som-laas.md`.
- Prøvet hook'en ved modelskift (`tools/modelskift.js`, et forsøg uden for kittet) i skrivebordsappen: den blev ikke kaldt ved to skift med `/model`. Årsagen er ikke fundet. Intet er bygget ind i kittet.

## Næste skridt
- Ejeren beslutter: skal grenen pushes og have en pull request?
- Ejeren beslutter: skal hook'en prøves én gang til (almindelig kopi, terminal, med kontrol-hook), eller droppes? Se "Anbefaling" i `docs/modelvalg-som-laas.md`.
- Ejeren beslutter: skal kittets rigtige opsætning (vagt, færdig-tjek, gemmepunkter) køres på dette repo? Se åbne problemer.

## Åbne problemer
- Projektet bruger kun kittets regler som tekst. Kittets hooks er ikke sat op her, fordi opsætningen ville lægge en kopi af `startkit/scripts/projekt/` i `scripts/startkit/` (to udgaver af samme kode i samme repo), og fordi vagten kan stoppe arbejdet med vagtens egne filer. Det kræver et designvalg.
- Modelvalg-reglen er en tekstregel. Den er ikke afprøvet i en rigtig chat, hverken i Claude Code eller Codex.
- Hook'en ved modelskift blev ikke kaldt i skrivebordsappen (2.1.321). Uafklaret: udløser `/model` ikke hændelsen dér, eller blev `.claude/settings.local.json` ikke læst? Forsøgsfilerne `.claude/settings.local.json` og `.claude/modelskift-log.txt` ligger stadig i worktree'en (ikke i git).
- Testen `rent: .git` er rød i en worktree (dér er `.git` en fil med en sti). Den er grøn i en almindelig kopi.
