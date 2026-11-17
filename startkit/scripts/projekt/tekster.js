// Alle beskeder fra startkittets programmer, på dansk og engelsk. Selve reglerne ligger i de andre filer;
// her ligger kun teksten, så en rettelse i en regel gælder begge sprog på én gang.
//
// Sproget står i filen sprog.json ved siden af denne fil ({"sprog": "en"}). Mangler den, er det dansk.
// Installationen skriver den i skill-mappen, og opsætningen skriver den i projektet.
//
// Hvilket AI-værktøj kittet er sat op til, står på samme måde i vaerktoej.json ({"vaerktoej": "claude"}).
// Mangler den, er det Codex. Reglerne er de samme; kun navne på filer og kommandoer er forskellige.
const fs = require("fs");
const path = require("path");

function sprog() {
  const miljoe = process.env.STARTKIT_SPROG;
  if (miljoe === "en" || miljoe === "da") return miljoe;
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, "sprog.json"), "utf8")).sprog === "en" ? "en" : "da"; }
  catch { return "da"; }
}

function vaerktoej() {
  const miljoe = process.env.STARTKIT_VAERKTOEJ;
  if (miljoe === "claude" || miljoe === "codex") return miljoe;
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, "vaerktoej.json"), "utf8")).vaerktoej === "claude" ? "claude" : "codex"; }
  catch { return "codex"; }
}

// Det, der hedder noget forskelligt i de to værktøjer. Sættes ind i beskederne, hvor der står {V}, {regelfil}, {hookfil} og {forbrug}.
//   starthook: om statusfilen kan læses ind automatisk, når en chat begynder (hook: SessionStart). Det er slået op og
//   prøvet for Claude Code. For Codex er det ikke bekræftet, så dér læser AI'en stadig filen, fordi reglerne siger det.
//   fejlhook: om værktøjet siger til, når en kommando er fejlet (hook: PostToolUseFailure). Det gør Claude Code ifølge
//   dokumentationen; Codex har ingen sådan hændelse. Loop-stoppet (loopstop.js) er derfor kun en lås i Claude Code.
//   hookvaerktoejer: de værktøjer, vagten skal kaldes før. Claude Code læser filer med sit eget værktøj (Read),
//   så dér skal vagten også med, ellers kunne en .env-fil læses uden om den.
const VAERKTOEJER = {
  codex: { V: "Codex", regelfil: "AGENTS.md", hookfil: ".codex/hooks.json", forbrug: "/status", start: "$startkit", hookvaerktoejer: "Bash|apply_patch|Edit|Write", starthook: false, fejlhook: false },
  claude: { V: "Claude Code", regelfil: "CLAUDE.md", hookfil: ".claude/settings.local.json", forbrug: "/usage", start: "/startkit", hookvaerktoejer: "Bash|PowerShell|Edit|Write|MultiEdit|NotebookEdit|Read|Grep", starthook: true, fejlhook: true },
};
// Claude Codes egne forbudsregler for hemmelige filer. De er et ekstra lag ved siden af vagten: kører en hook ikke
// (det er set på Windows), stopper de stadig læsning og ændring af filerne. .env.example er med vilje ikke på listen.
const FORBUDSREGLER = ["Read(.env)", "Read(.env.local)", "Read(.env.development)", "Read(.env.production)", "Read(.env.*.local)"];
const vt = (navn) => (navn ? VAERKTOEJER[vaerktoej()][navn] : VAERKTOEJER[vaerktoej()]);

// De filer i projektet, personen selv ser, hedder noget forskelligt på de to sprog.
const FILER = {
  da: { fejl: "docs/gentagne-fejl.md", deling: "docs/foer-du-deler.md", hvorfor: ".startkit/hvorfor-blev-jeg-stoppet.md", fortryd: ".startkit/saadan-fortryder-du.md", genvej: "overblik.cmd", profil: ".startkit/profil.json" },
  en: { fejl: "docs/recurring-mistakes.md", deling: "docs/before-you-share.md", hvorfor: ".startkit/why-was-i-stopped.md", fortryd: ".startkit/how-to-undo.md", genvej: "overview.cmd", profil: ".startkit/profile.json" },
};
const fil = (navn) => FILER[sprog()][navn];

