// Det, der hører til betaen: version, installation, genvej til overblikket, feedback, kort vej og undervisning.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { KIT, tjek, slut, nytProjekt, koer, skriv } = require("./hjaelp");

const ROD = path.join(KIT, "..");
const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
const kit = (rel) => laes(KIT, rel) || "";
const rod = (rel) => laes(ROD, rel) || "";

// ---- version og beta-mærkning ----
const version = kit("VERSION").trim();
tjek("VERSION: findes og er en beta", /^\d+\.\d+\.\d+-beta$/.test(version), version);
for (const f of ["README.md", "README.da.md"]) {
  tjek(`${f}: siger Beta og versionen øverst`, rod(f).split("\n").slice(0, 8).join("\n").includes(`Beta, version ${version}`));
}
for (const f of ["CHANGELOG.md", "CHANGELOG.da.md"]) tjek(`${f}: har den aktuelle version`, rod(f).includes(`## ${version}`));
tjek("intro: siger tidligt, at det er en beta", kit("references/intro.md").indexOf("Det er en beta") > 0 && kit("references/intro.md").indexOf("Det er en beta") < kit("references/intro.md").indexOf("Hvad skal du igennem"));
tjek("forbeholdet står uændret i begge README'er", /\*\*ikke kunnet afprøve det i Codex\*\*/.test(rod("README.da.md")) && /\*\*not been able to try it in Codex\*\*/.test(rod("README.md")));

// ---- download ----
const ZIP = "releases/latest/download/ai-coding-starter-kit.zip";
const udgiv = rod(".github/workflows/release.yml");
tjek("download: begge README'er linker til den samme ZIP-fil, som udgivelsen laver", rod("README.md").includes(ZIP) && rod("README.da.md").includes(ZIP) && udgiv.includes("ai-coding-starter-kit.zip") && ["startkit", "installer.cmd", "install-english.cmd", "install.ps1", "LICENSE"].every((f) => udgiv.includes(f)));

// ---- installation ----
const cmd = rod("installer.cmd");
tjek("installer.cmd: starter install.ps1 ved siden af sig selv og intet andet", /-File "%~dp0install\.ps1"/.test(cmd) && !/curl|Invoke-WebRequest|http/i.test(cmd));
const ps1 = rod("install.ps1");
tjek("install.ps1: henter intet fra nettet og sletter kun sin egen mappe", !/Invoke-WebRequest|Invoke-RestMethod|curl|wget|http/i.test(ps1) && (ps1.match(/Remove-Item/g) || []).length === 1 && /Remove-Item -Recurse -Force \$til/.test(ps1));
tjek("install.ps1: siger, hvad der sker, før den spørger, og siger næste skridt til sidst", ps1.indexOf("Det her sker, hvis du siger ja") < ps1.indexOf("Read-Host") && ps1.indexOf("Read-Host") < ps1.indexOf("Copy-Item") && ps1.indexOf("Copy-Item") < ps1.indexOf("Naeste skridt"));
tjek("install.ps1 og installer.cmd: kun almindelige tegn (vises rigtigt i alle terminaler)", !/[^\x00-\x7F]/.test(ps1) && !/[^\x00-\x7F]/.test(cmd));

