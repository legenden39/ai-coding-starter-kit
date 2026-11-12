# Det, de fleste ikke ved (erfaringer, der sparer måneder)

Brug denne fil i fase 5: slå personens problemer op her, før du søger på nettet. Hvert punkt har et problem, en årsag og en løsning. Forklar dem med dine egne ord, og kun dem, der passer til personens svar. Fakta om Codex er slået op i den officielle dokumentation i november 2026; tjek dem igen, hvis noget ikke passer.

## 1. En tekstregel bliver glemt. En hook eller en test bliver ikke.

Problem: "Jeg har sagt det tre gange, og den gør det stadig."
Årsag: Regler i en tekstfil er noget, AI'en læser og vægter. I en lang chat fylder de mindre og mindre. De bliver ikke håndhævet af nogen.
Løsning: Det, der *aldrig* må ske, skal låses af noget, der kører automatisk:
- en **hook** (et lille script, Codex kører før et værktøj bruges, eller før den siger "færdig"),
- en **test** (et script, der fejler, hvis noget er gået i stykker),
- et **tjek før commit** (git nægter at gemme, hvis fx en nøgle er på vej med).
Tekstregler bruges til det, der handler om smag og stil. Låse bruges til det, der ikke må gå galt.

Ærlig grænse: en hook er et sikkerhedsnet, ikke en mur. OpenAI skriver selv, at en hook, der fejler eller løber tør for tid, lader værktøjet køre videre, og at en kreativ kommando kan komme udenom et mønster.

## 2. Korte regelfiler. Lange filer taber information.

Problem: "Jeg har skrevet en lang instruktion, og den følger kun halvdelen."
Årsag: Alt i `AGENTS.md` bliver sendt med i hver eneste chat. En lang fil koster tokens hver gang, og de vigtige regler drukner. Codex stopper desuden med at læse instruktionsfiler, når de tilsammen når en grænse (32 KiB som standard).
Løsning: `AGENTS.md` på højst ca. 60 linjer med de faste regler. Alt andet lægges i `docs/` og læses kun, når opgaven kræver det ("læs `docs/betaling.md`, før du rører betaling"). Startkittet sætter en lås på længden, så filen ikke vokser igen. Låsen stopper først ved 80 linjer, så der er lidt luft over målet på 60.

## 3. Ny opgave = ny chat

Problem: "Den bliver dummere, jo længere vi arbejder." / "Den tænker pludselig meget længe."
Årsag: En chat har en begrænset hukommelse (kontekst). Når den er ved at være fuld, bliver ældre dele presset sammen, og detaljer går tabt. Alt i chatten sendes med hver gang, så en lang chat er også dyr.
Løsning: Én opgave pr. chat. Når opgaven er færdig: opdatér `STATUS.md`, og start en ny chat (`/new`). Er du midt i noget langt, så brug `/compact`, før den selv gør det. `STATUS.md` er det, der bærer viden fra gang til gang, ikke chattens hukommelse.

## 4. Overblik fra gang til gang kommer fra én fil, ikke fra hukommelsen

Problem: "Når jeg kommer tilbage, ved jeg ikke, hvor jeg slap."
Løsning: `STATUS.md` i projektets rod med fire korte afsnit: Nu (hvad arbejder vi på), Sidst lavet, Næste skridt, Åbne problemer. AI'en læser den i starten af hver chat og opdaterer den til sidst. Den må ikke blive lang: gamle ting flyttes til `docs/historik.md`. Kommer du tilbage og er i tvivl, så skriv "hvad nu?": AI'en læser filen, tjekker `git status` og foreslår ét næste skridt og en passende model, og starter først, når du har sagt ja.

## 5. Vælg model efter opgaven

