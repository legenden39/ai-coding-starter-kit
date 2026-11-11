# Værktøjerne: hjælp til det, der mangler (fase 2)

Læses kun, hvis noget mangler i fase 2. Personen kan være helt ny. Gå derfor ét værktøj igennem ad gangen, og følg samme mønster hver gang:

1. Sig med én sætning, hvad værktøjet er, og hvorfor I skal bruge det.
2. Vis præcis, hvad personen skal gøre. Ét skridt pr. besked, og vent på "det er gjort".
3. Tjek, at det virkede (kommandoen står ved hvert værktøj).
4. Virker det ikke, så bed om det, der står på skærmen, og find årsagen. Gæt ikke.

Regler:
- Personen installerer selv. Du installerer ikke programmer og plugins på egen hånd.
- Efter en installation skal der åbnes et **nyt** terminalvindue (eller Claude Code skal genstartes), før det nye program kan findes. Sig det hver gang; det er den fejl, flest løber ind i.
- Bed aldrig om en adgangskode, og skriv aldrig en for personen.
- Trinene her er slået op hos udgiverne i november 2026. Ser skærmen anderledes ud hos personen, så sig det, slå det op i den officielle vejledning, og notér det under "Fejl i kittet".

## Git

Hvad: et program, der gemmer hver udgave af dine filer. Det er din fortryd-knap: går noget i stykker, kan du gå tilbage til sidst, det virkede.

Sådan: gå til git-scm.com, hent udgaven til Windows, og kør installationsfilen. Tryk "Next" til alle spørgsmål; standardvalgene er fine. (Den, der hellere vil bruge terminalen, kan køre `winget install --id Git.Git -e --source winget`.)

Tjek: åbn et nyt terminalvindue, og kør `git --version`. Der skal stå et versionsnummer.

## Navn og e-mail i git (vigtigt, og det skal gøres før første commit)

Hvad: git stempler et navn og en e-mailadresse på alt, der gemmes. Uden dem nægter git at gemme. Lægger man senere projektet offentligt på nettet, kan alle se dem, og de kan ikke fjernes igen bagefter uden besvær.

Tjek: `git config user.name` og `git config user.email`. Vis personen, hvad der står (eller at der ikke står noget).

Forklar valget, og lad personen bestemme:
- **Navn:** et kaldenavn er helt i orden. Det behøver ikke være det rigtige navn.
- **E-mail:** har personen en GitHub-konto, eller vil personen have en sikkerhedskopi på GitHub (anbefales, se fase 9), så tag trin 1 og 2 i `claude/references/github.md` nu. Dér får personen en særlig adresse fra GitHub, som ikke afslører den rigtige. Vil personen ikke bruge GitHub, så brug `ikke-sat@example.invalid`; den kan ændres senere.

Sæt dem, når personen har valgt. Spørg, om det skal gælde alle projekter på computeren (`git config --global user.name "…"` og `git config --global user.email "…"`) eller kun dette (samme kommandoer uden `--global`, kørt i projektmappen).

Står der allerede en rigtig e-mailadresse, så ret den ikke uden et ja. Forklar, hvad det betyder, og lad personen vælge.

## Node

Hvad: et program, der kan køre små scripts. Startkittets vagt, færdig-tjek og overblik er skrevet til det. Uden Node kan de ikke køre.

Sådan: gå til nodejs.org, hent den udgave, der hedder LTS (den stabile), til Windows, og kør installationsfilen. Standardvalgene er fine.

Tjek: åbn et nyt terminalvindue, og kør `node --version`. Tallet skal være 18 eller højere.

## Superpowers (anbefales, men kan undværes)

Hvad: en gratis tilføjelse (et plugin) til Claude Code. Den får AI'en til at stille spørgsmål og lægge en plan, før den bygger, i stedet for at kaste sig ud i det. Startkittet bruger den i fase 5, hvis den er der.

Sådan:
1. Bed personen skrive dette i chatten og trykke Enter: `/plugin install superpowers@claude-plugins-official`
2. Følg det, der står på skærmen, og sig ja til at installere.

Virker kommandoen ikke:
1. Skriv `/plugin`.
2. Find **Superpowers** på listen (den ligger i Anthropics officielle samling, `claude-plugins-official`).
3. Vælg at installere den.

Start en ny chat bagefter, så den bliver indlæst. `/startkit` fortsætter, hvor I slap.

Tjek: bed personen skrive `/plugin` og se, om Superpowers står som installeret.

Kan personen ikke finde den, eller fejler installationen, så gå videre uden. Kittet virker også uden. Notér det under "Åbne spørgsmål".

## Forbrug og modeller

Bed personen skrive `/usage` (viser forbrug og grænser) og `/model` (viser, hvilke modeller der kan vælges), og fortælle dig, hvad der står. Forklar kort: modellen er "hvor klog og dyr" AI'en er, og forbruget er, hvor meget af abonnementet der er brugt. Gem modellisten i profilen under `vaerktoej.modeller`.
