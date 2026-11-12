# Ændringer

[English](CHANGELOG.md) · Dansk

Versionsnummeret står i `startkit/VERSION` og bliver skrevet i din feedback-fil, så man kan se, hvilken udgave feedbacken gælder.

Alle udgaver er betaer. Ingen af dem er afprøvet i Codex af den, der har lavet kittet.

## 0.5.0-beta (november 2026)

Selvtest af vagten, et ekstra lag for hemmelige filer, og installation som plugin i Claude Code.

- **Selvtest:** vagten noterer, hver gang AI-værktøjet kalder den (kun tidspunkt og værktøjets navn, aldrig hvad AI'en lavede). Tjekket af opsætningen og overblikssiden viser det. Bliver vagten ikke kaldt, kan du nu se det. Før skete det uden en besked. Gælder både Codex og Claude Code.
- **Ekstra lag i Claude Code:** opsætningen skriver Claude Codes egne forbudsregler for `.env`-filer i `.claude/settings.local.json`. De stopper læsning af filerne, også hvis en hook en dag ikke bliver kørt. Dine egne regler i filen bevares.
- **Plugin til Claude Code:** kittet kan installeres med to kommandoer inde i Claude Code (`/plugin marketplace add legenden39/ai-coding-starter-kit` og `/plugin install startkit-da@ai-coding-starter-kit`), uden ZIP-fil. Installationen med dobbeltklik virker som før. Plugin-mapperne laves ud fra kilden (`node tools/byg-plugin.js`), og en test stopper, hvis de kommer ud af trit.
- Har du sat kittet op med en ældre version, så kør opsætningen igen i projektet for at få selvtesten og forbudsreglerne med.
- Prøvet i Claude Code 2.1.322 på Linux: selvtesten, forbudsreglerne, og plugin-installation fra en lokal kopi af lageret.
- Ikke afprøvet: plugin-installation direkte fra GitHub, og alt det nye på Windows.

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
