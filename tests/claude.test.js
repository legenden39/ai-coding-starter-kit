// Udgaven til Claude Code: samme regler og programmer som udgaven til Codex, men med Claude Codes filer og kommandoer.
// Værktøjet vælges med filen vaerktoej.json (det gør installationen) eller, som her, med STARTKIT_VAERKTOEJ.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, falskNoegle } = require("./hjaelp");

const ROD = path.join(KIT, "..");
const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
const DANSKE_BOGSTAVER = /[æøåÆØÅ]/;
// Kører et program med et bestemt værktøj og sprog. "ingen" betyder: sæt ikke variablen, så filerne i mappen bestemmer.
function koer(program, args, { cwd, input, vaerktoej = "claude", sprog = "ingen" } = {}) {
  const env = { ...process.env };
  delete env.STARTKIT_VAERKTOEJ; delete env.STARTKIT_SPROG;
  if (vaerktoej !== "ingen") env.STARTKIT_VAERKTOEJ = vaerktoej;
  if (sprog !== "ingen") env.STARTKIT_SPROG = sprog;
  const r = spawnSync(program, args, { cwd, input, encoding: "utf8", env });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
}
const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const TJEK = path.join(KIT, "scripts", "tjek-opsaetning.js");
const eksempel = () => laes(__dirname, "eksempel-profil.json");

// ---- teksterne ----
const tekster = require(path.join(KIT, "scripts", "projekt", "tekster.js"));
const { TEKSTER, TEKSTER_CLAUDE, VAERKTOEJER } = tekster;
const cda = Object.keys(TEKSTER_CLAUDE.da).sort(), cen = Object.keys(TEKSTER_CLAUDE.en).sort();
tjek("tekster: Claude-beskederne findes på begge sprog og erstatter kun beskeder, der findes", JSON.stringify(cda) === JSON.stringify(cen) && cda.every((k) => k in TEKSTER.da), cda.concat(cen).join(", "));
tjek("tekster: ingen danske bogstaver i de engelske Claude-beskeder", cen.every((k) => !DANSKE_BOGSTAVER.test(TEKSTER_CLAUDE.en[k])));
tjek("tekster: de to værktøjer har de samme felter", JSON.stringify(Object.keys(VAERKTOEJER.codex).sort()) === JSON.stringify(Object.keys(VAERKTOEJER.claude).sort()));
const FRA_CODEX = /Codex|\.codex|AGENTS\.md|\$startkit|\/status\b/;
for (const sprog of ["da", "en"]) {
  process.env.STARTKIT_VAERKTOEJ = "claude"; process.env.STARTKIT_SPROG = sprog;
  const rester = Object.keys(TEKSTER.da).filter((k) => FRA_CODEX.test(tekster.t(k)));
  tjek(`tekster (${sprog}): med Claude Code nævner ingen besked Codex eller Codex' filer`, rester.length === 0, rester.join(", "));
  process.env.STARTKIT_VAERKTOEJ = "codex";
  tjek(`tekster (${sprog}): med Codex er beskederne som før`, /Codex/.test(tekster.t("tj.husk")) && tekster.t("tj.agents").includes("AGENTS.md") && tekster.t("tj.hooks").includes(".codex/hooks.json") && tekster.t("ov.ingen.tal").includes("/status"));
}
delete process.env.STARTKIT_VAERKTOEJ; delete process.env.STARTKIT_SPROG;
tjek("tekster: uden indstilling er værktøjet Codex", tekster.vaerktoej() === "codex" && tekster.vt("regelfil") === "AGENTS.md");

// ---- vejledningerne til Claude Code er lavet ud fra dem til Codex, og de passer til kilden ----
let r = koer("node", [path.join(ROD, "tools", "byg-claude.js"), "--tjek"]);
tjek("vejledningerne til Claude Code passer til kilden (ellers: node tools/byg-claude.js)", r.kode === 0, r.ud + r.fejl);
const { filer, FORBUDT } = require(path.join(ROD, "tools", "byg-claude.js"));
const overskrifter = (t) => ((t || "").match(/^## /gm) || []).length;
for (const f of filer()) {
  const kilde = laes(KIT, f.fra), ny = laes(KIT, f.til) || "";
  const uden = ny.replace(/(ud fra udgaven til|from the edition for) Codex/g, "");
  tjek(`claude: ${f.til} findes, har samme afsnit som kilden og nævner ikke Codex' filer og kommandoer`, ny.length > 0 && overskrifter(ny) === overskrifter(kilde) && !FORBUDT.test(uden), (uden.match(new RegExp(`.{0,40}(${FORBUDT.source}).{0,40}`)) || [""])[0]);
  if (f.sprog === "en") tjek(`claude: ${f.til} har ingen danske bogstaver`, !DANSKE_BOGSTAVER.test(ny));
}
const claudeFiler = [];
(function gaa(d) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, x.name); if (x.isDirectory()) gaa(f); else claudeFiler.push(f); } })(path.join(KIT, "claude"));
tjek("claude: der ligger ingen ekstra SKILL.md i pakken (så værktøjet ikke ser to skills)", !claudeFiler.some((f) => path.basename(f) === "SKILL.md"));
tjek("claude: hver vejledning findes på begge sprog", fs.readdirSync(path.join(KIT, "claude", "references")).length === fs.readdirSync(path.join(KIT, "references")).length && fs.readdirSync(path.join(KIT, "claude", "en", "references")).length === fs.readdirSync(path.join(KIT, "en", "references")).length);

