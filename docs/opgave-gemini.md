# Opgave til Gemini i Antigravity

Til: Gemini, der arbejder i Antigravity på ejerens computer. Skrevet af Claude den 26. nov. 2026 efter ejerens ønske.
Projektet: startkittet (gratis, til folk der er nye til at bygge med AI). Det findes i dag til Codex og Claude Code, på dansk og engelsk.

## Læs først
1. `CLAUDE.md`: projektets arbejdsregler. De gælder også for dig, med de ændringer, der står her.
2. `STATUS.md` og `docs/gentagne-fejl.md`.
3. `README.da.md` (hvad kittet er) og `startkit/SKILL.md` (forløbet).

Tal dansk, enkelt og ærligt. Ejeren er ny til teknik. Sig i én linje, hvad du har forstået, før du går i gang.

## Opgaven har tre dele, i denne rækkefølge

### Del 1: Gennemgang (kun læsning, ret intet)
Læs kittet igennem med friske øjne, og skriv dine fund i `docs/gemini-gennemgang.md`:
- Fejl og ting, der ikke passer sammen (fx mellem dansk og engelsk, eller mellem README og det, kittet faktisk gør).
- Hvad der er svært at forstå for en, der er ny til teknik.
- Forslag til forbedringer, hver med: hvad, hvorfor og hvor stort det er (lille, mellem eller stort).
- Sorter efter vigtighed, og skriv højst 15 punkter.

### Del 2: Find ud af, hvad Antigravity kan (kun læsning)
Slå op i Antigravitys og Googles officielle dokumentation, ikke i din hukommelse. Skriv svarene med kilde (link) øverst i `docs/gemini-gennemgang.md`:
1. Hvilke regelfiler læser du automatisk (fx `AGENTS.md`, `GEMINI.md` eller en mappe med regler)? Hvor skal de ligge?
2. Findes der "skills", workflows eller kommandoer som `/startkit`? Hvor skal de ligge?
3. Findes der hooks: et program, der køres automatisk, før du bruger et værktøj, eller når du vil stoppe? Det er det, kittets vagt og færdig-tjek bygger på. Skriv filnavn, hændelsernes navne og det JSON, der sendes.
4. Hvordan godkender ejeren kommandoer, og kan man forbyde bestemte kommandoer eller filer (fx `.env`)?
Står noget ikke i dokumentationen, så skriv "ikke dokumenteret". Gæt ikke.

### Del 3: Gemini-udgaven, men kun efter ejerens ja
Læg 2-3 måder frem at lave en Gemini-udgave på, med en anbefaling, ud fra det, du fandt i del 2. Stop derefter, og vent på, at ejeren vælger.
Sådan er de to udgaver, der findes i dag, bygget (følg samme mønster):
- `startkit/scripts/projekt/tekster.js`: `VAERKTOEJER` har en post pr. værktøj (`codex`, `claude`) med regelfil, hook-fil og kommandoer.
- `tools/byg-claude.js` laver Claude-udgaven (`startkit/claude/`) ud fra kilden. `tools/byg-plugin.js` laver `plugins/`.
- `install.ps1` og `.cmd`-filerne installerer. Testene ligger i `tests/` (fx `tests/claude.test.js`).
Findes der ikke hooks i Antigravity, så sig det tydeligt. Så kan vagten og færdig-tjekket ikke virke af sig selv, og README skal sige det ærligt.

## Faste regler for dig
- Arbejd på en ny gren: `gemini/gennemgang-og-udgave`. Ret aldrig direkte på `main`.
- Ret aldrig i `startkit/claude/` eller `plugins/`. De bliver lavet af `node tools/byg.js`.
- En ændring på dansk skal også laves på engelsk (`startkit/en/`), med en test på begge sprog.
- Skriv ændringer i `CHANGELOG.da.md` og `CHANGELOG.md` under "Ikke udgivet endnu". Ret ikke `startkit/VERSION`.
- Ingen navne, e-mailadresser, brugermapper eller nøgler i nogen fil. Testen `rent` stopper det.
- Du er færdig med en del, når `node tools/byg.js --tjek` og `node tests/run.js` er grønne. Kør dem én gang ad gangen, ikke flere samtidig.
- Hjælper en rettelse ikke efter to forsøg, så stop, og skriv fejlteksten ordret i rapporten.
- Du må committe på din gren. Du må ikke pushe, flette, lave en pull request eller udgive. Det gør Claude efter ejerens ja.

## Aflevering
Skriv øverst i `docs/gemini-gennemgang.md`: `KLAR TIL GENNEMGANG: ja/nej`, hvilke dele der er lavet, hvad der er afprøvet, og hvad der ikke er. Stop så.
Claude gennemgår dit arbejde bagefter, før noget kommer på `main`.
