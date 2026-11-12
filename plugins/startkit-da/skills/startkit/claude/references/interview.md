# Interviewet

Interviewet er en flydende samtale, ikke et skema. Der er 8 emner (runder). Antallet af spørgsmål er ikke fast: det kan blive færre end her, hvis svarene er grundige, og flere, hvis et svar åbner for noget, der er værd at forstå.

Spørgsmålene herunder er **startspørgsmål**. Det, der tæller, er **felterne**: de oplysninger, du skal have med hjem fra hver runde. En runde er færdig, når rundens felter er udfyldt eller noteret som åbne, ikke når alle spørgsmål er stillet.

Sig ved hver rundes start: "Emne X af 8", og fortæl rundens "Hvorfor denne runde" med dine egne ord. Spørg 2-3 ting ad gangen. Opsummér efter hver runde, og spørg "passer det?".

## Sådan holder du samtalen flydende

1. **Lyt efter, hvad svaret allerede dækker.** Et godt svar besvarer ofte flere spørgsmål på én gang, også i andre runder. Udfyld alle de felter, svaret dækker, og stil ikke de spørgsmål bagefter. Er du i tvivl, om du har forstået det rigtigt, så sig: "Det har du allerede fortalt: ... Passer det?"
2. **Følg op, når et svar åbner noget.** Nævner personen et problem, en hændelse, et værktøj eller en bekymring, som ikke står på listen, så spørg ind til det med dine egne spørgsmål. Det er ofte her, de vigtigste ting kommer frem. Gem det, du lærer, i profilen under `ekstra` med en kort overskrift.
3. **Stil kun opfølgende spørgsmål, der tjener et af de fire mål** (kvalitet, effektiv arbejdsgang, overblik, færre spildte tokens), eller som du skal bruge for at sætte noget rigtigt op. Nysgerrighed alene er ikke nok.
4. **Højst to opfølgninger på samme tråd.** Vend derefter tilbage til runden. Er der mere at hente, så notér tråden som åben, og tag den i planen.
5. **Spring over det, der ikke er relevant.** Skal intet ud til rigtige mennesker, er runde F ét spørgsmål. Er der kun ét projekt, stilles runde D én gang.
6. **Brug personens egne ord,** når du spørger videre og opsummerer. Skift rækkefølge, hvis samtalen naturligt går et andet sted hen; felterne er de samme.
7. **Sig, hvor I er.** Bliver en runde længere end ventet, så sig det: "To spørgsmål mere om det her, så går vi videre." Spørg, om personen vil holde pause, når I har været i gang længe.

Interviewet slutter, når du har det, du skal bruge for at lave en god plan. Tjek til sidst felterne i profilskemaet nederst: mangler et af dem, så spørg efter det.

## Uddybningsreglen (gælder alle spørgsmål)

Er svaret tomt, under ca. 8 ord uden konkret indhold, eller modsiger det et tidligere svar, så spørg én gang til med feltet "Uddyb", og giv et eksempel på et godt svar. Spørg højst 2 gange pr. spørgsmål. Derefter accepteres svaret, og spørgsmålets id lægges i `aabne` i profilen. Åbne punkter vises i afslutningen og tages op, når startkittet genoptages.

"Ved ikke" er et gyldigt svar. Notér det som åbent, og gå videre uden at presse.

Indsætter personen en nøgle eller adgangskode, så gentag den aldrig. Bed personen slette beskeden, hvis det kan lade sig gøre, og skifte nøglen. Notér kun typen.

## Runde A: Dig og dit mål

Hvorfor denne runde: alt andet bliver tilpasset, hvem du er, og hvad du vil opnå.

### A1
Spørgsmål: Hvad skal jeg kalde dig, og hvad bruger du AI til i dag? Fortæl det, som du ville til en ven.
Godt svar: Et navn og mindst én konkret ting, AI bliver brugt til.
Uddyb: Hvad var det sidste, du fik AI til at lave for dig?
Felt: person.navn, person.bruger_ai_til