const TEKSTER = {
  da: {
    // ---- vagten (regler.js og vagt.js) ----
    "vagt.se": " Mere forklaring: {fil}.",
    "vagt.hookspath.flyt": "Stoppet: AI'en ville flytte det sted, hvor projektets kontrol for nøgler ligger (git -c core.hooksPath). Hvorfor: så kører kontrollen ikke, og en nøgle kan slippe med ud. Hvad nu: lad indstillingen være. Ejeren ændrer den selv, hvis det er med vilje.",
    "vagt.alias": "Stoppet: kommandoen laver en genvej til en anden kommando (git alias). Hvorfor: en genvej kan skjule noget, der springer kontrollerne over eller overskriver arbejde. Hvad nu: skriv kommandoen helt ud. Ejeren kører den selv, hvis det er med vilje.",
    "vagt.hookspath.sluk": "Stoppet: AI'en ville flytte eller slukke kontrollen, der leder efter nøgler, før arbejdet gemmes (git config core.hooksPath). Hvorfor: uden den kan en nøgle komme med uden at blive opdaget. Hvad nu: lad indstillingen være. Ejeren ændrer den selv, hvis det er med vilje.",
    "vagt.noverify": "Stoppet: AI'en ville gemme arbejdet uden om kontrollen, der leder efter nøgler (git commit --no-verify). Hvorfor: så kan en nøgle komme med uden at blive opdaget. Hvad nu: gem på den almindelige måde. Stopper kontrollen det, så find årsagen i stedet for at springe den over.",
    "vagt.force": "Stoppet: AI'en ville overskrive det, der ligger på nettet, med sin egen udgave (git push --force). Hvorfor: arbejde, der bliver overskrevet sådan, kan ikke hentes igen. Hvad nu: send arbejdet på den almindelige måde. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.reset": "Stoppet: AI'en ville rulle projektet tilbage og kassere alt, der ikke er gemt (git reset --hard). Hvorfor: det, der kasseres, kan ikke hentes igen. Hvad nu: ret de enkelte filer i stedet. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.clean": "Stoppet: AI'en ville slette alle nye filer, der ikke er gemt endnu (git clean). Hvorfor: de kan ikke hentes igen. Hvad nu: slet kun de filer, der skal væk, én ad gangen. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.kasser": "Stoppet: AI'en ville smide alle ændringer væk, der ikke er gemt ({k}). Hvorfor: de kan ikke hentes igen. Hvad nu: ret én fil ad gangen tilbage. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.stash": "Stoppet: AI'en ville slette ændringer, der er lagt til side (git stash drop eller git stash clear). Hvorfor: de forsvinder for altid. Hvad nu: lad dem ligge. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.gren": "Stoppet: AI'en ville slette en gren, altså en sidelinje af projektet, selv om arbejdet på den ikke er lagt sammen med resten (git branch -D). Hvorfor: det arbejde kan gå tabt. Hvad nu: brug den forsigtige sletning, som kun fjerner det, der er lagt sammen (git branch -d). Ejeren kører selv den hårde, hvis det er med vilje.",
    "vagt.slet.udenfor": "Stoppet: AI'en ville slette {m}, som ligger uden for projektmappen (eller er din hjemmemappe). Hvorfor: det, der slettes dér, kan ikke hentes igen. Hvad nu: slet kun inde i projektet. Ejeren sletter selv, hvis det er med vilje.",
    "vagt.slet.alt": "Stoppet: kommandoen sletter alt i mappen eller projektets gemte historik ({m}). Hvorfor: det kan ikke hentes igen. Hvad nu: slet kun de filer, der skal væk. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.slet.mappe": "Stoppet: kommandoen sletter hele mappen {m} med alt, hvad der ligger i den. Hvorfor: det, der ikke er gemt, kan ikke hentes igen. Hvad nu: slet enkelte filer i stedet. Mapper, der kan laves igen af sig selv, må AI'en gerne slette (fx node_modules, dist og build). Ejeren sletter selv alt andet, hvis det er med vilje.",
    "vagt.slet.variabel": "Stoppet: stedet, der skal slettes ({m}), indeholder en variabel, altså et navn, der først bliver til en rigtig mappe, når kommandoen kører. Hvorfor: er navnet tomt, rammer sletningen en helt anden mappe. Hvad nu: skriv hele mappens navn ud. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.env.kommando": "Stoppet: kommandoen rører en fil med projektets nøgler (.env). Hvorfor: AI'en må aldrig læse eller skrive nøgler; en nøgle, der har været vist i en chat, skal skiftes. Hvad nu: ejeren lægger selv nøglerne ind. AI'en kan forklare hvordan.",
    "vagt.noegle.kommando": "Stoppet: kommandoen indeholder noget, der ligner en nøgle, altså en hemmelig kode til en tjeneste. Hvorfor: en nøgle, der står i en kommando eller en chat, kan blive misbrugt og skal skiftes. Hvad nu: skriv aldrig den rigtige nøgle. Ejeren lægger den selv ind det rigtige sted.",
    "vagt.kontrol.kommando": "Stoppet: kommandoen ændrer en af startkittets kontroller (vagten, færdig-tjekket, nøgletjekket eller deres indstillinger). Hvorfor: ellers kunne AI'en slå en kontrol fra, når den er i vejen. Hvad nu: at læse kontrollerne er i orden. At ændre dem gør ejeren selv, eller ved at køre startkittets opsætning igen.",
    "vagt.env.fil": "Stoppet: {f} er en fil med projektets nøgler. Hvorfor: AI'en må aldrig læse eller skrive nøgler; en nøgle, der har været vist i en chat, skal skiftes. Hvad nu: ejeren lægger selv nøglerne ind. AI'en kan forklare hvordan.",
    "vagt.kontrol.fil": "Stoppet: {f} er en af startkittets kontroller. Hvorfor: ellers kunne AI'en slå en kontrol fra, når den er i vejen. Hvad nu: ejeren ændrer filen selv, eller kører startkittets opsætning igen.",
    "vagt.noegle.fil": "Stoppet: indholdet ligner en nøgle eller en anden hemmelighed. Hvorfor: en nøgle i en fil kan komme med ud til andre. Hvad nu: skriv aldrig rigtige nøgler i filer. Ejeren lægger dem selv ind det rigtige sted.",
    "vagt.ulaeselig": "Stoppet: vagten kunne ikke læse, hvad AI'en var ved at gøre. Hvorfor: er vagten i tvivl, siger den nej for en sikkerheds skyld. Hvad nu: prøv igen. Sker det flere gange, så sig det til ejeren.",
    "vagt.fejlede": "Stoppet: vagten selv gik i stykker ({fejl}). Hvorfor: virker vagten ikke, siger den nej for en sikkerheds skyld. Hvad nu: sig det til ejeren, og prøv ikke at komme udenom.",

    // ---- loop-stop (loopstop.js; beskeden gives af vagt.js) ----
    "loop.anden": "Stoppet: den samme kommando er fejlet på samme måde {antal} gange i denne chat. Hvorfor: at prøve det samme igen hjælper sjældent; årsagen skal findes først. Hvad nu: fortæl ejeren, hvad du har prøvet, og hvad du tror, årsagen er. Derefter må du fortsætte.",
    "loop.igen": "Stoppet: den samme kommando er nu fejlet på samme måde {antal} gange i denne chat. Hvorfor: flere forsøg i samme chat koster tid og forbrug uden at komme nærmere. Hvad nu: skriv fejlen ordret og det, du har prøvet, i STATUS.md og i {fil}, og foreslå ejeren at starte en ny chat med den.",
    "loop.fejl": " Fejlen var: {fejl}",

    // ---- færdig-tjekket (faerdig.js) ----
    "faerdig.intet": "Der findes ikke noget bevis endnu.",
    "faerdig.roedt": "Det seneste bevis er rødt.",
    "faerdig.aendret": "Koden er ændret, siden beviset blev taget.",
    "faerdig.besked": "Ikke færdig endnu: koden er ændret i denne chat, og det er ikke vist, at den virker. Hvorfor: {hvorfor} Hvad nu: kør beviset, altså projektets egne tjek (node scripts/startkit/bevis.js). Er det rødt, så find og ret årsagen, ikke symptomet, og kør det igen. Fortæl derefter ejeren kort: hvad der er lavet, hvad beviset viste, og hvad du IKKE har afprøvet.",

    // ---- beviset (bevis.js) ----
    "ikke.git": "Ikke et git-projekt. Kør først: git init",
    "bevis.groen": "  ✅ grøn",
    "bevis.roed": "  ❌ rød",
    "bevis.ingen1": "Bevis gemt, men der er INGEN tjek-kommandoer sat op, så intet er afprøvet automatisk.",
    "bevis.ingen2": "Sig det ærligt til ejeren, og foreslå en første test. Kommandoer tilføjes i .startkit/config.json (det gør ejeren selv).",
    "bevis.groent": "Bevis: GRØNT. Alle tjek gik igennem.",
    "bevis.roedt": "Bevis: RØDT. Find og ret årsagen, og kør beviset igen.",

    // ---- forbrug (forbrug-gem.js) ----
    "forbrug.brug": "Brug: node scripts/startkit/forbrug-gem.js --5t <procent> --uge <procent>   (tal mellem 0 og 100)",
    "forbrug.gemt": "Forbrug gemt.",

    // ---- overblikket (overblik.js) ----
    "ov.lang": "da",
    "ov.locale": "da-DK",
    "ov.titel": "Overblik",
    "ov.ukendt.tid": "ukendt tidspunkt",
    "ov.ingen.status": "Ingen STATUS.md endnu. Den laves af startkittets opsætning.",
    "ov.intet.skrevet": "Intet skrevet.",
    "ov.intet.bevis": "Intet bevis endnu. Kør <code>node scripts/startkit/bevis.js</code>.",
    "ov.gult": "gult (ingen tjek sat op, så intet er afprøvet)",
    "ov.groent": "grønt",
    "ov.roedt": "rødt",
    "ov.seneste.bevis": "Seneste bevis:",
    "ov.ingen.tal": "Ingen tal gemt endnu. Skriv <code>{forbrug}</code> i {V}, og gem tallene med <code>node scripts/startkit/forbrug-gem.js --5t 40 --uge 12</code>.",
    "ov.over.graense": "over din grænse på {graense} %",
    "ov.5t": "5 timer",
    "ov.uge": "Uge",
    "ov.gemt": "Gemt {tid}",
    "ov.gamle.tal": " (gamle tal: tjek {forbrug}, og gem igen)",
    "ov.ingen.gren": "(ingen gren)",
    "ov.opdaterer": "Opdaterer sig selv hvert 15. sekund. Kun læsning.",
    "ov.ikke.git.endnu": "Mappen er ikke et git-projekt endnu.",
    "ov.hook.fra": "Nøgletjekket før commit er ikke tændt. Tænd det med <code>git config core.hooksPath .githooks</code>.",
    "ov.h.hvor": "Hvor er vi?",
    "ov.h.aendringer": "Ændringer, der ikke er gemt",
    "ov.gren": "Gren:",
    "ov.alt.gemt": "Ingen. Alt er gemt i git.",
    "ov.ikke.git": "Ikke et git-projekt.",
    "ov.h.seneste": "Seneste gemte ændringer",
    "ov.ingen.commits": "Ingen commits endnu.",
    "ov.h.virker": "Virker det?",
    "ov.h.fejl": "Gentagne fejl",
    "ov.ingen.liste": "Ingen liste endnu.",
    "ov.fejl.antal": "{antal} nedskrevne fejl",
    "ov.fejl.ulaast": ", heraf <b>{ulaast}</b> uden en lås",
    "ov.h.model": "Hvilken model til hvad?",
    "ov.ingen.guide": "Ingen modelguide endnu. Den laves i startkittets fase 5.",
    "ov.h.forbrug": "Forbrug",
    "ov.gp.ja": "Seneste gemmepunkt: {tid} ({antal} i alt). Hent filer tilbage med <code>node scripts/startkit/fortryd.js</code>.",
    "ov.gp.nej": "Ingen gemmepunkter endnu. Der bliver taget ét automatisk i starten af hver chat.",
    "ov.puls.ja": "Vagten blev sidst kaldt af {V}: {tid}.",
    "ov.puls.nej": "Vagten er aldrig blevet kaldt af {V} i dette projekt. Har du arbejdet i {V} her, siden startkittet blev sat op, så kører hooks'ene ikke. Skriv {start} i {V}, og bed om hjælp.",
    "ov.forbudt": "Forbudt",
    "ov.ikke.fundet": "Ikke fundet",
    "ov.port": "Port {port} er optaget. Kører overblikket allerede? Prøv {adresse}",
    "ov.koerer": "Overblik kører: {adresse}   (luk vinduet, eller tryk Ctrl+C, for at stoppe)",

    // ---- fortryd og gemmepunkter (fortryd.js) ----
    "fo.ingen": "Der er ingen gemmepunkter endnu. Der bliver taget ét automatisk i starten af hver chat, når noget er ændret siden sidst.",
    "fo.overskrift": "Gemmepunkter (nyeste først):",
    "fo.linje": "  {nr}. {tid}  ({antal} filer er anderledes nu)",
    "fo.linje.en": "  {nr}. {tid}  (1 fil er anderledes nu)",
    "fo.linje.ens": "  {nr}. {tid}  (ingen forskel fra nu)",
    "fo.brug": "\nSe filerne:    node scripts/startkit/fortryd.js --vis <nummer>\nHent tilbage:  node scripts/startkit/fortryd.js --hent <nummer> [fil ...]\nGem nu:        node scripts/startkit/fortryd.js --gem",
    "fo.ukendt": "Der er ikke noget gemmepunkt nummer {nr}. Kør uden tal for at se listen.",
    "fo.vis": "Gemmepunkt {nr} ({tid}). Disse filer er anderledes nu:",
    "fo.M": "ændret siden",
    "fo.D": "slettet siden; kan hentes tilbage",
    "fo.A": "kommet til siden; bliver liggende",
    "fo.vis.ens": "Ingen filer er anderledes nu end i gemmepunkt {nr}.",
    "fo.hentet": "Hentet fra gemmepunkt {nr} ({tid}). Filerne, som de så ud lige før, er gemt som et nyt gemmepunkt, så du kan fortryde igen. Filer, der er kommet til siden, er ikke slettet.",
    "fo.hent.fejl": "Kunne ikke hente fra gemmepunktet: {fejl}",
    "fo.gemt": "Gemmepunkt taget.",
    "fo.gem.intet": "Intet er ændret siden sidste gemmepunkt eller sidste commit, så der er ikke taget et nyt.",

    // ---- chattens start (start.js) ----
    "start.status": "Startkit: sådan står projektet (STATUS.md, læst ind automatisk ved chattens start).",
    "start.fejl": "Startkit: fejl, der ikke må ske igen ({fil}).",
    "start.kort": "(forkortet; resten står i filen)",

    // ---- opsætningen (opsaet.js) ----
    "ops.ikke.objekt": "Profilen er ikke et JSON-objekt.",
    "ops.navn": "person.navn mangler.",
    "ops.projekt": "Der mangler et projekt med navn og beskrivelse (projekter[] og valgt_projekt).",
    "ops.aldrig": "regler.aldrig_uden_ok skal være en liste med mindst én ting.",
    "ops.svarform": "regler.svarform mangler.",
    "ops.tjek": "tjek_kommandoer skal være en liste af tekster.",
    "ops.noegle": "Profilen indeholder noget, der ligner en nøgle. Fjern den (og skift nøglen hos udbyderen); nøgler må aldrig stå i profilen.",
    "ops.ved.tvivl": "spørg ejeren",
    "ops.status.hook1": "Startkit: vagten tjekker",
    "ops.status.hook2": "Startkit: færdig-tjek",
    "ops.hooks.json": "{hookfil} findes, men kan ikke læses som JSON. Ret filen (eller flyt den), og kør opsætningen igen.",
    "ops.gitignore": "# Tilføjet af startkittet",
    "ops.ukendt": "ukendt",
    "ops.h.ny": "ny",
    "ops.h.uaendret": "uændret",
    "ops.h.opdateres": "opdateres",
    "ops.h.findes": "findes (røres ikke)",
    "ops.n.agents": "korte, faste regler; kun startkittets blok ændres",
    "ops.n.status": "hvor vi er, fra gang til gang",
    "ops.n.fejl": "fejl, der ikke må ske igen",
    "ops.n.deling": "tjekliste til, før noget deles med andre",
    "ops.n.hvorfor": "forklaring af kontrollerne",
    "ops.n.fortryd": "sådan går du tilbage, når noget er gået galt",
    "ops.n.forloeb": "hvor langt startkittet er",
    "ops.n.config": "hvilke kommandoer beviser, at det virker",
    "ops.n.scripts": "vagt, færdig-tjek, bevis og overblik",
    "ops.n.genvej": "dobbeltklik for at åbne overblikket i browseren",
    "ops.n.feedback": "din feedback på startkittet (sendes aldrig automatisk)",
    "ops.n.precommit": "nøgletjek og længdelås før commit",
    "ops.n.hooks": "tænder vagten og færdig-tjekket i Codex (skal godkendes med /hooks)",
    "ops.n.ignore": "holder nøglefiler ude af git",
    "ops.brug": "Brug: node opsaet.js <projektmappe> [--toer]",
    "mappe.findes.ikke": "Mappen findes ikke: {mappe}",
    "ops.ingen.profil": "Der er ingen profil endnu (.startkit/profil.json). Lav interviewet først.",
    "ops.profil.json": ".startkit/profil.json kan ikke læses som JSON.",
    "ops.mangler": "Profilen mangler noget:",
    "ops.vil": "Det her vil blive sat op i {root} (intet er skrevet endnu):\n",
    "ops.saetter": "Sætter op i {root}:\n",
    "ops.lang": "\nBemærk: {regelfil} bliver på {linjer} linjer (højst 80). Flyt dine egne lange afsnit til docs/, ellers stopper længdelåsen næste commit.",
    "ops.ingen.tjek": "\nBemærk: der er ingen tjek-kommandoer i profilen, så beviset kan ikke afprøve noget endnu. Tag en første test med i planen.",
    "ops.naeste": "\nNæste skridt: tænd nøgletjekket (git config core.hooksPath .githooks), godkend hooks med /hooks i Codex, og start en ny chat.",

    // ---- nøglescan (noeglescan.js) ----
    "scan.ingen.sh": "Kan ikke finde 'sh'. Den følger med Git for Windows (git-scm.com). Installer Git, og prøv igen.",

    // ---- tjek af feedback-filen (feedback-tjek.js) ----
    "fb.noegle": "noget, der ligner en nøgle eller adgangskode",
    "fb.email": "en e-mailadresse",
    "fb.sti": "en sti med et brugernavn",
    "fb.ingen.fil": "Der er ingen feedback-fil endnu (.startkit/feedback.md).",
    "fb.ren": "Feedback-filen er set efter: ingen nøgler, e-mailadresser eller stier med brugernavn fundet.\nLæs den selv igennem, før du sender den. Kun du ved, hvad der er privat.",
    "fb.fund": "Feedback-filen indeholder noget, der ikke bør sendes:\n",
    "fb.linje": "  linje {linje}: {slags}",
    "fb.ret": "\nRet linjerne i .startkit/feedback.md, og kør tjekket igen.",

    // ---- tjek af opsætningen (tjek-opsaetning.js) ----
    "tj.git": "Mappen er et git-projekt",
    "tj.git.h": "Kør: git init",
    "tj.node": "Node er version 18 eller nyere",
    "tj.node.h": "Installer Node LTS fra nodejs.org",
    "tj.igen": "Kør opsætningen igen",
    "tj.agents": "{regelfil} findes og har startkittets blok",
    "tj.agents.kort": "{regelfil} er højst 80 linjer",
    "tj.agents.kort.h": "Flyt lange afsnit til docs/",
    "tj.findes": "{fil} findes",
    "tj.genvej": "Genvejen til overblikket findes ({fil})",
    "tj.hooks": "{hookfil} kan læses",
    "tj.hooks.h": "Filen mangler eller er ikke gyldig JSON. Kør opsætningen igen",
    "tj.vagt": "Vagten er koblet til og peger på en fil, der findes",
    "tj.faerdig": "Færdig-tjekket er koblet til og peger på en fil, der findes",
    "tj.flyttet": "Er mappen flyttet? Kør opsætningen igen",
    "tj.noegletjek": "Nøgletjekket findes (.githooks/pre-commit)",
    "tj.taendt": "Nøgletjekket er tændt (core.hooksPath)",
    "tj.taendt.h": "Kør: git config core.hooksPath .githooks",
    "tj.config": ".startkit/config.json kan læses",
    "tj.kommando": "Der er mindst én tjek-kommando (ellers afprøver beviset ingenting)",
    "tj.kommando.h": "Tilføj fx \"npm test\" under tjek i .startkit/config.json",
    "tj.env": ".env er holdt ude af git (.gitignore)",
    "tj.afviser": "Vagten afviser et forbudt kald, når den køres direkte",
    "tj.afviser.h": "Kør opsætningen igen, og tjek at Node virker",
    "tj.puls.ja": "✅ {V} kalder vagten (sidst for {tid} siden)",
    "tj.puls.gammel": "⚠️ {V} har ikke kaldt vagten i {tid}. Kører du dette inde i {V}, så kører hooks'ene ikke længere. Sig det til ejeren, og se {fil}.",
    "tj.puls.nej": "⚠️ {V} har endnu aldrig kaldt vagten i dette projekt. Lige efter opsætningen er det normalt. Kører du dette inde i en ny chat i {V}, så kører hooks'ene ikke. Sig det til ejeren, og se {fil}.",
    "tj.tid.sek": "{n} sekunder",
    "tj.tid.min": "{n} minutter",
    "tj.tid.timer": "{n} timer",
    "tj.tid.dage": "{n} dage",
    "tj.start": "Statusfilen læses automatisk ind, når en chat begynder (peger på en fil, der findes)",
    "tj.loop": "Loop-stoppet er koblet til: gentagne fejl tælles (peger på en fil, der findes)",
    "tj.deny": "Hemmelige filer (.env) er også spærret med Claude Codes egne forbudsregler (ekstra lag)",
    "tj.mangler": "\n{antal} ting mangler.",
    "tj.alt": "\nAlt er sat op.",
    "tj.husk": "Husk: linjen om, at {V} kalder vagten, er kun til at stole på, når dette tjek køres inde i en chat i {V}. Prøv også vagten ved at lade {V} forsøge et forbudt kald.",
  },

  en: {
    "vagt.se": " More explanation: {fil}.",
    "vagt.hookspath.flyt": "Stopped: the AI was about to move the place where the project's check for keys lives (git -c core.hooksPath). Why: then the check does not run, and a key can slip out. What now: leave the setting alone. The owner changes it themselves if it is intended.",
    "vagt.alias": "Stopped: the command creates a shortcut to another command (git alias). Why: a shortcut can hide something that skips the checks or overwrites work. What now: write the command out in full. The owner runs it themselves if it is intended.",
    "vagt.hookspath.sluk": "Stopped: the AI was about to move or switch off the check that looks for keys before work is saved (git config core.hooksPath). Why: without it a key can come along without being noticed. What now: leave the setting alone. The owner changes it themselves if it is intended.",
    "vagt.noverify": "Stopped: the AI was about to save the work around the check that looks for keys (git commit --no-verify). Why: then a key can come along without being noticed. What now: save in the ordinary way. If the check stops it, find the cause instead of skipping the check.",
    "vagt.force": "Stopped: the AI was about to overwrite what is online with its own copy (git push --force). Why: work that is overwritten this way cannot be recovered. What now: send the work in the ordinary way. The owner runs the command themselves if it is intended.",
    "vagt.reset": "Stopped: the AI was about to roll the project back and throw away everything that is not saved (git reset --hard). Why: what is thrown away cannot be recovered. What now: fix the individual files instead. The owner runs the command themselves if it is intended.",
    "vagt.clean": "Stopped: the AI was about to delete all new files that are not saved yet (git clean). Why: they cannot be recovered. What now: delete only the files that have to go, one at a time. The owner runs the command themselves if it is intended.",
    "vagt.kasser": "Stopped: the AI was about to throw away all changes that are not saved ({k}). Why: they cannot be recovered. What now: put one file back at a time. The owner runs the command themselves if it is intended.",
    "vagt.stash": "Stopped: the AI was about to delete changes that have been set aside (git stash drop or git stash clear). Why: they are gone for good. What now: leave them where they are. The owner runs the command themselves if it is intended.",
    "vagt.gren": "Stopped: the AI was about to delete a side line of the project, even though the work on it has not been joined with the rest (git branch -D). Why: that work can be lost. What now: use the careful delete, which only removes what has been joined (git branch -d). The owner runs the hard one themselves if it is intended.",
    "vagt.slet.udenfor": "Stopped: the AI was about to delete {m}, which is outside the project folder (or is your home folder). Why: what is deleted there cannot be recovered. What now: delete only inside the project. The owner deletes it themselves if it is intended.",
    "vagt.slet.alt": "Stopped: the command deletes everything in the folder, or the project's saved history ({m}). Why: it cannot be recovered. What now: delete only the files that have to go. The owner runs the command themselves if it is intended.",
    "vagt.slet.mappe": "Stopped: the command deletes the whole folder {m} and everything in it. Why: what is not saved cannot be recovered. What now: delete single files instead. Folders that can be recreated by themselves the AI may delete (like node_modules, dist and build). The owner deletes everything else themselves if it is intended.",
    "vagt.slet.variabel": "Stopped: the place to be deleted ({m}) contains a variable, meaning a name that only becomes a real folder when the command runs. Why: if the name is empty, the delete hits a completely different folder. What now: write out the full name of the folder. The owner runs the command themselves if it is intended.",
    "vagt.env.kommando": "Stopped: the command touches a file with the project's keys (.env). Why: the AI must never read or write keys; a key that has been shown in a chat has to be replaced. What now: the owner puts the keys in themselves. The AI can explain how.",
    "vagt.noegle.kommando": "Stopped: the command contains something that looks like a key, meaning a secret code for a service. Why: a key that is written in a command or a chat can be misused and has to be replaced. What now: never write the real key. The owner puts it in the right place themselves.",
    "vagt.kontrol.kommando": "Stopped: the command changes one of the starter kit's controls (the guard, the done-check, the key check or their settings). Why: otherwise the AI could switch a control off when it is in the way. What now: reading the controls is fine. Changing them is for the owner, or done by running the starter kit's setup again.",
    "vagt.env.fil": "Stopped: {f} is a file with the project's keys. Why: the AI must never read or write keys; a key that has been shown in a chat has to be replaced. What now: the owner puts the keys in themselves. The AI can explain how.",
    "vagt.kontrol.fil": "Stopped: {f} is one of the starter kit's controls. Why: otherwise the AI could switch a control off when it is in the way. What now: the owner changes the file themselves, or runs the starter kit's setup again.",
    "vagt.noegle.fil": "Stopped: the content looks like a key or another secret. Why: a key in a file can travel out to other people. What now: never write real keys in files. The owner puts them in the right place themselves.",
    "vagt.ulaeselig": "Stopped: the guard could not read what the AI was about to do. Why: when the guard is in doubt, it says no to be on the safe side. What now: try again. If it keeps happening, tell the owner.",
    "vagt.fejlede": "Stopped: the guard itself broke ({fejl}). Why: when the guard does not work, it says no to be on the safe side. What now: tell the owner, and do not try to get around it.",

    // ---- loop-stop (loopstop.js; beskeden gives af vagt.js) ----
    "loop.anden": "Stopped: the same command has failed in the same way {antal} times in this chat. Why: trying the same thing again rarely helps; the cause has to be found first. What now: tell the owner what you have tried, and what you think the cause is. After that you may continue.",
    "loop.igen": "Stopped: the same command has now failed in the same way {antal} times in this chat. Why: more attempts in the same chat cost time and usage without getting closer. What now: write the error word for word and what you have tried in STATUS.md and in {fil}, and suggest that the owner starts a new chat with it.",
    "loop.fejl": " The error was: {fejl}",

    "faerdig.intet": "There is no proof yet.",
    "faerdig.roedt": "The latest proof is red.",
    "faerdig.aendret": "The code has changed since the proof was taken.",
    "faerdig.besked": "Not done yet: the code has changed in this chat, and it has not been shown to work. Why: {hvorfor} What now: run the proof, meaning the project's own checks (node scripts/startkit/bevis.js). If it is red, find and fix the cause, not the symptom, and run it again. Then tell the owner briefly: what was done, what the proof showed, and what you have NOT tried.",

    "ikke.git": "Not a git project. Run this first: git init",
    "bevis.groen": "  ✅ green",
    "bevis.roed": "  ❌ red",
    "bevis.ingen1": "Proof saved, but NO check commands are set up, so nothing has been tried automatically.",
    "bevis.ingen2": "Tell the owner honestly, and suggest a first test. Commands are added in .startkit/config.json (the owner does that).",
    "bevis.groent": "Proof: GREEN. All checks passed.",
    "bevis.roedt": "Proof: RED. Find and fix the cause, and run the proof again.",

    "forbrug.brug": "Usage: node scripts/startkit/forbrug-gem.js --5h <percent> --week <percent>   (numbers between 0 and 100)",
    "forbrug.gemt": "Usage saved.",

    "ov.lang": "en",
    "ov.locale": "en-GB",
    "ov.titel": "Overview",
    "ov.ukendt.tid": "unknown time",
    "ov.ingen.status": "No STATUS.md yet. The starter kit's setup creates it.",
    "ov.intet.skrevet": "Nothing written.",
    "ov.intet.bevis": "No proof yet. Run <code>node scripts/startkit/bevis.js</code>.",
    "ov.gult": "yellow (no checks set up, so nothing has been tried)",
    "ov.groent": "green",
    "ov.roedt": "red",
    "ov.seneste.bevis": "Latest proof:",
    "ov.ingen.tal": "No numbers saved yet. Type <code>{forbrug}</code> in {V}, and save the numbers with <code>node scripts/startkit/forbrug-gem.js --5h 40 --week 12</code>.",
    "ov.over.graense": "above your limit of {graense} %",
    "ov.5t": "5 hours",
    "ov.uge": "Week",
    "ov.gemt": "Saved {tid}",
    "ov.gamle.tal": " (old numbers: check {forbrug}, and save again)",
    "ov.ingen.gren": "(no branch)",
    "ov.opdaterer": "Refreshes itself every 15 seconds. Read-only.",
    "ov.ikke.git.endnu": "The folder is not a git project yet.",
    "ov.hook.fra": "The key check before commit is not switched on. Switch it on with <code>git config core.hooksPath .githooks</code>.",
    "ov.h.hvor": "Where are we?",
    "ov.h.aendringer": "Changes that are not saved",
    "ov.gren": "Branch:",
    "ov.alt.gemt": "None. Everything is saved in git.",
    "ov.ikke.git": "Not a git project.",
    "ov.h.seneste": "Latest saved changes",
    "ov.ingen.commits": "No commits yet.",
    "ov.h.virker": "Does it work?",
    "ov.h.fejl": "Recurring mistakes",
    "ov.ingen.liste": "No list yet.",
    "ov.fejl.antal": "{antal} mistakes written down",
    "ov.fejl.ulaast": ", <b>{ulaast}</b> of them without a lock",
    "ov.h.model": "Which model for what?",
    "ov.ingen.guide": "No model guide yet. It is made in phase 5 of the starter kit.",
    "ov.h.forbrug": "Usage",
    "ov.gp.ja": "Latest save point: {tid} ({antal} in total). Restore files with <code>node scripts/startkit/fortryd.js</code>.",
    "ov.gp.nej": "No save points yet. One is taken automatically at the start of every chat.",
    "ov.puls.ja": "The guard was last called by {V}: {tid}.",
    "ov.puls.nej": "The guard has never been called by {V} in this project. If you have worked in {V} here since the starter kit was set up, the hooks are not running. Type {start} in {V}, and ask for help.",
    "ov.forbudt": "Forbidden",
    "ov.ikke.fundet": "Not found",
    "ov.port": "Port {port} is in use. Is the overview already running? Try {adresse}",
    "ov.koerer": "The overview is running: {adresse}   (close the window, or press Ctrl+C, to stop)",

    "fo.ingen": "There are no save points yet. One is taken automatically at the start of every chat, when something has changed since the last one.",
    "fo.overskrift": "Save points (newest first):",
    "fo.linje": "  {nr}. {tid}  ({antal} files are different now)",
    "fo.linje.en": "  {nr}. {tid}  (1 file is different now)",
    "fo.linje.ens": "  {nr}. {tid}  (no difference from now)",
    "fo.brug": "\nSee the files:  node scripts/startkit/fortryd.js --show <number>\nRestore:        node scripts/startkit/fortryd.js --restore <number> [file ...]\nSave now:       node scripts/startkit/fortryd.js --save",
    "fo.ukendt": "There is no save point number {nr}. Run without a number to see the list.",
    "fo.vis": "Save point {nr} ({tid}). These files are different now:",
    "fo.M": "changed since",
    "fo.D": "deleted since; can be restored",
    "fo.A": "added since; stays where it is",
    "fo.vis.ens": "No files are different now from save point {nr}.",
    "fo.hentet": "Restored from save point {nr} ({tid}). The files as they looked just before are saved as a new save point, so you can undo again. Files added since have not been deleted.",
    "fo.hent.fejl": "Could not restore from the save point: {fejl}",
    "fo.gemt": "Save point taken.",
    "fo.gem.intet": "Nothing has changed since the last save point or the last commit, so no new one was taken.",

    "start.status": "Starter kit: this is where the project stands (STATUS.md, loaded automatically at the start of the chat).",
    "start.fejl": "Starter kit: mistakes that must not happen again ({fil}).",
    "start.kort": "(shortened; the rest is in the file)",

    "ops.ikke.objekt": "The profile is not a JSON object.",
    "ops.navn": "person.name is missing.",
    "ops.projekt": "A project with a name and a description is missing (projects[] and chosen_project).",
    "ops.aldrig": "rules.never_without_ok must be a list with at least one thing.",
    "ops.svarform": "rules.answer_style is missing.",
    "ops.tjek": "check_commands must be a list of texts.",
    "ops.noegle": "The profile contains something that looks like a key. Remove it (and change the key at the provider); keys must never be in the profile.",
    "ops.ved.tvivl": "ask the owner",
    "ops.status.hook1": "Starter kit: the guard is checking",
    "ops.status.hook2": "Starter kit: done-check",
    "ops.hooks.json": "{hookfil} exists, but cannot be read as JSON. Fix the file (or move it), and run the setup again.",
    "ops.gitignore": "# Added by the starter kit",
    "ops.ukendt": "unknown",
    "ops.h.ny": "new",
    "ops.h.uaendret": "unchanged",
    "ops.h.opdateres": "will be updated",
    "ops.h.findes": "exists (not touched)",
    "ops.n.agents": "short, fixed rules; only the starter kit's block is changed",
    "ops.n.status": "where we are, from one session to the next",
    "ops.n.fejl": "mistakes that must not happen again",
    "ops.n.deling": "checklist for before something is shared with others",
    "ops.n.hvorfor": "explanation of the controls",
    "ops.n.fortryd": "how to go back when something has gone wrong",
    "ops.n.forloeb": "how far the starter kit has come",
    "ops.n.config": "which commands prove that it works",
    "ops.n.scripts": "guard, done-check, proof and overview",
    "ops.n.genvej": "double-click to open the overview in the browser",
    "ops.n.feedback": "your feedback on the starter kit (never sent automatically)",
    "ops.n.precommit": "key check and length lock before commit",
    "ops.n.hooks": "switches on the guard and the done-check in Codex (must be approved with /hooks)",
    "ops.n.ignore": "keeps key files out of git",
    "ops.brug": "Usage: node opsaet.js <project folder> [--dry-run]",
    "mappe.findes.ikke": "The folder does not exist: {mappe}",
    "ops.ingen.profil": "There is no profile yet (.startkit/profile.json). Do the interview first.",
    "ops.profil.json": ".startkit/profile.json cannot be read as JSON.",
    "ops.mangler": "The profile is missing something:",
    "ops.vil": "This will be set up in {root} (nothing has been written yet):\n",
    "ops.saetter": "Setting up in {root}:\n",
    "ops.lang": "\nNote: {regelfil} will be {linjer} lines long (80 at most). Move your own long sections to docs/, or the length lock will stop the next commit.",
    "ops.ingen.tjek": "\nNote: there are no check commands in the profile, so the proof cannot try anything yet. Include a first test in the plan.",
    "ops.naeste": "\nNext step: switch on the key check (git config core.hooksPath .githooks), approve the hooks with /hooks in Codex, and start a new chat.",

    "scan.ingen.sh": "Cannot find 'sh'. It comes with Git for Windows (git-scm.com). Install Git, and try again.",

    "fb.noegle": "something that looks like a key or a password",
    "fb.email": "an email address",
    "fb.sti": "a path with a user name",
    "fb.ingen.fil": "There is no feedback file yet (.startkit/feedback.md).",
    "fb.ren": "The feedback file has been checked: no keys, email addresses or paths with a user name found.\nRead it through yourself before you send it. Only you know what is private.",
    "fb.fund": "The feedback file contains something that should not be sent:\n",
    "fb.linje": "  line {linje}: {slags}",
    "fb.ret": "\nFix the lines in .startkit/feedback.md, and run the check again.",

    "tj.git": "The folder is a git project",
    "tj.git.h": "Run: git init",
    "tj.node": "Node is version 18 or newer",
    "tj.node.h": "Install Node LTS from nodejs.org",
    "tj.igen": "Run the setup again",
    "tj.agents": "{regelfil} exists and has the starter kit's block",
    "tj.agents.kort": "{regelfil} is 80 lines at most",
    "tj.agents.kort.h": "Move long sections to docs/",
    "tj.findes": "{fil} exists",
    "tj.genvej": "The shortcut to the overview exists ({fil})",
    "tj.hooks": "{hookfil} can be read",
    "tj.hooks.h": "The file is missing or is not valid JSON. Run the setup again",
    "tj.vagt": "The guard is connected and points to a file that exists",
    "tj.faerdig": "The done-check is connected and points to a file that exists",
    "tj.flyttet": "Has the folder been moved? Run the setup again",
    "tj.noegletjek": "The key check exists (.githooks/pre-commit)",
    "tj.taendt": "The key check is switched on (core.hooksPath)",
    "tj.taendt.h": "Run: git config core.hooksPath .githooks",
    "tj.config": ".startkit/config.json can be read",
    "tj.kommando": "There is at least one check command (otherwise the proof tries nothing)",
    "tj.kommando.h": "Add for example \"npm test\" under checks in .startkit/config.json",
    "tj.env": ".env is kept out of git (.gitignore)",
    "tj.afviser": "The guard refuses a forbidden call when run directly",
    "tj.afviser.h": "Run the setup again, and check that Node works",
    "tj.puls.ja": "✅ {V} calls the guard (last time {tid} ago)",
    "tj.puls.gammel": "⚠️ {V} has not called the guard for {tid}. If you are running this inside {V}, the hooks are no longer running. Tell the owner, and see {fil}.",
    "tj.puls.nej": "⚠️ {V} has never called the guard in this project yet. Right after the setup that is normal. If you are running this inside a new chat in {V}, the hooks are not running. Tell the owner, and see {fil}.",
    "tj.tid.sek": "{n} seconds",
    "tj.tid.min": "{n} minutes",
    "tj.tid.timer": "{n} hours",
    "tj.tid.dage": "{n} days",
    "tj.start": "The status file is loaded automatically when a chat begins (points to a file that exists)",
    "tj.loop": "The loop stop is connected: repeated errors are counted (points to a file that exists)",
    "tj.deny": "Secret files (.env) are also blocked by Claude Code's own deny rules (extra layer)",
    "tj.mangler": "\n{antal} things are missing.",
    "tj.alt": "\nEverything is set up.",
    "tj.husk": "Remember: the line saying that {V} calls the guard can only be trusted when this check is run inside a chat in {V}. Also try the guard by letting {V} attempt a forbidden call.",
  },
};

