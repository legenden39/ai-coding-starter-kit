# Oplæg: "nyt projekt"-vej i startkittet

Status: kun et oplæg. Intet er bygget, og ingen kode eller regler i kittet er ændret. Ejeren vælger, før noget laves.
Model til selve bygningen: stærk (design af kittet og regler om, hvad der må kopieres). Teksten og testene bagefter kan en billigere model klare.

## Problemet i én sætning

Startkittet sætter ét projekt op ad gangen. Åbner brugeren en ny mappe, ved kittet ikke, hvem personen er, og starter forfra ved fase 1: introduktion, valg af vej, interview. Navn, niveau, svarform og "aldrig uden at spørge" bliver spurgt om igen.

## Hvad jeg har undersøgt (læst i koden, ikke afprøvet)

- **Alt ligger i projektmappen.** `.startkit/profil.json`, `status.md`, `config.json`, vagten og færdig-tjekket hører til den mappe, de er sat op i. Kittets scripts (`opsaet.js`, `projekt/*.js`) læser kun derfra.
- **Kittet skriver intet i brugerens egen mappe på computeren.** Det eneste uden for projektet er en lille midlertidig fil pr. chat (`tilstand.js`, "hvordan koden så ud, da chatten begyndte"). Installationen lægger kittet selv i skill-mappen under brugermappen, men ikke noget om personen.
- **Skill-mappen er ikke et sted til personlige filer.** `install.ps1` sletter hele mappen og kopierer kittet ind igen ved en opdatering (linje 52-54). Om et plugin-opdatering gør det samme, har jeg ikke undersøgt.
- **Hooks er pr. projekt.** `.claude/settings.local.json` (Claude Code) og `.codex/hooks.json` (Codex) ligger i projektmappen og holdes ude af git. Et nyt projekt har derfor ingen vagt, før opsætningen er kørt dér og hooks er godkendt. Det ændrer ingen af mulighederne herunder: **uanset hvad skal opsætningen køres i hvert nyt projekt.**
- **`profil.json` er ikke i `.gitignore`-tillægget.** README siger, at personen spørges, om den skal med i sikkerhedskopien. Jeg har ikke tjekket præcist, hvor i forløbet det sker. Navnet står desuden i regelfilen (`AGENTS.md`/`CLAUDE.md`, "Ejer: ..."), som typisk er i git. Personlige oplysninger ligger altså allerede i projektfiler, ved design.
- Profilen har to slags felter:
  - **Hører til personen** (kan genbruges): `person.navn`, `person.niveau`, `regler.*` (aldrig uden ok, svarform, ved tvivl, bestemmer selv), `vaerktoej`, `overblik`.
  - **Hører til projektet** (må ikke kopieres): `projekter`, `valgt_projekt`, `projektmappe`, `tjek_kommandoer`, `virkelig.*` (betaling, persondata, mails), `sikkerhed.*` (nøgletyper), `aabne`, `vej`.
  - Det vigtigste: kopieres `virkelig.*` fra et legeprojekt til en webshop, springer kittet tjeklisten for rigtig drift over. Den fejl er dyr.

## Hvad der skal ske, uanset valg (det nye projekts forløb)

1. Personlige svar genbruges, efter et "passer det stadig?".
2. Projektspørgsmålene stilles på ny: navn, hvad det skal kunne, skal det ud til rigtige mennesker, betaling/mails, persondata/login, nøgletyper.
3. Opsætningen køres i den nye mappe (først med `--toer`, som kittet gør i dag), og personen godkender hooks og starter en ny chat.

## Tre muligheder

### (a) Kun tekst i SKILL: "peg på et tidligere projekt"

I fase 0 ("find projektmappen") spørger AI'en, hvis mappen ikke har `.startkit/`: "Har du sat startkittet op i et andet projekt? Så kan jeg hente dine svar derfra." Personen peger på mappen (adressen kopieres fra Stifinder, som i interviewets D6). AI'en læser den gamle `.startkit/profil.json`, viser de navngivne felter (navn, niveau, regler), og får et ja, før de bruges.

