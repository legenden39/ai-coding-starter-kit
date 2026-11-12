<!-- startkit:start (denne blok vedligeholdes af startkittet; skriv dine egne regler uden for blokken) -->
# Arbejdsregler for AI: {{PROJEKT}}

{{BESKRIVELSE}}
Ejer: {{NAVN}}. Kun ejeren godkender nye eller ændrede aftaler.

## Start her (hver ny chat)
- Læs `STATUS.md` (hvor vi er) og `docs/gentagne-fejl.md` (fejl, der ikke må ske igen).
- Sig i én linje, hvad du har forstået, at opgaven er, før du går i gang.
- Én opgave pr. chat. En ny opgave hører til i en ny chat.

## Faste regler
- Skriv, vis eller læs aldrig rigtige nøgler og adgangskoder. `.env`-filer rører kun ejeren.
- Sig først "færdig", når `node scripts/startkit/bevis.js` er grøn, og du har sagt, hvad du ikke har afprøvet.
- Ret årsagen, ikke symptomet. Kan du ikke finde årsagen, så sig det.
- Opdatér `STATUS.md`, hver gang et delmål er nået, ikke kun til sidst. Så kan en chat, der bliver afbrudt af forbrugsgrænsen, tages op igen uden at miste tråden.
- Hjælper en rettelse ikke efter to forsøg, så stop. Skriv fejlteksten ordret og det, du har prøvet, i `STATUS.md`, og foreslå, at ejeren starter en ny chat med den. Gæt ikke videre.
- Gæt aldrig. Ved du det ikke, så sig "det ved jeg ikke", og foreslå, hvordan vi finder ud af det.
- Valg, der er svære at lave om (struktur, database, nye værktøjer): læg 2-3 muligheder frem med en anbefaling, og lad ejeren vælge.
- Spørg ejeren, før du: {{ALDRIG_UDEN_OK}}.
- Er du i tvivl: {{VED_TVIVL}}.
- Siger ejeren "den fejl igen": skriv fejlen i `docs/gentagne-fejl.md`, og foreslå en lås (hook eller test), ikke en ny tekstregel.
- Skriver ejeren "hvad nu?": læs `STATUS.md`, kør `git status`, og se de seneste commits. Svar kort med: hvor vi er, ét forslag til næste opgave, om der er åbne problemer eller ugemte ændringer, der skal først, og hvilken model der passer (billig til det enkle, stærk til det svære). Start ikke, før ejeren har sagt ja.
- Skal noget deles med andre (et link, en hjemmeside, en app på nettet): læs `docs/foer-du-deler.md`, og gå den igennem med ejeren, før noget lægges ud. Sig, hvad der er tjekket, og hvad der ikke er.
- Stopper en vagt dig, så omgå den ikke. Forklar ejeren, hvad der skete (se `.startkit/hvorfor-blev-jeg-stoppet.md`).
- Hold denne fil kort. Lange forklaringer hører til i `docs/` og læses kun, når opgaven kræver det.

## Sådan vil ejeren have svar
{{SVARFORM}}

## Når opgaven er slut
- Opdatér `STATUS.md`: hvad er lavet, hvad mangler, næste skridt. Hold den kort.
- Foreslå næste chat: opgave, hvad der er lavet, færdig når, og hvilken model der passer (billig til det enkle, stærk til det svære).
<!-- startkit:slut -->
