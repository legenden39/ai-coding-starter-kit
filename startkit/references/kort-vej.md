# Den korte vej

Den korte vej er for den, der vil have sikkerhedsnettene og overblikket på plads nu og tage det grundige interview senere. Den tager typisk 20-40 minutter og bruger langt mindre forbrug end den fulde vej.

Personen vælger selv vej i fase 1b. Du må fortælle, hvad forskellen er, og hvad du ville vælge i personens situation, men du vælger ikke for personen.

## Hvad den korte vej giver, og hvad den ikke giver

Giver: tjek af computeren, de faste regler, vagten, færdig-tjekket, nøgletjekket, statusfilen, overblikssiden og (hvis personen vil) en privat sikkerhedskopi.

Giver ikke endnu: det grundige interview, undersøgelsen af personens egne problemer, planen med forslag, modelguiden og det skræddersyede lag. Reglerne bliver derfor mere generelle, indtil den fulde vej er taget.

Sig det ærligt, før personen vælger.

## Rækkefølgen

1. Fase 2 og 2b som normalt (computeren, navn og e-mail i git, nøglescan).
2. Det lille interview herunder i stedet for fase 3.
3. Spring fase 4 og 5 over. Skriv ⏳ ved dem og ved fase 3 i `.startkit/status.md`.
4. Fase 6 og 7 som normalt (fundamentet sættes op og prøves).
5. Fase 8: vis overblikket, men byg ikke et skræddersyet lag.
6. Fase 9 som normalt (afslutning, sikkerhedskopi, feedback).

## Det lille interview

Stil kun disse spørgsmål, 2-3 ad gangen. De er det mindste, opsætningen skal bruge. Brug uddybningsreglen fra `references/interview.md`, hvis et svar er for tyndt til at bruge.

1. Hvad skal jeg kalde dig? (felt: `person.navn`. Et kaldenavn er fint.)
2. Hvor meget har du kodet selv: slet ikke, lidt eller en del? (felt: `person.niveau`)
3. Hvad hedder projektet, og hvad skal det kunne? To sætninger er nok. Har du ikke en idé endnu, så kalder vi det "Mit første projekt". (felter: `projekter[].navn`, `projekter[].beskrivelse`, `valgt_projekt`)
4. Hvad må AI'en aldrig gøre uden at spørge dig først? Foreslå selv tre, og lad personen vælge til og fra: slette filer, lægge noget på nettet, installere nye programmer eller pakker. (felt: `regler.aldrig_uden_ok`)
5. Vil du have forklaringer undervejs, eller bare resultatet? (felt: `regler.svarform`) Vil personen have forklaringer, eller er personen helt ny, så tilbyd forklar-tilstand: fagord forklares første gang, og hvert svar slutter med "Det gjorde jeg, og hvorfor". Svarene bliver længere og koster lidt flere tokens. (felt: `forklar`, `true` eller `false`)
6. Hvad skal AI'en gøre, når den er i tvivl: spørge, eller vælge selv og sige det? (felt: `regler.ved_tvivl`)

Findes der allerede kode i mappen, så find sammen med personen én kommando, der viser, at det virker (felt: `tjek_kommandoer`). Ellers lad listen være tom, og sig, at færdig-tjekket først kan afprøve noget, når der er en test.

Gem svarene i `.startkit/profil.json` efter skemaet nederst i `references/interview.md`, og tilføj `"vej": "kort"`.

## Den fulde vej bagefter

Sig til sidst: "Når du har arbejdet lidt med projektet og ved, hvad der driller, så skriv `$startkit` igen. Så tager vi interviewet og undersøgelsen, og reglerne bliver tilpasset dig." Skriv det under "Næste skridt" i `STATUS.md`.

Når personen kommer tilbage: fortsæt fra fase 3, og spring de spørgsmål over, som allerede er besvaret. Efter fase 5 køres opsætningen igen (den er lavet til at kunne køres flere gange), så reglerne bliver opdateret.
