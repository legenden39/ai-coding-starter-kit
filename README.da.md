# AI Coding Starter Kit (til ChatGPT / Codex og til Claude Code)

[English](README.md) · Dansk

> **Beta, version 0.7.0-beta.** Det her er en prøveudgave. Udgaven til Codex er ikke afprøvet i Codex af den, der har lavet den. Udgaven til Claude Code er ny: dens sikkerhedsnet er prøvet i Claude Code på Linux, men ikke på Windows, og hele forløbet er ikke kørt igennem af et menneske. Der vil være fejl. Prøver du den, så giv feedback: kittet hjælper dig med det til sidst. Se [ændringer](CHANGELOG.da.md).

**Vil du bygge noget med AI, men ved ikke, hvor du skal starte, eller er du træt af, at AI'en laver de samme fejl igen og igen? Så er det her til dig.**

Du behøver ikke kunne kode, og du behøver ikke kende de ord, der bliver brugt herunder. De bliver forklaret undervejs, og der er en ordliste nederst.

## Hvad er problemet?

Når man bygger noget sammen med en AI, løber næsten alle ind i de samme ting:

- **Den glemmer.** I aftalte noget i går. I dag skal du forklare det hele forfra.
- **Den gentager fejl.** Du har sagt det tre gange, og den gør det stadig.
- **Den siger "færdig", og det virker ikke.** Den har ikke prøvet det, den har lavet.
- **Du mister overblikket.** Hvad virker? Hvad er halvt færdigt? Hvilken mappe er den nyeste?
- **Noget forsvinder.** En fil bliver slettet eller overskrevet, og du kan ikke få den tilbage.
- **Du bruger dit forbrug for hurtigt** uden at vide hvorfor.

Det skyldes sjældent, at du gør noget forkert. Det skyldes, at der mangler et fundament: nogle faste regler og sikkerhedsnet, som AI'en skal arbejde inden for. De fleste opdager det først efter måneder med frustration.

## Hvad gør startkittet ved det?

Startkittet er en hjælper, du starter inde i dit AI-værktøj. Den tager dig i hånden fra A til Z:

1. **Den hjælper dig med at få værktøjerne på plads.** Mangler der noget på din computer, viser den dig, hvordan du installerer det, ét skridt ad gangen.
2. **Den interviewer dig.** Hvad vil du bygge? Hvad irriterer dig? Hvordan vil du have, at AI'en taler til dig?
3. **Den undersøger løsninger** på netop dine problemer og lægger en plan frem. Du siger ja eller nej til hvert forslag.
4. **Den sætter fundamentet op** i dit projekt og prøver sammen med dig, at det virker.
5. **Den viser dig en overbliksside,** som du åbner i din browser, og bygger den til efter dine ønsker.
6. **Den hjælper dig med en privat sikkerhedskopi** på nettet, så dit arbejde ikke kun ligger på én computer.

Kittet gør arbejdet for dig, men det vælger aldrig for dig. Det viser altid først, hvad der sker, og venter på dit ja.

Bagefter kan du gå i gang med at bygge, uden at skulle være bange for de fejl, der står øverst.

### Det får du

| Det her | betyder for dig |
|---|---|
| Korte, faste regler | AI'en læser dem i starten af hver samtale, så du ikke skal forklare det samme igen. |
| En statusfil | Der står altid, hvor du er: hvad der er lavet, og hvad der er næste skridt. |
| En vagt | Den stopper AI'en, før den sletter dit arbejde eller lægger en hemmelig kode det forkerte sted. |
| Et færdig-tjek | AI'en må først sige "færdig", når det er prøvet, at det virker. |
| Et nøgletjek | Hemmelige koder (nøgler) bliver stoppet, før de bliver gemt et sted, hvor andre kan se dem. |
| En huskeliste over fejl | Fejl, der er sket to gange, bliver skrevet ned og låst, så de ikke sker en tredje gang. |
| En overbliksside | Én side i din browser, der viser, hvor projektet står lige nu. |
| En privat sikkerhedskopi | Dit projekt ligger også på GitHub, hvor kun du kan se det. |

## Codex eller Claude Code?

Kittet findes til to AI-værktøjer: **Codex** (fra OpenAI, firmaet bag ChatGPT) og **Claude Code** (fra Anthropic, firmaet bag Claude). Du vælger, når du installerer. Forløbet, reglerne og programmerne er de samme; kun navnene på nogle filer og kommandoer er forskellige.

