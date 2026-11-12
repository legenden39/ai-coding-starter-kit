# Kan modelvalget blive en lås? (anbefaling, 13. nov. 2026)

Kort svar: **delvist, og kun i Claude Code.** En påmindelse ved hver besked er ikke det værd. En lille hook, der kun kører i det øjeblik, modellen skiftes, er værd at prøve. Intet er bygget endnu.

Alt herunder er **læst** i Anthropics dokumentation (code.claude.com/docs/en/hooks, 13. nov. 2026). Intet af det er afprøvet i en rigtig chat. Codex er ikke slået op.

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

- Om teksten fra `PostModelSwitch` når frem til AI'en, eller kun til ejeren. Det står ikke i det, der er læst. Når den kun ejeren, er den stadig nyttig, men som en påmindelse til mennesket, ikke en lås på AI'en.
- Om hook'en også kører, når modellen skiftes i skrivebordsappen og ikke med `/model`.
- Hvordan modelnavnet ser ud i `to_model`, og om en hook kan kende "stærk" fra "billig" uden en liste, der skal holdes ved lige (modelnavne skifter).
- Om Codex har noget tilsvarende.

## Anbefaling

1. Behold tekstreglen (den er lavet). Den dækker også Codex og starten af en opgave, som ingen hook dækker.
2. Prøv mulighed 2 i dette repo først: en hook på få linjer, og én prøve i en rigtig Claude Code, hvor modellen skiftes midt i en opgave. Skriv ned, hvad der skete.
3. Byg den kun ind i kittet, hvis prøven viser, at teksten når AI'en. Ellers skrives den som en påmindelse til ejeren, eller den droppes.

Model til forsøget: stærk (design af en lås, og dokumentationen skal læses nøje). Det er en lille opgave, højst en time.
