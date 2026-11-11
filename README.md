# Startkit til ChatGPT (Codex)

Et startkit, der hjælper dig med at få AI til at arbejde ordentligt for dig: bedre kvalitet, en hurtigere arbejdsgang, overblik hele tiden og færre spildte tokens.

Det er ikke en færdig pakke. Kittet interviewer dig, undersøger de bedste løsninger til netop dine problemer, og bygger et fundament ud fra dine svar.

Det er et uofficielt hobbyprojekt. Det har ikke noget med OpenAI at gøre.

## Læs det her først (ærligt forbehold)

Kittet er bygget om fra en udgave til Claude. Den, der har lavet det, bruger ikke ChatGPT og har derfor **ikke kunnet afprøve det i Codex**. De enkelte dele er testet hver for sig (se nederst), men hele forløbet er ikke kørt igennem i Codex af et menneske. Der kan derfor være fejl.

Støder du på en, så bed Codex skrive den i `.startkit/status.md` under "Fejl i kittet", og meld den gerne tilbage (se "Meld en fejl" nederst), så kittet kan blive bedre.

## Hvad du skal bruge

- **Codex** (OpenAI's værktøj til at bygge med; det følger med dit ChatGPT-abonnement). Enten appen på computeren eller terminal-udgaven. Kittet virker ikke i den almindelige ChatGPT-chat i browseren, fordi den ikke kan arbejde i dine mapper.
- **Git** (git-scm.com) og **Node** (nodejs.org, vælg LTS). Mangler de, hjælper kittet dig med det.
- Windows er det, kittet er lavet til. Mac og Linux er ikke afprøvet.

## Installér (3 trin)

1. Hent projektet: tryk på den grønne knap **Code** øverst på GitHub-siden, vælg **Download ZIP**, og pak filen ud et sted, fx i Dokumenter. (Kender du git, kan du klone det i stedet.)
2. Højreklik i mappen, vælg "Åbn i Terminal", og kør:

   ```
   powershell -ExecutionPolicy Bypass -File install.ps1
   ```

   Scriptet kopierer mappen `startkit` til `C:\Users\<dig>\.agents\skills\startkit`. Det er det eneste, det gør. `-ExecutionPolicy Bypass` giver Windows lov til at køre netop dette ene script, denne ene gang; det ændrer ingen indstillinger. Scriptet er kort, så læs det gerne først. Du kan også bare kopiere mappen derhen selv.
3. Åbn Codex i den projektmappe, du vil arbejde i, og skriv:

   ```
   $startkit
   ```

   Dukker den ikke op, så genstart Codex, eller find den under Skills (`/skills`).

**Anbefalet:** installér også Superpowers, hvis du kan finde det hos dig (i appen: Plugins i sidemenuen; i terminalen: `/plugins`). Det giver bedre brainstorming og planlægning, og kittet bruger det, hvis det er der. Kittet virker også uden.

## Hvad der sker, når du starter

1. **Introduktion.** Du får at vide, hvad du skal igennem, og hvorfor, før der kommer et eneste spørgsmål.
2. **Tjek af computeren** (git, Node, hvilke modeller du har).
3. **Interview** om 8 emner, 2-3 spørgsmål ad gangen. Det er en samtale, ikke et skema: antallet af spørgsmål er ikke fast. Svarer du grundigt, bliver der færre, og siger du noget, der er værd at forstå bedre, bliver der spurgt ind til det. Typisk 30-60 minutter. Du kan holde pause når som helst; `$startkit` fortsætter, hvor du slap.
4. **Kortlægning** af det, du allerede har. Der bliver ikke ændret noget.
5. **Undersøgelse og plan.** Kittet undersøger løsninger på dine problemer og lægger forslag frem. Du siger ja eller nej til hvert.
6. **Det faste fundament** sættes op og prøves sammen med dig.
7. **Dit overblik** bygges efter dine ønsker.

Jo mere uddybende du svarer, jo bedre passer resultatet til dig.

## Det koster tokens, og det er meningen

At køre kittet igennem bruger en del af dit forbrug: interviewet er en lang samtale, og undersøgelsen bagefter læser kilder på nettet. Se det som en investering. Du bruger tokens én gang på at bygge fundamentet, og bagefter sparer du dem hver dag, fordi du ikke skal forklare det samme forfra, rette de samme fejl igen eller bruge en dyr model til en enkel opgave.

Tjek dit forbrug (`/status`), før du starter. Du kan dele forløbet over flere dage; alt bliver gemt, så intet skal gentages.

## Hvad du får i dit projekt

| Fil | Hvad den gør |
|---|---|
| `AGENTS.md` | Korte, faste regler, som AI'en læser i hver chat. Dine egne linjer røres ikke. |
| `STATUS.md` | Hvor du er: nu, sidst lavet, næste skridt, åbne problemer. Bærer viden fra gang til gang. |
| `docs/gentagne-fejl.md` | Fejl, der ikke må ske igen, og om de er låst af en hook eller test. |
| `scripts/startkit/vagt.js` | Vagten: stopper nøgler i kode, sletning af arbejde, og at kontroller springes over. |
| `scripts/startkit/faerdig.js` og `bevis.js` | Færdig-tjekket: "færdig" kræver et grønt bevis for den kode, der ligger der nu. |
| `.githooks/pre-commit` | Nøgletjek før hver commit, og en lås på længden af `AGENTS.md`. |
| `scripts/startkit/overblik.js` | En lille side på din egen computer, der viser, hvor projektet står. |
| `.codex/hooks.json` | Fortæller Codex, at vagten og færdig-tjekket skal køres. |
| `.startkit/` | Din profil, planen, indstillinger og forklaringen "hvorfor blev jeg stoppet". |

Der er to statusfiler, og de er ikke det samme: `STATUS.md` handler om dit projekt og bliver brugt hver dag. `.startkit/status.md` handler kun om, hvor langt du er i startkittets eget forløb, og det er dér, fejl i kittet skrives ned.

**Hvad kittet gør med dine data:** Kittets scripts sender ingenting nogen steder hen. Nøgletjekket læser dine filer på din egen computer for at finde nøgler, der ligger forkert, men det viser kun filnavn og slags, og det gemmer eller sender aldrig en nøgle. I undersøgelsesfasen søger Codex på nettet, sådan som Codex ellers gør; det sker gennem din egen Codex og ikke gennem kittet.

**Lægger du dit projekt på GitHub:** `.codex/hooks.json` indeholder den fulde sti til projektmappen, og den rummer typisk dit brugernavn på computeren (`C:\Users\<dig>\...`). Vil du ikke dele det, så hold filen ude af git ved at skrive `.codex/hooks.json` i din `.gitignore`. Stien passer alligevel kun til din egen computer.

## Fjern det igen

Slet mappen `C:\Users\<dig>\.agents\skills\startkit`. I et projekt: slet `scripts/startkit/`, `.githooks/`, `.startkit/` og startkittets poster i `.codex/hooks.json`, fjern blokken mellem `startkit:start` og `startkit:slut` i `AGENTS.md`, og kør `git config --unset core.hooksPath`. `STATUS.md`, `docs/gentagne-fejl.md` og linjerne under "Tilføjet af startkittet" i `.gitignore` er dine egne nu; behold dem, eller slet dem, som du vil.

## Hvad er afprøvet, og hvad er ikke?

| Del | Status |
|---|---|
| Vagtens regler (hvad tillades og afvises) | Testet automatisk |
| Vagten og færdig-tjekket kørt som programmer med den slags input, Codex ifølge dokumentationen sender | Testet automatisk |
| Opsætningen på et tomt projekt, og at den bevarer dine egne filer | Testet automatisk |
| Nøgletjekket og længdelåsen med rigtig git | Testet automatisk |
| Overblikssiden | Testet automatisk og set i en browser |
| At Codex faktisk kører hooks'ene, som dokumentationen beskriver | **Ikke afprøvet** |
| At vagten også bliver kaldt, når Codex retter filer (og ikke kun ved kommandoer) | **Ikke afprøvet** |
| At `$startkit` dukker op og følger faserne i Codex | **Ikke afprøvet** |
| Installationen på en anden computer end den, kittet er lavet på | **Ikke afprøvet** |
| Hele forløbet med et rigtigt menneske | **Ikke afprøvet** |
| Mac og Linux | **Ikke afprøvet** |

Kør testene selv med `node tests/run.js` (kræver git og Node).

Fakta om Codex (hvor skills og hooks ligger, hvordan en hook svarer, grænser for `AGENTS.md`) er slået op i OpenAI's egen dokumentation i november 2026. Ændrer OpenAI noget, kan dele af kittet holde op med at virke.

## Meld en fejl

Opret en sag under fanen **Issues** her på GitHub-siden. Skriv tre ting: hvad du gjorde, hvad der skete, og hvad du havde forventet. Kopiér gerne det, der står under "Fejl i kittet" i din `.startkit/status.md`.

Skriv aldrig nøgler, adgangskoder eller personlige oplysninger i en sag; alt dér er offentligt. Tjek også, at det, du kopierer ind, ikke indeholder stier med dit brugernavn, hvis du ikke vil dele det.

## Licens

MIT. Du må bruge, ændre og dele kittet frit, så længe licensteksten følger med. Se filen `LICENSE`. Kittet kommer uden garanti.