### A2
Spørgsmål: Hvad vil du gerne kunne om tre måneder, som du ikke kan i dag?
Godt svar: Et konkret mål, der kan ses eller prøves.
Uddyb: Hvis det gik rigtig godt, hvad ville du så sidde med?
Felt: person.maal

### A3
Spørgsmål: Hvor meget har du kodet selv: slet ikke, lidt eller en del? Giv et eksempel.
Godt svar: Ét af de tre, og et eksempel.
Uddyb: Kan du fx læse en fejlbesked og gætte, hvad der er galt?
Felt: person.niveau

### A4
Spørgsmål: Er det hobby, arbejde eller noget, du vil tjene penge på?
Godt svar: Ét valg, og gerne hvorfor.
Uddyb: Skal andre end dig nogensinde bruge det, du bygger?
Felt: person.formaal

### A5
Spørgsmål: Hvor meget tid bruger du på det om ugen, og hvor længe sidder du ad gangen?
Godt svar: Et cirkatal og en typisk længde.
Uddyb: Er det aftener, weekender eller spredt?
Felt: person.tid

## Runde B: Sådan arbejder du i dag

Hvorfor denne runde: vi kan kun forbedre en arbejdsgang, vi kender. Her leder vi efter de steder, hvor tid og tokens forsvinder.

### B1
Spørgsmål: Gå mig igennem sidste gang, du arbejdede på noget med AI, fra du åbnede programmet, til du lukkede. Hvad gjorde du først, og hvordan sluttede du?
Godt svar: En rækkefølge med mindst tre trin.
Uddyb: Hvad var det allerførste, du skrev til AI'en den dag?
Felt: arbejdsgang.sidste_session

### B2
Spørgsmål: Når du kommer tilbage til et projekt efter nogle dage, hvordan finder du så ud af, hvor du slap?
Godt svar: En konkret metode, eller "det gør jeg ikke, og det er et problem".
Uddyb: Skal du forklare AI'en det hele forfra hver gang?
Felt: arbejdsgang.fra_gang_til_gang

### B3
Spørgsmål: Hvor ligger dine projekter på computeren, og hvordan er mapperne bygget op? Har du selv valgt det, eller har AI'en lavet dem?
Godt svar: Et sted, og hvem der har bestemt strukturen.
Uddyb: Hvis jeg bad dig finde den nyeste udgave af en bestemt fil, kunne du så det med det samme?
Felt: arbejdsgang.mapper

### B4
Spørgsmål: Arbejder du i én lang chat, eller starter du en ny til hver opgave?
Godt svar: Ét af de to, og hvorfor.
Uddyb: Hvor lang bliver en chat typisk, før du starter en ny?
Felt: arbejdsgang.chats

### B5
Spørgsmål: Hvordan ved du, at noget, AI'en har lavet, faktisk virker?
Godt svar: En konkret måde (prøver det selv, tests, stoler på den).
Uddyb: Er det sket, at den sagde "færdig", og det så ikke virkede?
Felt: arbejdsgang.tjek

### B6
Spørgsmål: Hvad sker der, når AI'en skal rette noget? Hvad går den igennem, og kan du følge med i, hvad den ændrer?
Godt svar: En beskrivelse af, hvad personen ser og ikke ser.
Uddyb: Ved du bagefter, hvilke filer den har rørt?
Felt: arbejdsgang.rettelser

## Runde C: Det, der er træls

Hvorfor denne runde: det er her, den største gevinst ligger. Hvert irritationsmoment bliver til et konkret punkt, vi undersøger en løsning på.

### C1
Spørgsmål: Hvad irriterer dig mest ved at arbejde med AI lige nu? Skriv gerne flere ting.
Godt svar: Mindst to konkrete ting.
Uddyb: Tænk på sidste gang, du blev sur på den. Hvad skete der lige før?
Felt: traels.irritationer

### C2
Spørgsmål: Hvilke fejl laver AI'en igen og igen, selvom du har sagt det før?
Godt svar: Mindst ét eksempel, eller et begrundet "ingen".
Uddyb: Er der noget, du har måttet forklare mere end to gange?
Felt: traels.gentagne_fejl