for (const [navn, rel, mappe, loefter] of [
  ["dansk", "claude/SKILL.claude.md", "claude/references/", [/vælg aldrig for personen/, /Ingen skjulte valg/, /Sig altid næste skridt/, /Du sender aldrig/, /ikke kørt igennem i Claude Code af et menneske/]],
  ["engelsk", "claude/en/SKILL.claude.en.md", "claude/en/references/", [/never choose for the person/, /No hidden choices/, /Always say the next step/, /You never send/, /not been taken through Claude Code by a human/]],
]) {
  const skill = laes(KIT, rel) || "";
  tjek(`SKILL til Claude Code (${navn}): navn, beskrivelse, og kun personen selv kan starte den`, /^---\nname: startkit\ndescription: .{40,}\ndisable-model-invocation: true\n---\n/.test(skill) && /\/startkit/.test(skill));
  tjek(`SKILL til Claude Code (${navn}): samme faser som udgaven til Codex`, overskrifter(skill) === overskrifter(laes(KIT, "SKILL.md")));
  const henvist = [...skill.matchAll(/`((?:claude\/)?(?:en\/)?references\/[\w-]+\.md)`/g)].map((m) => m[1]);
  tjek(`SKILL til Claude Code (${navn}): peger kun på Claude-vejledningerne, og de findes`, henvist.length >= 8 && henvist.every((f) => f.startsWith(mappe) && laes(KIT, f)), henvist.join(", "));
  const scripts = [...skill.matchAll(/scripts\/(?:startkit\/)?([\w-]+\.js)/g)].map((m) => m[1]);
  tjek(`SKILL til Claude Code (${navn}): de programmer, den nævner, findes`, scripts.length > 0 && scripts.every((f) => laes(KIT, "scripts", f) || laes(KIT, "scripts", "projekt", f)), scripts.join(", "));
  tjek(`SKILL til Claude Code (${navn}): de samme løfter som udgaven til Codex`, loefter.every((re) => re.test(skill)));
  tjek(`SKILL til Claude Code (${navn}): bruger Claude Codes filer og kommandoer`, ["CLAUDE.md", ".claude/settings.local.json", "`/usage`", "`/hooks`", "~/.claude/skills/startkit"].every((s) => skill.includes(s)));
}
tjek("vaerktoejer (Claude Code): Superpowers installeres fra Anthropics officielle samling", (laes(KIT, "claude/references/vaerktoejer.md") || "").includes("/plugin install superpowers@claude-plugins-official") && (laes(KIT, "claude/en/references/tools.md") || "").includes("/plugin install superpowers@claude-plugins-official"));

