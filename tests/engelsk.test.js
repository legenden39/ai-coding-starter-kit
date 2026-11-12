// Den engelske udgave: samme regler og programmer som den danske, men al tekst på engelsk.
// Sproget vælges med filen sprog.json (det gør installationen) eller, som her, med STARTKIT_SPROG.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, falskNoegle } = require("./hjaelp");

const ROD = path.join(KIT, "..");
const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
const DANSKE_BOGSTAVER = /[æøåÆØÅ]/;
function koer(program, args, { cwd, input, sprog = "en" } = {}) {
  const r = spawnSync(program, args, { cwd, input, encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
}

// ---- teksterne: de to sprog har de samme beskeder ----
const { TEKSTER, FILER } = require(path.join(KIT, "scripts", "projekt", "tekster.js"));
const da = Object.keys(TEKSTER.da).sort(), en = Object.keys(TEKSTER.en).sort();
tjek("tekster: dansk og engelsk har præcis de samme nøgler", JSON.stringify(da) === JSON.stringify(en), da.filter((k) => !en.includes(k)).concat(en.filter((k) => !da.includes(k))).join(", "));
const pladser = (s) => (s.match(/\{\w+\}/g) || []).sort().join(",");
tjek("tekster: samme pladsholdere på begge sprog", da.every((k) => pladser(TEKSTER.da[k]) === pladser(TEKSTER.en[k])), da.filter((k) => pladser(TEKSTER.da[k]) !== pladser(TEKSTER.en[k])).join(", "));
tjek("tekster: ingen danske bogstaver i de engelske beskeder", en.every((k) => !DANSKE_BOGSTAVER.test(TEKSTER.en[k])), en.filter((k) => DANSKE_BOGSTAVER.test(TEKSTER.en[k])).join(", "));
tjek("tekster: filnavnene findes på begge sprog", JSON.stringify(Object.keys(FILER.da).sort()) === JSON.stringify(Object.keys(FILER.en).sort()));

// ---- vejledningerne: alt det danske findes på engelsk ----
const PAR = { "intro.md": "intro.md", "kort-vej.md": "short-path.md", "vaerktoejer.md": "tools.md", "interview.md": "interview.md", "research.md": "research.md", "viden.md": "knowledge.md", "virkelige-verden.md": "real-world.md", "github.md": "github.md", "feedback.md": "feedback.md" };
const danske = fs.readdirSync(path.join(KIT, "references")).sort();
tjek("vejledninger: hver dansk fil har en engelsk", JSON.stringify(danske) === JSON.stringify(Object.keys(PAR).sort()) && Object.values(PAR).every((f) => laes(KIT, "en", "references", f)), danske.join(", "));
const overskrifter = (t) => (t.match(/^## /gm) || []).length;
for (const [d, e] of Object.entries(PAR)) {
  tjek(`vejledninger: ${e} har samme antal afsnit som ${d}`, overskrifter(laes(KIT, "references", d)) === overskrifter(laes(KIT, "en", "references", e) || ""), `${overskrifter(laes(KIT, "references", d))} mod ${overskrifter(laes(KIT, "en", "references", e) || "")}`);
}
const engelskeFiler = [];
(function gaa(d) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, x.name); if (x.isDirectory()) gaa(f); else engelskeFiler.push(f); } })(path.join(KIT, "en"));
tjek("engelsk udgave: ingen danske bogstaver i nogen fil", engelskeFiler.every((f) => !DANSKE_BOGSTAVER.test(fs.readFileSync(f, "utf8"))), engelskeFiler.filter((f) => DANSKE_BOGSTAVER.test(fs.readFileSync(f, "utf8"))).join(", "));

const skill = laes(KIT, "en", "SKILL.en.md") || "";
tjek("engelsk udgave: der ligger kun én SKILL.md i pakken (så Codex ikke ser to skills)", !engelskeFiler.some((f) => path.basename(f) === "SKILL.md"));
tjek("SKILL.md (engelsk): samme navn og samme faser som den danske", /^name: startkit$/m.test(skill) && overskrifter(skill) === overskrifter(laes(KIT, "SKILL.md")), `${overskrifter(skill)} mod ${overskrifter(laes(KIT, "SKILL.md"))}`);
const henvist = [...skill.matchAll(/`(en\/references\/[\w-]+\.md)`/g)].map((m) => m[1]);
tjek("SKILL.md (engelsk): peger kun på vejledninger, der findes, og på dem alle", henvist.length > 0 && henvist.every((f) => laes(KIT, f)) && Object.values(PAR).every((f) => henvist.includes(`en/references/${f}`)), henvist.join(", "));
tjek("SKILL.md (engelsk): peger ikke på de danske vejledninger", !/[^/]references\/(kort-vej|vaerktoejer|viden|virkelige-verden)\.md/.test(skill) && !/`references\//.test(skill));
const scripts = [...skill.matchAll(/scripts\/(?:startkit\/)?([\w-]+\.js)/g)].map((m) => m[1]);
tjek("SKILL.md (engelsk): de programmer, den nævner, findes", scripts.length > 0 && scripts.every((f) => laes(KIT, "scripts", f) || laes(KIT, "scripts", "projekt", f)), scripts.join(", "));
tjek("SKILL.md (engelsk): de samme løfter som den danske", /never choose for the person/.test(skill) && /No hidden choices/.test(skill) && /Always say the next step/.test(skill) && /You never send/.test(skill) && /has not been tried in Codex/.test(skill));
const intro = laes(KIT, "en", "references", "intro.md") || "";
tjek("intro (engelsk): beta tidligt, forbeholdet og at det koster tokens", intro.indexOf("It is a beta") > 0 && intro.indexOf("It is a beta") < intro.indexOf("What will you go through") && /not been able to try it in Codex/.test(intro) && /costs tokens/.test(intro) && /investment/.test(intro));
const FEM = ["Where did you get stuck?", "What did you not understand?", "What was unnecessary?", "How long did it take?", "Would you recommend it"];
tjek("feedback (engelsk): de fem spørgsmål er de samme i vejledningen, skabelonen og på GitHub", FEM.every((s) => (laes(KIT, "en", "references", "feedback.md") || "").includes(s) && (laes(KIT, "en", "assets", "feedback.template.md") || "").includes(s) && (laes(ROD, ".github", "ISSUE_TEMPLATE", "beta-feedback.md") || "").includes(s)));

// ---- installationen ----
const cmd = laes(ROD, "install-english.cmd") || "";
const ps1 = laes(ROD, "install.ps1") || "";
tjek("install-english.cmd: starter install.ps1 ved siden af sig selv med engelsk og intet andet", /-File "%~dp0install\.ps1" -Sprog en/.test(cmd) && !/curl|Invoke-WebRequest|http/i.test(cmd) && !/[^\x00-\x7F]/.test(cmd));
tjek("install.ps1: den engelske udgave får engelsk SKILL.md og sprog.json, efter kopieringen", ps1.indexOf("Copy-Item -Recurse $fra $til") < ps1.indexOf('en\\SKILL.en.md') && /scripts\\projekt\\sprog\.json/.test(ps1) && /"sprog": "en"/.test(ps1));
tjek("installer.cmd (dansk): er uændret dansk", !/-Sprog/.test(laes(ROD, "installer.cmd") || "x -Sprog"));

if (process.platform === "win32") {
  const os = require("os");
  const maal = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-install-en-")), "skills", "startkit");
  const koerInstall = (svar) => koer("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROD, "install.ps1"), "-Til", maal, "-Sprog", "en"], { input: svar + "\n", sprog: "da" });
  let i = koerInstall("n");
  tjek("engelsk installation: et nej ændrer ingenting", i.kode === 0 && !fs.existsSync(maal) && /Nothing has been changed/.test(i.ud), i.ud + i.fejl);
  i = koerInstall("y");
  tjek("engelsk installation: et ja kopierer mappen, lægger den engelske SKILL.md øverst og sætter sproget", i.kode === 0 && /Next steps/.test(i.ud) && i.ud.includes("$startkit") && laes(maal, "SKILL.md") === laes(maal, "en", "SKILL.en.md") && /"sprog": "en"/.test(laes(maal, "scripts", "projekt", "sprog.json") || ""), i.ud + i.fejl);
}

// ---- installation i hånden, som README beskriver: kopiér mappen, læg den engelske SKILL.md øverst, og skriv sprog.json ----
{
  const os = require("os");
  const skillMappe = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-skill-en-")), "startkit");
  fs.cpSync(KIT, skillMappe, { recursive: true });
  fs.copyFileSync(path.join(skillMappe, "en", "SKILL.en.md"), path.join(skillMappe, "SKILL.md"));
  fs.writeFileSync(path.join(skillMappe, "scripts", "projekt", "sprog.json"), '{"sprog": "en"}\n');
  const p = nytProjekt();
  skriv(p, ".startkit/profile.json", JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Explain along the way." } }));
  const env = { ...process.env }; delete env.STARTKIT_SPROG;
  const x = spawnSync("node", [path.join(skillMappe, "scripts", "opsaet.js"), p], { encoding: "utf8", env });
  tjek("installeret engelsk skill: opsætningen taler engelsk uden hjælp, og projektet får sproget med", x.status === 0 && /Setting up in/.test(x.stdout) && /If you are in doubt: ask the owner\./.test(laes(p, "AGENTS.md") || "") && /"en"/.test(laes(p, "scripts/startkit/sprog.json") || ""), x.stdout + x.stderr);
}

// ---- opsætning på engelsk i et tomt projekt ----
const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const profil = { person: { name: "Sample Person", level: "a little" }, chosen_project: "Card game log", projects: [{ name: "Card game log", description: "You can save your games and see statistics over time." }], rules: { never_without_ok: ["delete files", "put something on the internet"], answer_style: "Short answers. Explain only what is new or risky.", when_in_doubt: "ask the owner" }, check_commands: ["node -e \"process.exit(0)\""], tools: { models: [] }, open: [] };
const rod = nytProjekt();
let r = koer("node", [OPSAET, rod]);
tjek("uden profil: stopper med en forklaring på engelsk", r.kode === 2 && /no profile yet/.test(r.fejl) && !DANSKE_BOGSTAVER.test(r.fejl), r.fejl);
skriv(rod, ".startkit/profile.json", JSON.stringify({ person: {} }));
r = koer("node", [OPSAET, rod]);
tjek("mangelfuld profil: siger på engelsk, hvad der mangler, med de engelske feltnavne", r.kode === 2 && /person\.name/.test(r.fejl) && /never_without_ok/.test(r.fejl) && !DANSKE_BOGSTAVER.test(r.fejl), r.fejl);
skriv(rod, ".startkit/profile.json", JSON.stringify(profil));
r = koer("node", [OPSAET, rod, "--dry-run"]);
tjek("tørkørsel (--dry-run): viser planen på engelsk uden at skrive", r.kode === 0 && /nothing has been written/.test(r.ud) && laes(rod, "AGENTS.md") === null && !DANSKE_BOGSTAVER.test(r.ud.replace(rod, "")), r.ud + r.fejl);
r = koer("node", [OPSAET, rod]);
tjek("kørsel: lykkes", r.kode === 0, r.ud + r.fejl);
const agents = laes(rod, "AGENTS.md") || "";
tjek("AGENTS.md: engelsk, med projektet og personens regler", agents.includes("<!-- startkit:start") && agents.includes("<!-- startkit:slut -->") && agents.includes("Card game log") && agents.includes("Ask the owner before you: delete files; put something on the internet.") && agents.includes("Sample Person") && !/\{\{/.test(agents) && !DANSKE_BOGSTAVER.test(agents) && agents.split("\n").length <= 45, agents);
for (const f of ["STATUS.md", "docs/recurring-mistakes.md", "docs/before-you-share.md", ".startkit/why-was-i-stopped.md", ".startkit/status.md", ".startkit/feedback.md", "overview.cmd", "scripts/startkit/sprog.json", "scripts/startkit/tekster.js", ".githooks/pre-commit", ".codex/hooks.json"]) {
  tjek(`fil skrevet: ${f}`, laes(rod, f) !== null);
}
for (const f of ["docs/gentagne-fejl.md", "docs/foer-du-deler.md", ".startkit/hvorfor-blev-jeg-stoppet.md", "overblik.cmd"]) {
  tjek(`dansk fil er ikke skrevet: ${f}`, laes(rod, f) === null);
}
for (const f of ["STATUS.md", "docs/recurring-mistakes.md", "docs/before-you-share.md", ".startkit/why-was-i-stopped.md", ".startkit/status.md", ".startkit/feedback.md", "overview.cmd", ".gitignore"]) {
  tjek(`engelsk indhold: ${f}`, !DANSKE_BOGSTAVER.test(laes(rod, f) || "æ"));
}
const config = JSON.parse(laes(rod, ".startkit/config.json"));
tjek("config: engelske navne, og tjek-kommandoerne kommer fra profilen", config.checks.length === 1 && Array.isArray(config.model_guide) && config.limit_percent === 85);
const genvej = laes(rod, "overview.cmd") || "";
tjek("overview.cmd: skrevet med CRLF, starter overblikket og åbner browseren", /node scripts\\startkit\\overblik\.js --open/.test(genvej) && genvej.includes("\r\n") && !/[^\r]\n/.test(genvej));
tjek("hooks.json: beskederne er engelske", /Starter kit: the guard is checking/.test(laes(rod, ".codex/hooks.json")));
tjek("feedback.md: engelsk, med kittets version", (laes(rod, ".startkit/feedback.md") || "").includes(`Startkit version: ${(laes(KIT, "VERSION") || "").trim()}`));
r = koer("node", [OPSAET, rod]);
tjek("kørsel igen: ændrer ingenting", r.kode === 0 && !/^\s+(new|will be updated)\s/m.test(r.ud), r.ud);

// Herfra er STARTKIT_SPROG ikke sat: projektets egne scripts skal selv vide, at sproget er engelsk (sprog.json).
const uden = (program, args, opts = {}) => { const env = { ...process.env }; delete env.STARTKIT_SPROG; const x = spawnSync(program, args, { ...opts, encoding: "utf8", env }); return { kode: x.status, ud: x.stdout || "", fejl: x.stderr || "" }; };
git(rod, "config", "core.hooksPath", ".githooks");
const vagt = (kommando) => JSON.parse(uden("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify({ tool_name: "Bash", tool_input: { command: kommando }, cwd: rod, session_id: "engelsk-test" }) }).ud || "{}");
let svar = vagt("git commit --no-verify -m x");
tjek("vagten: afviser på engelsk og peger på den engelske forklaring", svar.hookSpecificOutput && svar.hookSpecificOutput.permissionDecision === "deny" && /skips the key check/.test(svar.hookSpecificOutput.permissionDecisionReason) && /\.startkit\/why-was-i-stopped\.md/.test(svar.hookSpecificOutput.permissionDecisionReason), JSON.stringify(svar));
svar = vagt("git status");
tjek("vagten: tillader det ufarlige", !svar.hookSpecificOutput, JSON.stringify(svar));

skriv(rod, "sample.txt", "key = " + falskNoegle() + "\n");
git(rod, "add", "sample.txt");
r = uden("git", ["commit", "-q", "-m", "sample"], { cwd: rod });
tjek("nøgletjekket: stopper en commit på engelsk og viser ikke nøglen", r.kode !== 0 && /COMMIT STOPPED/.test(r.fejl) && /Anthropic key/.test(r.fejl) && !r.fejl.includes(falskNoegle()) && !DANSKE_BOGSTAVER.test(r.fejl), r.ud + r.fejl);
git(rod, "reset", "-q", "sample.txt");
fs.unlinkSync(path.join(rod, "sample.txt"));
r = koer("node", [path.join(KIT, "scripts", "noeglescan.js"), rod]);
tjek("nøglescan: ren på engelsk", r.kode === 0 && /No keys found \(scan\)/.test(r.ud), r.ud + r.fejl);
git(rod, "add", "-A");
r = uden("git", ["commit", "-q", "-m", "first"], { cwd: rod });
tjek("første commit: går igennem nøgletjekket", r.kode === 0, r.ud + r.fejl);
r = koer("node", [path.join(KIT, "scripts", "noeglescan.js"), rod, "--history"]);
tjek("nøglescan (--history): ren på engelsk", r.kode === 0 && /No keys found \(history\)/.test(r.ud), r.ud + r.fejl);

r = uden("node", [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod });
tjek("beviset: kører de engelske checks og melder grønt på engelsk", r.kode === 0 && /Proof: GREEN/.test(r.ud), r.ud + r.fejl);
r = uden("node", [path.join(rod, "scripts", "startkit", "forbrug-gem.js"), "--5h", "40", "--week", "12"], { cwd: rod });
tjek("forbrug: de engelske flag virker", r.kode === 0 && /Usage saved/.test(r.ud) && JSON.parse(laes(rod, ".startkit/forbrug.json")).uge === 12, r.ud + r.fejl);
const side = uden("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod }).ud;
tjek("overblikket: siden er på engelsk og viser beviset og forbruget", /<html lang="en">/.test(side) && /Where are we\?/.test(side) && /Latest proof: <b>green<\/b>/.test(side) && /Week: <b>12 %<\/b>/.test(side) && /0 mistakes written down/.test(side) && !DANSKE_BOGSTAVER.test(side.replace(path.basename(rod), "")), side.slice(0, 400));
r = koer("node", [path.join(KIT, "scripts", "tjek-opsaetning.js"), rod]);
tjek("tjek af opsætningen: alt er grønt, på engelsk", r.kode === 0 && /Everything is set up/.test(r.ud) && !/❌/.test(r.ud) && !DANSKE_BOGSTAVER.test(r.ud), r.ud + r.fejl);
skriv(rod, ".startkit/feedback.md", "Phase 2: fine.\nmy path is C:" + "\\Users\\" + "someone\\project\n");
r = koer("node", [path.join(KIT, "scripts", "feedback-tjek.js"), rod]);
tjek("feedback-tjek: stopper på engelsk og viser kun linje og slags", r.kode === 1 && /line 2: a path with a user name/.test(r.fejl) && !r.fejl.includes("someone"), r.ud + r.fejl);

// ---- det danske er uændret, når sproget ikke er sat ----
const dansk = nytProjekt();
skriv(dansk, ".startkit/profil.json", laes(__dirname, "eksempel-profil.json"));
r = uden("node", [OPSAET, dansk]);
tjek("dansk er standard: danske filer, ingen sprog.json", r.kode === 0 && laes(dansk, "docs/gentagne-fejl.md") !== null && laes(dansk, "overblik.cmd") !== null && laes(dansk, "scripts/startkit/sprog.json") === null && laes(dansk, "docs/recurring-mistakes.md") === null && JSON.parse(laes(dansk, ".startkit/config.json")).tjek.length === 1, r.ud + r.fejl);

// ---- siderne udenom ----
const readme = laes(ROD, "README.md") || "";
tjek("README.md: forklarer den engelske installation og lover ikke længere kun dansk", readme.includes("install-english.cmd") && !/only useful if you read Danish/.test(readme));
tjek("README.da.md: nævner den engelske udgave", (laes(ROD, "README.da.md") || "").includes("install-english.cmd"));

slut("engelsk");