Problem: "Nogle gange tænker den 30 minutter, andre gange 5 sekunder." / "Jeg løber tør for forbrug."
Årsag: Der er to knapper: **modellen** (hvor stærk og dyr) og **tænkeniveauet** (hvor længe den må tænke). De højeste tænkeniveauer kan bruge mange minutter og meget forbrug på en opgave, der ikke kræver det.
Princip:
- Den **mindste og hurtigste** model: enkle rettelser, omdøbning, tekst, små spørgsmål, at finde noget i koden.
- **Mellemmodellen** (standardvalget): almindelig bygning af funktioner efter en klar plan.
- Den **stærkeste** model og højt tænkeniveau: arkitektur, sikkerhed, penge, persondata, fejl, der er svære at finde, og planlægning af noget stort.
En god tommelfingerregel: planlæg med en stærk model, byg med en billigere efter planen.
Modelnavnene skifter flere gange om året. Brug derfor listen fra personens egen `/model`, og skriv personens egen modelguide ind i `.startkit/config.json` (`modelguide`), så den vises i overblikket. Tænkeniveau vælges sammen med modellen i `/model`. Forbrug ses med `/status` og på forbrugssiden under indstillinger.

## 6. Spar tokens de rigtige steder

- Giv kun de filer med, opgaven handler om. Bed ikke AI'en "læse hele projektet".
- Skriv, hvad der er *krævet*, og hvad der er *valgfrit*, så den ikke bygger mere end nødvendigt.
- Slå tilføjelser og MCP-servere fra, som du ikke bruger: hver af dem fylder i hver chat.
- Hold `AGENTS.md` kort (punkt 2).
- Tjek forbruget, før du starter noget stort. Aftal en grænse (fx 85 %), hvor I stopper og gemmer status.

## 7. Agenter: brug dem sjældent og med vilje

Problem: "Jeg satte agenter til at arbejde, og resultatet blev rodet og dyrt."
Årsag: Hver agent starter uden at vide, hvad de andre ved, og skal læse sig ind forfra. Flere agenter ganger forbruget og kan overskrive hinandens arbejde.
Løsning: Én agent ad gangen som udgangspunkt. Flere kun, når opgaverne er helt uafhængige og rører hver sine filer, og så i hver sin arbejdskopi (worktree). En regel, der skal håndhæves, er en hook, ikke en "kontrol-agent".

## 8. "Færdig" skal kunne bevises

Problem: "Den sagde færdig, og det virkede ikke."
Løsning: Aftal, hvad der beviser, at det virker (en test-kommando, at siden åbner uden fejl), og lad et færdig-tjek kræve beviset, før AI'en må stoppe. Startkittets `bevis.js` kører projektets tjek-kommandoer og gemmer resultatet; færdig-hooken afviser "færdig", hvis koden er ændret siden sidste grønne bevis. Bed altid om: "sig, hvad du ikke har prøvet".

## 9. Gentagne fejl bliver til låse

Hver gang en fejl sker for anden gang: skriv den i `docs/gentagne-fejl.md` (dato, hvad skete der, årsag), og spørg: kan en hook eller en test forhindre den? Kolonnen "Låst af" viser, om fejlen kun er en tekstregel (svag) eller har en lås (stærk). Reglerne skal vokse ud fra rigtige fejl, ikke fra fantasi.

## 10. Ret årsagen, ikke symptomet

Problem: AI'en bygger en advarsel eller en omvej i stedet for at fjerne fejlen.
Løsning: Fast spørgsmål i færdig-rapporten: "Hvad var årsagen, og er den fjernet?" Kan årsagen ikke findes, skal det siges højt.
Hjælper en rettelse ikke efter to forsøg, så stop: fejlteksten og det, der er prøvet, skrives i `STATUS.md`, og ejeren starter en ny chat med dem. En chat, der har gættet flere gange, er fuld af sine egne forkerte spor.

## 11. Git er din fortryd-knap og din sikkerhedskopi

- Commit, hver gang noget virker. Så kan alt rulles tilbage.
- Læg en kopi et andet sted (et privat lager på GitHub). En mappe på én computer er ikke en sikkerhedskopi.
- Én gren pr. opgave, så halvfærdigt arbejde ikke blander sig med det, der virker.
- Kommandoer, der sletter arbejde, som ikke er gemt (`git reset --hard`, `git clean`, `git checkout .`, `git stash drop`, `git branch -D`), og sletning uden for projektet eller af hele mapper (`rm -rf src`), kører ejeren selv. Vagten stopper AI'en. Mapper, der kan laves igen (`node_modules`, `dist`, `build`), må den gerne slette.

