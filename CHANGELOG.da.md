# Ændringer

[English](CHANGELOG.md) · Dansk

Versionsnummeret står i `startkit/VERSION` og bliver skrevet i din feedback-fil, så man kan se, hvilken udgave feedbacken gælder.

Alle udgaver er betaer. Ingen af dem er afprøvet i Codex af den, der har lavet kittet.

## Ikke udgivet endnu

- **Udgave til Antigravity (Gemini):** fuld udgave på dansk og engelsk med regelfilen `GEMINI.md`, skill-mappen `~/.gemini/config/skills/startkit` (`/startkit`), hooks i `.agents/hooks.json` (`SessionStart`, `PreToolUse`, `PostToolUse` til loop-stop og `Stop`), bygger (`tools/byg-gemini.js` → `startkit/gemini/`), installationsfiler (`installer-gemini.cmd`, `install-gemini-english.cmd`, `install.ps1 -Vaerktoej gemini`) og automatiske tests på begge sprog (`tests/gemini.test.js`). At Antigravity faktisk kalder `.agents/hooks.json` (`PreToolUse`) er bevist i praksis på Windows; hele forløbet er endnu ikke kørt igennem af et menneske i Antigravity.
- **Små rettelser fra gennemgangen:** `opsaet.js` bruger nu det valgte værktøjs navn i stedet for fast "Codex"; Claude-udgaven af `SKILL.md` nævner nu alle fire hooks i `/hooks`; `hvorfor-blev-jeg-stoppet.md` / `why-was-i-stopped.md` forklarer nu også loop-stoppet; `tjek-opsaetning.js` tjekker nu også `statuslinje.js`, `haenger-sammen.md` og `foer-du-deler.md`; små dansk/engelsk-rettelser i README; `tests/noeglescan.test.js` virker nu på Windows, også når Git's `usr\bin` ikke ligger i `PATH`.
- **Vagten i Antigravity ser på argumenterne, ikke kun navnet:** Antigravitys værktøjsnavne er ikke dokumenteret samlet, så vagten kaldes nu før alle værktøjer (`matcher: ".*"`) og tjekker alle stier og alt indhold, uanset hvad værktøjet hedder. Før slap fx `write_to_file` på `.agents/hooks.json` og `view_file` på `.env` igennem. Loop-stoppet stopper på samme måde alt, der ikke ligner læsning.
- **Codex beholder vejledningen om `/hooks`:** opsætningen siger igen til Codex-brugere, at hooks skal godkendes med `/hooks`. Antigravity har sin egen tekst.
- **Neutralt eksempel i `haenger-sammen.md`:** eksemplet bruger nu en hjemmeside (forside, om os, kontakt) på begge sprog.

## 0.10.0-beta (november 2026)

Kittet bygger kun fundamentet (seks korte spørgsmål i stedet for det lange interview), en kort og visuel README, loop-stop og fem forbedringer fra et rigtigt projekt.

- **Statuslinje, spærring og sikkerhedstjek:** i Claude Code viser en statuslinje nu, hvor meget af chatten der er brugt, og siger ved 70 %, at det er tid til en ny chat (`scripts/startkit/statuslinje.js`); dokumentationen beskriver statuslinjen i terminalen, ikke i skrivebordsappen. Opsætningen sætter `permissions.blockWritesOutsideWorkingDirectories`, så AI'en ikke skriver filer uden for projektmappen (kun Claude Code). En statuslinje eller et valg, personen selv har lavet, bevares. Regelfilen tilbyder et ugentligt sikkerhedstjek, der kun læser, og projekttrinnet foreslår forbud mod direkte udrulning. Begge sprog, test i `forbedringer`. Ikke afprøvet i en rigtig chat.

- **Passer det nye ind i resten?** Ny fil i projektet: `docs/haenger-sammen.md`, en liste over ting, der hører sammen ("en ny side for et sted skal også have en gennemgang og et menupunkt"). Regelfilen og færdig-tjekket beder AI'en se på ting af samme slags, sige, hvad det nye mangler, og foreslå nye linjer og en test, når det er vigtigt. Låse i listen tjekkes af beviset som i fejllisten. Begge sprog, test i `forbedringer`. Idéen kommer fra et rigtigt projekt, hvor en ny side ikke fik den gennemgang, de andre sider havde.

