# Den korte vej

Den korte vej er for den, der vil have sikkerhedsnettene og overblikket på plads nu og tage det grundige interview senere. Den tager typisk 20-40 minutter og bruger langt mindre forbrug end den fulde vej.

Personen vælger selv vej i fase 1b. Du må fortælle, hvad forskellen er, og hvad du ville vælge i personens situation, men du vælger ikke for personen.

## Hvad den korte vej giver, og hvad den ikke giver

Giver: tjek af computeren, de faste regler, vagten, færdig-tjekket, nøgletjekket, statusfilen, overblikssiden og (hvis personen vil) en privat sikkerhedskopi.

Giver også: et lille sikkerhedsminimum (spørgsmål 7-11 herunder), så kittet kender nøgler, sikkerhedskopi og om noget skal ud til rigtige mennesker, før der bygges videre.

Giver ikke endnu: det grundige interview, undersøgelsen af personens egne problemer (det, der er træls, og de fejl, AI'en gentager), planen med forslag, modelguiden og forbruget, og det skræddersyede lag. Reglerne bliver derfor mere generelle, indtil den fulde vej er taget.

Sig det ærligt, før personen vælger.

## Rækkefølgen

1. Fase 2 og 2b som normalt (computeren, navn og e-mail i git, nøglescan).
2. Det lille interview herunder i stedet for fase 3.
3. Spring fase 4 og 5 over. Skriv ⏳ ved dem og ved fase 3 i `.startkit/status.md`.
4. Fase 6 og 7 som normalt (fundamentet sættes op og prøves).
5. Fase 8: vis overblikket, men byg ikke et skræddersyet lag.
6. Fase 9 som normalt (afslutning, sikkerhedskopi, feedback).

## Det lille interview

Stil kun disse spørgsmål, 2-3 ad gangen. De er det mindste, opsætningen skal bruge. Brug uddybningsreglen fra `claude/references/interview.md`, hvis et svar er for tyndt til at bruge.

1. Hvad skal jeg kalde dig? (felt: `person.navn`. Et kaldenavn er fint.)
2. Hvor meget har du kodet selv: slet ikke, lidt eller en del? (felt: `person.niveau`)
3. Hvad hedder projektet, og hvad skal det kunne? To sætninger er nok. Har du ikke en idé endnu, så kalder vi det "Mit første projekt". (felter: `projekter[].navn`, `projekter[].beskrivelse`, `valgt_projekt`)
4. Hvad må AI'en aldrig gøre uden at spørge dig først? Foreslå selv tre, og lad personen vælge til og fra: slette filer, lægge noget på nettet, installere nye programmer eller pakker. (felt: `regler.aldrig_uden_ok`)
5. Vil du have forklaringer undervejs, eller bare resultatet? (felt: `regler.svarform`)
6. Hvad skal AI'en gøre, når den er i tvivl: spørge, eller vælge selv og sige det? (felt: `regler.ved_tvivl`)

Findes der allerede kode i mappen, så find sammen med personen én kommando, der viser, at det virker (felt: `tjek_kommandoer`). Ellers lad listen være tom, og sig, at færdig-tjekket først kan afprøve noget, når der er en test.

### Sikkerhedsminimum (spørgsmål 7-11)

Disse fem fanger de fejl, der ikke kan fortrydes. Stil dem også på den korte vej, 2-3 ad gangen, og sig, hvorfor: "Nu fem hurtige om nøgler, kopi og rigtige brugere. Det er dem, der er dyrest at opdage for sent."

7. Hvilke slags nøgler og konti bruger projektet (fx AI, betaling, mail, database)? Kun typerne, aldrig selve nøglerne. (felt: `sikkerhed.noegletyper`. "Ingen" og "ved ikke" er gyldige.)
8. Bruger du git, og har du en kopi af projektet et andet sted end på computeren? (felter: `sikkerhed.git`, `sikkerhed.kopi`)
9. Skal noget af det, du bygger, ud til rigtige mennesker? Hvornår cirka? (felt: `virkelig.skal_ud`)
10. Skal det tage imod penge, eller sende mails eller sms'er til rigtige mennesker? (felter: `virkelig.betaling`, `virkelig.mails`)
11. Gemmer det oplysninger om rigtige mennesker (navne, mails, telefonnumre), eller skal nogen logge ind? (felter: `virkelig.persondata`, `virkelig.login`)

Regler for dem:
- Er svaret ja eller måske til 9, 10 eller 11: læs `claude/references/virkelige-verden.md`, læg tjeklisten ind i `.startkit/status.md` under "Før det går live", og skriv i `STATUS.md`, at runde F i det fulde interview skal tages, før noget går live. Byg ikke betaling, mails, login eller lagring af persondata ind i projektet, før personen har set tjeklisten.
- Er svaret på 7 "ved ikke", eller står en nøgle i koden: sig det, og læg det i `aabne` i profilen. Nøglescannet i fase 2b har ellers kun fundet det, der allerede ligger i filer.
- Er der ingen kopi (8): tilbyd den private sikkerhedskopi i fase 9, og læg det i `aabne`, hvis personen siger nej.
- Gentag aldrig en nøgle, personen indsætter (se `claude/references/interview.md`).

Gem svarene i `.startkit/profil.json` efter skemaet nederst i `claude/references/interview.md`, og tilføj `"vej": "kort"`.

## Ærlig afslutning (må ikke udelades)

Sig "færdig" om den korte vej, ikke om interviewet. Sig aldrig "interviewet er færdigt". Fortæl i afslutningen, i klart sprog:
- **Det er sat op:** reglerne, vagten, færdig-tjekket, nøgletjekket, overblikket og sikkerhedsminimummet.
- **Det er ikke dækket endnu:** det grundige interview, det, der er træls for dig, de fejl AI'en gentager, model og forbrug, og undersøgelsen. Reglerne er derfor mere generelle, og kittet kender ikke dine egne irritationsmomenter endnu.
- **Åbne punkter** fra `aabne` og tjeklisten "Før det går live", hvis den findes.
- **Hvad du gør nu:** skriv `/startkit` igen, når du har arbejdet lidt med projektet. Så fortsætter vi fra interviewet.

## Den fulde vej bagefter

Sig til sidst: "Når du har arbejdet lidt med projektet og ved, hvad der driller, så skriv `/startkit` igen. Så tager vi interviewet og undersøgelsen, og reglerne bliver tilpasset dig." Skriv det under "Næste skridt" i `STATUS.md`.

Når personen kommer tilbage: fortsæt fra fase 3, og spring de spørgsmål over, som allerede er besvaret. Efter fase 5 køres opsætningen igen (den er lavet til at kunne køres flere gange), så reglerne bliver opdateret.
