# Hvorfor blev AI'en stoppet?

Startkittet har sat tre kontroller op i dit projekt. De stopper AI'en med vilje. Det er ikke en fejl, når det sker.

## 1. Vagten (kører, før AI'en bruger et værktøj)

Den afviser:
- **Nøgler og adgangskoder** i filer eller kommandoer, og al læsning og skrivning af `.env`-filer. En nøgle, der havner i en fil eller en chat, er brændt og skal skiftes.
- **`git commit --no-verify`**: det springer nøgletjekket over.
- **`git push --force`, `git reset --hard` og `git clean`**: de kan slette arbejde, som ikke kan hentes igen.
- **Ændringer af kontrollerne selv** (`.claude/settings.local.json`, `scripts/startkit/`, `.githooks/`, `.startkit/config.json`, beviset). Ellers kunne AI'en slå dem fra, når de er i vejen.

Er det noget, du selv vil have gjort, så kør kommandoen i din egen terminal. Vagten stopper kun AI'en, ikke dig.

## 2. Færdig-tjekket (kører, når AI'en vil stoppe)

Er koden ændret i chatten, og er der ikke et grønt bevis for netop den kode, bliver AI'en bedt om at køre `node scripts/startkit/bevis.js` først. Den bliver højst bedt om det én gang pr. stop.

Hvilke kommandoer beviset kører, står i `.startkit/config.json` under `tjek`. Den fil retter du selv.

## 3. Nøgletjekket (kører, før git gemmer en commit)

Det stopper en commit, hvis der er en nøgle på vej med, eller hvis `CLAUDE.md` er blevet for lang (over 80 linjer). Lange regelfiler koster tokens i hver chat, og de vigtige regler drukner.

## Ærlige grænser

- Vagten er et sikkerhedsnet, ikke en mur. En kreativ kommando kan komme udenom et mønster.
- Fejler en hook, eller løber den tør for tid, lader Claude Code værktøjet køre videre.
- Claude Code har ingen godkendelse af hver enkelt hook. Skriv `/hooks` for at se, hvilke der er indlæst.

## Stoppede den noget, den ikke burde?

Skriv det i `STATUS.md` under "Åbne problemer", og kør kommandoen selv i mellemtiden. Slå ikke kontrollerne fra for at komme videre.
