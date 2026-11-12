# Fra test til den virkelige verden

Læses kun, hvis runde F viser, at noget skal ud til rigtige mennesker. Når et projekt får eget domæne, rigtige mails og rigtige betalinger, gælder der andre krav end på ens egen computer. Formålet her er, at personen kender kravene **før** de rammer.

Dette er en tjekliste til overblik, ikke juridisk eller økonomisk rådgivning. Lovkrav og udbyderes regler ændrer sig: slå hvert punkt, der gælder personen, op hos den officielle kilde i fase 5, og sig tydeligt, hvor en fagperson (jurist, revisor) bør spørges, før rigtige brugere kommer til.

Gå kun de afsnit igennem, som personens svar peger på. Hvert punkt, der gælder, bliver et punkt i `.startkit/plan.md`.

## 1. To verdener: test og drift

- Hold test og drift adskilt: hver sin database, hver sit sæt nøgler, hver sin adresse. En fejl i test må aldrig kunne ramme rigtige brugere.
- AI'en arbejder kun i test. Den logger aldrig ind i drift og får aldrig driftens nøgler.
- Udrulning (at lægge en ny udgave ud) sker med ét fast script, der bygger, tester og kun udruller ved grønt, og kun efter ejerens ja. Direkte udrulning kan spærres med en regel i vagten, når hostingen er valgt.
- Efter hver udrulning: tjek, at den rigtige udgave faktisk kører. Tro ikke på "det gik godt" uden at se det.
- Hav en vej tilbage: vid, hvordan den forrige udgave lægges ud igen.

## 2. Eget domæne

- Domænet skal ejes af personen selv (eller firmaet), ikke af en udvikler eller en AI-tjeneste.
- Sikker forbindelse (https) hele vejen.
- Hvem har adgang til domænets indstillinger (DNS)? Slå to-trins-login til dér.
- Fornyelse: et udløbet domæne lukker både siden og mailen.

## 3. Rigtige mails

- Mail fra eget domæne kræver opsætning i domænets indstillinger (SPF, DKIM og DMARC), ellers ender mailen i spam eller bliver afvist. Slå udbyderens aktuelle vejledning op.
- Brug en mail-tjeneste til at sende; send ikke fra en privat postkasse i kode.
- Hold test og drift adskilt: test må aldrig kunne sende til rigtige modtagere.
- Markedsføringsmails kræver samtykke og en afmeldingsmulighed. Kvitteringer og login-links er noget andet end nyhedsbreve. Slå reglerne op.
- Hvad sker der, hvis en mail ikke kommer frem? Det skal kunne ses et sted.

## 4. Rigtige betalinger

- Brug en betalingsudbyder. Gem aldrig selv kortoplysninger.
- Byg og test i udbyderens testtilstand med testnøgler og testkort. AI'en må aldrig gennemføre en rigtig betaling eller have driftens betalingsnøgler.
- Betalingen bekræftes af udbyderens besked til serveren (webhook), ikke af at brugeren lander på en "tak"-side. Beskeden skal tjekkes for ægthed, og den kan komme to gange.
- Tænk det igennem, der går galt: afbrudt betaling, dobbelt klik, refundering, indsigelser.
- At tage imod penge udløser krav til virksomheden (fx registrering, moms, bogføring, handelsbetingelser, fortrydelsesret ved salg til forbrugere). Det er et spørgsmål til en revisor eller myndighedernes egne sider, ikke til AI'en.
- Kode, der rører penge, skrives med den stærkeste model og med tests før koden.

## 5. Oplysninger om rigtige mennesker (GDPR)

- Lav en liste over, hvilke oplysninger der gemmes, hvorfor, hvor, og hvor længe. Gem kun det nødvendige.
- Folk skal kunne få at vide, hvad der er gemt om dem, og få det slettet. Byg det ind fra start.
- En privatlivspolitik på siden, og samtykke til cookies, der ikke er nødvendige.
- Tjenester, der behandler oplysningerne for dig (hosting, database, mail), kræver en databehandleraftale, og det betyder noget, hvor i verden data ligger.
- Brug kun opdigtede data i test og i chatten med AI'en. Aldrig rigtige personers oplysninger i en chat, i en fejlbesked eller i git.
- Særlige oplysninger (helbred, børn m.m.) kræver mere. Spørg en fagperson først.
- Et brud (data ude, hvor de ikke må være) skal i nogle tilfælde anmeldes inden for en kort frist. Vid på forhånd, hvem der gør hvad.

## 6. Login og adgang

- Byg ikke selv adgangskode-håndtering; brug en gennemprøvet løsning.
- Rettigheder håndhæves på serveren og i databasen, ikke kun ved at skjule en knap.
- Test det som en fremmed: kan én bruger se en andens data ved at ændre et tal i adressen?
- Begræns antal forsøg (login, formularer), så de ikke kan misbruges.

## 7. Drift: når det kører

- Sikkerhedskopi af databasen, og prøv mindst én gang at hente den ind igen. En kopi, der aldrig er prøvet, tæller ikke.
- Fejl skal kunne ses: en log eller en besked, når noget går galt.
- Hold styr på udgifter: sæt beløbsgrænser hos de tjenester, der kan løbe løbsk (især AI-forbrug via API).
- Hvem ringer brugerne til, når noget ikke virker? En kontaktadresse, der bliver læst.
- Skriv ned, hvilke konti og tjenester projektet afhænger af, og hvem der har adgang (kun typer og navne på tjenester, aldrig nøgler).

## Sådan bruges tjeklisten i planen

For hvert punkt, der gælder: skriv, hvad status er i dag (på plads, mangler, ved ikke), hvad der skal undersøges hos en officiel kilde, og hvad der skal låses med en hook eller en test. Sæt punkterne i rækkefølge: det, der ikke kan fortrydes (penge, persondata, nøgler), kommer først.
