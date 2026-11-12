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
//   hookvaerktoejer: de værktøjer, vagten skal kaldes før. Claude Code læser filer med sit eget værktøj (Read),
//   så dér skal vagten også med, ellers kunne en .env-fil læses uden om den.
const VAERKTOEJER = {
  codex: { V: "Codex", regelfil: "AGENTS.md", hookfil: ".codex/hooks.json", forbrug: "/status", start: "$startkit", hookvaerktoejer: "Bash|apply_patch|Edit|Write" },
  claude: { V: "Claude Code", regelfil: "CLAUDE.md", hookfil: ".claude/settings.local.json", forbrug: "/usage", start: "/startkit", hookvaerktoejer: "Bash|PowerShell|Edit|Write|MultiEdit|NotebookEdit|Read|Grep" },
};
// Claude Codes egne forbudsregler for hemmelige filer. De er et ekstra lag ved siden af vagten: kører en hook ikke
// (det er set på Windows), stopper de stadig læsning og ændring af filerne. .env.example er med vilje ikke på listen.
const FORBUDSREGLER = ["Read(.env)", "Read(.env.local)", "Read(.env.development)", "Read(.env.production)", "Read(.env.*.local)"];
const vt = (navn) => (navn ? VAERKTOEJER[vaerktoej()][navn] : VAERKTOEJER[vaerktoej()]);

// De filer i projektet, personen selv ser, hedder noget forskelligt på de to sprog.
const FILER = {
  da: { fejl: "docs/gentagne-fejl.md", deling: "docs/foer-du-deler.md", hvorfor: ".startkit/hvorfor-blev-jeg-stoppet.md", genvej: "overblik.cmd", profil: ".startkit/profil.json" },
  en: { fejl: "docs/recurring-mistakes.md", deling: "docs/before-you-share.md", hvorfor: ".startkit/why-was-i-stopped.md", genvej: "overview.cmd", profil: ".startkit/profile.json" },
};
const fil = (navn) => FILER[sprog()][navn];