Resten af denne side er skrevet med Codex' navne. Bruger du Claude Code, så læs "Codex" som "Claude Code", og brug denne tabel:

| Ting | Codex | Claude Code |
|---|---|---|
| Fil, du dobbeltklikker på for at installere (dansk) | `installer.cmd` | `installer-claude.cmd` |
| Fil, du dobbeltklikker på for at installere (engelsk) | `install-english.cmd` | `install-claude-english.cmd` |
| Mappen, kittet bliver kopieret til | `C:\Users\<dig>\.agents\skills\startkit` | `C:\Users\<dig>\.claude\skills\startkit` |
| Det, du skriver for at starte kittet | `$startkit` | `/startkit` |
| Filen med de faste regler i dit projekt | `AGENTS.md` | `CLAUDE.md` |
| Filen, der tænder vagten og færdig-tjekket | `.codex/hooks.json` | `.claude/settings.local.json` |
| Se dit forbrug | `/status` | `/usage` |
| Ny chat | `/new` | `/clear` |

## Læs det her først (ærligt forbehold)

Kittet er bygget om fra en udgave til Claude. Den, der har lavet det, bruger ikke ChatGPT og har derfor **ikke kunnet afprøve det i Codex**. De enkelte dele er testet hver for sig (se nederst), men hele forløbet er ikke kørt igennem i Codex af et menneske. Der kan derfor være fejl, og knapper kan sidde et andet sted, end der står her.

Udgaven til Claude Code er bygget ud fra udgaven til Codex. Dens sikkerhedsnet (vagten, færdig-tjekket og reglerne i `CLAUDE.md`) og selve starten med `/startkit` er prøvet i Claude Code i en terminal på Linux. Den er ikke prøvet på Windows eller i Claudes app, og heller ikke dér er hele forløbet kørt igennem af et menneske.

Støder du på en fejl, så bed Codex skrive den ned (den ved, hvor), og meld den gerne tilbage. Se "Meld en fejl" nederst. Det gør kittet bedre for den næste.

Kittet er lavet til Windows. Linux bliver testet automatisk hos GitHub, hver gang noget ændres. Mac er ikke afprøvet.

## Kom i gang

Der er fire ting, du selv skal gøre, før startkittet kan tage over. Regn med 15-30 minutter, hvis du starter helt fra bunden.

Skal du bruge kittet på et hold? Se [vejledningen til undervisere](UNDERVISNING.md).

### Trin 1: Få Codex eller Claude Code

Du skal kun bruge det ene. Har du allerede et abonnement på ChatGPT eller Claude, så vælg det værktøj, der hører til.

**Codex**

Codex er OpenAI's værktøj til at bygge med AI. Det er det samme firma som ChatGPT, og du logger ind med din ChatGPT-konto. Forskellen er, at Codex kan arbejde i mapperne på din computer. Det kan den almindelige ChatGPT-chat i browseren ikke, og derfor virker startkittet ikke dér.

- Hent appen til Windows via OpenAI's egen vejledning: [learn.chatgpt.com/codex/quickstart](https://learn.chatgpt.com/codex/quickstart).
- Åbn den, og log ind med din ChatGPT-konto.
- Hvilke abonnementer der giver adgang, og hvor meget forbrug du har, står på OpenAI's prisside. Det ændrer sig, så tjek det dér.

**Claude Code**

Claude Code er Anthropics værktøj til at bygge med AI. Det er det samme firma som Claude, og du logger ind med din Claude-konto. Ligesom Codex kan Claude Code arbejde i mapperne på din computer. Det kan den almindelige Claude-chat i browseren ikke, og derfor virker startkittet ikke dér.

