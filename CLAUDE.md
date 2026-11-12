# Arbejdsregler for AI: startkittet selv

Dette er kildekoden til startkittet (gratis, til folk der er nye til at bygge med AI). Projektet følger kittets egne regler. Skrevet i hånden efter `startkit/assets/AGENTS.skabelon.md`; kittets hooks er ikke sat op her endnu (se `STATUS.md`).
Kun ejeren godkender udgivelser, push og pull requests. Tal dansk, enkelt og ærligt; ejeren er ny til teknik.

## Start her (hver ny chat)
- Læs `STATUS.md` (hvor vi er) og `docs/gentagne-fejl.md` (fejl, der ikke må ske igen).
- Sig i én linje, hvad du har forstået, at opgaven er, før du går i gang.
- Én opgave pr. chat. En ny opgave hører til i en ny chat.
- Ved hver ny opgave: sig i én linje, om den kræver en stærk model eller kan klares af en billig. Stærk (i dag Fable): fejlsøgning, gennemgang, design af kittet, vagten og andre sikkerhedsregler. Billig (i dag Sonnet): tekst, ændringslog, simple tests, at køre kommandoer. Passer din model ikke til opgaven, eller skifter ejeren til en for svag midt i den, så sig det, før du fortsætter.

## Sådan er projektet bygget
- Kilden ligger i `startkit/`. Mapperne `startkit/claude/` og `plugins/` er GENERERET: ret aldrig i dem. Ret kilden, og kør `node tools/byg.js`.
- Alt findes på dansk og engelsk (`startkit/en/`). En ændring i det ene sprog skal også laves i det andet, med en test på begge.
- Ændringer skrives i `CHANGELOG.da.md` og `CHANGELOG.md` under "Ikke udgivet endnu". Ret ikke `startkit/VERSION`; det gør ejeren ved en udgivelse.
- Ingen navne, e-mailadresser, brugermapper eller nøgler i nogen fil. Testen `rent` stopper det.

## Faste regler
- Sig først "færdig", når `node tools/byg.js --tjek` og `node tests/run.js` er grønne, og du har sagt, hvad du ikke har afprøvet. (I en worktree er `rent: .git` rød af en kendt grund; bekræft i en almindelig kopi.)
- Skriv "afprøvet" kun om det, der er kørt. Er noget kun læst i dokumentationen, så skriv det.
- Ret årsagen, ikke symptomet. Kan du ikke finde årsagen, så sig det.
- Hjælper en rettelse ikke efter to forsøg, så stop. Skriv fejlteksten ordret og det, du har prøvet, i `STATUS.md`, og foreslå en ny chat. Gæt ikke videre.
- Gæt aldrig. Fakta om Codex og Claude Code slås op i den officielle dokumentation, ikke i hukommelsen.
- Opdatér `STATUS.md`, hver gang et delmål er nået, ikke kun til sidst.
- Valg, der er svære at lave om: læg 2-3 muligheder frem med en anbefaling, og lad ejeren vælge. Spørg, før noget nyt bygges.
- Spørg ejeren, før du: pusher, åbner eller fletter en pull request, udgiver, sletter filer eller ændrer vagtens regler.
- Siger ejeren "den fejl igen": skriv fejlen i `docs/gentagne-fejl.md`, og foreslå en lås (hook eller test), ikke en ny tekstregel.
- Skriver ejeren "hvad nu?": læs `STATUS.md`, kør `git status`, og se de seneste commits. Svar kort med: hvor vi er, ét forslag til næste opgave, åbne problemer, og hvilken model der passer. Start ikke, før ejeren har sagt ja.
- Før noget deles (push, pull request, udgivelse): gå `startkit/assets/foer-du-deler.md` igennem med ejeren, og sig, hvad der er tjekket, og hvad der ikke er.
- Hold denne fil kort (højst 45 linjer). Lange forklaringer hører til i `docs/`.

## Når opgaven er slut
- Opdatér `STATUS.md`: hvad er lavet, hvad mangler, næste skridt.
- Foreslå næste chat: opgave, hvad der er lavet, færdig når, og hvilken model der passer.
