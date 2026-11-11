// Opsætningen på et tomt prøveprojekt, tjek af opsætningen, nøgletjekket og et eftersyn af selve kittet.
const fs = require("fs");
const path = require("path");
const { KIT, tjek, slut, nytProjekt, git, koer, skriv, falskNoegle } = require("./hjaelp");

const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const TJEK = path.join(KIT, "scripts", "tjek-opsaetning.js");
const profil = () => JSON.parse(fs.readFileSync(path.join(__dirname, "eksempel-profil.json"), "utf8"));
const laes = (rod, rel) => { try { return fs.readFileSync(path.join(rod, rel), "utf8"); } catch { return null; } };
const opsaet = (rod, ...flag) => koer("node", [OPSAET, rod, ...flag]);

// ---- uden profil, og med en dårlig profil ----
let rod = nytProjekt();
let r = opsaet(rod);
tjek("uden profil: stopper med en forklaring", r.kode === 2 && /ingen profil/.test(r.fejl), r.fejl);

skriv(rod, ".startkit/profil.json", JSON.stringify({ person: {} }));
r = opsaet(rod);
tjek("mangelfuld profil: siger, hvad der mangler", r.kode === 2 && /person\.navn/.test(r.fejl) && /aldrig_uden_ok/.test(r.fejl), r.fejl);

const medNoegle = profil(); medNoegle.person.andet = falskNoegle();
skriv(rod, ".startkit/profil.json", JSON.stringify(medNoegle));
r = opsaet(rod);
tjek("profil med nøgle: afvises, og nøglen vises ikke", r.kode === 2 && /ligner en nøgle/.test(r.fejl) && !r.fejl.includes(falskNoegle()), r.fejl);

// ---- tørkørsel og rigtig kørsel ----
skriv(rod, ".startkit/profil.json", JSON.stringify(profil()));
r = opsaet(rod, "--toer");
tjek("tørkørsel: viser planen uden at skrive", r.kode === 0 && /intet er skrevet/.test(r.ud) && laes(rod, "AGENTS.md") === null && laes(rod, ".codex/hooks.json") === null, r.ud + r.fejl);

