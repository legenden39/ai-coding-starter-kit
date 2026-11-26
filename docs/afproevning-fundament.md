# Afprøvning: fundamentet som standard

Til ejeren, før den næste udgivelse. Det skal prøves i en rigtig chat på din egen computer, fordi tests kun viser, at scriptene virker, når de bliver kaldt. Regn med 30-45 minutter. Skriv det ned, der går galt, med den tekst, du ser.

## Før du starter
1. Hent grenen `claude/fundament-som-standard` (den skal være pushet først).
2. Lav en tom mappe, f.eks. `Dokumenter/startkit-proeve`. Brug IKKE kittets egen mappe: dér afviser vagten intet.
3. Installér kittet fra grenen, ikke fra den udgivne version. Fjern en gammel installation først, så du ved, hvilken der kører.

## Det, du skal se
- [ ] **Start:** `/startkit` i en ny chat i prøvemappen. Du får at vide, hvad der skal ske, før første spørgsmål.
- [ ] **Lille interview:** præcis seks korte spørgsmål, højst 2-3 ad gangen. Ingen spørgsmål om selve projektet ud over et arbejdsnavn.
- [ ] **Fundamentet:** AI'en viser først, hvad der laves, og venter på dit ja. Bagefter findes `AGENTS.md` (eller `CLAUDE.md`), `STATUS.md`, `docs/gentagne-fejl.md` og mappen `.startkit/`.
- [ ] **Sikkerhedsnettet:** AI'en prøver noget for øjnene af dig, og vagten stopper det.
- [ ] **Hooks kører:** `.startkit/vagt-puls.json` får et nyt tidspunkt, og `git for-each-ref refs/startkit` viser et gemmepunkt.
- [ ] **Loop-stop:** bed AI'en køre en kommando, der fejler, f.eks. `node findes-ikke.js`, to gange. Tredje forsøg skal stoppes med "Stoppet: ... 2 gange ... Hvorfor ... Hvad nu".
- [ ] **Afslutning:** det grundige interview tilbydes som valgfrit, i en ny chat.

## Bagefter
Fortæl AI'en i en chat i kittets mappe, hvad du så, og hvad der ikke virkede. Det skrives i `STATUS.md`.
