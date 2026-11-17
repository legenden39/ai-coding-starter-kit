# Det lille interview

Det lille interview er det mindste, opsætningen skal bruge for at lave korte, passende regler. Det handler ikke om selve projektet, kun om hvordan AI'en skal opføre sig hos personen. Det tager 5-10 minutter.

Fundamentet kommer først. Det grundige interview om projektet og arbejdsgangen venter til bagefter (se `claude/references/projekt-trin.md`). Reglerne er derfor generelle, indtil personen har tilpasset dem efter noget erfaring. Sig det ærligt.

## Spørgsmålene

Stil kun disse, 2-3 ad gangen. Brug uddybningsreglen fra `claude/references/interview.md`, hvis et svar er for tyndt til at bruge.

1. Hvad skal jeg kalde dig? (felt: `person.navn`. Et kaldenavn er fint.)
2. Hvor meget har du kodet selv: slet ikke, lidt eller en del? (felt: `person.niveau`)
3. Hvad skal projektet kaldes som arbejdsnavn? Et par ord er nok, og har du ikke en idé endnu, så kalder vi det "Mit første projekt". Du skal ikke fortælle mere om det nu. (felter: `projekter[].navn`, `projekter[].beskrivelse`, `valgt_projekt`)
4. Hvad må AI'en aldrig gøre uden at spørge dig først? Foreslå selv tre, og lad personen vælge til og fra: slette filer, lægge noget på nettet, installere nye programmer eller pakker. (felt: `regler.aldrig_uden_ok`)
5. Vil du have forklaringer undervejs, eller bare resultatet? (felt: `regler.svarform`)
6. Hvad skal AI'en gøre, når den er i tvivl: spørge, eller vælge selv og sige det? (felt: `regler.ved_tvivl`)

Findes der allerede kode i mappen, så find sammen med personen én kommando, der viser, at det virker (felt: `tjek_kommandoer`). Ellers lad listen være tom, og sig, at færdig-tjekket først kan afprøve noget, når der er en test.

Gem svarene i `.startkit/profil.json` efter skemaet nederst i `claude/references/interview.md`.

## Når fundamentet står

Sig til sidst: "Fundamentet er på plads. Nu kan du begynde på selve projektet i en ny chat, med sikkerhedsnettet under dig. Vil du have hjælp til at tage projektet fra idé til plan, så skriv `/startkit` igen." Skriv det under "Næste skridt" i `STATUS.md`.