- **Rører:** `startkit/SKILL.md` og `SKILL.claude.md` (dansk og engelsk, plus `kort-vej.md`). Ingen kode.
- **Persondata:** intet nyt sted. Svarene flyttes fra én projektmappe til en anden, som personen selv peger på. Samme risiko som i dag.
- **Svaghed:** det er en tekstregel. Intet stopper AI'en i at kopiere for meget (fx `virkelig.*`). Det kan heller ikke testes med kode, kun at teksten står der.
- **Kan ikke afprøves af mig:** om AI'en i Codex/Claude Code må læse en anden mappe end arbejdsmappen (sandkasse og tilladelser). Det er ikke undersøgt.
- **Pris:** lav. En time eller to med tekst og tekst-tests på begge sprog.

### (b) En personlig fil i brugerens egen mappe

Kittet gemmer et lille "personkort" (kun navn, niveau, regler) i en mappe i brugerens hjem og læser det ved hvert nyt projekt.

- **Fordel:** mest glidende. Personen skal ikke finde en gammel mappe.
- **Rører:** nye scripts til at skrive og læse kortet, nyt sted uden for projektet, tekst og tests på begge sprog, begge værktøjer (Codex og Claude Code skal enes om stedet).
- **Persondata:** det er første gang, kittet skriver uden for projektmappen. Personen skal give samtykke, og der skal være en måde at slette kortet på. Indholdet kan holdes smalt, men det er en ny ting at forklare og forsvare.
- **Kan ikke ligge i skill-mappen** (slettes ved opdatering, se ovenfor).
- **Kan ikke afprøves af mig:** Mac/Linux-stier, om Codex' sandkasse må skrive i hjemmemappen, delt computer med flere personer.
- **Pris:** høj. Størst design, mest at gå galt, og det bryder kittets nuværende løfte om, at det kun rører projektmappen.

### (c) Et script, der opretter nyt projekt ud fra et gammelt

`node scripts/nyt-projekt.js <gammel-mappe> <ny-mappe>` kopierer **kun en fast liste af personlige felter** (navn, niveau, regler, værktøj, overblik) fra den gamle profil til en ny, delvis `.startkit/profil.json`. Alt andet starter tomt. Derefter fortsætter AI'en med projektspørgsmålene og opsætningen.

- **Rører:** ét nyt script, nogle få linjer i SKILL om, hvornår det køres, tekster og tests på dansk og engelsk (engelske feltnavne er allerede håndteret af `normaliser` i `opsaet.js`). `profil.json` er ikke en af de filer, vagten beskytter, så scriptet kan skrive den.
- **Persondata:** intet nyt sted. Kun den fælles feltliste kopieres, og scriptet kan afvise noget, der ligner en nøgle (`harNoegle` findes allerede).
- **Styrke:** listen er kode, så en test kan **bevise**, at `virkelig.*`, `sikkerhed.*`, `projekter` og `tjek_kommandoer` ikke kommer med. Det er en lås og ikke en tekstregel, i tråd med projektets egen regel om at foretrække låse.
- **Svaghed:** personen skal stadig pege på den gamle mappe. Scriptet læser en anden mappe end arbejdsmappen, så tilladelsesspørgsmålet fra (a) gælder også her.
- **Kan ikke afprøves af mig:** Mac/Linux og om skrivebordsappen tillader det i en rigtig chat. Det kan prøves på Windows med en test.
- **Pris:** middel.

## Min anbefaling

**(c), med (a)-teksten som reserve.** Det, der skal beskyttes, er at de projektspecifikke felter ikke bliver kopieret med, og kun (c) kan bevise det med en test. (a) alene er en tekstregel, som kan blive ignoreret, og (b) bryder et løfte, kittet har i dag, og er det dyreste at lave rigtigt. Hvis du vil starte billigt, kan (a) laves først og (c) lægges ovenpå, hvis AI'en kopierer forkert eller personen har svært ved at finde mappen.

Små valg, når du har valgt:
- Skal `person.niveau` kopieres, eller spørges der igen? (Det ændrer sig med tiden; jeg ville spørge "passer det stadig?".)
- Skal `vaerktoej` (plan, modelvalg) med? Det ændrer sig også, men er ikke farligt.

## Ikke undersøgt endnu

- Om Claude Code og Codex har indstillinger på brugerniveau (hooks, der gælder alle projekter). Det kunne fjerne kravet om at køre opsætningen i hvert projekt, men det skal slås op i den officielle dokumentation, ikke gættes.
- Om plugin-opdateringer sletter skill-mappen som `install.ps1` gør.
- Mac og Linux.
- Alt er læst i koden. Intet er afprøvet i en rigtig chat.