if (process.platform === "win32") {
  const maal = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-install-")), "skills", "startkit");
  const koerInstall = (svar) => koer("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROD, "install.ps1"), "-Til", maal], { input: svar + "\n" });
  let r = koerInstall("n");
  tjek("installation: et nej ændrer ingenting", r.kode === 0 && !fs.existsSync(maal) && /Intet er aendret/.test(r.ud), r.ud + r.fejl);
  r = koerInstall("j");
  tjek("installation: et ja kopierer mappen og siger næste skridt", r.kode === 0 && fs.existsSync(path.join(maal, "SKILL.md")) && fs.existsSync(path.join(maal, "scripts", "opsaet.js")) && /Naeste skridt/.test(r.ud) && r.ud.includes("$startkit"), r.ud + r.fejl);
  tjek("installation: viser, hvor mappen kopieres hen, før den spørger", r.ud.indexOf(maal) > 0 && r.ud.indexOf(maal) < r.ud.indexOf("Faerdig"), r.ud);
  fs.writeFileSync(path.join(maal, "gammel-fil.txt"), "x");
  r = koerInstall("j");
  tjek("installation igen: siger, at den gamle udgave erstattes, og gør det", r.kode === 0 && /allerede installeret/.test(r.ud) && !fs.existsSync(path.join(maal, "gammel-fil.txt")) && fs.existsSync(path.join(maal, "SKILL.md")), r.ud + r.fejl);
}

// ---- genvej til overblikket og feedback-filen, sat op i et projekt ----
const projekt = nytProjekt();
skriv(projekt, ".startkit/profil.json", laes(__dirname, "eksempel-profil.json"));
let r = koer("node", [path.join(KIT, "scripts", "opsaet.js"), projekt]);
tjek("opsætning: lykkes", r.kode === 0, r.ud + r.fejl);
const genvej = laes(projekt, "overblik.cmd") || "";
tjek("overblik.cmd: skrevet med CRLF, starter overblikket og åbner browseren", /node scripts\\startkit\\overblik\.js --aabn/.test(genvej) && genvej.includes("\r\n") && !/[^\r]\n/.test(genvej), JSON.stringify(genvej.slice(0, 120)));
tjek("overblik.cmd: bliver i projektmappen og henter intet", /cd \/d "%~dp0"/.test(genvej) && !/http|curl/i.test(genvej));
tjek("overblik.js: kender --aabn og lytter stadig kun på egen computer", /--aabn/.test(kit("scripts/projekt/overblik.js")) && /const HOST = "127\.0\.0\.1"/.test(kit("scripts/projekt/overblik.js")));
const fb = laes(projekt, ".startkit/feedback.md") || "";
tjek("feedback.md: oprettet med kittets version", fb.includes(`Startkit version: ${version}`) && !/\{\{/.test(fb), fb.slice(0, 200));
const FEM = ["Hvor gik du i stå?", "Hvad forstod du ikke?", "Hvad var overflødigt?", "Hvor lang tid tog det?", "Ville du anbefale det"];
tjek("feedback.md: har de fem spørgsmål", FEM.every((s) => fb.includes(s)));
fs.appendFileSync(path.join(projekt, ".startkit", "feedback.md"), "\nFase 2: vidste ikke, hvad en terminal er.\n");
const medNote = laes(projekt, ".startkit/feedback.md");
r = koer("node", [path.join(KIT, "scripts", "opsaet.js"), projekt]);
tjek("opsætning igen: rører ikke personens feedback, og genvejen er uændret", r.kode === 0 && laes(projekt, ".startkit/feedback.md") === medNote && !/^\s+(ny|opdateres)\s/m.test(r.ud), r.ud);

// ---- tjekket af feedback-filen ----
const { fund } = require(path.join(KIT, "scripts", "feedback-tjek.js"));
const TJEK = path.join(KIT, "scripts", "feedback-tjek.js");
tjek("feedback-tjek: en ren fil går igennem", fund(medNote).length === 0, JSON.stringify(fund(medNote)));
r = koer("node", [TJEK, projekt]);
tjek("feedback-tjek: ren fil giver grønt og en påmindelse om selv at læse den", r.kode === 0 && /Læs den selv igennem/.test(r.ud), r.ud + r.fejl);
const falsk = "sk-" + "ant-" + "a1B2".repeat(8);
const beskidt = ["Fase 6: det gik fint.", "min sti er C:" + "\\Users\\" + "nogen\\projekt", "skriv til nogen" + "@" + "firma.dk", "noeglen var " + falsk].join("\n");
const f = fund(beskidt);
tjek("feedback-tjek: finder sti med brugernavn, e-mailadresse og nøgle på de rigtige linjer", f.some((x) => x.linje === 2 && /sti/.test(x.slags)) && f.some((x) => x.linje === 3 && /e-mail/.test(x.slags)) && f.some((x) => x.linje === 4 && /nøgle/.test(x.slags)) && !f.some((x) => x.linje === 1), JSON.stringify(f));
fs.writeFileSync(path.join(projekt, ".startkit", "feedback.md"), beskidt);
r = koer("node", [TJEK, projekt]);
tjek("feedback-tjek: stopper og viser kun linje og slags, aldrig indholdet", r.kode === 1 && /linje 4/.test(r.fejl) && !r.fejl.includes(falsk) && !(r.ud + r.fejl).includes("firma.dk") && !(r.ud + r.fejl).includes("nogen\\projekt"), r.ud + r.fejl);
tjek("feedback-tjek: sender ingenting (ingen netværkskode)", !/require\("(https?|net|dgram|tls)"\)|fetch\(/.test(kit("scripts/feedback-tjek.js")));
r = koer("node", [TJEK, nytProjekt()]);
tjek("feedback-tjek: uden fil siger den det", r.kode === 2 && /ingen feedback-fil/.test(r.fejl), r.fejl);

// ---- feedback i kittets forløb ----
const skill = kit("SKILL.md");
const fbRef = kit("references/feedback.md");
tjek("SKILL.md: 'jeg sidder fast' giver hjælp og en note, og feedback er et trin i afslutningen", /jeg sidder fast/.test(skill) && /references\/feedback\.md/.test(skill) && /feedback-tjek\.js/.test(skill));
tjek("feedback: kittet sender aldrig noget selv (står i SKILL.md, referencen og skabelonen)", /Du sender aldrig/.test(skill) && /Du sender aldrig noget/.test(fbRef) && /aldrig sendt automatisk/.test(kit("assets/feedback.skabelon.md")));
tjek("feedback: de fem spørgsmål er de samme i referencen, skabelonen og på GitHub", FEM.every((s) => fbRef.includes(s) && kit("assets/feedback.skabelon.md").includes(s) && rod(".github/ISSUE_TEMPLATE/beta-feedback.md").includes(s)));
tjek("feedback: intet privat i filen, og personen ser den, før den sendes", /Intet privat i filen/.test(fbRef) && /Vis personen hele filen/.test(fbRef) && /offentligt/.test(fbRef));
tjek("GitHub-skabelonen: advarer om, at alt er offentligt", /Alt, du skriver her, er offentligt/.test(rod(".github/ISSUE_TEMPLATE/beta-feedback.md")));

// ---- kontrol hos personen, og den korte vej som et valg ----
tjek("SKILL.md: gør arbejdet for personen, men vælger aldrig for personen", /vælg aldrig for personen/.test(skill) && /Ingen skjulte valg/.test(skill) && /Sig altid næste skridt/.test(skill));
tjek("SKILL.md: kort eller fuld vej vælges af personen, efter introduktionen og før maskintjekket", skill.indexOf("Fase 1: Introduktion") < skill.indexOf("Fase 1b: Kort eller fuld vej") && skill.indexOf("Fase 1b: Kort eller fuld vej") < skill.indexOf("Fase 2: Er maskinen klar?") && /men du vælger ikke/.test(skill));
const kort = kit("references/kort-vej.md");
tjek("kort vej: siger ærligt, hvad den ikke giver, og hvordan man tager resten senere", /Giver ikke endnu/.test(kort) && /Sig det ærligt, før personen vælger/.test(kort) && /\$startkit/.test(kort));
const { valider } = require(path.join(KIT, "scripts", "opsaet.js"));
const kortProfil = { vej: "kort", person: { navn: "Prøve", niveau: "slet ikke" }, valgt_projekt: "Mit første projekt", projekter: [{ navn: "Mit første projekt", beskrivelse: "Et sted at prøve ting af." }], regler: { aldrig_uden_ok: ["sletter filer"], svarform: "Forklar undervejs.", ved_tvivl: "spørg" }, tjek_kommandoer: [] };
tjek("kort vej: det lille interview giver en profil, opsætningen kan bruge", valider(kortProfil).length === 0 && ["person.navn", "projekter[].navn", "projekter[].beskrivelse", "regler.aldrig_uden_ok", "regler.svarform"].every((felt) => kort.includes(felt)), JSON.stringify(valider(kortProfil)));
const kortProjekt = nytProjekt();
skriv(kortProjekt, ".startkit/profil.json", JSON.stringify(kortProfil));
r = koer("node", [path.join(KIT, "scripts", "opsaet.js"), kortProjekt]);
tjek("kort vej: opsætningen kører på den korte profil", r.kode === 0 && fs.existsSync(path.join(kortProjekt, "AGENTS.md")) && fs.existsSync(path.join(kortProjekt, "overblik.cmd")), r.ud + r.fejl);
tjek("forløbsskabelonen: har vej, sikkerhedskopi og feedback", ["Vej:", "9b", "9c"].every((s) => kit("assets/forloeb.skabelon.md").includes(s)));

// ---- undervisning ----
const und = rod("UNDERVISNING.md");
tjek("UNDERVISNING.md: siger ærligt beta, ikke afprøvet i Codex og ikke afprøvet på et hold", /Det er en beta/.test(und) && /ikke afprøvet i Codex/.test(und) && /ikke afprøvet på et hold/.test(und));
tjek("UNDERVISNING.md: har forberedelse, tidsplan, faldgruber og indsamling af feedback", ["## Hvad deltagerne skal have klar hjemmefra", "## Forslag til tidsplan", "## Det, der kan gå galt i et lokale", "## Sådan samles holdets feedback"].every((o) => und.includes(o)));
tjek("TEACHING.md: siger det samme ærligt på engelsk", /It is a beta/.test(rod("TEACHING.md")) && /not been tried in Codex/.test(rod("TEACHING.md")) && /not been tried with a class/.test(rod("TEACHING.md")));
for (const f of ["README.md", "README.da.md"]) {
  tjek(`${f}: dobbeltklik-installation, genvej, feedback og de nye ting står som ikke afprøvet`, ["installer.cmd", "overblik.cmd", ".startkit/feedback.md"].every((s) => rod(f).includes(s)) && (rod(f).match(/\*\*(Ikke afprøvet|Not tried)\*\* \|/g) || []).length >= 11, String((rod(f).match(/\*\*(Ikke afprøvet|Not tried)\*\* \|/g) || []).length));
}

slut("beta");