- **Låsene i fejllisten tjekkes:** står der en sti i backticks under "Låst af" i `docs/gentagne-fejl.md`, bliver beviset rødt, hvis filen forsvinder, og det siger hvilken. Et punkt, der er låst med "tekstregel" eller "nej", tjekkes ikke. Listen siger nu også, at AI'en spørger, om et punkt kan fjernes, når det ikke er sket i flere måneder. Begge sprog, test i `forbedringer`.

- **Ét samlet ja, ingen stilstand, prøv det som bruger:** regelfilen siger nu, at AI'en samler sine spørgsmål i én liste og viser en plan, som ejerens ja dækker; at hver tur slutter med arbejde, der kører, eller ét spørgsmål øverst; og at "færdig" også kræver, at det er prøvet som en bruger. Færdig-tjekket beder om det samme, når det stopper AI'en. Begge sprog, ny test `forbedringer`. Kun tekst og en besked: om AI'en følger det, er ikke afprøvet.

- **Fuld test én gang om ugen:** `.startkit/config.json` kan have en langsom fuld test under `fuld_tjek`. Beviset kører de hurtige tjek hver gang og den fulde test kun, når den sidst var grøn for over 7 dage siden (`fuld_dage`), eller med `--fuld`. Tidspunktet gemmes i `.startkit/fuld-tjek.json` (holdt ude af git). Beviset siger altid, hvorfor den fulde test kørte eller ikke kørte. Ny test `fuldtest` på dansk og engelsk. Idéen kommer fra et rigtigt projekt, hvor hele testpakken tog en halv time pr. ændring.

- **Ny, kortere README:** øverst står kun det vigtigste: en tegning af forløbet, en tabel over, hvad man får (uden og med kittet), og tre trin til at komme i gang. Alt det andet (forbehold, trin for trin, sikkerhed, ordliste, hvad der er afprøvet) står uændret længere nede, foldet sammen. Begge sprog. Plugin-vejen er stadig kun afprøvet på Linux.