### C3
Spørgsmål: Hvornår mister du overblikket? Hvad er det helt præcist, du ikke kan se eller ikke ved?
Godt svar: En konkret situation.
Uddyb: Er det overblik over filerne, over hvad der er færdigt, over hvad der sker lige nu, eller noget fjerde?
Felt: traels.overblik

### C4
Spørgsmål: Er der sket noget, der gik rigtig galt: noget blev slettet, ødelagt eller overskrevet?
Godt svar: En hændelse, eller "nej".
Uddyb: Hvordan opdagede du det, og fik du det tilbage?
Felt: traels.uheld

### C5
Spørgsmål: Hvad har du selv prøvet for at løse de her ting, og hvordan gik det?
Godt svar: Mindst ét forsøg, eller "ingenting endnu".
Uddyb: Har du fx skrevet regler til den, lavet egne instruktioner eller prøvet et andet værktøj?
Felt: traels.proevet

### C6
Spørgsmål: Hvad får dig til at lukke computeren og give op for i dag?
Godt svar: En konkret situation.
Uddyb: Kan du huske sidste gang?
Felt: traels.giver_op

## Runde D: Dine projekter

Hvorfor denne runde: fundamentet skal passe til det, du faktisk bygger. Tag ét projekt ad gangen; gentag D1-D5 for hvert (højst tre nu, resten kan komme senere).

### D1
Spørgsmål: Hvad hedder projektet, og hvad gør det? Forklar det i 2-3 sætninger.
Godt svar: Et navn og en handling ("man kan ...").
Uddyb: Giv et eksempel på, hvad en person gør, når hun bruger det.
Felt: projekter[].navn, projekter[].beskrivelse

### D2
Spørgsmål: Hvor langt er det? Hvad virker, og hvad er halvt færdigt?
Godt svar: Mindst én ting, der virker, og én, der mangler.
Uddyb: Hvis du skulle vise det til nogen i dag, hvad ville du så vise?
Felt: projekter[].status

### D3
Spørgsmål: Hvad er det bygget med, hvis du ved det (sprog, database, andet)? "Det ved jeg ikke, AI'en valgte" er et fint svar.
Godt svar: En liste, eller "ved ikke".
Uddyb: Hvordan starter du det? En fil, du åbner, eller en kommando?
Felt: projekter[].teknik, projekter[].start_kommando

### D4
Spørgsmål: Hvordan ser "færdigt" ud for det her projekt?
Godt svar: Mindst én ting, man kan prøve.
Uddyb: Nævn tre ting, en bruger skal kunne.
Felt: projekter[].faerdigt_er

### D5
Spørgsmål: Hvad må projektet aldrig blive eller gøre?
Godt svar: Mindst én ting, eller et begrundet "intet".
Uddyb: Hvad ville få dig til at sige "nej, det her skal vi ikke have"?
Felt: projekter[].aldrig

### D6
Spørgsmål: Hvilket projekt skal vi sætte fundamentet op i først, og hvor ligger mappen?
Godt svar: Ét projekt og en sti.
Uddyb: Åbn mappen i Stifinder, og kopiér adressen.
Felt: valgt_projekt, projektmappe

## Runde E: Værktøjer, modeller og forbrug

Hvorfor denne runde: forkert model og for meget baggrund er de to største årsager til spildte tokens og svingende kvalitet.

### E1
Spørgsmål: Hvilket abonnement har du, og bruger du appen på computeren, terminalen, chatten i browseren eller flere af dem?
Godt svar: Et plannavn og mindst ét sted.
Uddyb: Hvor sidder du, når du bygger: i Claude-chatten (claude.ai) eller i Claude Code?
Felt: vaerktoej.plan, vaerktoej.flader

### E2
Spørgsmål: Hvordan vælger du model i dag? Vælger du selv, eller tager du den, der står?
Godt svar: En beskrivelse af, hvad der faktisk sker.
Uddyb: Ved du, hvilken model du brugte sidst?
Felt: vaerktoej.modelvalg

