# Startkittet på et hold: vejledning til underviseren

[English](TEACHING.md) · Dansk

Denne side er til dig, der vil bruge startkittet med et hold, fx 10-20 deltagere, hvoraf de fleste er nybegyndere.

## Læs det her først

- **Det er en beta.** Der vil være ting, der ikke virker som beskrevet.
- **Kittet er ikke afprøvet i Codex** af den, der har lavet det. De enkelte dele er testet automatisk, men hele forløbet er ikke kørt igennem i Codex af et menneske. Se tabellen "Hvad er afprøvet, og hvad er ikke?" i [README](README.da.md).
- **Det er ikke afprøvet på et hold.** Tidsplanen herunder er et skøn, ikke en erfaring.
- Kittet er lavet til Windows. Mac og Linux er ikke afprøvet.

Derfor det vigtigste råd: **kør hele forløbet igennem selv, på din egen computer, før du står foran et hold.** Så ved du, hvor det driller, og du kan melde det tilbage, inden deltagerne rammer det.

## Hvad deltagerne skal have klar hjemmefra

Installation er det, der oftest vælter en undervisningsgang. Bed deltagerne om at have dette på plads i forvejen, og sæt tid af til dem, der ikke nåede det:

1. **En ChatGPT-konto,** som de kan logge ind på, og som har adgang til Codex. Tjek OpenAI's prisside for, hvilke abonnementer der giver adgang, og hvor meget forbrug der følger med. Det ændrer sig.
2. **Codex installeret** og åbnet mindst én gang, så login er klaret.
3. **Git og Node installeret.** Trin 2 i [README](README.da.md) viser hvordan. Kittet kan også hjælpe med det, men det tager tid i et lokale.
4. **Startkittet hentet og installeret** (trin 3 i README: hent ZIP, pak ud, dobbeltklik på `installer.cmd`).
5. **Deres egen computer med rettigheder til at installere programmer.** En arbejdscomputer, der er låst af en it-afdeling, kan ofte ikke installere Git og Node, og Windows kan nægte at køre installationsfilen.
6. **Adgang til deres egen e-mail og telefon,** hvis de vil oprette en GitHub-konto undervejs (den beder om en bekræftelseskode).

Send gerne listen ud en uge før, og bed dem skrive tilbage, når de fire første punkter er klaret.

## Forslag til tidsplan

Den korte vej passer bedst til en enkelt undervisningsgang. Den fulde vej har et interview på typisk 30-60 minutter pr. person, og det egner sig bedre som hjemmearbejde.

**En gang på ca. 2 timer (kort vej):**

| Tid | Hvad |
|---|---|
| 15 min. | Hvorfor et fundament? Gennemgå de seks problemer øverst i README. Spørg, hvem der kender dem. |
| 15 min. | Alle åbner Codex i en tom mappe og skriver `$startkit`. Hjælp dem, der ikke kan få den frem. |
| 20 min. | Introduktionen, valg af kort vej, og tjek af computeren. Her opstår de fleste problemer. |
| 10 min. | Pause. Brug den på dem, der hænger. |
| 30 min. | Det lille interview, fundamentet sættes op, og hooks godkendes. |
| 15 min. | Sikkerhedsnettet prøves: se vagten stoppe noget. Det er her, det giver mening for de fleste. |
| 10 min. | Overblikssiden åbnes med `overblik.cmd`. |
| 5 min. | De fem feedback-spørgsmål. |

**Sikkerhedskopi på GitHub** kræver konto, bekræftelseskoder og login, og det tager let 20-30 minutter på et hold. Tag det som en selvstændig gang eller som hjemmearbejde.

**Den fulde vej** (interview, undersøgelse og plan) kan deltagerne tage hjemme bagefter ved at skrive `$startkit` igen. Den fortsætter, hvor de slap.

## Det, der kan gå galt i et lokale

| Problem | Hvad du kan gøre |
|---|---|
| **Forbruget slipper op.** Kittet bruger en del forbrug, og mange starter med et lille abonnement. | Bed alle skrive `/status` i Codex, før I begynder. Vælg den korte vej. Sig, at forløbet kan fortsættes en anden dag. |
| **`$startkit` dukker ikke op.** | Luk Codex helt, og åbn det igen. Prøv `/skills`. Tjek, at mappen ligger i `C:\Users\<dig>\.agents\skills\startkit`. |
| **Windows advarer om installationsfilen** ("Windows beskyttede din pc"). | Det sker med filer hentet fra nettet. Vis, at man kan trykke "Flere oplysninger" og "Kør alligevel", eller kopiér mappen `startkit` i hånden. Lad deltagerne selv vælge. |
| **Et nyt program kan ikke findes lige efter installation.** | Der skal åbnes et nyt terminalvindue, og Codex skal genstartes. Det er den hyppigste fejl. |
| **Hooks kører ikke.** | Hooks skal godkendes af deltageren selv med `/hooks`, og der skal startes en ny chat bagefter. |
| **Wifi og login.** 20 personer, der logger ind samtidig, kan udløse ekstra sikkerhedstjek. | Få login klaret hjemmefra. |
| **Deltagerne kommer i hver sit tempo.** Kittet er en samtale, så ingen er på samme trin. | Regn med det. Sæt de hurtige til at hjælpe sidemanden, og lad være med at styre holdet trin for trin. |
| **Nogen indsætter en nøgle eller adgangskode i chatten.** | Sig på forhånd, at det aldrig må ske. Sker det, skal nøglen skiftes hos udbyderen. |
| **Skærmen ser anderledes ud end beskrevet.** | Det er forventet i en beta. Bed deltageren skrive til kittet, hvad der står på skærmen. Det bliver noteret som feedback. |

Sig fra start, at alle når som helst kan skrive "jeg sidder fast" eller "det her forstod jeg ikke" til kittet. Så forklarer det på en anden måde og noterer det.

## Sådan samles holdets feedback

Hver deltager får en fil i sit projekt: `.startkit/feedback.md`. Den indeholder kittets version, det, der blev noteret undervejs, og svarene på fem spørgsmål: hvor gik du i stå, hvad forstod du ikke, hvad var overflødigt, hvor lang tid tog det, og ville du anbefale det.

Kittet sender aldrig filen selv. Deltageren ser den først og bestemmer selv.

1. Sæt fem minutter af til sidst, så alle når spørgsmålene.
2. Bed deltagerne sende dig filen, eller kopiere teksten ind i en besked til dig. Sig tydeligt, at det er frivilligt.
3. Saml det, og send det videre til den, du fik kittet fra, eller opret en sag under **Issues** på kittets GitHub-side (vælg "Beta-feedback"). Alt på GitHub er offentligt, så fjern navne først.
4. Læg gerne dine egne iagttagelser ved: hvor gik flest i stå, og hvor lang tid tog hvert trin i virkeligheden? Det er netop det, der mangler i denne vejledning.

Feedback-filen må ikke indeholde nøgler, navne, e-mailadresser eller stier med brugernavn. Kittet ser efter det, før filen vises, men bed deltagerne læse den igennem selv.

## Til øvede deltagere

Øvede kan springe det meste af forklaringen over: kittet spørger til niveau og tilpasser sig. De får mest ud af den fulde vej, og de kan læse kittets filer for at se, hvordan vagten og færdig-tjekket er bygget. Alt er åbent.