// ---- opsætning til Claude Code i et tomt projekt (dansk) ----
let rod = nytProjekt();
skriv(rod, ".startkit/profil.json", eksempel());
r = koer("node", [OPSAET, rod, "--toer"]);
tjek("tørkørsel: viser planen med Claude Codes filer uden at skrive", r.kode === 0 && /intet er skrevet/.test(r.ud) && /CLAUDE\.md/.test(r.ud) && /\.claude\/settings\.local\.json/.test(r.ud) && !/AGENTS\.md|\.codex/.test(r.ud) && laes(rod, "CLAUDE.md") === null, r.ud + r.fejl);
r = koer("node", [OPSAET, rod]);
tjek("kørsel: lykkes", r.kode === 0 && /se dem med \/hooks/.test(r.ud) && !/Codex/.test(r.ud), r.ud + r.fejl);
const regler = laes(rod, "CLAUDE.md") || "";
tjek("CLAUDE.md: har blokken, projektet og personens regler, og er kort", regler.includes("<!-- startkit:start") && regler.includes("<!-- startkit:slut -->") && regler.includes("Kortspil-log") && regler.includes("Prøveperson") && !/\{\{/.test(regler) && regler.split("\n").length <= 45, regler);
tjek("Codex' filer skrives ikke", laes(rod, "AGENTS.md") === null && laes(rod, ".codex/hooks.json") === null);
for (const f of ["STATUS.md", "docs/gentagne-fejl.md", ".startkit/hvorfor-blev-jeg-stoppet.md", ".startkit/status.md", ".startkit/config.json", ".githooks/pre-commit", "overblik.cmd", "scripts/startkit/vagt.js", "scripts/startkit/faerdig.js", "scripts/startkit/vaerktoej.json"]) {
  tjek(`fil skrevet: ${f}`, laes(rod, f) !== null);
}
const ind = JSON.parse(laes(rod, ".claude/settings.local.json"));
const vagtKommando = ind.hooks.PreToolUse[0].hooks[0].command;
const matcher = ind.hooks.PreToolUse[0].matcher;
tjek("settings.local.json: vagt og færdig-tjek med fuld sti i anførselstegn", /^node ".+\/scripts\/startkit\/vagt\.js"$/.test(vagtKommando) && !vagtKommando.includes("\\") && ind.hooks.Stop.length === 1 && /faerdig\.js"$/.test(ind.hooks.Stop[0].hooks[0].command), vagtKommando);
tjek("settings.local.json: vagten kaldes før kommandoer, filændringer og læsning (Claude Codes værktøjsnavne)", ["Bash", "PowerShell", "Edit", "Write", "MultiEdit", "NotebookEdit", "Read", "Grep"].every((v) => matcher.split("|").includes(v)) && !matcher.includes("apply_patch"), matcher);
tjek("settings.local.json holdes ude af git (stien rummer brugernavnet)", (laes(rod, ".gitignore") || "").split("\n").includes(".claude/settings.local.json"));
tjek("skabelonerne er Claude-udgaverne", /\.claude\/settings\.local\.json/.test(laes(rod, ".startkit/hvorfor-blev-jeg-stoppet.md")) && /CLAUDE\.md/.test(laes(rod, ".startkit/hvorfor-blev-jeg-stoppet.md")) && /\/startkit i Claude Code/.test(laes(rod, "overblik.cmd")) && /hooks set med \/hooks/.test(laes(rod, ".startkit/status.md")) && ![".startkit/hvorfor-blev-jeg-stoppet.md", "overblik.cmd", ".startkit/status.md"].some((f) => /Codex|\$startkit/.test(laes(rod, f))));
tjek("overblik.cmd: stadig CRLF", (laes(rod, "overblik.cmd") || "").includes("\r\n") && !/[^\r]\n/.test(laes(rod, "overblik.cmd")));
const foer = ["CLAUDE.md", ".claude/settings.local.json", ".gitignore", "STATUS.md"].map((f) => laes(rod, f)).join("\u0000");
r = koer("node", [OPSAET, rod]);
tjek("anden kørsel: ændrer ingenting", r.kode === 0 && foer === ["CLAUDE.md", ".claude/settings.local.json", ".gitignore", "STATUS.md"].map((f) => laes(rod, f)).join("\u0000") && !/^\s+(ny|opdateres)\s/m.test(r.ud), r.ud);

r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: rød, før nøgletjekket er tændt", r.kode === 1 && /❌ Nøgletjekket er tændt/.test(r.ud) && /✅ CLAUDE\.md findes/.test(r.ud) && /✅ \.claude\/settings\.local\.json kan læses/.test(r.ud), r.ud + r.fejl);
git(rod, "config", "core.hooksPath", ".githooks");
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: grøn, når alt er på plads, og nævner ikke Codex", r.kode === 0 && /Alt er sat op/.test(r.ud) && /✅ Vagten afviser et forbudt kald/.test(r.ud) && !/Codex/.test(r.ud), r.ud + r.fejl);

// ---- vagten og færdig-tjekket med den slags input, Claude Code sender ----
// Herfra er STARTKIT_VAERKTOEJ ikke sat: projektets egne scripts skal selv vide, at værktøjet er Claude Code (vaerktoej.json).
const session = "claude-test-" + process.pid;
const fuld = (rel) => path.join(rod, rel).replace(/\\/g, "/");
function vagt(tool_name, tool_input) {
  const x = koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, vaerktoej: "ingen", input: JSON.stringify({ session_id: session, transcript_path: "x", cwd: rod, permission_mode: "default", hook_event_name: "PreToolUse", tool_name, tool_input, tool_use_id: "toolu_test" }) });
  let svar = {}; try { svar = JSON.parse(x.ud || "{}"); } catch { svar = { ulaeselig: x.ud }; }
  const h = svar.hookSpecificOutput;
  return { afvist: !!h && h.hookEventName === "PreToolUse" && h.permissionDecision === "deny" && h.permissionDecisionReason.length > 20, tavs: x.kode === 0 && x.ud === "", grund: h ? h.permissionDecisionReason : "", raa: x.ud + x.fejl };
}
const noegle = falskNoegle();
const FORBUDT_KALD = [
  ["Bash: git commit --no-verify", "Bash", { command: "git commit --no-verify -m x", description: "commit" }],
  ["PowerShell: git commit --no-verify", "PowerShell", { command: "git commit --no-verify -m x" }],
  ["PowerShell: git reset --hard", "PowerShell", { command: "git reset --hard HEAD~1" }],
  ["Bash: skriver i Claude Codes indstillinger", "Bash", { command: "echo {} > .claude/settings.local.json" }],
  ["PowerShell: skriver i Claude Codes indstillinger", "PowerShell", { command: "Set-Content .claude\\settings.local.json '{}'" }],
  ["Bash: læser en .env-fil", "Bash", { command: "cat .env" }],
  ["PowerShell: læser en .env-fil", "PowerShell", { command: "Get-Content .env" }],
  ["Read: en .env-fil", "Read", { file_path: fuld(".env") }],
  ["Read: en .env.local-fil", "Read", { file_path: fuld("app/.env.local") }],
  ["Grep: i en .env-fil", "Grep", { pattern: "KEY", path: fuld(".env") }],
  ["Edit: Claude Codes lokale indstillinger", "Edit", { file_path: fuld(".claude/settings.local.json"), old_string: "a", new_string: "b" }],
  ["Write: Claude Codes delte indstillinger", "Write", { file_path: fuld(".claude/settings.json"), content: "{}" }],
  ["Write: vagten selv", "Write", { file_path: fuld("scripts/startkit/vagt.js"), content: "" }],
  ["Edit: nøgletjekket", "Edit", { file_path: fuld(".githooks/pre-commit"), old_string: "a", new_string: "b" }],
  ["Write: en .env-fil", "Write", { file_path: fuld(".env"), content: "A=1" }],
  ["Write: en nøgle i en fil", "Write", { file_path: fuld("src/a.js"), content: `const k = "${noegle}";` }],
  ["Edit: en nøgle i en fil", "Edit", { file_path: fuld("src/a.js"), old_string: "x", new_string: noegle }],
  ["MultiEdit: en nøgle i en af flere rettelser", "MultiEdit", { file_path: fuld("src/a.js"), edits: [{ old_string: "a", new_string: "b" }, { old_string: "c", new_string: noegle }] }],
  ["NotebookEdit: en nøgle i en celle", "NotebookEdit", { notebook_path: fuld("analyse.ipynb"), new_source: `key = "${noegle}"` }],
  ["NotebookEdit: en af kontrollerne", "NotebookEdit", { notebook_path: fuld("scripts/startkit/x.ipynb"), new_source: "1" }],
];
for (const [navn, vaerktoej, input] of FORBUDT_KALD) {
  const s = vagt(vaerktoej, input);
  tjek(`vagt (Claude Code) afviser: ${navn}`, s.afvist && !s.grund.includes(noegle) && /hvorfor-blev-jeg-stoppet\.md/.test(s.grund), s.raa);
}
const TILLADTE_KALD = [
  ["Bash: npm test", "Bash", { command: "npm test", description: "Kør test", timeout: 120000, run_in_background: false }],
  ["PowerShell: git status", "PowerShell", { command: "git status" }],
  ["Read: en almindelig fil", "Read", { file_path: fuld("src/a.js") }],
  ["Read: .env.example", "Read", { file_path: fuld(".env.example") }],
  ["Read: vagten (kontrollerne må gerne læses)", "Read", { file_path: fuld("scripts/startkit/vagt.js") }],
  ["Read: Claude Codes indstillinger (må gerne læses)", "Read", { file_path: fuld(".claude/settings.local.json") }],
  ["Grep: i projektet", "Grep", { pattern: "TODO", path: fuld("src") }],
  ["Grep: uden sti", "Grep", { pattern: "TODO" }],
  ["Write: en almindelig fil", "Write", { file_path: fuld("src/b.js"), content: "module.exports = 1;\n" }],
  ["Edit: CLAUDE.md (regelfilen er personens og AI'ens fælles)", "Edit", { file_path: fuld("CLAUDE.md"), old_string: "a", new_string: "b" }],
  ["MultiEdit: almindelige rettelser", "MultiEdit", { file_path: fuld("src/a.js"), edits: [{ old_string: "a", new_string: "b" }] }],
  ["Bash: kører beviset", "Bash", { command: "node scripts/startkit/bevis.js" }],
  ["Bash: tænder nøgletjekket", "Bash", { command: "git config core.hooksPath .githooks" }],
];
for (const [navn, vaerktoej, input] of TILLADTE_KALD) {
  const s = vagt(vaerktoej, input);
  tjek(`vagt (Claude Code) tillader: ${navn}`, s.tavs, s.raa);
}

const faerdig = (ekstra = {}) => koer("node", [path.join(rod, "scripts", "startkit", "faerdig.js")], { cwd: rod, vaerktoej: "ingen", input: JSON.stringify({ session_id: session, transcript_path: "x", cwd: rod, permission_mode: "default", hook_event_name: "Stop", stop_hook_active: false, last_assistant_message: "Færdig.", ...ekstra }) });
git(rod, "add", "-A");
r = koer("git", ["commit", "-q", "-m", "opsætning"], { cwd: rod, vaerktoej: "ingen" });
tjek("første commit: går igennem nøgletjekket", r.kode === 0, r.ud + r.fejl);
tjek("git: indstillingerne med den fulde sti er ikke kommet med", !git(rod, "ls-files").includes("settings.local.json"));
try { fs.unlinkSync(path.join(os.tmpdir(), `startkit-${session}.json`)); } catch { /* fandtes ikke */ }
vagt("Bash", { command: "git status" }); // første værktøjskald i "chatten": her huskes, hvordan koden så ud
r = faerdig();
tjek("færdig-tjek (Claude Code): tier, når koden ikke er ændret", r.kode === 0 && r.ud === "", r.ud + r.fejl);
skriv(rod, "src/a.js", "module.exports = 2;\n");
r = faerdig();
let blok = {}; try { blok = JSON.parse(r.ud); } catch { /* fanges af tjekket */ }
tjek("færdig-tjek (Claude Code): beder om bevis i Claude Codes format, når koden er ændret", r.kode === 0 && blok.decision === "block" && /bevis\.js/.test(blok.reason), r.ud + r.fejl);
r = faerdig({ stop_hook_active: true });
tjek("færdig-tjek (Claude Code): beder kun én gang pr. stop (ingen løkke)", r.kode === 0 && r.ud === "", r.ud);
r = koer("node", [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod, vaerktoej: "ingen" });
tjek("beviset: grønt", r.kode === 0 && /GRØNT/.test(r.ud), r.ud + r.fejl);
r = faerdig();
tjek("færdig-tjek (Claude Code): slipper igennem med grønt bevis", r.ud === "", r.ud);
tjek("færdig-tjek: ændringer i .claude/ tæller ikke som kode", require(path.join(KIT, "scripts", "projekt", "tilstand.js")).IKKE_KODE.test(".claude/settings.local.json"));
try { fs.unlinkSync(path.join(os.tmpdir(), `startkit-${session}.json`)); } catch { /* ikke vigtigt */ }

const side = koer("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod, vaerktoej: "ingen" }).ud;
tjek("overblikket: beder om /usage i Claude Code, ikke /status i Codex", /<code>\/usage<\/code> i Claude Code/.test(side) && !/Codex|\/status/.test(side), (side.match(/.{0,60}forbrug-gem.{0,40}/) || [""])[0]);

// ---- pulsen: kan man se, om Claude Code faktisk kalder vagten? ----
const { laesPuls } = require(path.join(KIT, "scripts", "projekt", "tilstand.js"));
const p1 = laesPuls(rod);
tjek("puls: vagten noterer, at den blev kaldt, med tidspunkt og værktøj, og intet om indholdet", p1 && !isNaN(Date.parse(p1.at)) && typeof p1.vaerktoej === "string" && JSON.stringify(Object.keys(p1).sort()) === '["at","vaerktoej"]', JSON.stringify(p1));
tjek("puls: filen holdes ude af git, og AI'en må ikke rette i den", (laes(rod, ".gitignore") || "").split("\n").includes(".startkit/vagt-puls.json") && vagt("Write", { file_path: fuld(".startkit/vagt-puls.json"), content: "{}" }).afvist && vagt("Bash", { command: "echo {} > .startkit/vagt-puls.json" }).afvist);
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: siger, at Claude Code kalder vagten, når pulsen er frisk", r.kode === 0 && /✅ Claude Code kalder vagten \(sidst for \d+ sekunder siden\)/.test(r.ud), r.ud);
skriv(rod, ".startkit/vagt-puls.json", JSON.stringify({ at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), vaerktoej: "Bash" }));
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: advarer, når vagten ikke er kaldt længe (men det tæller ikke som en mangel)", r.kode === 0 && /⚠️ Claude Code har ikke kaldt vagten i 3 timer/.test(r.ud), r.ud);
const sideGammel = koer("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod, vaerktoej: "ingen" }).ud;
tjek("overblikket: viser, hvornår vagten sidst blev kaldt", /Vagten blev sidst kaldt af Claude Code:/.test(sideGammel));
fs.unlinkSync(path.join(rod, ".startkit", "vagt-puls.json"));
r = koer("node", [TJEK, rod]);
tjek("tjek-opsaetning: advarer, når vagten aldrig er kaldt", r.kode === 0 && /⚠️ Claude Code har endnu aldrig kaldt vagten/.test(r.ud), r.ud);
const sideUden = koer("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod, vaerktoej: "ingen" }).ud;
tjek("overblikket: advarer, når vagten aldrig er kaldt", /class="advarsel">Vagten er aldrig blevet kaldt af Claude Code/.test(sideUden));
const direkte = koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, vaerktoej: "ingen", input: JSON.stringify({ tool_name: "Bash", tool_input: { command: "ls" }, cwd: rod }) });
tjek("puls: et kald uden chat-id (som tjekkets egen prøve) tæller ikke som et kald fra Claude Code", direkte.kode === 0 && laesPuls(rod) === null);

// ---- forbudsreglerne: det ekstra lag for hemmelige filer ----
const { FORBUDSREGLER } = tekster;
const ind2 = JSON.parse(laes(rod, ".claude/settings.local.json"));
tjek("forbudsregler: .env-filer er spærret i Claude Codes egne indstillinger, og .env.example er ikke", FORBUDSREGLER.includes("Read(.env)") && FORBUDSREGLER.every((x) => ind2.permissions.deny.includes(x)) && !ind2.permissions.deny.some((x) => /example/.test(x)), JSON.stringify(ind2.permissions));

// ---- længdelåsen gælder også CLAUDE.md (rigtig git, rigtig hook) ----
skriv(rod, "CLAUDE.md", regler + "\n" + Array.from({ length: 60 }, (_, i) => `- ekstra regel ${i}`).join("\n") + "\n");
git(rod, "add", "CLAUDE.md");
r = koer("git", ["commit", "-q", "-m", "lang"], { cwd: rod, vaerktoej: "ingen" });
tjek("længdelås: en for lang CLAUDE.md stopper commit", r.kode !== 0 && /CLAUDE\.md er på \d+ linjer/.test(r.fejl), r.ud + r.fejl);

// ---- eksisterende filer bevares ----
rod = nytProjekt();
skriv(rod, ".startkit/profil.json", eksempel());
skriv(rod, "CLAUDE.md", "# Mine egne regler\n\n- Brug altid tabs.\n");
skriv(rod, "AGENTS.md", "min egen fil til et andet værktøj\n");
skriv(rod, ".claude/settings.local.json", JSON.stringify({ permissions: { allow: ["Bash(npm test)"], deny: ["Read(hemmeligt/**)", "Read(.env)"] }, hooks: { Stop: [{ hooks: [{ type: "command", command: "node min-egen.js" }] }], SessionStart: [{ hooks: [{ type: "command", command: "echo hej" }] }] } }));
koer("node", [OPSAET, rod]); r = koer("node", [OPSAET, rod]);
const c2 = laes(rod, "CLAUDE.md");
tjek("egen CLAUDE.md: egne linjer bevares, blokken står én gang", c2.startsWith("# Mine egne regler") && c2.includes("Brug altid tabs.") && c2.split("<!-- startkit:start").length === 2, c2);
tjek("egen AGENTS.md: røres ikke", laes(rod, "AGENTS.md") === "min egen fil til et andet værktøj\n");
const s2 = JSON.parse(laes(rod, ".claude/settings.local.json"));
tjek("egne forbudsregler: bevares, og startkittets tilføjes én gang", s2.permissions.deny[0] === "Read(hemmeligt/**)" && s2.permissions.deny.filter((x) => x === "Read(.env)").length === 1, JSON.stringify(s2.permissions));
tjek("egne indstillinger og hooks: bevares, og startkittets står én gang", s2.permissions.allow[0] === "Bash(npm test)" && s2.hooks.Stop.length === 2 && s2.hooks.Stop[0].hooks[0].command === "node min-egen.js" && s2.hooks.SessionStart.length === 1 && s2.hooks.PreToolUse.length === 1, JSON.stringify(s2));
skriv(rod, ".claude/settings.local.json", "{ ikke json");
r = koer("node", [OPSAET, rod]);
tjek("ulæselige indstillinger: stopper, forklarer og overskriver ikke", r.kode === 2 && /\.claude\/settings\.local\.json findes, men kan ikke læses/.test(r.fejl) && laes(rod, ".claude/settings.local.json") === "{ ikke json", r.fejl);

// ---- engelsk til Claude Code ----
rod = nytProjekt();
skriv(rod, ".startkit/profile.json", JSON.stringify({ person: { name: "Sample Person" }, chosen_project: "Card game log", projects: [{ name: "Card game log", description: "You can save your games." }], rules: { never_without_ok: ["delete files"], answer_style: "Short answers." }, check_commands: ["node -e \"process.exit(0)\""] }));
r = koer("node", [OPSAET, rod], { sprog: "en" });
tjek("engelsk: opsætningen lykkes og taler engelsk om Claude Code", r.kode === 0 && /Setting up in/.test(r.ud) && /see them with \/hooks/.test(r.ud) && !/Codex/.test(r.ud) && !DANSKE_BOGSTAVER.test(r.ud.replace(rod, "")), r.ud + r.fejl);
tjek("engelsk: CLAUDE.md og de engelske Claude-skabeloner", /Ask the owner before you: delete files\./.test(laes(rod, "CLAUDE.md") || "") && /\.claude\/settings\.local\.json/.test(laes(rod, ".startkit/why-was-i-stopped.md") || "") && /type \/startkit in Claude Code/.test(laes(rod, "overview.cmd") || "") && /hooks seen with \/hooks/.test(laes(rod, ".startkit/status.md") || "") && laes(rod, "AGENTS.md") === null);
for (const f of ["CLAUDE.md", ".startkit/why-was-i-stopped.md", "overview.cmd", ".startkit/status.md"]) tjek(`engelsk indhold: ${f}`, !DANSKE_BOGSTAVER.test(laes(rod, f) || "æ") && !/Codex/.test(laes(rod, f) || ""));
tjek("engelsk: beskederne i indstillingerne er engelske", /Starter kit: the guard is checking/.test(laes(rod, ".claude/settings.local.json")));
git(rod, "config", "core.hooksPath", ".githooks");
r = koer("node", [TJEK, rod], { sprog: "en" });
tjek("engelsk: tjek af opsætningen er grønt", r.kode === 0 && /Everything is set up/.test(r.ud) && /CLAUDE\.md exists/.test(r.ud) && !/Codex/.test(r.ud) && !DANSKE_BOGSTAVER.test(r.ud), r.ud + r.fejl);
const x = koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, vaerktoej: "ingen", input: JSON.stringify({ session_id: "claude-en-" + process.pid, cwd: rod, hook_event_name: "PreToolUse", tool_name: "Read", tool_input: { file_path: path.join(rod, ".env") } }) });
tjek("engelsk: vagten afviser læsning af .env på engelsk", /"deny"/.test(x.ud) && /is a \.env file/.test(x.ud) && /why-was-i-stopped\.md/.test(x.ud), x.ud + x.fejl);
try { fs.unlinkSync(path.join(os.tmpdir(), `startkit-claude-en-${process.pid}.json`)); } catch { /* ikke vigtigt */ }

