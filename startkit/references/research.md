# Fase 5: undersøg og foreslå

Formålet er at finde de løsninger, der passer til netop denne person. Hverken personen eller du har facit på forhånd. Du må ikke bare bygge ud fra det, du tror; du skal undersøge det.

## Trin 1: Lav problemlisten

Gå profilen og kortlægningen igennem, og skriv en nummereret liste i `.startkit/plan.md`:
- hvert irritationsmoment og hver gentagen fejl (runde C),
- hvert sted, arbejdsgangen taber tid eller overblik (runde B),
- hvert ønske til overblikket (runde H),
- alt i runde F, der gælder den virkelige verden,
- ting, personen *ikke* nævnte, men som svarene afslører (fx ingen sikkerhedskopi, nøgler i koden, én chat til alt, ingen måde at tjekke "færdig" på).

Skriv personens egne ord ved hvert punkt. Vis listen, og spørg: "Er det de rigtige problemer, og mangler der nogen?" Bed personen pege på de tre vigtigste.

## Trin 2: Sortér

For hvert punkt:
- **Kendt svar:** står løsningen i `viden.md`, så brug den. Søg ikke på nettet efter det, du allerede har et afprøvet svar på.
- **Dækket af det faste fundament:** sig det, og gå videre.
- **Skal undersøges:** alt andet, og alt, der afhænger af aktuelle fakta (modeller, priser, grænser, hvad Codex kan lige nu, krav til betaling, mails og persondata).

## Trin 3: Undersøg (målrettet)

Researchen må ikke selv blive et tokenspild. Regler:
- Undersøg kun punkter fra listen. De tre vigtigste først.
- Officiel dokumentation først (OpenAI's Codex-dokumentation, udbyderens egne sider, myndigheder ved lovkrav). Blogs og fora kun som supplement, og sig det, når en kilde er uofficiel.
- Højst 3-4 opslag pr. punkt. Finder du ikke et godt svar, så skriv "ikke fundet" i planen. Gæt ikke.
- Tjek datoen. Råd om AI-værktøjer, der er mere end et halvt år gamle, kan være forældede.
- Er kilderne uenige, så sig det, og foreslå, at I prøver det i praksis i stedet for at vælge den ene.
- Notér kilden (adresse) ved hvert fund.

Er Superpowers installeret, så brug dets brainstorming-skill, når du skal vælge mellem flere mulige løsninger på et punkt.

## Trin 4: Skriv forslagene

For hvert punkt i `.startkit/plan.md`:

```
### 3. Mister overblik over, hvad der er færdigt
Dine ord: "…"
Forslag: …
Hvorfor det hjælper: … (hvilket af de fire mål)
Hvordan det håndhæves: hook / test / tjek før commit / fast vane / tekstregel
Besvær: lille / mellem / stort (og hvad det kræver af dig)
Kilde: …
Usikkerhed: … (hvad er ikke afprøvet)
Dit svar: ja / nej / senere
```

Regler for forslagene:
- Vælg altid den **mindste** løsning, der løser problemet. Intet nyt værktøj, hvis en fil eller en vane kan gøre det.
- Foretræk en lås (hook, test) frem for en tekstregel, når noget ikke må gå galt.
- Foretræk ikke agenter og ikke flere tilføjelser, medmindre gevinsten er tydelig. Hver tilføjelse koster tokens i hver chat.
- Sig ærligt, hvis et problem ikke kan løses helt, og hvad der så er det næstbedste.
- Lov ikke tal ("sparer 50 %"), som du ikke kan måle.

## Trin 5: Gennemgå med personen

Gå forslagene igennem ét ad gangen, vigtigste først. Få ja, nej eller senere til hvert, og skriv svaret ind. Slut med en kort rækkefølge: "Først sætter vi det faste fundament op (fase 6), derefter 1, 3 og 5."

## Modelguiden (laves altid)

Ud fra personens egen modelliste (fra `/model` i fase 2) og principperne i `viden.md` punkt 5: skriv en kort guide med 3-4 linjer, "brug X til ...". Slå modellernes aktuelle beskrivelser op i OpenAI's dokumentation, hvis listen ikke forklarer sig selv. Gem den i `.startkit/config.json` under `modelguide` (en liste af tekstlinjer), så den vises i overblikket, og skriv dato på. Sig til personen, at guiden skal tjekkes igen, når der kommer nye modeller.
