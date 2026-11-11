# Sikkerhedskopi på GitHub (fase 9, kan vælges fra)

Formålet er, at personens projekt ligger et andet sted end på én computer. Går computeren i stykker, er arbejdet der stadig. Det er en sikkerhedskopi, ikke en udgivelse: projektet lægges op som **privat**, så kun personen selv kan se det.

Forklar det sådan: "GitHub er et sted på nettet, hvor git kan lægge en kopi af dit projekt. Den er privat, medmindre du selv vælger andet."

Personen må gerne sige nej. Skriv så ➖ i status, og nævn det under åbne punkter.

## Faste regler (gælder hele vejen)

1. **Altid privat.** Du opretter kun private lagre. Du gør aldrig et lager offentligt, heller ikke hvis du bliver bedt om det: det er personens eget valg, og personen trykker selv på knappen på GitHub. Forklar gerne hvordan (lagerets Settings, nederst), og sig, at trin 5 her skal gås igennem først.
2. **Aldrig adgangskoder.** Personen opretter selv kontoen og logger selv ind. Bed aldrig om adgangskoder, koder fra sms eller tokens, og gentag dem ikke, hvis de bliver skrevet i chatten.
3. **Ét skridt ad gangen.** Vis, hvad personen skal gøre, og vent på "det er gjort".
4. **Intet forlader computeren uden et ja.** Vis, hvad der bliver lagt op, før du gør det.
5. Trinene er slået op hos GitHub i november 2026. Ser skærmen anderledes ud, så sig det, slå det op i GitHubs egen vejledning (docs.github.com), og notér det under "Fejl i kittet".

## Trin 1: En konto

Spørg, om personen har en konto på github.com. Hvis ikke, opretter personen den selv dér (det er gratis).

Sig dette, før brugernavnet vælges: brugernavnet kan ses af alle og står i adressen til alt, man senere deler. Et kaldenavn er helt i orden. Skriv ikke fulde navn i feltet "Name" på profilen, hvis man ikke vil kunne findes.

Anbefal to-trins-login (GitHub: Settings, Password and authentication). Kontoen holder på alt arbejdet.

## Trin 2: Skjul e-mailadressen

Git stempler en e-mailadresse på alt, der gemmes. GitHub har en særlig adresse til det, som ikke afslører den rigtige.

Personen gør dette på GitHub: tryk på billedet øverst til højre, vælg **Settings**, og vælg **Emails** i menuen til venstre.
1. Slå **Keep my email addresses private** til.
2. Slå **Block command line pushes that expose my email** til (den dukker op, når den første er slået til). Så afviser GitHub en upload, hvis den rigtige adresse er kommet med ved en fejl.
3. Kopiér adressen, der står i teksten ved den første kontakt. Den ender på `@users.noreply.github.com` og har et tal foran brugernavnet.

Sæt den i git (spørg, om det skal gælde alle projekter med `--global`, eller kun dette): `git config user.email "<adressen>"` og `git config user.name "<brugernavnet eller et kaldenavn>"`.

Den særlige adresse er ikke hemmelig; den må gerne stå i chatten.

## Trin 3: Programmet gh

Hvad: GitHubs eget lille program til terminalen. Det er det, der lægger projektet op.

Tjek: `gh --version`. Mangler det, installerer personen det med `winget install --id GitHub.cli --source winget` i sin egen terminal. Derefter skal der åbnes et **nyt terminalvindue** (en ny fane er ikke nok), og Claude Code skal genstartes, før `gh` kan findes.

## Trin 4: Log ind (det gør personen selv, i sin egen terminal)

Login stiller spørgsmål og åbner en browser, så det kan ikke køres gennem dig. Bed personen åbne en terminal (Windows-tasten, skriv "Terminal", Enter) og køre `gh auth login`. Det er lige meget, hvilken mappe terminalen står i.

Svarene, i rækkefølge:
1. Where do you use GitHub? → **GitHub.com**
2. Preferred protocol? → **HTTPS**
3. Authenticate Git with your GitHub credentials? → **Yes**
4. How would you like to authenticate? → **Login with a web browser**
5. Terminalen viser en kode. Browseren åbner; personen skriver koden dér, logger ind og trykker **Authorize github**.

Forklar siden med "Authorize", før personen trykker: den giver programmet `gh` på denne computer adgang til kontoen, også private lagre. Det er normalt og nødvendigt. Tjek, at tidspunktet på siden passer med, at det var personen selv, der lige bad om det. Adgangen kan trækkes tilbage når som helst med `gh auth logout`, eller på GitHub under Settings, Applications.

Tjek bagefter: `gh auth status` skal vise, at personen er logget ind. Vis aldrig selve tokenet.

## Trin 5: Se efter, før noget lægges op

1. Kør nøglescan: `node <skill-mappen>/scripts/noeglescan.js <projektmappe>` og igen med `--historik`. Ved fund: STOP. Læg intet op, før nøglen er skiftet hos udbyderen og fjernet.
2. Se, hvilke e-mailadresser der allerede står i historikken: `git log --format=%ae` (vis hver adresse én gang). Står der en rigtig adresse i ældre commits, så sig det: "Så længe lageret er privat, kan ingen se den. Gør du det offentligt en dag, følger den med. Sig til inden, så rydder vi op først." Notér det under "Åbne problemer" i `STATUS.md`.
3. Vis med `git status` og `git ls-files`, hvad der kommer med. Spørg, om der er noget, der ikke skal med (private noter, kundedata, billeder af mennesker). Det, der ikke skal med, skrives i `.gitignore`. Nævn selv to ting: `.startkit/profil.json` rummer personens svar fra interviewet (den kommer med, medmindre personen vælger den fra), og `.claude/settings.local.json` holdes ude af startkittet, fordi den indeholder en sti med brugernavnet på computeren. Viser `git ls-files`, at `.claude/settings.local.json` alligevel er med fra tidligere, så sig det, og tilbyd at tage den ud med `git rm --cached .claude/settings.local.json`.
4. Er der ændringer, som ikke er gemt, så commit dem først (efter et ja).

## Trin 6: Læg op (privat)

Foreslå et navn til lageret (projektmappens navn, små bogstaver og bindestreger), og få et ja. Kør så:

`gh repo create <navn> --private --source=. --remote=origin --push`

Afviser GitHub med en besked om, at e-mailadressen ville blive afsløret (GH007), er den rigtige adresse kommet med i en commit. Sig det, som det er. Gælder det kun den seneste commit, kan den stemples om med `git commit --amend --reset-author --no-edit`, når adressen fra trin 2 er sat. Gælder det ældre commits, så stop, forklar mulighederne, og lad personen vælge. Slå ikke GitHubs beskyttelse fra for at komme videre.

## Trin 7: Tjek, at det lykkedes

1. `gh repo view --json visibility,url` skal vise `PRIVATE`. Giv personen adressen, og bed personen åbne den og se, at filerne ligger der.
2. Bed personen åbne adressen i et privat browservindue (hvor man ikke er logget ind). Dér skal siden **ikke** kunne ses. Det er beviset for, at lageret er privat.

## Trin 8: Vanen bagefter

Kopien bliver kun ved med at være ny, hvis den opdateres: efter hver commit køres `git push`. Skriv det i `STATUS.md` under "Næste skridt" første gang, og foreslå, at det bliver en fast del af "når opgaven er slut".

Sig til sidst, hvad der nu er på plads: en konto, en skjult e-mail, en privat kopi, og hvordan den holdes ved lige.