// ---- installation i hånden, som README beskriver: kopiér mappen, læg Claude-udgavens SKILL.md øverst, og skriv vaerktoej.json ----
for (const [sprog, skillFil, profilFil, profil, forventet] of [
  ["da", "claude/SKILL.claude.md", ".startkit/profil.json", eksempel(), /Sætter op i/],
  ["en", "claude/en/SKILL.claude.en.md", ".startkit/profile.json", JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Explain along the way." } }), /Setting up in/],
]) {
  const skillMappe = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-skill-claude-")), "startkit");
  fs.cpSync(KIT, skillMappe, { recursive: true });
  fs.copyFileSync(path.join(skillMappe, skillFil), path.join(skillMappe, "SKILL.md"));
  fs.writeFileSync(path.join(skillMappe, "scripts", "projekt", "vaerktoej.json"), '{"vaerktoej": "claude"}\n');
  if (sprog === "en") fs.writeFileSync(path.join(skillMappe, "scripts", "projekt", "sprog.json"), '{"sprog": "en"}\n');
  const p = nytProjekt();
  skriv(p, profilFil, profil);
  const y = koer("node", [path.join(skillMappe, "scripts", "opsaet.js"), p], { vaerktoej: "ingen" });
  tjek(`installeret skill til Claude Code (${sprog}): opsætningen bruger Claude Codes filer uden hjælp, og projektet får værktøjet med`, y.kode === 0 && forventet.test(y.ud) && laes(p, "CLAUDE.md") !== null && laes(p, ".claude/settings.local.json") !== null && laes(p, "AGENTS.md") === null && /"claude"/.test(laes(p, "scripts/startkit/vaerktoej.json") || ""), y.ud + y.fejl);
  const skill = laes(skillMappe, "SKILL.md");
  const peger = [...skill.matchAll(/`(claude\/(?:en\/)?references\/[\w-]+\.md)`/g)].map((m) => m[1]);
  tjek(`installeret skill til Claude Code (${sprog}): SKILL.md peger på vejledninger, der ligger i den installerede mappe`, peger.length >= 8 && peger.every((f) => laes(skillMappe, f)));
}

// ---- Codex er stadig standard, og intet er ændret dér ----
rod = nytProjekt();
skriv(rod, ".startkit/profil.json", eksempel());
r = koer("node", [OPSAET, rod], { vaerktoej: "ingen" });
const codexHooks = JSON.parse(laes(rod, ".codex/hooks.json") || "{}");
tjek("Codex er standard: AGENTS.md og .codex/hooks.json som før, og ingen Claude-filer", r.kode === 0 && !codexHooks.permissions && laes(rod, "AGENTS.md") !== null && codexHooks.hooks.PreToolUse[0].matcher === "Bash|apply_patch|Edit|Write" && laes(rod, "CLAUDE.md") === null && laes(rod, ".claude/settings.local.json") === null && laes(rod, "scripts/startkit/vaerktoej.json") === null && /Codex/.test(laes(rod, ".startkit/hvorfor-blev-jeg-stoppet.md")), r.ud + r.fejl);

skriv(rod, "CLAUDE.md", Array.from({ length: 120 }, (_, i) => `- min egen regel ${i}`).join("\n") + "\n");
git(rod, "config", "core.hooksPath", ".githooks");
git(rod, "add", "-A");
r = koer("git", ["commit", "-q", "-m", "egen lang CLAUDE.md"], { cwd: rod, vaerktoej: "ingen" });
tjek("Codex-projekt: personens egen lange CLAUDE.md stopper ikke en commit (kun kittets egen regelfil låses)", r.kode === 0, r.ud + r.fejl);

// ---- installationen ----
const ps1 = laes(ROD, "install.ps1") || "";
const cmdDa = laes(ROD, "installer-claude.cmd") || "", cmdEn = laes(ROD, "install-claude-english.cmd") || "";
tjek("installer-claude.cmd: starter install.ps1 ved siden af sig selv med Claude Code og intet andet", /-File "%~dp0install\.ps1" -Vaerktoej claude/.test(cmdDa) && !/-Sprog/.test(cmdDa) && !/curl|Invoke-WebRequest|http/i.test(cmdDa) && !/[^\x00-\x7F]/.test(cmdDa));
tjek("install-claude-english.cmd: starter install.ps1 med engelsk og Claude Code og intet andet", /-File "%~dp0install\.ps1" -Sprog en -Vaerktoej claude/.test(cmdEn) && !/curl|Invoke-WebRequest|http/i.test(cmdEn) && !/[^\x00-\x7F]/.test(cmdEn));
tjek("de to gamle installationsfiler er uændrede (Codex)", !/-Vaerktoej/.test(laes(ROD, "installer.cmd") || "x -Vaerktoej") && !/-Vaerktoej/.test(laes(ROD, "install-english.cmd") || "x -Vaerktoej"));
tjek("install.ps1: Claude-udgaven lægges i .claude\\skills, og dens SKILL.md og vaerktoej.json skrives efter kopieringen", /\.claude\\skills\\startkit/.test(ps1) && ps1.indexOf("Copy-Item -Recurse $fra $til") < ps1.indexOf("claude\\SKILL.claude.md") && /claude\\en\\SKILL\.claude\.en\.md/.test(ps1) && /scripts\\projekt\\vaerktoej\.json/.test(ps1) && /"vaerktoej": "claude"/.test(ps1));
tjek("install.ps1: uden -Vaerktoej er det stadig Codex", /\$Vaerktoej = "codex"/.test(ps1) && /\.agents\\skills\\startkit/.test(ps1));
const udgiv = laes(ROD, ".github/workflows/release.yml") || "";
tjek("udgivelsen: ZIP-filen rummer også installationen til Claude Code", ["installer-claude.cmd", "install-claude-english.cmd"].every((f) => udgiv.includes(f)) && !/tools/.test(udgiv.split("Pak kittet")[1].split("Læg udgivelsen ud")[0]));

// ---- siderne udenom ----
for (const [f, tabel] of [["README.md", "## Codex or Claude Code?"], ["README.da.md", "## Codex eller Claude Code?"]]) {
  const t = laes(ROD, f) || "";
  tjek(`${f}: forklarer valget mellem Codex og Claude Code og begge installationer til Claude Code`, t.includes(tabel) && ["installer-claude.cmd", "install-claude-english.cmd", "`/startkit`", "`CLAUDE.md`", "`.claude/settings.local.json`", ".claude\\skills\\startkit", '{"vaerktoej": "claude"}', "claude.com/download"].every((x) => t.includes(x)));
  tjek(`${f}: siger ærligt, hvad der er prøvet i Claude Code, og hvad der ikke er`, /(Prøvet|Tried) i?n? ?Claude Code 2\.\d+\.\d+/.test(t) && /Claude Code (på Windows og i Claudes app|on Windows and in the Claude app) \| \*\*(Ikke afprøvet|Not tried)\*\*/.test(t));
}
for (const f of ["CHANGELOG.md", "CHANGELOG.da.md", "TEACHING.md", "UNDERVISNING.md"]) tjek(`${f}: nævner udgaven til Claude Code`, /Claude Code/.test(laes(ROD, f) || "") && /installer-claude\.cmd|install-claude-english\.cmd/.test(laes(ROD, f) || ""));

// En linje "run: ..." må ikke rumme kolon efterfulgt af mellemrum: så kan GitHub ikke læse filen, og udgivelsen fejler uden at køre.
for (const f of ["release.yml", "test.yml"]) {
  const daarlige = (laes(ROD, ".github", "workflows", f) || "").split("\n").filter((l) => /^\s*(- )?(run|name): [^|>"']/.test(l) && /: /.test(l.replace(/^\s*(- )?(run|name): /, "")));
  tjek(`${f}: ingen linje, som GitHub ikke kan læse (kolon og mellemrum midt i en kommando)`, daarlige.length === 0, daarlige.join(" | ").slice(0, 300));
}

if (process.platform === "win32") {
  for (const [sprog, svarJa, skillFil, naeste] of [["da", "j", ["claude", "SKILL.claude.md"], /Naeste skridt/], ["en", "y", ["claude", "en", "SKILL.claude.en.md"], /Next steps/]]) {
    const maal = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-install-claude-")), "skills", "startkit");
    const koerInstall = (svar) => koer("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROD, "install.ps1"), "-Til", maal, "-Sprog", sprog, "-Vaerktoej", "claude"], { input: svar + "\n", vaerktoej: "ingen" });
    let i = koerInstall("n");
    tjek(`installation til Claude Code (${sprog}): et nej ændrer ingenting`, i.kode === 0 && !fs.existsSync(maal), i.ud + i.fejl);
    i = koerInstall(svarJa);
    tjek(`installation til Claude Code (${sprog}): et ja kopierer mappen, lægger Claude-udgavens SKILL.md øverst og sætter værktøjet`, i.kode === 0 && naeste.test(i.ud) && i.ud.includes("/startkit") && !i.ud.includes("$startkit") && /Claude Code/.test(i.ud) && !/Codex/.test(i.ud) && laes(maal, "SKILL.md") === laes(maal, ...skillFil) && /"vaerktoej": "claude"/.test(laes(maal, "scripts", "projekt", "vaerktoej.json") || "") && (sprog === "en") === /"sprog": "en"/.test(laes(maal, "scripts", "projekt", "sprog.json") || ""), i.ud + i.fejl);
    const p = nytProjekt();
    skriv(p, ".startkit/profil.json", eksempel());
    const y = koer("node", [path.join(maal, "scripts", "opsaet.js"), p], { vaerktoej: "ingen" });
    tjek(`installation til Claude Code (${sprog}): den installerede skill sætter op med Claude Codes filer`, y.kode === 0 && laes(p, "CLAUDE.md") !== null && laes(p, ".claude/settings.local.json") !== null, y.ud + y.fejl);
  }
}

slut("claude");
