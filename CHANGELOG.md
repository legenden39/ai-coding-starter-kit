# Ændringer

Versionsnummeret står i `startkit/VERSION` og bliver skrevet i din feedback-fil, så man kan se, hvilken udgave feedbacken gælder.

Alle udgaver er betaer. Ingen af dem er afprøvet i Codex af den, der har lavet kittet.

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
