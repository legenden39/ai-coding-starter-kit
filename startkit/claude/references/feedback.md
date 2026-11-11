# Feedback på startkittet (hele vejen, og til sidst i fase 9)

Startkittet er en beta. Det bliver kun bedre, hvis dem, der prøver det, fortæller, hvor det gik galt. Din opgave er at gøre det nemt: du skriver ned undervejs, og personen skal kun svare på fem korte spørgsmål til sidst.

Al feedback samles i én fil: `.startkit/feedback.md`. Findes den ikke endnu, så opret den fra `assets/feedback.skabelon.md`, og skriv kittets version ind (den står i filen `VERSION` i skill-mappen).

## Faste regler

1. **Du sender aldrig noget.** Hverken filen eller dele af den. Personen sender den selv, hvis personen vil.
2. **Intet privat i filen.** Ingen nøgler, adgangskoder, navne, e-mailadresser, stier med brugernavn eller indhold fra personens projekt. Skriv "projektmappen", ikke stien. Skriv "en nøgle til en betalingstjeneste", ikke nøglen.
3. **Skriv det, der skete, ikke en pæn udgave.** "Forstod ikke ordet hook" er nyttigt. "Alt gik fint" er det ikke, hvis det ikke passer.
4. **Personen ser filen, før den forlader computeren,** og må rette og slette i den.

## Undervejs: skriv ned, når det sker

Skriv en kort linje under "Undervejs" i filen, hver gang:
- personen siger noget i stil med "jeg sidder fast", "det forstod jeg ikke", "hvad betyder det?", "det virker ikke" eller "hvorfor skal jeg det?",
- et trin ikke virkede, som der står i kittet (skriv det også i `.startkit/status.md` under "Fejl i kittet"),
- du selv måtte gætte eller slå noget op, fordi kittets vejledning ikke passede,
- personen sprang noget over eller ville stoppe.

Formen er: fase, hvad der skete, og hvad der hjalp. Eksempel: "Fase 2: vidste ikke, hvad en terminal er. Hjalp at få at vide, hvordan man åbner den."

Sig det til personen første gang: "Jeg noterer lige, at det her var uklart, så kittet kan blive bedre. Det bliver ikke sendt nogen steder hen uden dig." Derefter noterer du bare, uden at afbryde.

Fortæl personen i introduktionen, at man når som helst kan skrive "jeg sidder fast" eller "det her forstod jeg ikke", og at det både giver hjælp og bliver noteret.

## Til sidst: fem korte spørgsmål

Stil dem i fase 9, ét eller to ad gangen. Sig først, at det tager to minutter, og at svarene er det, der gør kittet bedre for den næste. Personen må springe over.

1. Hvor gik du i stå?
2. Hvad forstod du ikke?
3. Hvad var overflødigt?
4. Hvor lang tid tog det?
5. Ville du anbefale det til en anden? Hvorfor, eller hvorfor ikke?

Skriv svarene ind med personens egne ord. Udfyld "Om forløbet" (kort eller fuld vej, niveau, hvilke faser der blev gennemført, styresystem).

## Før filen sendes

1. Kør `node <skill-mappen>/scripts/feedback-tjek.js <projektmappe>`. Den ser efter nøgler, e-mailadresser og stier med brugernavn, og viser kun linjenummer og slags. Ret det, den finder.
2. Vis personen hele filen, og spørg: "Er der noget her, du ikke vil dele?" Ret det.
3. Forklar de to måder at sende på, og lad personen vælge. Personen må også lade være.
   - **Til den, du fik kittet fra:** send filen `.startkit/feedback.md` (den ligger i projektmappen), eller kopiér teksten ind i en besked.
   - **Som en sag på GitHub:** gå til kittets side på GitHub, tryk **Issues**, **New issue**, vælg "Beta-feedback", og sæt teksten ind. Sig tydeligt, at alt dér er offentligt og kan læses af alle.

Sig tak, uanset hvad personen vælger.