- Hent appen til Windows på [claude.com/download](https://claude.com/download), åbn den, og log ind med din Claude-konto. Claude Code er fanen **Code** i appen.
- Claude Code kræver et betalt abonnement. Hvilke der giver adgang, og hvor meget forbrug du har, står på [claude.com/pricing](https://claude.com/pricing). Det ændrer sig, så tjek det dér.

### Trin 2: Få Git og Node

Det er to gratis programmer, som startkittet bruger bag kulisserne.

- **Git** gemmer hver udgave af dine filer. Det er din fortryd-knap. Hent det på [git-scm.com](https://git-scm.com) (vælg Windows), kør filen, og tryk "Next" til alle spørgsmål.
- **Node** kører startkittets små programmer (vagten, færdig-tjekket, overblikket). Hent det på [nodejs.org](https://nodejs.org) (vælg den, der hedder **LTS**), og kør filen.

Er du i tvivl, om du har dem? Spring bare videre. Startkittet tjekker det og hjælper dig, hvis noget mangler.

### Trin 3: Hent og installér startkittet

1. Hent kittet: **[ai-coding-starter-kit.zip](https://github.com/legenden39/ai-coding-starter-kit/releases/latest/download/ai-coding-starter-kit.zip)**. Linket giver dig altid den nyeste udgave.
2. Find filen i din mappe "Overførsler", højreklik på den, og vælg **Udpak alle**. Læg mappen et sted, du kan finde igen, fx i Dokumenter.
3. Åbn den udpakkede mappe, og **dobbeltklik på filen `installer.cmd`** (den kan også hedde bare `installer`). Bruger du Claude Code, så dobbeltklik på **`installer-claude.cmd`** i stedet. De to filer, der hedder noget med `english`, installerer den engelske udgave.
4. Der kommer et vindue med tekst. Det fortæller, hvad der sker: mappen `startkit` bliver kopieret til `C:\Users\<dig>\.agents\skills\startkit`, som er dér, Codex leder efter den slags (til Claude Code: `C:\Users\<dig>\.claude\skills\startkit`). Intet andet. Skriv `j`, og tryk Enter for at sige ja.
5. Vinduet fortæller dig til sidst, hvad næste skridt er.

Siger Windows "Windows beskyttede din pc"? Det sker med filer, der er hentet fra nettet. Du kan trykke **Flere oplysninger** og **Kør alligevel**, hvis du stoler på filen. Den er kort, og du kan åbne den i Notesblok og læse, hvad den gør.

**Bruger du Claude Code? Så kan du også installere uden ZIP-fil.** Skriv disse to linjer i Claude Code, én ad gangen, og tryk Enter efter hver:

```
/plugin marketplace add legenden39/ai-coding-starter-kit
/plugin install startkit-da@ai-coding-starter-kit
```

Den første fortæller Claude Code, hvor kittet ligger. Den anden installerer den danske udgave som et plugin (en tilføjelse). Vil du have den engelske, så skriv `startkit` i stedet for `startkit-da`. Start en ny chat bagefter, og skriv `/startkit`. Brug kun én af de to måder (ZIP-fil eller plugin), ikke begge. Et plugin opdaterer ikke sig selv: skriv `/plugin` for at hente en ny udgave. Du fjerner det igen med `/plugin uninstall startkit-da@ai-coding-starter-kit`.

Den vej er prøvet i Claude Code på Linux fra en kopi af lageret, men ikke på Windows.

<details>
<summary>Hellere uden dobbeltklik? To andre måder</summary>

- **I terminalen:** højreklik et tomt sted i mappen, vælg **Åbn i Terminal**, og kør `powershell -ExecutionPolicy Bypass -File install.ps1` (til Claude Code: tilføj `-Vaerktoej claude` til sidst). Terminalen er et vindue, hvor man skriver kommandoer i stedet for at klikke. Delen `-ExecutionPolicy Bypass` giver Windows lov til at køre netop denne ene fil, denne ene gang; den ændrer ingen indstillinger.
- **I hånden:** kopiér mappen `startkit` til `C:\Users\<dig>\.agents\skills\`. Til Claude Code: kopiér den til `C:\Users\<dig>\.claude\skills\` i stedet, kopiér så `startkit\claude\SKILL.claude.md` hen over `startkit\SKILL.md`, og lav filen `startkit\scripts\projekt\vaerktoej.json` med indholdet `{"vaerktoej": "claude"}`.

</details>

### Trin 4: Start startkittet

1. Lav en mappe til det, du vil bygge (eller brug en, du allerede har). Har du ikke en idé endnu, så lav bare en tom mappe, der hedder fx `mit-foerste-projekt`.
2. Åbn Codex, og åbn den mappe som projekt. I Claude Code: vælg mappen, før du starter en chat (i en terminal: åbn mappen, og skriv `claude`).
3. Skriv dette i chatten, og tryk Enter (i Claude Code skriver du `/startkit` i stedet):

   ```
   $startkit
   ```

Nu tager startkittet over og fortæller dig, hvad der skal ske. Dukker den ikke op, så luk Codex, åbn det igen, og prøv en gang til. Du kan også skrive `/skills` og vælge den på listen.

## Hvad sker der så?

Startkittet taler dansk og spørger højst om 2-3 ting ad gangen.

1. **Introduktion.** Du får at vide, hvad du skal igennem, og hvorfor, før der kommer et eneste spørgsmål.
   Derefter vælger du selv vej: den **korte** (computeren tjekkes, sikkerhedsnettene og overblikket sættes op; typisk 20-40 minutter) eller den **fulde** (alt herunder; typisk 1-2 timer, som kan deles over flere dage). Du kan altid tage resten senere.
2. **Tjek af computeren.** Mangler Git, Node eller noget andet, bliver du hjulpet igennem. Du får også hjælp til at vælge det navn og den e-mail, der bliver stemplet på dit arbejde, så du ikke kommer til at dele noget, du ikke ville.
3. **Superpowers.** Det er en gratis tilføjelse til Codex, som får AI'en til at stille spørgsmål og lægge en plan, før den bygger. Startkittet viser dig, hvordan du installerer den. Den kan undværes.
4. **Interview** om 8 emner. Det er en samtale, ikke et skema: antallet af spørgsmål er ikke fast. Svarer du grundigt, bliver der færre. Typisk 30-60 minutter.
5. **Kortlægning** af det, du allerede har. Der bliver ikke ændret noget.
6. **Undersøgelse og plan.** Du siger ja eller nej til hvert forslag.
7. **Fundamentet** sættes op og prøves for øjnene af dig, så du ser, at sikkerhedsnettene faktisk stopper noget.
8. **Overblikssiden** vises, og du får forslag til, hvad den skal vise for netop dig. Bagefter åbner du den ved at dobbeltklikke på filen `overblik.cmd` i din projektmappe.
9. **Privat sikkerhedskopi på GitHub.** Du bliver hjulpet med konto, skjult e-mail og login. Den kan vælges fra.
10. **Feedback.** Fem korte spørgsmål, to minutter. Se "Giv feedback" herunder.

**Sidder du fast?** Skriv bare "jeg sidder fast" eller "det her forstod jeg ikke". Så forklarer kittet det på en anden måde.

Du kan holde pause når som helst. Skriv `$startkit` igen en anden dag, så fortsætter den, hvor du slap. Jo mere uddybende du svarer, jo bedre passer resultatet til dig.

## Giv feedback (det er derfor, det er en beta)

Kittet noterer undervejs, når noget er uklart eller går galt, og til sidst stiller det fem korte spørgsmål: hvor gik du i stå, hvad forstod du ikke, hvad var overflødigt, hvor lang tid tog det, og ville du anbefale det.

Det hele samles i én fil i dit projekt: `.startkit/feedback.md`. **Kittet sender den aldrig selv.** Du ser den først, du må rette i den, og du bestemmer, om du vil sende den. Der er to måder:

- Send filen (eller kopiér teksten) til den, du fik kittet fra.
- Opret en sag på GitHub: fanen **Issues** øverst på denne side, **New issue**, vælg "Beta-feedback". Alt dér er offentligt.

## Det koster forbrug, og det er meningen

Et AI-abonnement har en grænse for, hvor meget du kan bruge. Det måles i "tokens", som groft sagt er mængden af tekst, AI'en læser og skriver.

At køre startkittet igennem bruger en del af dit forbrug: interviewet er en lang samtale, og undersøgelsen bagefter læser kilder på nettet. Se det som en investering. Du bruger forbrug én gang på at bygge fundamentet, og bagefter sparer du det hver dag, fordi du ikke skal forklare det samme forfra eller rette de samme fejl igen. Der kan ikke loves et tal for, hvor meget du sparer.

Skriv `/status` i Codex for at se dit forbrug, før du starter. Du kan dele forløbet over flere dage; alt bliver gemt.

## Er det sikkert?

- **Kittet sender ingenting nogen steder hen.** Dets programmer kører kun på din egen computer.
- **Det gemmer aldrig dine hemmelige koder.** Nøgletjekket læser dine filer på din egen computer for at finde koder, der ligger forkert, men det viser kun filens navn og kodens slags.
- **Du bestemmer.** Intet bliver ændret, uden at du har set det og sagt ja.
- **Sikkerhedskopien er privat.** Startkittet opretter kun private kopier på GitHub. Vil du dele noget offentligt, er det dit eget valg, og du trykker selv på knappen.
- **Du logger selv ind.** Startkittet beder aldrig om adgangskoder.
- I undersøgelsen søger Codex på nettet, sådan som Codex ellers gør. Det sker gennem din egen Codex, ikke gennem kittet.
- Sikkerhedsnettene er net, ikke mure. De fanger de almindelige fejl, men de kan ikke garantere, at intet går galt.

Alt i kittet er åbent, så enhver kan læse, hvad det gør.

## Hvem står bag, og hvad kan du regne med?

- **Kittet er ikke tilknyttet OpenAI eller Anthropic.** Det er lavet af én person og er ikke lavet, godkendt eller støttet af nogen af dem. Navnene Codex, ChatGPT, Claude og Claude Code tilhører deres ejere og bruges kun til at sige, hvilke værktøjer kittet virker sammen med.
- **Det er gratis, en beta og uden garanti.** Det er lavet i fritiden. Der er ingen aftale om svartid, og jeg kan ikke love, at en fejl bliver rettet.
- **Hjælp gælder selve kittet, ikke dit projekt.** Fejl og forslag til kittet tager jeg gerne imod under **Issues** (se "Giv feedback"). Jeg kan ikke hjælpe med at bygge dit projekt eller løse fejl i det.
- **Ingen tæller dig.** Kittet har ingen telemetri: det sender ingen oplysninger om dig eller din brug af sted. Det eneste, der tælles, er hvor mange gange ZIP-filen hentes, og det gør GitHub, ikke kittet.

## Ordliste

| Ord | Betyder |
|---|---|
| **Codex** | OpenAI's værktøj til at bygge med AI. Kan arbejde i mapperne på din computer. |
| **Claude Code** | Anthropics værktøj til at bygge med AI. Kan også arbejde i mapperne på din computer. |
| **Terminal** | Et vindue, hvor man skriver kommandoer i stedet for at klikke. |
| **Git** | Et program, der gemmer hver udgave af dine filer, så du kan gå tilbage. |
| **Commit** | At gemme en udgave i git. Som at trykke "gem" for hele projektet på én gang. |
| **GitHub** | Et sted på nettet, hvor git kan lægge en kopi af dit projekt. |
| **Lager** (repository) | Et projekt, som git holder styr på. |
| **Node** | Et program, der kører små scripts. Startkittets vagt og overblik bruger det. |
| **Skill** | En opskrift, som Codex kan følge. Startkittet er en skill. |
| **Plugin** | En tilføjelse, der giver Codex flere evner. Superpowers er et plugin. |
| **Hook** | Et lille program, som Codex kører automatisk på bestemte tidspunkter, fx før den ændrer en fil. Vagten er en hook. |
| **Nøgle** (API-nøgle) | En hemmelig kode, der giver adgang til en tjeneste, ofte en man betaler for. Må aldrig deles. |
| **Token** | Måleenheden for, hvor meget tekst AI'en læser og skriver. Dit forbrug tælles i tokens. |
| **Model** | Selve AI'en. Der findes flere: nogle er hurtige og billige, andre klogere og dyrere. |

## For de nysgerrige: hvad lægger kittet i dit projekt?

| Fil | Hvad den gør |
|---|---|
| `AGENTS.md` (i Claude Code: `CLAUDE.md`) | Korte, faste regler, som AI'en læser i hver chat. Dine egne linjer røres ikke. |
| `STATUS.md` | Hvor du er: nu, sidst lavet, næste skridt, åbne problemer. |
| `docs/gentagne-fejl.md` | Fejl, der ikke må ske igen, og om de er låst af en hook eller test. |
| `scripts/startkit/vagt.js` | Vagten: stopper nøgler i kode, sletning af arbejde, og at kontroller springes over. |
| `scripts/startkit/faerdig.js` og `bevis.js` | Færdig-tjekket: "færdig" kræver et grønt bevis for den kode, der ligger der nu. |
| `.githooks/pre-commit` | Nøgletjek før hver commit, og en lås på længden af `AGENTS.md`. |
| `scripts/startkit/overblik.js` | Overblikssiden på din egen computer. |
| `overblik.cmd` | Genvej: dobbeltklik for at åbne overblikssiden i browseren. |
| `.codex/hooks.json` (i Claude Code: `.claude/settings.local.json`) | Fortæller Codex eller Claude Code, at vagten og færdig-tjekket skal køres. |
| `scripts/startkit/fortryd.js` og `.startkit/saadan-fortryder-du.md` | Fortryd-hjælpen: i starten af hver chat tages der automatisk et gemmepunkt af dine filer, og programmet henter dem tilbage. Siden forklarer hvordan. |
| `.startkit/` | Din profil, planen, indstillinger, din feedback og forklaringen "hvorfor blev jeg stoppet". |

Der er to statusfiler, og de er ikke det samme: `STATUS.md` handler om dit projekt og bliver brugt hver dag. `.startkit/status.md` handler kun om, hvor langt du er i startkittets eget forløb, og det er dér, fejl i kittet skrives ned.

`.codex/hooks.json` (og `.claude/settings.local.json` i Claude Code) indeholder den fulde sti til projektmappen, og den rummer typisk dit brugernavn på computeren (`C:\Users\<dig>\...`). Startkittet holder derfor filen ude af git, så den ikke kommer med, hvis du deler projektet. Stien passer alligevel kun til din egen computer. `.startkit/profil.json` rummer dine svar fra interviewet; du bliver spurgt, om den skal med i sikkerhedskopien.

## Fjern det igen

Slet mappen `C:\Users\<dig>\.agents\skills\startkit` (Claude Code: `C:\Users\<dig>\.claude\skills\startkit`). Herunder står Codex' filnavne; i Claude Code hedder de to filer `.claude/settings.local.json` og `CLAUDE.md`. I et projekt: slet `scripts/startkit/`, `.githooks/`, `.startkit/` og startkittets poster i `.codex/hooks.json`, fjern blokken mellem `startkit:start` og `startkit:slut` i `AGENTS.md`, slet `overblik.cmd`, og kør `git config --unset core.hooksPath`. `STATUS.md`, `docs/gentagne-fejl.md` og linjerne under "Tilføjet af startkittet" i `.gitignore` er dine egne nu; behold dem, eller slet dem, som du vil.

## Hvad er afprøvet, og hvad er ikke?

| Del | Status |
|---|---|
| Vagtens regler (hvad tillades og afvises) | Testet automatisk |
| Vagten og færdig-tjekket kørt som programmer med den slags input, Codex ifølge dokumentationen sender | Testet automatisk |
| Opsætningen på et tomt projekt, og at den bevarer dine egne filer | Testet automatisk |
| Nøgletjekket og længdelåsen med rigtig git | Testet automatisk |
| Overblikssiden | Testet automatisk og set i en browser |
| Installationen (`install.ps1`): spørger først, kopierer kun mappen, og gør intet ved et nej | Testet automatisk |
| Tjekket af feedback-filen (finder nøgler, e-mailadresser og stier med brugernavn) | Testet automatisk |
| Den engelske udgave: opsætningen, vagten, nøgletjekket, beviset og overblikssiden med engelsk tekst | Testet automatisk |
| Installationen på begge sprog, kørt på Windows hos GitHub, hver gang noget ændres | Testet automatisk |
| Udgaven til Claude Code: opsætningen, vagten og færdig-tjekket med den slags input, Claude Code sender, på begge sprog | Testet automatisk |
| At vejledningerne til Claude Code passer til dem til Codex (de laves ud fra dem) | Testet automatisk |
| Installationen til Claude Code på begge sprog, kørt på Windows hos GitHub | Testet automatisk |
| At Claude Code faktisk kører vagten (ved kommandoer, når den retter filer, og når den vil læse en `.env`-fil) og færdig-tjekket | Prøvet i Claude Code 2.1.322 i en terminal på Linux |
| At `/startkit` dukker op i Claude Code og begynder med introduktionen | Prøvet i Claude Code 2.1.322 i en terminal på Linux |
| Gemmepunkter og fortryd: at arbejde, der ikke er gemt i git, kommer med, at `.env` aldrig gør, at intet slettes, og at en fortrydelse kan fortrydes | Testet automatisk |
| At Claude Code selv finder gemmepunktet og henter en ødelagt fil tilbage ved at følge fortryd-siden | Prøvet i Claude Code 2.1.322 på Linux |
| At statusfilen læses ind automatisk, når en chat begynder i Claude Code | Testet automatisk, og prøvet i Claude Code 2.1.322 på Linux |
| Gemmepunkter og fortryd på Windows, og gemmepunkter i Codex | **Ikke afprøvet** |
| Selvtesten: at tjekket af opsætningen viser, om Claude Code faktisk kalder vagten | Testet automatisk, og prøvet i Claude Code 2.1.322 på Linux |
| At Claude Codes egne forbudsregler stopper læsning af `.env`, også uden vagten | Prøvet i Claude Code 2.1.322 på Linux |
| Plugin-udgaven: at mapperne passer til kilden, og at en installeret kopi sætter op rigtigt på begge sprog | Testet automatisk |
| Plugin-udgaven installeret med `/plugin` fra en lokal kopi af lageret, og startet med `/startkit` | Prøvet i Claude Code 2.1.322 på Linux |
| Plugin-udgaven installeret direkte fra GitHub med `claude plugin marketplace add` og `claude plugin install`, begge sprog: de installerede mapper er magen til dem i lageret | Prøvet i Claude Code 2.1.322 på Linux |
| Plugin-udgaven installeret i det rigtige Claude Code hos GitHub, på Windows og Linux, hver gang noget ændres: begge plugins installeres, og et projekt sættes op fra den installerede kopi | Testet automatisk |
| Plugin-udgaven startet med `/startkit` på Windows | **Ikke afprøvet** |
| Udgaven til Claude Code på Windows og i Claudes app | **Ikke afprøvet** |
| Dobbeltklik på `installer-claude.cmd` og `install-claude-english.cmd` på en rigtig computer | **Ikke afprøvet** |
| Hjælpen til at installere Superpowers i Claude Code | **Ikke afprøvet** |
| Dobbeltklik på `install-english.cmd` på en rigtig computer | **Ikke afprøvet** |
| Den engelske udgave kørt gennem Codex med et rigtigt menneske | **Ikke afprøvet** |
| Dobbeltklik på `installer.cmd` og `overblik.cmd` på en fremmed computer (Windows kan advare) | **Ikke afprøvet** |
| Den korte vej, feedback-spørgsmålene og noterne undervejs, kørt gennem Codex | **Ikke afprøvet** |
| Kittet brugt på et hold | **Ikke afprøvet** |
| At Codex faktisk kører hooks'ene, som dokumentationen beskriver | **Ikke afprøvet** |
| At vagten også bliver kaldt, når Codex retter filer (og ikke kun ved kommandoer) | **Ikke afprøvet** |
| At `$startkit` dukker op og følger faserne i Codex | **Ikke afprøvet** |
| Hjælpen til at installere Git, Node og Superpowers, sådan som den ser ud i Codex | **Ikke afprøvet** |
| Hjælpen til sikkerhedskopi på GitHub, kørt gennem Codex | **Ikke afprøvet** |
| Installationen på en anden computer end den, kittet er lavet på | **Ikke afprøvet** |
| Hele forløbet med et rigtigt menneske (hverken i Codex eller i Claude Code) | **Ikke afprøvet** |
| Linux: alle test, og plugin-udgaven i det rigtige Claude Code, kører hos GitHub, hver gang noget ændres | Testet automatisk |
| Mac | **Ikke afprøvet** |

Kør testene selv med `node tests/run.js` (kræver git og Node).

Fakta om Codex, Claude Code, GitHub og Superpowers (hvor skills og hooks ligger, hvordan en hook svarer, grænser for `AGENTS.md`, hvor knapperne sidder) er slået op i udgivernes egen dokumentation i november 2026. Ændrer de noget, kan dele af kittet holde op med at passe.

## Meld en fejl

Tryk på fanen **Issues** øverst på denne side, og tryk **New issue**. Skriv tre ting: hvad du gjorde, hvad der skete, og hvad du havde forventet. Kopiér gerne det, Codex har skrevet under "Fejl i kittet" i filen `.startkit/status.md`.

Skriv aldrig nøgler, adgangskoder eller personlige oplysninger i en sag; alt dér er offentligt. Tjek også, at det, du kopierer ind, ikke indeholder stier med dit brugernavn, hvis du ikke vil dele det.

## Støt arbejdet

Kittet er gratis, og det bliver ved med at være gratis. Du skal ikke betale noget for at bruge det, og intet er holdt tilbage.

Har det sparet dig tid, og vil du gerne hjælpe med, at der kommer flere værktøjer som dette, kan du give en donation her: [paypal.me/KasperJensen798](https://paypal.me/KasperJensen798). Feedback hjælper lige så meget.

## Licens

MIT. Du må bruge, ændre og dele kittet frit, så længe licensteksten følger med. Se filen `LICENSE`. Kittet kommer uden garanti. Det er et uofficielt hobbyprojekt og har ikke noget med OpenAI eller Anthropic at gøre.