r = opsaet(rod);
tjek("kørsel: lykkes", r.kode === 0, r.ud + r.fejl);
const agents = laes(rod, "AGENTS.md") || "";
tjek("AGENTS.md: har blokken, projektet og personens regler", agents.includes("<!-- startkit:start") && agents.includes("Kortspil-log") && agents.includes("sletter filer; lægger noget på nettet") && agents.includes("Prøveperson") && !/\{\{/.test(agents), agents);
tjek("AGENTS.md: er kort (højst 45 linjer)", agents.split("\n").length <= 45, String(agents.split("\n").length));
for (const f of ["STATUS.md", "docs/gentagne-fejl.md", ".startkit/hvorfor-blev-jeg-stoppet.md", ".startkit/status.md", ".startkit/config.json", ".githooks/pre-commit", ".codex/hooks.json", ".gitignore", "scripts/startkit/vagt.js", "scripts/startkit/regler.js", "scripts/startkit/tilstand.js", "scripts/startkit/faerdig.js", "scripts/startkit/bevis.js", "scripts/startkit/overblik.js", "scripts/startkit/forbrug-gem.js"]) {
  tjek(`fil skrevet: ${f}`, laes(rod, f) !== null);
}
tjek("pre-commit: skrevet med LF", !(laes(rod, ".githooks/pre-commit") || "\r").includes("\r"));
tjek("config: tjek-kommandoer kommer fra profilen", JSON.parse(laes(rod, ".startkit/config.json")).tjek.length === 1);
const hooks = JSON.parse(laes(rod, ".codex/hooks.json"));
const vagtKommando = hooks.hooks.PreToolUse[0].hooks[0].command;
tjek("hooks.json: vagt og færdig-tjek med fuld sti i anførselstegn", /^node ".+\/scripts\/startkit\/vagt\.js"$/.test(vagtKommando) && !vagtKommando.includes("\\") && hooks.hooks.Stop.length === 1 && hooks.hooks.PreToolUse[0].matcher.includes("apply_patch"), vagtKommando);

// ---- kan køres igen uden at ændre noget ----
const foer = ["AGENTS.md", ".codex/hooks.json", ".gitignore", "STATUS.md"].map((f) => laes(rod, f)).join("\u0000");
r = opsaet(rod);
const efter = ["AGENTS.md", ".codex/hooks.json", ".gitignore", "STATUS.md"].map((f) => laes(rod, f)).join("\u0000");
tjek("anden kørsel: ændrer ingenting", r.kode === 0 && foer === efter && !/^\s+(ny|opdateres)\s/m.test(r.ud), r.ud);

// ---- tjek af opsætningen ----
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: rød, før nøgletjekket er tændt", r.kode === 1 && /❌ Nøgletjekket er tændt/.test(r.ud), r.ud + r.fejl);
git(rod, "config", "core.hooksPath", ".githooks");
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: grøn, når alt er på plads", r.kode === 0 && /Alt er sat op/.test(r.ud) && /✅ Vagten afviser et forbudt kald/.test(r.ud), r.ud + r.fejl);

// ---- nøgletjekket før commit (rigtig git, rigtig hook) ----
git(rod, "add", ".");
r = koer("git", ["commit", "-q", "-m", "opsætning"], { cwd: rod });
tjek("commit uden nøgler går igennem", r.kode === 0, r.ud + r.fejl);

skriv(rod, "proeve.txt", `noegle = ${falskNoegle()}\n`);
const SCAN = path.join(KIT, "scripts", "noeglescan.js");
r = koer("node", [SCAN, rod]);
tjek("scan: finder nøglen og viser den ikke", r.kode === 1 && /proeve\.txt/.test(r.fejl) && !r.fejl.includes(falskNoegle()), r.ud + r.fejl);
git(rod, "add", "proeve.txt");
r = koer("git", ["commit", "-q", "-m", "prøve"], { cwd: rod });
tjek("commit med nøgle stoppes af hooken", r.kode !== 0 && /COMMIT STOPPET/.test(r.fejl), r.ud + r.fejl);
git(rod, "reset", "-q", "proeve.txt");
fs.unlinkSync(path.join(rod, "proeve.txt"));
r = koer("node", [SCAN, rod]);
tjek("scan: ren, når nøglen er væk", r.kode === 0 && /Ingen nøgler fundet/.test(r.ud), r.ud + r.fejl);
r = koer("node", [SCAN, rod, "--historik"]);
tjek("scan af historikken: ren", r.kode === 0 && /Ingen nøgler fundet \(historik\)/.test(r.ud), r.ud + r.fejl);

skriv(rod, "AGENTS.md", agents + "\n" + Array.from({ length: 60 }, (_, i) => `- ekstra regel ${i}`).join("\n") + "\n");
git(rod, "add", "AGENTS.md");
r = koer("git", ["commit", "-q", "-m", "lang"], { cwd: rod });
tjek("længdelås: en for lang AGENTS.md stopper commit", r.kode !== 0 && /AGENTS\.md er på \d+ linjer/.test(r.fejl), r.ud + r.fejl);

// ---- eksisterende filer bevares ----
rod = nytProjekt();
skriv(rod, ".startkit/profil.json", JSON.stringify(profil()));
skriv(rod, "AGENTS.md", "# Mine egne regler\n\n- Brug altid tabs.\n");
skriv(rod, "STATUS.md", "min egen status\n");
skriv(rod, ".gitignore", "dist/\n.env\n");
skriv(rod, ".codex/hooks.json", JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: "command", command: "node min-egen.js" }] }], SessionStart: [{ hooks: [{ type: "command", command: "echo hej" }] }] } }));
opsaet(rod); r = opsaet(rod);
const a2 = laes(rod, "AGENTS.md");
tjek("egen AGENTS.md: egne linjer bevares, blokken står én gang", a2.startsWith("# Mine egne regler") && a2.includes("Brug altid tabs.") && a2.split("<!-- startkit:start").length === 2, a2);
tjek("egen STATUS.md: røres ikke", laes(rod, "STATUS.md") === "min egen status\n");
const gi = laes(rod, ".gitignore");
tjek("egen .gitignore: bevares, og linjer gentages ikke", gi.startsWith("dist/\n.env\n") && gi.split("\n").filter((l) => l === ".env").length === 1 && gi.includes("node_modules/"), gi);
const h2 = JSON.parse(laes(rod, ".codex/hooks.json"));
tjek("egne hooks: bevares, og startkittets står én gang", h2.hooks.Stop.length === 2 && h2.hooks.Stop[0].hooks[0].command === "node min-egen.js" && h2.hooks.SessionStart.length === 1 && h2.hooks.PreToolUse.length === 1, JSON.stringify(h2));

// Blokken kan opdateres uden at røre resten.
const p3 = profil(); p3.regler.svarform = "Lange forklaringer, tak.";
skriv(rod, ".startkit/profil.json", JSON.stringify(p3));
opsaet(rod);
const a3 = laes(rod, "AGENTS.md");
tjek("blokken opdateres ved ny profil", a3.includes("Lange forklaringer, tak.") && !a3.includes("Korte svar. Forklar kun") && a3.includes("Brug altid tabs.") && a3.split("<!-- startkit:start").length === 2, a3);

skriv(rod, ".codex/hooks.json", "{ ikke json");
r = opsaet(rod);
tjek("ulæselig hooks.json: stopper og overskriver ikke", r.kode === 2 && laes(rod, ".codex/hooks.json") === "{ ikke json", r.fejl);