- **Kittet bygger kun fundamentet:** forløbet var for stort, fordi det også interviewede om selve projektet, undersøgte løsninger og byggede et skræddersyet lag, og brugeren mistede overblikket. Nu er forløbet: introduktion, tjek af computeren, nøglescan, et lille interview (seks spørgsmål om, hvordan AI'en skal opføre sig), fundamentet (regler, vagt, færdig-tjek, nøgletjek, gemmepunkter, fejlliste), prøve af sikkerhedsnettet og afslutning (overblik, første commit, sikkerhedskopi, feedback). Valget mellem kort og fuld vej er væk, og faserne er omnummereret 1-6. Det grundige interview, kortlægning, undersøgelse og plan og det skræddersyede lag ligger nu i et eget, valgfrit projekttrin (`references/projekt-trin.md`), som først tages bagefter i en ny chat. `kort-vej.md` hedder nu `lille-interview.md`. Regel 12 i kittet: hold dig til fundamentet. Introduktion, forløbsskabelon, README, undervisningsfiler og tekster er rettet, og testene følger det nye forløb. Det nye forløb er ikke kørt igennem i en rigtig chat.

- **Loop-stop (trin 1 af "én kommando"):** kommer den samme kommando med den samme fejl to gange i én chat, afviser vagten den næste handling én gang med hvad, hvorfor og hvad nu; tredje gang stoppes der igen med henvisning til fejllisten og en ny chat. Fejl tælles i en ny `fejl.js` (hook på fejlede kommandoer) og `loopstop.js`; tal, tidspunkter og stier (også med mellemrum) tages ud, før fejl sammenlignes. Der gemmes kun et fingeraftryk, et antal og et kort uddrag; adgangskoder i adresser (`https://bruger:kode@...`) og efter `password=`, `token:` o.l. skjules i uddraget. Kun Claude Code; Codex har ingen hændelse for fejl, så dér er det kun en regel. Test på dansk og engelsk (`loopstop`, `laesning`). Ikke afprøvet i en rigtig chat.

- **Vagten kan køre i kun-registrér-tilstand:** står `"vagt": "kun-registrer"` i `.startkit/config.json`, tager vagten stadig gemmepunktet og husker chattens start (færdig-tjekket kræver det), men afviser intet. Det er til kittets egen kilderepo, hvor vagtens egne filer er det, der bygges. Almindelige projekter er uændrede: AI'en kan ikke slå kontakten til, fordi indstillingsfilen er beskyttet, og en ukendt værdi eller ødelagt fil giver den strenge vagt. Nyt script `tools/hooks-lokalt.js` sætter det op lokalt uden en kopi af kittets scripts. Test på dansk og engelsk værdi. Valget og det, der ikke er dækket, står i `docs/hooks-paa-kittet-selv.md`. Ikke afprøvet i en rigtig chat i skrivebordsappen, ikke på Mac eller Linux.

## 0.9.0-beta (november 2026)

Modelvalg ved hver opgave, hurtigt nøglescan og en mere præcis README.

- **README:** afsnittet "Hvem står bag, og hvad kan du regne med?" er gjort mere præcist: kittet er lavet af én person, som selv er ny til teknik, sammen med AI; sager under Issues bliver læst, men der loves ikke svar; og GitHub tæller også besøg på siden, ikke kun hentninger (kun tal, ingen navne).

- **Nøglescannet er hurtigt i store projekter:** scannet og nøgletjekket før commit startede det lille søgeprogram `grep` ca. 14 gange pr. fil. På Windows koster hver programstart ca. 50-70 ms, så et projekt med 222 filer tog over to minutter og så ud til at hænge. Nu findes de filer, der rammer et mønster, først med få kald, og kun de filer får det grundige tjek. Målt på samme mappe og samme maskine: fra 2 min. 24 sek. til ca. 1 sek. Mønstrene og beskederne er de samme. Ny test, der tæller programstarter i stedet for tid. Stadig langsomt: en commit med mange filer, hvor der faktisk er en nøgle, for så gås alle filerne igennem for at finde hvor. Afprøvet på Windows og Linux, ikke på Mac.

- **Modelvalg ved hver opgave:** én ny linje i reglerne. AI'en siger ved hver ny opgave, hvilken model den kræver: den mindste (tekst, rutine, at køre kommandoer), mellemmodellen (almindelig bygning efter en klar plan) eller den stærkeste (fejlsøgning, gennemgang, design, sikkerhed). Det er de samme tre trin som i vidensnotatets afsnit 5, og har du en modelguide, følger AI'en den. Den siger fra, hvis modellen ikke passer, eller du skifter til en for svag midt i opgaven. Før stod modelvalget kun i "hvad nu?" og i forslaget til næste chat. Det er en tekstregel og ikke en lås: den kan blive glemt i en lang chat, og den er ikke afprøvet i en rigtig chat.

## 0.8.0-beta (november 2026)

Forklar-vane som tilvalg og ærlige oplysninger i README.

- **Forklar-vane (tilvalg):** nyt afsnit 16 i vidensnotatet og et ja/nej-tilbud i afslutningen. Personen kan vælge at lære undervejs. I Claude Code peges der på de indbyggede svarstile `/output-style Explanatory` og `/output-style Learning` og på, hvordan de slås fra igen (læst i Anthropics dokumentation, ikke afprøvet i en rigtig chat). I Codex er det en vane (bed om forklaring og "hvorfor"), fordi der ikke er fundet noget tilsvarende. Har personen allerede sagt ja til forklaringer i interviewet, bliver der ikke spurgt igen. Grundlaget er ét lille forsøg på udviklere, hvor sammenhængen kun er set i grupper på få personer, så afsnittet siger, at det er et fingerpeg og ikke et bevis, og at forsøget ikke viser, at forklaringerne var årsagen.
- **README:** nyt afsnit "Hvem står bag, og hvad kan du regne med?": kittet er ikke tilknyttet OpenAI eller Anthropic, det er gratis og uden garanti, hjælp gælder kittet og ikke dit projekt, og kittet har ingen telemetri.
- **Vedligehold:** GitHub-handlingerne er opdateret til Node 24, så advarslen om Node 20 er væk.

## 0.7.0-beta (november 2026)

Fortryd-hjælp med gemmepunkter, og statusfilen læses ind af sig selv i Claude Code.

- **Gemmepunkter:** i starten af hver chat tager kittet automatisk et øjebliksbillede af alle filer i projektet, også dem, der aldrig nåede at blive gemt i git. Det rører hverken dine filer, din gren eller din historik, og det bliver på din egen computer. Filer i `.gitignore` (fx `.env` med dine nøgler) kommer aldrig med. De 30 nyeste gemmes. Gælder både Codex og Claude Code.
- **Fortryd:** `node scripts/startkit/fortryd.js` viser gemmepunkterne. `--vis 1` viser, hvilke filer der er anderledes nu, og `--hent 1` henter dem tilbage (eller kun én fil). Før noget hentes, gemmes det, der ligger der nu, så en fortrydelse også kan fortrydes. Intet bliver slettet.
- **En side om at gå tilbage:** opsætningen skriver `.startkit/saadan-fortryder-du.md` (engelsk: `.startkit/how-to-undo.md`) med de fire måder: fortryd i selve værktøjet, gemmepunkter, git og kopien på GitHub. Én ny linje i reglerne peger på den.
- **Statusfilen ved chattens start (Claude Code):** `STATUS.md` og listen over gentagne fejl læses nu ind automatisk, når en chat begynder, fortsætter eller bliver kortet ned. I Codex læser AI'en dem stadig, fordi reglerne siger det; dér er den automatiske vej ikke bekræftet.
- Overblikssiden viser seneste gemmepunkt.
- Rettet: vagten afviste en sammensat kommando, der kun læste og skrev tekst ud (`echo`), som om den ændrede kittets kontroller. Fundet ved prøven i Claude Code.
- Har du sat kittet op med en ældre version, så kør opsætningen igen i projektet for at få det nye med.
- Prøvet i Claude Code 2.1.322 på Linux: statusfilen blev læst ind uden værktøjer, og Claude fandt selv gemmepunktet og hentede en ødelagt fil tilbage ved at følge siden.
- Ikke afprøvet: gemmepunkter og fortryd på Windows ud over de automatiske test, gemmepunkter i en rigtig Codex, og `/rewind`-delen af siden.

## 0.6.0-beta (november 2026)

Vagten stopper nu sletning, ikke kun to git-kommandoer.

- **Et hul er lukket:** hidtil stoppede vagten kun `git reset --hard` og `git clean`. Almindelig sletning slap igennem, og README lovede mere. `rm -rf ~/`, `rm -rf src`, `rmdir /s /q src`, `del /s /q *.*`, `Remove-Item -Recurse -Force` på en mappe og `git checkout .` blev alle tilladt.
- **Nu stoppet:** sletning uden for projektmappen eller i hjemmemappen, "alt" i en mappe, hele mapper med indhold, stier med en variabel i (en tom variabel kan gøre `"$MAPPE/"` til `/`), `find ... -delete` uden `-name`-filter, og de git-kommandoer, der smider ugemte ændringer væk (`git checkout .`, `git restore .`, `git checkout -f`, `git switch -f`, `git stash drop`, `git branch -D`).
- **Stadig tilladt:** enkelte filer i projektet, mapper der kan laves igen (`node_modules`, `dist`, `build`, `.next`, `coverage` og lignende), `find ... -name ... -delete`, `git checkout -- én-fil`, `git restore --staged` og `git branch -d`.
- Beskeden siger, hvad der er galt, og at ejeren selv kan køre kommandoen. På begge sprog og i begge udgaver (Codex og Claude Code).
- Ærlig grænse: vagten læser kommandoens tekst. Sletning gennem et script, eller gennem `node -e` og lignende, kan den ikke se.
- **Løkke-bryder:** én ny linje i de regler, kittet skriver (`AGENTS.md` eller `CLAUDE.md`): hjælper en rettelse ikke efter to forsøg, stopper AI'en, skriver fejlteksten ordret og det, den har prøvet, i `STATUS.md`, og foreslår en ny chat. Fejlretning i ring er den hyppigste klage fra begyndere. Projekter, der er sat op før, får linjen, når opsætningen køres igen.
- **Når forbrugsgrænsen rammer midt i en ændring:** et nyt punkt 15 i kittets vidensnotat med en kort opskrift (vent, læs `STATUS.md`, tjek `git status` og kør beviset, og `git stash`, hvis det er i stykker), og én ny linje i reglerne: opdatér `STATUS.md` ved hvert delmål, ikke kun til sidst.
- **Før du deler (udkast):** opsætningen skriver nu `docs/foer-du-deler.md` (engelsk: `docs/before-you-share.md`), en kort tjekliste, som AI'en går igennem med ejeren, før et link, en hjemmeside eller en app lægges ud: tre spørgsmål først, så hemmeligheder i browserkode, login og åbne databaser, det der kan koste penge, rigtige menneskers oplysninger, og hvad en fremmed ser. AI'en svarer i tre lister (tjekket, skal rettes, ikke tjekket) og siger aldrig "det er sikkert". Én ny linje i reglerne peger på filen. Projekter, der er sat op før, får den, når opsætningen køres igen.
- Det her er et første udkast. Det er bygget ud fra researchrapporten og almindelig viden, ikke ud fra begyndere, der har brugt det. Det er en tjekliste, ikke en sikkerhedsgennemgang, og det erstatter ikke en fagperson, når der er penge, helbred, børn eller mange brugere.
- **"Hvad nu?":** én ny linje i reglerne. Skriver ejeren "hvad nu?" i en chat, læser AI'en `STATUS.md`, kører `git status`, ser de seneste commits og svarer kort: hvor vi er, ét forslag til næste opgave, om åbne problemer eller ugemte ændringer skal først, og hvilken model der passer. Den starter ikke, før ejeren har sagt ja. Det er en regel, ikke en kommando, så den virker ens i Codex og Claude Code, og en regel kan blive glemt (se punkt 1 i vidensnotatet).
- README er rettet: Linux testes automatisk hos GitHub, Mac er ikke afprøvet.
- Fundet ved at læse den tidligere researchrapport. Ikke prøvet i Claude Code eller Codex på en rigtig computer, kun i de automatiske test, som nu har over 230 tilfælde for vagten.

## 0.5.0-beta (november 2026)

Selvtest af vagten, et ekstra lag for hemmelige filer, og installation som plugin i Claude Code.

- **Selvtest:** vagten noterer, hver gang AI-værktøjet kalder den (kun tidspunkt og værktøjets navn, aldrig hvad AI'en lavede). Tjekket af opsætningen og overblikssiden viser det. Bliver vagten ikke kaldt, kan du nu se det. Før skete det uden en besked. Gælder både Codex og Claude Code.
- **Ekstra lag i Claude Code:** opsætningen skriver Claude Codes egne forbudsregler for `.env`-filer i `.claude/settings.local.json`. De stopper læsning af filerne, også hvis en hook en dag ikke bliver kørt. Dine egne regler i filen bevares.
- **Plugin til Claude Code:** kittet kan installeres med to kommandoer inde i Claude Code (`/plugin marketplace add legenden39/ai-coding-starter-kit` og `/plugin install startkit-da@ai-coding-starter-kit`), uden ZIP-fil. Installationen med dobbeltklik virker som før. Plugin-mapperne laves ud fra kilden (`node tools/byg-plugin.js`), og en test stopper, hvis de kommer ud af trit.
- Har du sat kittet op med en ældre version, så kør opsætningen igen i projektet for at få selvtesten og forbudsreglerne med.
- Prøvet i Claude Code 2.1.322 på Linux: selvtesten, forbudsreglerne, og plugin-installation fra en lokal kopi af lageret.
- Prøvet efter udgivelsen, i Claude Code 2.1.322 på Linux: plugin-installation direkte fra GitHub, på begge sprog.
- Testet automatisk efter udgivelsen: plugin-installation i det rigtige Claude Code hos GitHub, på Windows og Linux (`node tests/plugin-installation.js`).
- Ikke afprøvet: selvtesten og forbudsreglerne i Claude Code på Windows, og `/startkit` fra pluginnet på Windows.

## 0.4.0-beta (november 2026)

Kittet findes nu også til Claude Code.

- **Udgave til Claude Code:** dobbeltklik på `installer-claude.cmd` (dansk) eller `install-claude-english.cmd` (engelsk). Kittet lægges i `.claude\skills`, startes med `/startkit`, og sætter `CLAUDE.md` og `.claude/settings.local.json` op i stedet for `AGENTS.md` og `.codex/hooks.json`. `installer.cmd` og `install-english.cmd` giver stadig udgaven til Codex, og den er uændret.
- De to udgaver deler de samme programmer og de samme regler, så en rettelse gælder begge. Vejledningerne til Claude Code laves ud fra dem til Codex (`node tools/byg-claude.js`), og en test stopper, hvis de kommer ud af trit.
- I Claude Code kaldes vagten også, når AI'en vil læse en fil med sit eget værktøj, så en `.env`-fil ikke kan læses uden om den.
- Vagten beskytter nu også Claude Codes indstillinger (`.claude/settings.json` og `.claude/settings.local.json`), i begge udgaver. I udgaven til Claude Code gælder længdelåsen `CLAUDE.md` i stedet for `AGENTS.md`.
- Prøvet i Claude Code 2.1.322 i en terminal på Linux: vagten stopper `git commit --no-verify`, skrivning og læsning af `.env`, færdig-tjekket kræver et bevis, og `/startkit` begynder med introduktionen.
- Ikke afprøvet: udgaven til Claude Code på Windows og i Claudes app, dobbeltklik på de to nye installationsfiler, og hele forløbet med et rigtigt menneske.

## 0.3.0-beta (november 2026)

Kittet findes nu også på engelsk.

- **Engelsk udgave:** dobbeltklik på `install-english.cmd`. Interviewet, vejledningerne, reglerne i `AGENTS.md`, skabelonerne og alle beskeder fra programmerne er på engelsk. `installer.cmd` giver stadig den danske udgave, og den er uændret.
- De to udgaver deler de samme programmer og de samme regler, så en rettelse gælder begge. Kun teksten er forskellig.
- I den engelske udgave hedder tre filer i projektet noget andet: `docs/recurring-mistakes.md`, `.startkit/why-was-i-stopped.md` og `overview.cmd`. Programmerne i `scripts/startkit/` har beholdt deres danske navne.
- Programmerne forstår også engelske flag: `--dry-run`, `--history`, `--5h`, `--week` og `--open`.
- Rettet: på Mac og Linux blev nøgletjekket før commit ikke kørt, fordi filen ikke var markeret som kørbar.
- Testene kører nu automatisk på Windows og Linux hos GitHub, hver gang der kommer en ændring.
- Kittet bliver nu lagt ud som en ZIP-fil under Releases, og README linker direkte til den. GitHub tæller, hvor mange gange den hentes; kittet selv sender stadig ingenting.
- Afsnit om at støtte arbejdet nederst i README, og en Sponsor-knap på GitHub.
- Den engelske udgave og begge installationer er testet automatisk (installationen på Windows hos GitHub), men den engelske udgave er ikke afprøvet i Codex, og ingen har dobbeltklikket på `install-english.cmd` på en rigtig computer.

## 0.2.0-beta (november 2026)

Første udgave til flere testere og til undervisning.

- **Installation med dobbeltklik:** `installer.cmd`. Den fortæller, hvad der sker, og spørger om ja, før noget kopieres.
- **Genvej til overblikket:** `overblik.cmd` i dit projekt åbner overblikssiden i browseren med et dobbeltklik.
- **Feedback bygget ind:** kittet noterer undervejs, når noget er uklart, stiller fem korte spørgsmål til sidst og samler det i `.startkit/feedback.md`. Det sender aldrig noget selv.
- **Kort eller fuld vej:** du vælger selv efter introduktionen.
- **Hjælp fra A til Z:** Git, navn og e-mail i git, Node, Superpowers og en privat sikkerhedskopi på GitHub.
- **Overblikket vises altid,** og kittet foreslår selv forbedringer ud fra dine svar.
- `.codex/hooks.json` holdes ude af git, fordi stien i den rummer dit brugernavn på computeren.
- README skrevet om til nybegyndere, på dansk og engelsk, med ordliste.
- Vejledning til undervisning: `UNDERVISNING.md` (engelsk: `TEACHING.md`).
- Skabelon til feedback som sag på GitHub.

## 0.1.0-beta (november 2026)

Første udgave: introduktion, interview om 8 emner, undersøgelse og plan, det faste fundament (regler, vagt, færdig-tjek, nøgletjek, statusfil) og overblikssiden.
