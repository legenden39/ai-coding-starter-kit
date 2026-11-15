# Kittets hooks på kittet selv

Valgt af ejeren den 15. nov. 2026: gemmepunkter og færdig-tjek på dette repo, men ikke vagtens afvisninger.

## De tre muligheder

| | Hvad den koster | Hvad den ikke dækker |
|---|---|---|
| (a) Kun tekstregler | Intet | Intet håndhæves; alt hviler på, at AI'en følger `CLAUDE.md` |
| (b) Alle hooks, kildefiler undtaget fra vagten | Ny undtagelsesregel i vagten, som selv skal testes; et hul i en sikkerhedsregel | Mest dækning, men størst indgreb |
| **(c) Valgt: gemmepunkter + færdig-tjek, vagten kun i registrér-tilstand** | En lille kontakt i vagten (+ test), et lokalt opsætningsscript | Vagtens afvisninger (farlige kommandoer, nøgler, filer uden for projektet) |

Undervejs viste det sig, at gemmepunkter og færdig-tjek ikke kan køre uden vagten: `vagt.js` tager gemmepunktet og husker, hvordan koden så ud ved chattens start, og færdig-tjekket bruger det. Derfor "kun-registrér": vagten kaldes, men afviser intet.

## Hvordan det virker

- `.startkit/config.json` har `"vagt": "kun-registrer"` (engelsk: `"guard": "record-only"`). Kun den præcise værdi tæller; en ukendt værdi eller en ødelagt fil giver den almindelige, strenge vagt.
- Ingen kopi af kittets scripts: hooks peger direkte på `startkit/scripts/projekt/`. Kun `scripts/startkit/bevis.js` (en omdirigering på én linje) ligger lokalt, fordi færdig-tjekkets besked nævner den sti. Den er holdt uden for git via `.git/info/exclude`.
- Alt ligger lokalt og kommer ikke med i git: `.claude/settings.local.json`, `.startkit/`, omdirigeringen. Det eneste, der ændres i git, er kontakten i `vagt.js`, testen og scriptet `tools/hooks-lokalt.js`.
- Færdig-tjekket kræver et grønt bevis (`node tools/byg.js --tjek` og `node tests/run.js`), når kode er ændret i en chat.

## Sæt op (eller sæt op igen i et nyt checkout)

```bash
node tools/hooks-lokalt.js
```

Start derefter en ny chat. Tjek, at det kører: `.startkit/vagt-puls.json` får nyt tidspunkt, og `git for-each-ref refs/startkit` viser et gemmepunkt. Fortryd-hjælp: `startkit/assets/fortryd.md`.

## Hvad der ikke er dækket (ærligt)

- Med vagten i registrér-tilstand kan AI'en ændre hook-filerne, indstillingerne og kittets scripts uden at blive stoppet. Beskyttelsen er her ejerens gennemgang af pull requests og git-historikken, ikke vagten. Nøgletjekket før commit (`.githooks/pre-commit`) er en separat ting og er uændret.
- Afprøvet: vagtens og færdig-tjekkets scripts køres med rigtige input (testen `hooks`, plus en manuel prøve på Windows: ingen afvisning, gemmepunkt taget, færdig-tjek blokerer ved ændret kode uden bevis).
- IKKE afprøvet: at skrivebordsappen (2.1.321) faktisk kalder `PreToolUse`- og `Stop`-hooks på dette repo. Hook'en ved modelskift blev ikke kaldt (`docs/modelvalg-som-laas.md`), så det skal bekræftes i en ny chat via pulsen. Ikke afprøvet på Mac eller Linux.
- `STARTKIT_VAERKTOEJ=claude` foran kommandoen i hook-filen virker i bash (Claude Code på Windows bruger Git Bash); ikke afprøvet i en PowerShell-hook.
