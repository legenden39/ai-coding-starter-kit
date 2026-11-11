# Ændringer

Versionsnummeret står i `startkit/VERSION` og bliver skrevet i din feedback-fil, så man kan se, hvilken udgave feedbacken gælder.

Alle udgaver er betaer. Ingen af dem er afprøvet i Codex af den, der har lavet kittet.

## 0.3.0-beta (november 2026)

Kittet findes nu også på engelsk.

- **Engelsk udgave:** dobbeltklik på `install-english.cmd`. Interviewet, vejledningerne, reglerne i `AGENTS.md`, skabelonerne og alle beskeder fra programmerne er på engelsk. `installer.cmd` giver stadig den danske udgave, og den er uændret.
- De to udgaver deler de samme programmer og de samme regler, så en rettelse gælder begge. Kun teksten er forskellig.
- I den engelske udgave hedder tre filer i projektet noget andet: `docs/recurring-mistakes.md`, `.startkit/why-was-i-stopped.md` og `overview.cmd`. Programmerne i `scripts/startkit/` har beholdt deres danske navne.
- Programmerne forstår også engelske flag: `--dry-run`, `--history`, `--5h`, `--week` og `--open`.
- Rettet: på Mac og Linux blev nøgletjekket før commit ikke kørt, fordi filen ikke var markeret som kørbar.
- Testene kører nu automatisk på Windows og Linux hos GitHub, hver gang der kommer en ændring.
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
