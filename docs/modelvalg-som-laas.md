# Kan modelvalget blive en lås? (anbefaling, 13. nov. 2026)

Kort svar: **ikke endnu.** En hook ved modelskift er prøvet i skrivebordsappen, og den blev ikke kaldt (se "Prøvet" nederst). Årsagen er ikke fundet. Tekstreglen er derfor stadig det eneste, der virker. Intet er bygget ind i kittet.

Afsnittene "Hvad en hook kan se" og "De tre muligheder" er **læst** i Anthropics dokumentation (code.claude.com/docs/en/hooks, 13. nov. 2026), ikke afprøvet. Kun det, der står under "Prøvet", er kørt. Codex er ikke slået op.

## Hvad en hook kan se

| Hook | Hvornår | Kender den modellen? |
|---|---|---|
| `UserPromptSubmit` | ved hver besked fra ejeren | Nej. Den får beskedens tekst, men intet felt med modellen. |
| `SessionStart` | når en chat begynder, fortsætter eller kortes ned | Nogle gange. Der er et felt `model`, men dokumentationen siger, at det kan mangle. |
| `PreModelSwitch` | lige før et modelskift | Ja (`from_model`, `to_model`). Kan stoppe skiftet og vise ejeren en tekst. |
| `PostModelSwitch` | lige efter et modelskift | Ja (`from_model`, `to_model`). Kan ikke stoppe noget. |

Der findes ingen miljøvariabel med modellen. Ingen hook kender **opgaven**, så ingen hook kan selv afgøre, om modellen er for svag. Det kan kun AI'en eller ejeren.

## De tre muligheder

1. **Påmindelse ved hver besked (`UserPromptSubmit`).** Frarådes. Hook'en ved ikke, hvilken model der kører, så den ville sige det samme hver gang. Det koster tokens ved hver eneste besked, og en tekst, der altid er der, bliver overset på samme måde som en tekstregel. Det er støj.
2. **Hook ved modelskift (`PostModelSwitch`).** Anbefales som forsøg. Den kører kun, når modellen faktisk skiftes, altså præcis dér, hvor fejlen skete. Den kan skrive én linje: "Modellen er skiftet fra X til Y. Sig i én linje, om den passer til opgaven." Ingen støj i resten af chatten.
3. **Stop skiftet (`PreModelSwitch`).** Frarådes. Ejeren skal altid kunne vælge model selv, og hook'en ved ikke, om opgaven er svær. En lås, der stopper et lovligt valg, lærer folk at slå låsen fra.

## Det, vi ikke ved

- Om teksten fra `PostModelSwitch` når frem til AI'en. Dokumentationen siger ja, ordret: "Claude Code adds plain-text stdout as context that Claude can see and act on" (slået op igen 13. nov. 2026). Det er ikke afprøvet, fordi hook'en aldrig blev kaldt.
- Hvorfor hook'en ikke blev kaldt i skrivebordsappen (se "Prøvet"). Dokumentationen siger, at hændelserne kræver version 2.1.251 eller nyere (prøven kørte 2.1.321), og at hooks kører ens i terminal og skrivebordsapp. Efter dokumentationen burde den altså være kaldt. Et gæt, der ikke er afprøvet: `${CLAUDE_PROJECT_DIR}` er "the project root where the session started" og bliver stående, hvis chatten senere går ind i en worktree. Startede chatten i hovedmappen, er worktree'ens `.claude/settings.local.json` måske aldrig blevet læst.
- Om hook'en kører i Claude Code i en terminal.
- Hvordan modelnavnet ser ud i `to_model`, og om en hook kan kende "stærk" fra "billig" uden en liste, der skal holdes ved lige (modelnavne skifter).
- Om Codex har noget tilsvarende.

## Anbefaling

1. Behold tekstreglen (den er lavet). Den dækker også Codex og starten af en opgave, som ingen hook dækker.
2. **Byg ikke hook'en ind i kittet nu.** Den blev ikke kaldt i prøven, og en lås, der ikke kører, giver falsk tryghed.
3. Vil ejeren prøve én gang til, så gør det i en almindelig kopi af repoet (ikke en worktree, der deles med en anden chat), først i Claude Code i en terminal og så i skrivebordsappen. Læg en kontrol-hook på `UserPromptSubmit` i samme fil, så det kan ses, om filen overhovedet bliver læst. Kun hvis teksten når AI'en, bygges hook'en ind.

Model til en ny prøve: stærk (fejlsøgning af en lås).

## Prøvet (13. nov. 2026)

Sat op: scriptet `tools/modelskift.js` (slettet igen 13. nov. 2026, da hook'en ikke bygges ind; det ligger i git-historikken) og en `PostModelSwitch`-hook i `.claude/settings.local.json` (ikke i git) med kommandoen `node "${CLAUDE_PROJECT_DIR}/tools/modelskift.js"`. Filen lå der, fra chatten startede. Chatten kørte i skrivebordsappen på Windows med Claude Code 2.1.321, i en worktree, som chatten delte med den chat, der oprettede den.

Afprøvet:
- Ejeren skiftede med `/model` fra Fable til Sonnet og senere tilbage til Fable. Begge skift blev gennemført ("Set model to ...").
- Ingen af gangene fik AI'en en tekst fra hook'en, og scriptet skrev ingen linje i `.claude/modelskift-log.txt`. **Hook'en blev ikke kaldt.**
- Kørt i hånden med falsk input virker scriptet: det skriver teksten og én linje i loggen.
- Navnet `PostModelSwitch` står i den installerede programfil (2.1.321), så hændelsen findes i versionen.
- Andre hooks kører i samme chat (en `SessionStart`-hook fra et plugin står i chattens log).

Ikke afklaret: om `/model` i skrivebordsappen ikke udløser hændelsen, eller om `.claude/settings.local.json` ikke blev læst af en chat, der kun deler worktree'en. En kontrol-hook kunne have skilt de to ad, men chatten måtte ikke rette i worktree'ens `.claude`-mappe. Der er ikke forsøgt nogen rettelse.

Ikke prøvet: Claude Code i en terminal (dér er version 2.1.319 installeret), model-vælgeren i appen, en almindelig kopi af repoet, og om teksten når AI'en, når hook'en først kører.