// De få beskeder, hvor Claude Code ikke bare hedder noget andet, men virker anderledes:
// Claude Code har ingen godkendelse af hver enkelt hook. Den kører dem, når mappen er betroet.
const TEKSTER_CLAUDE = {
  da: {
    "ops.n.hooks": "tænder vagten, færdig-tjekket og loop-stoppet i Claude Code (se dem med /hooks)",
    "ops.naeste": "\nNæste skridt: tænd nøgletjekket (git config core.hooksPath .githooks), se med /hooks i Claude Code, at vagten og færdig-tjekket står der, og start en ny chat.",
  },
  en: {
    "ops.n.hooks": "switches on the guard, the done-check and the loop stop in Claude Code (see them with /hooks)",
    "ops.naeste": "\nNext step: switch on the key check (git config core.hooksPath .githooks), check with /hooks in Claude Code that the guard and the done-check are listed, and start a new chat.",
  },
};

// Henter en tekst på det aktuelle sprog og sætter værdier ind, hvor der står {navn}.
function t(noegle, vaerdier = {}) {
  const tekst = (vaerktoej() === "claude" ? TEKSTER_CLAUDE[sprog()][noegle] : undefined) ?? TEKSTER[sprog()][noegle] ?? TEKSTER.da[noegle];
  if (tekst === undefined) throw new Error(`Ukendt tekst: ${noegle}`);
  const alle = { ...vt(), ...vaerdier };
  return tekst.replace(/\{(\w+)\}/g, (hele, k) => (k in alle ? String(alle[k]) : hele));
}

// Indstillingerne (.startkit/config.json) har danske eller engelske navne. Her får de ét sæt navne.
function laesConfig(raa) {
  const c = raa && typeof raa === "object" ? raa : {};
  return { tjek: c.tjek ?? c.checks, modelguide: c.modelguide ?? c.model_guide, graense_procent: c.graense_procent ?? c.limit_percent, vagt: c.vagt ?? c.guard };
}

module.exports = { t, sprog, fil, laesConfig, vaerktoej, vt, TEKSTER, TEKSTER_CLAUDE, FILER, VAERKTOEJER, FORBUDSREGLER };
