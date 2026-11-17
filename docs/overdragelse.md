# Overdragelse (17. nov. 2026)

Skrevet, fordi ejeren skifter konto. Chatterne fra den gamle konto kan ikke forventes at følge med, så alt, der betyder noget, står her eller i de filer, der peges på. Læs hele filen; den er kort med vilje.

## Læs i denne rækkefølge
1. `CLAUDE.md` (arbejdsregler), 2. `STATUS.md`, 3. denne fil, 4. `docs/gentagne-fejl.md`.

## Hvor projektet står
- `main` = udgivet 0.9.0-beta plus hooks på kittet selv (pull request 25). `main` er rent og ligger på GitHub.
- Åben pull request: nr. 14 (kladde, grenen `claude/claude-udgave`, fra 0.8.0-beta). Sandsynligvis forældet; ejeren afgør, om den skal lukkes.
- **Meget arbejde er IKKE i `main` og IKKE på GitHub.** Det ligger kun på denne computer, i arbejdskopierne under `.claude/worktrees/`. Se tabellen.

## Arbejde, der kun ligger lokalt
Hver række har en sikkerhedskopi i git: `refs/backup/overdragelse/<mappe>` (taget 17. nov., filerne er ikke rørt).

| Mappe under `.claude/worktrees/` | Hvad | Tilstand |
|---|---|---|
| `starterkit-foundation-refocus-d593b8` | Kittet bygger kun fundamentet: faser 1-6, lille interview (6 spørgsmål), det grundige interview flyttet til valgfrit `projekt-trin.md`. Ejerens valg A. | Ikke committet. Tests var grønne ifølge dens STATUS. Mangler ejerens gennemgang. |
| `confident-jones-ecb9ed` | Overblik og almindeligt sprog: én plan med seks trin, ordliste `sprog.md`/`language.md`, nye tests `overblik` og `sprog`. Oplæg: `docs/oplaeg-overblik-og-sprog.md`. | Ikke committet. Ikke afprøvet i en rigtig chat. |
| `unruffled-grothendieck-b2b8a3` | Tre commits (kort vej: sikkerhedsminimum; nyt projekt-vej) plus ucommittede oplæg: `docs/oplaeg-en-kommando.md` (ejerens 17 ønsker), `docs/oplaeg-nyt-projekt-vej.md`, `docs/hook-haendelser.md`, `docs/test-rapport-opskrift.md`. | Commits ikke pushet. Oplægget er skrevet af Sonnet og skal gennemgås af Fable. Ejeren skal vælge vej A/B/C. |
| `startkit-en-kommando-trin-1-4eb51f` | Trin 1 af "én kommando": loop-stop (`fejl.js`, `loopstop.js`, ændring i `vagt.js`). | Chatten kørte stadig, da kopien blev taget. Ufærdigt, ingen tests set. |
| `starter-kit-improvements-22ac40` | Ændring i `regler.js` med test, og en rapport: `reports/Forbedring og udbredelse af starterkittet.md` med fire notater i `research_notes/`. | Ikke committet. |
| `starterkit-test-project-e35f8f` | `docs/testprojekt-naboevaerkstedet.md` (og .pdf): et testprojekt til at prøve kittet på. | Ikke committet. |
| `modelvalg-regel-2b98b3` | Tre afsnit i STATUS om, hvorfor skrivebordsappen ikke kalder hooks. Indholdet står nedenfor. | Ikke committet. |
| `noeglescan-hang-debug-79ec6b` | Grenen `claude/interview-stops-early-649de5`: én commit, "Kort vej: sikkerhedsminimum og ærlig afslutning". | Ikke pushet. Samme commit findes i `unruffled-grothendieck`. |

De øvrige arbejdskopier er rene og står på `main`. Grenen `claude/modelvalg-regel-2b98b3` ser ud til at være foran `main`, men indholdet kom med i 0.9.0-beta (ikke tjekket linje for linje).