### E3
Spørgsmål: Du har oplevet, at den nogle gange tænker meget længe og andre gange svarer med det samme. Hvornår sker hvad, så vidt du kan se?
Godt svar: Et mønster eller "jeg kan ikke se noget mønster".
Uddyb: Var den lange tænkning ved en svær opgave eller ved noget simpelt?
Felt: vaerktoej.taenketid

### E4
Spørgsmål: Har du ramt grænsen for dit forbrug? Hvor tit, og hvad var du i gang med?
Godt svar: Ja eller nej, og ved ja en situation.
Uddyb: Ved du, hvor du ser, hvor meget du har brugt?
Felt: vaerktoej.graense

### E5
Spørgsmål: Bruger du agenter, der arbejder selv, eller en API-nøgle, som dine egne programmer bruger? Hvad styrer, hvilke opgaver de får?
Godt svar: Ja eller nej, og ved ja en kort beskrivelse.
Uddyb: Koster API-forbruget noget ud over dit abonnement, og holder du øje med det?
Felt: vaerktoej.agenter_api

### E6
Spørgsmål: Hvilke plugins, tilføjelser eller andre AI-værktøjer har du sat til, og hvilke bruger du faktisk?
Godt svar: En liste, eller "ingen".
Uddyb: Er der noget, du installerede og aldrig har brugt?
Felt: vaerktoej.tilfoejelser

## Runde F: Den virkelige verden

Hvorfor denne runde: at noget virker på din egen computer er én ting. Når det skal på eget domæne, sende rigtige mails og tage imod rigtige betalinger, gælder der andre krav. Dem vil vi kende på forhånd.

### F1
Spørgsmål: Skal noget af det, du bygger, ud til rigtige mennesker? Hvornår cirka?
Godt svar: Ja, nej eller måske, og en cirkatid.
Uddyb: Hvem er de første, der skal bruge det?
Felt: virkelig.skal_ud

### F2
Spørgsmål: Skal det ligge på sit eget domæne, og ved du, hvor det skal køre (hosting)?
Godt svar: Ja eller nej, og et sted eller "ved ikke".
Uddyb: Har du et domæne i dag?
Felt: virkelig.domaene, virkelig.hosting

### F3
Spørgsmål: Skal det sende mails eller sms'er til rigtige mennesker?
Godt svar: Ja eller nej, og hvilke slags beskeder.
Uddyb: Fx kvitteringer, login-links eller nyhedsbreve?
Felt: virkelig.mails

### F4
Spørgsmål: Skal det tage imod penge?
Godt svar: Ja, nej eller senere.
Uddyb: Hvordan skal folk betale, og hvem er betalingen til?
Felt: virkelig.betaling

### F5
Spørgsmål: Gemmer det oplysninger om rigtige mennesker (navne, mails, telefonnumre, betalinger)? Skal brugerne logge ind?
Godt svar: Ja eller nej til begge, og ved ja hvilke oplysninger.
Uddyb: Hvis nej nu: bliver det ja senere?
Felt: virkelig.persondata, virkelig.login

### F6
Spørgsmål: Hvad er du mest usikker på ved at gå fra test til rigtig drift?
Godt svar: Mindst én konkret bekymring.
Uddyb: Hvad ville du nødig opdage for sent?
Felt: virkelig.bekymring

## Runde G: Sikkerhed og sikkerhedskopi

Hvorfor denne runde: en nøgle i den forkerte fil eller et slettet projekt er de fejl, der ikke kan fortrydes. Dem sætter vi låse på.

### G1
Spørgsmål: Hvilke slags nøgler og konti bruger dine projekter (fx AI-tjenester, betaling, mail, database)? Kun typerne, aldrig selve nøglerne.
Godt svar: En liste af typer, eller "ingen".
Uddyb: Kræver noget af det et login til en anden tjeneste?
Felt: sikkerhed.noegletyper

### G2
Spørgsmål: Ved du, hvor nøglerne ligger i dag? Står nogen af dem direkte i koden?
Godt svar: Et sted, eller "ved ikke".
Uddyb: Har AI'en nogensinde skrevet en nøgle ind i en fil for dig?
Felt: sikkerhed.noegler_ligger

