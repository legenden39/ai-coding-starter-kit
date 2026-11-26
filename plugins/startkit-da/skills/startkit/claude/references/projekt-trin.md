# Projekttrinnet (efter fundamentet, valgfrit)

Det her er IKKE en del af fundamentet. Det køres først, når fundamentet er ✅ i `.startkit/status.md`, når personen selv beder om det, og helst i en ny chat. Fundamentet beskytter arbejdet; det her er selve arbejdet med at finde ud af, hvad projektet skal være.

## Før du begynder

- Læs `STATUS.md` og `docs/gentagne-fejl.md`, så sikkerhedsnettet er i brug fra første minut.
- Spørg, om personen vil tage det nu eller en anden dag. Forløbet bruger en del forbrug (et langt interview og undersøgelser på nettet); sig det, og tjek `/usage`.
- Gem fremdriften i `.startkit/status.md` under "Projekttrin", så det kan tages i etaper.

## Trin 1: Det grundige interview

Følg `claude/references/interview.md` (8 emner, A-H). Det er en flydende samtale, ikke et skema: spørgsmålene er startspørgsmål, antallet er ikke fast, og et svar kan dække flere spørgsmål eller udløse nye. Sig ved hver rundes start, hvilket emne det er ("emne 3 af 8"), og hvorfor spørgsmålene kommer. Opsummér efter hver runde, og spørg "passer det?". Opdatér `.startkit/profil.json`; spring de spørgsmål over, det lille interview allerede har besvaret.

## Trin 2: Kortlæg det, der findes (kun læsning)

Har personen allerede projekter, så se kun på strukturen: mappeoversigt (to niveauer), om der er git og en kopi et andet sted, størrelsen på instruktionsfiler, antal åbne grene, og om der ligger gamle kopier og dubletter. Vis en kort oversigt. Ret intet.

## Trin 3: Undersøg og foreslå

Følg `claude/references/research.md`. Skriv resultatet i `.startkit/plan.md`, og gennemgå det med personen: hvert forslag med hvorfor, kilde og besvær. Personen siger ja eller nej til hvert; intet sættes op uden et ja. Er Superpowers installeret, så brug dets brainstorming-skill. Skal noget ud til rigtige mennesker (domæne, mails, betaling, persondata), så tag `claude/references/virkelige-verden.md` med i planen. Efter planen køres `opsaet.js` igen (den kan køres flere gange), så reglerne tilpasses.

## Trin 4: Det skræddersyede lag

Sæt de forslag op, personen sagde ja til, ét ad gangen, med et tjek efter hvert. Foreslå selv 2-3 forbedringer af overblikssiden ud fra det, personen sagde i runde C og H (fx "du sagde, du mister overblik over, hvad der er halvt færdigt: skal det stå øverst?"), og byg kun det, personen siger ja til. Vis kun målte fakta, aldrig gæt. Selve projektet bygges ikke her, men i almindelige chats med fundamentet som sikkerhedsnet.