### Sådan ses eller hentes en sikkerhedskopi
- Se filerne: `git show --stat refs/backup/overdragelse/<mappe>`
- Hent én fil: `git show refs/backup/overdragelse/<mappe>:<sti>`
- Kopierne ligger kun lokalt. Går disken tabt, er de væk. De kommer først på GitHub, hvis ejeren siger ja til et push.

## Advarsler til den næste
- **Tre spor retter i de samme filer** (`startkit/SKILL.md`, intro, interview, `kort-vej.md`, `tekster.js`): fundament-sporet, overblik-og-sprog og "kort vej"-commits. De kan ikke bare flettes hver for sig. Fundament-sporet omdøber `kort-vej.md` til `lille-interview.md`, mens de to andre retter i `kort-vej.md`. Foreslået rækkefølge: fundament først (ejerens nyeste retning), så sprog oven på, så loop-stop. Ejeren vælger.
- **Slet ingen arbejdskopi og arkivér ingen chat**, før dens arbejde er committet på en gren. Oprydning kan fjerne mappen og dermed de ucommittede filer.
- Kør `node tools/byg.js` efter en ændring i `startkit/`; ret aldrig i `plugins/` eller `startkit/claude/`.

## Uafklaret: hooks kaldes ikke i skrivebordsappen
- Afprøvet 15. nov.: en testchat i en arbejdskopi kørte fire Bash-kald, men `.startkit/vagt-puls.json` blev ikke opdateret, og der kom intet gemmepunkt. Samme udfald som hook'en ved modelskift (`docs/modelvalg-som-laas.md`).
- Mest sandsynlige årsag (læst i dokumentationen, ikke bevist): en chat i en arbejdskopi læser indstillinger og hooks fra HOVEDMAPPEN, ikke fra arbejdskopien.
- Kontrol er sat op: `node tools/hooks-lokalt.js` er kørt i hovedmappen. **Mangler:** start en chat i hovedmappen (ikke en arbejdskopi), kør noget i Bash, og se, om `.startkit/vagt-puls.json` får nyt tidspunkt, og `git for-each-ref refs/startkit` viser et gemmepunkt.

## Beslutninger, ejeren har taget
- Kittet skal kun bygge fundamentet; langt interview er valgfrit bagefter.
- Almindeligt sprog overalt; AI'en gør selv det, den kan, og siger hvad og hvorfor.
- Kittets hooks kører på kittet selv med vagten i kun-registrér-tilstand (valg c).
- Modelvalg siges ved hver opgave (Fable til design, fejlsøgning og sikkerhed; Sonnet til tekst og simple ting). Billig model laver, stærk model gennemgår.
- Test kun det relevante ved en ændring, fuld test før deling. Dette er et ønske, IKKE indført: `CLAUDE.md` kræver stadig fuld test, til ejeren siger andet.

## Beslutninger, der venter på ejeren
- Vej A/B/C og tre valg i `oplaeg-en-kommando.md`.
- Om fundament-sporet og sprog-sporet skal committes og i pull requests, og i hvilken rækkefølge.
- Om sikkerhedskopierne og de upushede grene skal pushes til GitHub.
- Pull request 14: luk eller behold.

## Viden uden for dette repo
Kittet er prøvet på ejerens andet projekt (garderobe-platformen, i en anden mappe). Chatterne hed "Startkit", "Startkit fortsættelse kort vej", "Startkit kort vej trin 7-9" og "Vagt · rød vagt-test (ask fik allow)". Fundene herfra førte til "Interviewet stopper for tidligt" og "kort vej"-rettelserne. Den røde vagt-test (et "spørg" blev til "tillad") er ikke fulgt op her; spørg ejeren.

## Ikke gjort ved overdragelsen
- De andre chats' samtaler er ikke læst igennem; tabellen bygger på filerne og deres STATUS. Noget, der kun blev sagt i en chat og aldrig skrevet ned, kan mangle.
- Intet er pushet, flettet eller slettet.