### G3
Spørgsmål: Bruger du git, og har du en kopi af projekterne et andet sted end på computeren (fx GitHub)?
Godt svar: Ja eller nej til begge.
Uddyb: Hvis computeren gik i stykker i morgen, hvad ville så være væk?
Felt: sikkerhed.git, sikkerhed.kopi

### G4
Spørgsmål: Arbejder du på flere computere eller med flere konti?
Godt svar: Ja eller nej, og antal.
Uddyb: Hvordan får du det nyeste med fra den ene til den anden?
Felt: sikkerhed.flere_maskiner

### G5
Spørgsmål: Hvad må AI'en aldrig gøre uden at spørge dig først?
Godt svar: Mindst én ting (fx slette filer, lægge noget på nettet, bruge penge).
Uddyb: Hvad ville du blive bange for, hvis den gjorde det alene?
Felt: regler.aldrig_uden_ok

## Runde H: Sådan vil du have det

Hvorfor denne runde: her bestemmer du, hvordan AI'en skal tale til dig, og hvad dit overblik skal vise.

### H1
Spørgsmål: Vil du have forklaringer undervejs, eller bare resultatet? Og hvor lange svar?
Godt svar: Ét valg, og et ønske til længden.
Uddyb: Forklaring altid, eller kun når noget er nyt eller risikabelt?
Felt: regler.svarform

### H2
Spørgsmål: Hvad vil du selv bestemme, og hvad må AI'en vælge for dig?
Godt svar: Mindst ét område, personen selv bestemmer.
Uddyb: Fx udseende, funktioner, penge, værktøjer: hvad hører til hos dig?
Felt: regler.bestemmer_selv

### H3
Spørgsmål: Hvad skal AI'en gøre, når den er i tvivl: spørge, stoppe eller vælge selv og sige det?
Godt svar: Ét valg.
Uddyb: Hellere et spørgsmål for meget end en fejl?
Felt: regler.ved_tvivl

### H4
Spørgsmål: Forestil dig en side, du åbner, før du går i gang. Hvad skal du kunne se på den for at vide, hvor du er?
Godt svar: Mindst tre ting.
Uddyb: Fx hvad der blev lavet sidst, hvad der er næste skridt, hvad der er ændret, forbrug, åbne problemer?
Felt: overblik.vil_se

### H5
Spørgsmål: Hvad skal stå øverst på den side? Det ene, du vil se først.
Godt svar: Én ting.
Uddyb: Hvis siden kun måtte vise én ting, hvad så?
Felt: overblik.vigtigst

### H6
Spørgsmål: Er der noget, jeg ikke har spurgt om, som jeg skal vide for at hjælpe dig godt?
Godt svar: Noget konkret, eller "nej".
Uddyb: (ingen; "nej" er et fuldt svar)
Felt: person.andet

## Profilskema (`.startkit/profil.json`)

Gem svarene med felternes navne. Aldrig nøgler eller adgangskoder. Disse felter bruger opsætningen direkte og skal være udfyldt, før fase 6:

```json
{
  "person": { "navn": "…" },
  "valgt_projekt": "…",
  "projektmappe": "…",
  "projekter": [{ "navn": "…", "beskrivelse": "…", "start_kommando": "" }],
  "regler": {
    "aldrig_uden_ok": ["sletter filer", "lægger noget på nettet"],
    "svarform": "Korte svar. Forklar kun det, der er nyt eller risikabelt.",
    "ved_tvivl": "spørg"
  },
  "tjek_kommandoer": [],
  "vaerktoej": { "modeller": [] },
  "ekstra": [{ "overskrift": "…", "hvad_jeg_laerte": "…" }],
  "aabne": []
}
```

`tjek_kommandoer` er de kommandoer, der beviser, at projektet virker (fx `npm test`). Find dem sammen med personen ud fra D3. Findes der ingen endnu, så lad listen være tom, og tag "en første test" med i planen i fase 5.