const TEKSTER = {
  da: {
    // ---- vagten (regler.js og vagt.js) ----
    "vagt.se": " Se {fil}.",
    "vagt.hookspath.flyt": "Man må ikke flytte git-hooks (core.hooksPath): nøgletjekket skal køre.",
    "vagt.alias": "Et git-alias kan skjule --no-verify eller --force. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.hookspath.sluk": "Man må ikke flytte eller slukke git-hooks (core.hooksPath): nøgletjekket skal køre.",
    "vagt.noverify": "git commit --no-verify springer nøgletjekket over. Stopper tjekket en commit, så find årsagen i stedet.",
    "vagt.force": "git push --force kan overskrive arbejde, der ikke kan hentes igen. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.reset": "git reset --hard sletter ændringer, der ikke er gemt. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.clean": "git clean sletter filer, der ikke er gemt i git. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.kasser": "{k} smider ændringer væk, der ikke er gemt i en commit. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.stash": "git stash drop og git stash clear sletter gemte ændringer for altid. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.gren": "git branch -D sletter en gren, selv om arbejdet på den ikke er flettet. Brug git branch -d, som kun sletter flettede grene. Ejeren kører selv -D, hvis det er med vilje.",
    "vagt.slet.udenfor": "{m} ligger uden for projektmappen (eller er din hjemmemappe). Det, der slettes dér, kan git ikke redde. Ejeren sletter selv, hvis det er med vilje.",
    "vagt.slet.alt": "Kommandoen sletter alt i mappen eller git-historikken ({m}). Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.slet.mappe": "Kommandoen sletter hele mappen {m} med alt, hvad der ligger i den. Mapper, der kan laves igen (fx node_modules, dist og build), må AI'en gerne slette. Ejeren sletter selv alt andet, hvis det er med vilje.",
    "vagt.slet.variabel": "Stien {m} indeholder en variabel. Er variablen tom, kan kommandoen ramme en helt anden mappe. Skriv den fulde sti i stedet. Ejeren kører selv kommandoen, hvis det er med vilje.",
    "vagt.env.kommando": "Kommandoen rører en .env-fil. Nøgler læses og skrives aldrig af AI'en; ejeren lægger dem selv ind.",
    "vagt.noegle.kommando": "Kommandoen indeholder noget, der ligner en nøgle. Skriv aldrig rigtige nøgler.",
    "vagt.kontrol.kommando": "Kommandoen rører en af startkittets kontroller (vagt, færdig-tjek, nøgletjek eller deres indstillinger). Ejeren ændrer dem selv, eller kører startkittets opsætning igen.",
    "vagt.env.fil": "{f} er en .env-fil. Nøgler læses og skrives aldrig af AI'en; ejeren lægger dem selv ind.",
    "vagt.kontrol.fil": "{f} er en af startkittets kontroller. Ejeren ændrer den selv, eller kører startkittets opsætning igen.",
    "vagt.noegle.fil": "Indholdet ligner en nøgle eller en hemmelighed. Skriv aldrig rigtige nøgler i filer.",
    "vagt.ulaeselig": "Vagten kunne ikke læse, hvad der skulle ske, og afviser derfor for en sikkerheds skyld. Prøv igen; sker det flere gange, så sig det til ejeren.",
    "vagt.fejlede": "Vagten fejlede ({fejl}) og afviser derfor for en sikkerheds skyld. Sig det til ejeren.",

    // ---- færdig-tjekket (faerdig.js) ----
    "faerdig.intet": "Der findes ikke noget bevis endnu.",
    "faerdig.roedt": "Det seneste bevis er rødt.",
    "faerdig.aendret": "Koden er ændret, siden beviset blev taget.",
    "faerdig.besked": "Koden er ændret i denne chat, og det er ikke bevist, at den virker. {hvorfor} Kør: node scripts/startkit/bevis.js. Er den rød, så find og ret årsagen (ikke symptomet), og kør den igen. Fortæl derefter ejeren kort: hvad der er lavet, hvad beviset viste, og hvad du IKKE har afprøvet.",

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
    "ov.puls.ja": "Vagten blev sidst kaldt af {V}: {tid}.",
    "ov.puls.nej": "Vagten er aldrig blevet kaldt af {V} i dette projekt. Har du arbejdet i {V} her, siden startkittet blev sat op, så kører hooks'ene ikke. Skriv {start} i {V}, og bed om hjælp.",
    "ov.forbudt": "Forbudt",
    "ov.ikke.fundet": "Ikke fundet",
    "ov.port": "Port {port} er optaget. Kører overblikket allerede? Prøv {adresse}",
    "ov.koerer": "Overblik kører: {adresse}   (luk vinduet, eller tryk Ctrl+C, for at stoppe)",

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
    "tj.deny": "Hemmelige filer (.env) er også spærret med Claude Codes egne forbudsregler (ekstra lag)",
    "tj.mangler": "\n{antal} ting mangler.",
    "tj.alt": "\nAlt er sat op.",
    "tj.husk": "Husk: linjen om, at {V} kalder vagten, er kun til at stole på, når dette tjek køres inde i en chat i {V}. Prøv også vagten ved at lade {V} forsøge et forbudt kald.",
  },

  en: {
    "vagt.se": " See {fil}.",
    "vagt.hookspath.flyt": "Git hooks must not be moved (core.hooksPath): the key check has to run.",
    "vagt.alias": "A git alias can hide --no-verify or --force. The owner runs the command themselves if it is intended.",
    "vagt.hookspath.sluk": "Git hooks must not be moved or switched off (core.hooksPath): the key check has to run.",
    "vagt.noverify": "git commit --no-verify skips the key check. If the check stops a commit, find the cause instead.",
    "vagt.force": "git push --force can overwrite work that cannot be recovered. The owner runs the command themselves if it is intended.",
    "vagt.reset": "git reset --hard deletes changes that have not been saved. The owner runs the command themselves if it is intended.",
    "vagt.clean": "git clean deletes files that are not saved in git. The owner runs the command themselves if it is intended.",
    "vagt.kasser": "{k} throws away changes that are not saved in a commit. The owner runs the command themselves if it is intended.",
    "vagt.stash": "git stash drop and git stash clear delete saved changes for good. The owner runs the command themselves if it is intended.",
    "vagt.gren": "git branch -D deletes a branch even if the work on it has not been merged. Use git branch -d, which only deletes merged branches. The owner runs -D themselves if it is intended.",
    "vagt.slet.udenfor": "{m} is outside the project folder (or is your home folder). What is deleted there, git cannot save. The owner deletes it themselves if it is intended.",
    "vagt.slet.alt": "The command deletes everything in the folder, or the git history ({m}). The owner runs the command themselves if it is intended.",
    "vagt.slet.mappe": "The command deletes the whole folder {m} and everything in it. Folders that can be recreated (like node_modules, dist and build) the AI may delete. The owner deletes everything else themselves if it is intended.",
    "vagt.slet.variabel": "The path {m} contains a variable. If the variable is empty, the command can hit a completely different folder. Write out the full path instead. The owner runs the command themselves if it is intended.",
    "vagt.env.kommando": "The command touches a .env file. The AI never reads or writes keys; the owner puts them in.",
    "vagt.noegle.kommando": "The command contains something that looks like a key. Never write real keys.",
    "vagt.kontrol.kommando": "The command touches one of the starter kit's controls (the guard, the done-check, the key check or their settings). The owner changes them, or runs the starter kit's setup again.",
    "vagt.env.fil": "{f} is a .env file. The AI never reads or writes keys; the owner puts them in.",
    "vagt.kontrol.fil": "{f} is one of the starter kit's controls. The owner changes it, or runs the starter kit's setup again.",
    "vagt.noegle.fil": "The content looks like a key or a secret. Never write real keys in files.",
    "vagt.ulaeselig": "The guard could not read what was about to happen, so it refuses to be on the safe side. Try again; if it keeps happening, tell the owner.",
    "vagt.fejlede": "The guard failed ({fejl}), so it refuses to be on the safe side. Tell the owner.",

    "faerdig.intet": "There is no proof yet.",
    "faerdig.roedt": "The latest proof is red.",
    "faerdig.aendret": "The code has changed since the proof was taken.",
    "faerdig.besked": "The code has changed in this chat, and it has not been proven to work. {hvorfor} Run: node scripts/startkit/bevis.js (the proof). If it is red, find and fix the cause (not the symptom), and run it again. Then tell the owner briefly: what was done, what the proof showed, and what you have NOT tried.",

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
    "ov.puls.ja": "The guard was last called by {V}: {tid}.",
    "ov.puls.nej": "The guard has never been called by {V} in this project. If you have worked in {V} here since the starter kit was set up, the hooks are not running. Type {start} in {V}, and ask for help.",
    "ov.forbudt": "Forbidden",
    "ov.ikke.fundet": "Not found",
    "ov.port": "Port {port} is in use. Is the overview already running? Try {adresse}",
    "ov.koerer": "The overview is running: {adresse}   (close the window, or press Ctrl+C, to stop)",

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
    "ops.n.hooks": "tænder vagten og færdig-tjekket i Claude Code (se dem med /hooks)",
    "ops.naeste": "\nNæste skridt: tænd nøgletjekket (git config core.hooksPath .githooks), se med /hooks i Claude Code, at vagten og færdig-tjekket står der, og start en ny chat.",
  },
  en: {
    "ops.n.hooks": "switches on the guard and the done-check in Claude Code (see them with /hooks)",
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
  return { tjek: c.tjek ?? c.checks, modelguide: c.modelguide ?? c.model_guide, graense_procent: c.graense_procent ?? c.limit_percent };
}

module.exports = { t, sprog, fil, laesConfig, vaerktoej, vt, TEKSTER, TEKSTER_CLAUDE, FILER, VAERKTOEJER, FORBUDSREGLER };
