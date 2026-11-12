# Sådan går du tilbage, når noget er gået galt

Der er fire måder. Start fra toppen: den øverste er den hurtigste, den nederste rækker længst tilbage.

Du kan altid bede AI'en om hjælp: skriv "noget er gået galt, hjælp mig med at gå tilbage". Så skal den følge denne side og vise dig, hvad der sker, før noget bliver hentet tilbage.

## 1. Fortryd i selve Claude Code

Skriv `/rewind` (eller tryk Esc to gange). Så kan du vælge et tidligere sted i chatten og få filerne tilbage, som de var dér.

Det skal du vide: `/rewind` henter kun det tilbage, Claude har rettet med sine egne redigeringsværktøjer. Har en kommando ændret eller slettet filer (fx en sletning i terminalen), henter den dem ikke. Så brug gemmepunkterne herunder.

## 2. Gemmepunkter (startkittets egen fortryd)

I starten af hver chat tager startkittet automatisk et gemmepunkt: et øjebliksbillede af alle filer i projektet, også dem, der aldrig nåede at blive gemt i git. Det rører ikke dine filer.

- Se dem: `node scripts/startkit/fortryd.js`
- Se, hvilke filer der er anderledes nu end i gemmepunkt 1: `node scripts/startkit/fortryd.js --vis 1`
- Hent alt tilbage fra gemmepunkt 1: `node scripts/startkit/fortryd.js --hent 1`
- Hent kun én fil: `node scripts/startkit/fortryd.js --hent 1 src/side.js`
- Tag et gemmepunkt nu, før noget risikabelt: `node scripts/startkit/fortryd.js --gem`

Før noget hentes tilbage, bliver filerne, som de ser ud lige nu, selv gemt som et nyt gemmepunkt. Du kan altså også fortryde en fortrydelse. Intet bliver slettet: filer, der er kommet til siden, bliver liggende.

Det skal du vide:
- Gemmepunkterne ligger kun på din egen computer. De er ikke en sikkerhedskopi: går computeren i stykker, er de væk.
- Filer, der står i `.gitignore` (fx `.env` med dine nøgler), kommer aldrig med.
- Kun de 30 nyeste bliver gemt.

## 3. Git (det, du har gemt med en commit)

Hver commit er en udgave, du kan gå tilbage til.

- Se de seneste: `git log --oneline -10`
- Hent én fil tilbage, som den var ved sidste commit: `git restore src/side.js`
- Se, hvad der er ændret siden sidste commit: `git status` og `git diff`

Bed AI'en om hjælp til at gå længere tilbage end sidste commit. Kommandoer som `git reset --hard` sletter arbejde og er spærret for AI'en af vagten; dem kører du kun selv, og kun når du har set, hvad de gør.

## 4. Kopien på GitHub

Har du lavet en privat sikkerhedskopi på GitHub, ligger alt, hvad du har sendt op, også dér. Det er den eneste af de fire, der overlever, at computeren går i stykker. Bed AI'en om hjælp til at hente det ned igen.

## Før du går tilbage

- Luk ikke chatten i panik. Skriv, hvad du så, og hvad du forventede.
- Bed om at se, hvilke filer der er anderledes (`--vis`), før du henter noget tilbage.
- Er du i tvivl, så tag et gemmepunkt først (`--gem`). Så kan intet af det, der ligger der nu, gå tabt.
