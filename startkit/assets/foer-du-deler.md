# Før du deler noget

AI'en læser denne fil, når noget skal ud til andre: et link, en hjemmeside, en app på nettet, en prøveversion til en ven. Det, der er sikkert på din egen computer, er ikke sikkert, så snart andre kan nå det. Her er det, der oftest går galt for dem, der bygger med AI.

Det her er en tjekliste, ikke en sikkerhedsgennemgang. AI'en siger aldrig "det er sikkert". Den siger, hvad der er tjekket, hvad der ikke er, og hvad der skal rettes. Du bestemmer, om det går ud.

## 1. Tre spørgsmål først

1. Hvem skal kunne se det: kun dig, få kendte, eller alle med linket?
2. Gemmer det noget om mennesker eller konti (login, e-mail, formularer, billeder)?
3. Skal der betales, eller sendes mails?

Svarer du "kun mig" eller "få kendte", og der er ingen oplysninger om andre, så tag punkt 2, 3 og 6. Ellers tag dem alle.

## 2. Hemmeligheder

- Kør `sh .githooks/pre-commit --scan`. Den leder efter nøgler i alle filer, git kender.
- Kør `node scripts/startkit/del-tjek.js`. Den leder efter nøgler i det, der faktisk bliver lagt ud (den byggede mappe, fx `dist` eller `build`, som de andre tjek ikke ser), og efter nøgler, der giver fuld adgang til en database. Ligger det byggede et andet sted, så skriv mappen efter kommandoen.
- Ligger der en nøgle i kode, der kører i browseren? Alt dér kan en fremmed se. Kun nøgler, der er lavet til at være offentlige, må ligge dér. Nøgler med ord som secret, service eller private må aldrig. Slå udbyderens egen vejledning op; gæt ikke.
- Står `.env` i `.gitignore`, og har nøglerne aldrig ligget i git? Har de, så er de brændt og skal skiftes.

## 3. Login og adgang

- Åbn siden i et privat vindue, uden at være logget ind. Kan du se noget, du ikke burde?
- Kan én bruger se en andens ting ved at ændre et tal i adressen?
- Bruger du en database-tjeneste? Mange starter med regler, hvor alle kan læse og skrive, så det er nemt at prøve. Tjek, at adgangsreglerne er slået til, og at de gælder for rigtige brugere. Slå udbyderens aktuelle vejledning op.
- Skjuler du kun en knap? Så er det ikke beskyttet. Reglen skal ligge på serveren eller i databasen.

## 4. Det, der kan koste penge

- Har nøglerne til betalte tjenester (fx AI) en beløbsgrænse hos udbyderen? En fremmed kan bruge dem op.
- Kan en formular eller en upload misbruges i stor stil?
- Betaling: kun udbyderens testtilstand, ingen rigtige betalinger, før en fagperson har set på det.

## 5. Rigtige mennesker

- Brug opdigtede data i test. Aldrig rigtige personers oplysninger i en chat, en fejlbesked eller git.
- Gemmer det rigtige oplysninger om andre, så stop, og tal med en fagperson (GDPR). AI'en giver ikke juridisk rådgivning.
- Børn, helbred og penge kræver mere end denne liste.

## 6. Hvad ser en fremmed?

- Fejlbeskeder og testsider, der viser interne ting?
- Filer og mapper, der ikke skulle ligge åbent (`.git`, sikkerhedskopier, noter)?
- Adressen starter med https?
- Hvem får linket? Kun dem, der skal. Kan du slå det fra igen?

## Sådan svarer AI'en

Tre lister, kort:
- ✅ **Tjekket:** hvad, og hvordan.
- ⚠️ **Skal rettes:** hvad, og hvorfor det betyder noget.
- ❓ **Ikke tjekket:** det AI'en ikke kunne se (fx hvad der sker i din browser, eller hvad udbyderen viser).

Det, der skal rettes, kommer i `STATUS.md` under "Åbne problemer". Intet lægges ud, før du har sagt ja.