## 12. Nøgler hører aldrig til i kode eller chat

Nøgler ligger i en `.env`-fil, som står i `.gitignore`. AI'en læser og skriver den aldrig. En nøgle, der har ligget i git eller i en chat, er brændt og skal skiftes hos udbyderen. En ren HTML-fil i browseren kan ikke holde en nøgle hemmelig; den skal ligge bag en server.

## 13. Skjulte valg

Problem: AI'en vælger database, struktur eller bibliotek uden at sige det.
Løsning: Regel i `AGENTS.md`: valg, der er svære at lave om, lægges frem som 2-3 muligheder med fordele, ulemper og en anbefaling, og ejeren vælger. Brug en planlægnings-skill (fx Superpowers' brainstorming) før alt nyt.

## 14. Mapper, der roder

Problem: "Jeg kan ikke finde den nyeste udgave."
Årsag: Kopier som `projekt-ny`, `projekt-final2` opstår, når git ikke bruges som fortryd-knap.
Løsning: Ét projekt = én mappe = ét git-lager. Ingen kopier af mapper; brug grene. En kort `docs/struktur.md`, der siger, hvad der bor hvor, og en regel om, at nye mapper på øverste niveau kræver et ja.

## 15. Forbrugsgrænsen rammer midt i en ændring

Problem: "Grænsen ramte midt i arbejdet, og jeg ved ikke, om koden er i stykker."
Årsag: Chatten stopper, hvor den er, også midt i en ændring af flere filer. Så kan noget være halvt lavet, og den næste chat ved ikke af det.
Før den rammer:
- Opdatér `STATUS.md`, hver gang et delmål er nået, ikke kun til sidst, og commit, når noget virker (punkt 4 og 11). Så er der kun lidt at gå tilbage til.
- Tjek forbruget, før noget stort begynder, og stop ved den grænse, I har aftalt (punkt 6).
Når den er ramt:
1. Vent, til grænsen nulstilles. Tidspunktet står i beskeden. Rør ikke ved noget i mellemtiden, og slet ikke noget for at "rydde op".
2. Start en ny chat, og bed AI'en læse `STATUS.md` og køre `git status` og `git diff --stat`, så den ser, hvilke filer der er halvt rettet. Derefter `node scripts/startkit/bevis.js`, så I ved, om det virker, som det står.
3. Virker det, og mangler der kun lidt: fortsæt, og skriv i `STATUS.md`, hvad der er gjort. Er det i stykker, og I ikke kan se hvorfor: bed AI'en køre `git stash`. Det lægger de halve ændringer til side uden at slette dem (`git stash pop` henter dem igen), og I starter fra den sidste commit, der virkede.
4. Skriv i `STATUS.md` under "Næste skridt", hvad den næste chat skal gøre, i ét afsnit.

## 16. Lær undervejs (tilvalg)

Problem: "Det bliver lavet, men jeg forstår ikke, hvad AI'en gjorde."
Årsag: I et lille forsøg fra Anthropic med udviklere, der lærte et nyt bibliotek, klarede de sig dårligst til prøven bagefter, som lod AI'en gøre det hele. De, der bad om forklaringer og spurgte hvorfor, klarede sig bedre. Forsøget var lille og ikke på begyndere, så det er et fingerpeg, ikke et bevis.
Tilvalg: Spørg personen med ét ja eller nej, om hun eller han vil lære undervejs. Det koster lidt flere ord og dermed lidt mere forbrug. Siger personen nej, så lad det være.
Sådan i praksis: Bed AI'en om at forklare i ord, hvad den lige gjorde og hvorfor, og stil selv spørgsmålet "hvorfor valgte du det?". Vil personen have det hver gang, så sæt svarformen til "forklar altid" (spørgsmål H1 i interviewet).