// ---- eftersyn af selve kittet ----
const interview = fs.readFileSync(path.join(KIT, "references", "interview.md"), "utf8");
const spoergsmaal = interview.split(/^### /m).slice(1).map((s) => s.split(/^## /m)[0]);
tjek("interview: mindst 40 startspørgsmål", spoergsmaal.length >= 40, String(spoergsmaal.length));
tjek("interview: er en flydende samtale uden fast antal", /flydende samtale/.test(interview) && /ikke fast/.test(interview) && /Følg op, når et svar åbner noget/.test(interview) && /allerede dækker/.test(interview));
const brugerflade = ["README.md", "startkit/SKILL.md", "startkit/references/intro.md", "startkit/references/interview.md"].map((f) => fs.readFileSync(path.join(KIT, "..", f), "utf8")).join("\n");
tjek("intet sted loves et fast antal spørgsmål", !/\b\d{2} spørgsmål/.test(brugerflade), (brugerflade.match(/.{0,30}\d{2} spørgsmål/) || [""])[0]);
for (const s of spoergsmaal) {
  const id = s.split("\n")[0].trim();
  tjek(`interview ${id}: har spørgsmål, godt svar, uddyb og felt`, /^[A-H]\d$/.test(id) && ["Spørgsmål:", "Godt svar:", "Uddyb:", "Felt:"].every((x) => s.includes("\n" + x)), s.slice(0, 80));
}
tjek("interview: 8 runder med begrundelse", (interview.match(/^## Runde [A-H]:/gm) || []).length === 8 && (interview.match(/^Hvorfor denne runde:/gm) || []).length === 8);

const skill = fs.readFileSync(path.join(KIT, "SKILL.md"), "utf8");
tjek("SKILL.md: har navn og beskrivelse", /^---\nname: startkit\ndescription: .{40,}\n---\n/.test(skill.replace(/\r\n/g, "\n")));
for (const m of skill.matchAll(/`(?:<skill-mappen>\/)?((?:references|assets|scripts)\/[\w./-]+)`/g)) {
  if (m[1].startsWith("scripts/startkit/")) continue; // ligger i projektet, ikke i skill-mappen
  tjek(`SKILL.md peger på en fil, der findes: ${m[1]}`, fs.existsSync(path.join(KIT, m[1])));
}
tjek("SKILL.md: introduktion før interview, og forbeholdet er med", skill.indexOf("Fase 1: Introduktion") < skill.indexOf("Fase 3: Interview") && /ikke afprøvet i Codex/.test(skill));
tjek("intro: forbeholdet siges tydeligt", /ikke kunnet afprøve det i Codex/.test(fs.readFileSync(path.join(KIT, "references", "intro.md"), "utf8")));

tjek("intro: siger, at forløbet koster tokens og er en investering", /koster tokens/.test(fs.readFileSync(path.join(KIT, "references", "intro.md"), "utf8")) && /investering/.test(fs.readFileSync(path.join(KIT, "references", "intro.md"), "utf8")));

// Ingen personoplysninger og ingen nøgler i det, der bliver delt (også testene selv):
// ingen e-mailadresser, ingen rigtige brugermapper, og ingen af ordene på den private ordliste.
// Den private ordliste (.privat-ordliste.txt, ét ord pr. linje) ligger kun på din egen computer og
// gemmes aldrig i git. Dér skriver du navne, der ikke må slippe med ud. Findes filen ikke, springes den del over.
const EMAIL = /[A-Za-z0-9._%+-]+@(?!example\.com|users\.noreply\.github\.com)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
const BRUGERMAPPE = /[A-Za-z]:[\\/]Users[\\/](?!<dig>|<you>)[^\\/\s]|\/home\/[A-Za-z0-9]/;
const ORDLISTE = ".privat-ordliste.txt";
let privateOrd = [];
try { privateOrd = fs.readFileSync(path.join(KIT, "..", ORDLISTE), "utf8").split(/\r?\n/).map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith("#")); } catch { /* ingen privat ordliste */ }
const SPRING_OVER = new Set([".git", "node_modules", ".claude", ".startkit"]);
const alle = [];
(function gaa(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!SPRING_OVER.has(e.name)) gaa(f); } else if (e.name !== ORDLISTE && !/\.(zip|log)$/i.test(e.name)) alle.push(f); } })(path.join(KIT, ".."));
const { harNoegle } = require(path.join(KIT, "scripts", "projekt", "regler"));
for (const f of alle) {
  const t = fs.readFileSync(f, "utf8");
  const lille = t.toLowerCase();
  tjek(`rent: ${path.relative(path.join(KIT, ".."), f)}`, !EMAIL.test(t) && !BRUGERMAPPE.test(t) && !privateOrd.some((o) => lille.includes(o)) && !harNoegle(t));
}

slut("opsaet");
