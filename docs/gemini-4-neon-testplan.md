# Testplan: kan Gemini 4 Neon bruges til noget på startkittet?

Skrevet 19. nov. 2026, dagen efter at modellen udkom. Status: PLAN, intet er kørt endnu.

Hvad vi ved: modellen findes, koster ca. $3 / $15 pr. million tokens (input / output) i den betalte API og er ikke gratis. Tallene kommer fra tredjepartsmedier, ikke fra Google (siden `blog.google` kunne ikke åbnes herfra). Tjek pris og adgang på Googles egen side, før noget regnes for sandt.

## Spørgsmålet
Er Neon en nyttig ekstra læser eller hjælper til kittet, sammenlignet med de modeller vi bruger i dag (Sonnet til billige opgaver, Fable til svære)? Vi tester kun det, kittet har brug for. Vi bygger ingenting ind i kittet endnu.

## Før vi starter (skal afklares med ejeren)
1. Adgang: ejeren har Google AI Pro (25 kr./md. i 3 måneder, derefter 169 kr./md.). Ifølge tredjepartskilder giver Pro adgang til Neon i Gemini-appen og Antigravity; det skal ejeren selv bekræfte i modelvælgeren. Ultra (799 kr./md.) er ikke nødvendig. Testene køres som copy-paste i Gemini-appen af ejeren; herfra kan jeg ikke nå Googles API (ingen nøgle, og netværket er lukket). Opsig eller nedgradér Pro, før de 3 måneder udløber, hvis Neon ikke er nyttig.
2. Et loft for prisen, som ejeren vælger. En vejledning på nogle få tusind ord koster kun få øre, men sæt et tal.
3. Ingen nøgler, navne eller e-mails i det, der sendes. Testmaterialet er kittets egne tekster, som allerede skal være rene (testen `rent`). Nøgler hører ikke hjemme i repoet eller i chatten.

## Testene (fra billigst til dyrest)
Alle prøves på samme materiale med både Neon og Sonnet, uden at man ved, hvem der har sagt hvad.

**Test 1: Uklare formuleringer i vejledninger (begynder-læsning)**
- Materiale: en vejledning og `startkit/assets/AGENTS.skabelon.md`.
- Opgave: "Du er helt ny til AI og teknik. Hvilke sætninger forstår du ikke, eller kan du misforstå?"
- Mål: antal forslag, der er rigtige og brugbare (ejeren vurderer), og antal falske alarmer.

**Test 2: Dansk/engelsk-paritet med plantede fejl**
- Vi laver en kopi i scratchpad'en af et dansk/engelsk filpar og planter 5 kendte forskelle (en manglende linje, et forkert tal, en ændret regel, et forkert filnavn, en modsat betydning). Originalerne røres ikke.
- Opgave: "Find forskelle i betydning mellem de to filer."
- Mål: hvor mange af de 5 bliver fundet, og hvor mange falske alarmer. Det er den eneste test med et facit.

**Test 3: Svært spørgsmål om reglerne**
- Opgave: giv kittets regelfil og en konkret situation ("ejeren siger 'den fejl igen'"), og se, om modellen svarer efter reglen.
- Mål: følger den reglen, eller finder den på noget?

**Test 4 (kun hvis 1-3 går godt): Fejlsøgning**
- Giv en gammel fejltekst fra `docs/gentagne-fejl.md` eller `STATUS.md` (fx nøglescannet, der var langsomt) uden løsningen. Kan den finde årsagen?
- Mål: finder den årsagen, eller gætter den? Reglen i projektet er, at vi ikke gætter.

## Hvad vi skriver ned for hver test
Model, test, hvad den fandt, falske alarmer, pris, tid, og ejerens ærlige vurdering (1-5: ville jeg bruge det?).

## Beslutning
- Neon er brugbar, hvis den finder lige så meget som Sonnet eller noget Sonnet missede, til en pris ejeren kan leve med.
- Ellers dropper vi den og skriver hvorfor i `STATUS.md`.
- Falder den ud i Test 2 (facit), bruger vi den ikke til kittets tekster.
- Aldrig til vagtens regler eller sikkerhed, og aldrig som kilde til fakta om Codex og Claude Code (de slås op i den officielle dokumentation).

## Stopregel
Hjælper noget ikke efter to forsøg (fx adgangsfejl), stopper vi og skriver fejlteksten ordret i `STATUS.md`. Vi gætter ikke videre.

## Næste skridt
1. Ejeren svarer på de tre punkter under "Før vi starter".
2. En ny chat (billig model, Sonnet) laver testmaterialet til Test 1-3 i scratchpad'en, inklusive de plantede fejl og et facit, der ikke vises for modellen.
3. Ejeren kører testene i sin adgang og indsætter svarene. Derefter vurderer vi dem sammen.
