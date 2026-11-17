# Opskrift: samle data fra testen af startkittet

Til dig, der har testet kittet i flere chats (sessioner).

## Sådan gør du
1. Åbn hver chat, du har brugt til testen (en ad gangen).
2. Kopiér teksten under "Prompten" herunder, og send den til AI'en i den chat.
3. AI'en laver en tekstfil og fortæller, hvor den ligger. Åbn filen, og læs den igennem. Der skal ikke stå nøgler, adgangskoder, e-mailadresser eller rigtige navne.
4. Send filerne til den, der skal læse dem (alle chats, der er brugt, hver med sin fil). Er filerne små, kan du også lægge teksten ind i en besked.
5. Har du mange filer, så læg dem i én mappe, og send mappen som en zip-fil: højreklik på mappen, vælg "Send til", derefter "Komprimeret mappe". Det er den eneste del, du selv skal klikke.

## Prompten

```
Lav en rapport om hele den her chat i testen af startkittet, så en anden kan læse den og forstå, hvad der skete. Skriv i almindeligt dansk. Gem den som en tekstfil med navnet `test-rapport.md` i den mappe, du arbejder i. Skriv øverst, hvad chatten blev brugt til (ét par ord) og hvilken dato det var.

Tag med:
1. Forløbet i rækkefølge: hvad blev du bedt om, og hvad blev der gjort. Kort, ét punkt pr. skridt.
2. Alle de steder, hvor ejeren blev stoppet, skulle godkende noget eller trykke Tab/Enter. For hvert sted: hvad der stod i chatten (så ordret som du kan), hvad du ville opnå, og om det var et rigtigt stop (fx en hook, der skulle godkendes, eller vagten, der stoppede noget) eller bare en besked eller en kommando.
3. Alle PowerShell- eller terminalkommandoer, der blev vist til ejeren, og om ejeren selv skulle skrive dem, eller du kørte dem.
4. Alle fejl og loops: fejlteksten ordret, hvad der blev prøvet, hvor mange gange, og hvordan det endte.
5. Steder, hvor ejeren sagde, at noget var uforståeligt, eller hvor du selv synes, sproget var for teknisk.
6. Hvilken model og hvilket værktøj (Codex eller Claude Code) der blev brugt, og hvad du ved om forbruget.
7. Hvad der virkede godt.
8. Hvad du ikke kan huske eller ikke kan se (fx fordi chatten er blevet kortet ned). Gæt ikke. Skriv "ved ikke".

Regler:
- Ingen nøgler, adgangskoder, e-mailadresser, rigtige navne eller brugermapper i rapporten. Skriv [fjernet] i stedet.
- Brug kun det, du faktisk kan se i chatten eller i filerne. Opfind ikke noget.
- Findes filen `.startkit/feedback.md`, så tag den med.
- Når filen er gemt, så skriv hele stien til den, og vis mig indholdet.
```

## Til den, der læser rapporterne
- En rapport er AI'ens egen erindring af chatten. Er chatten blevet kortet ned, kan dele mangle. Det skal stå i punkt 8.
- Det, der søges efter: er stoppene for mange, for tekniske eller ikke til at skelne fra de vigtige?
