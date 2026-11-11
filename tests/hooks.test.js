// Vagten og færdig-tjekket kørt som rigtige programmer med den slags input, Codex sender.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { tjek, slut, nytProjekt, git, koer, skriv, kopierScripts } = require("./hjaelp");

const rod = nytProjekt();
kopierScripts(rod);
skriv(rod, "src/a.js", "module.exports = 1;\n");
skriv(rod, "README.md", "# Prøve\n");
git(rod, "add", ".");
git(rod, "commit", "-q", "-m", "start");

const session = "test-" + process.pid;
const sessionFil = path.join(os.tmpdir(), `startkit-${session}.json`);
const vagt = (data, raa) => koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: raa ?? JSON.stringify({ session_id: session, cwd: rod, hook_event_name: "PreToolUse", ...data }) });
const faerdig = (ekstra = {}) => koer("node", [path.join(rod, "scripts", "startkit", "faerdig.js")], { cwd: rod, input: JSON.stringify({ session_id: session, cwd: rod, hook_event_name: "Stop", stop_hook_active: false, ...ekstra }) });
const bevis = () => koer("node", [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod });
const saetTjek = (liste) => skriv(rod, ".startkit/config.json", JSON.stringify({ tjek: liste }));
const GROEN = 'node -e "process.exit(0)"', ROED = 'node -e "process.exit(1)"';

// ---- vagten ----
let r = faerdig();
tjek("færdig-tjek: tier, før noget værktøj er brugt i chatten", r.kode === 0 && r.ud === "", r.ud + r.fejl);

r = vagt({ tool_name: "Bash", tool_input: { command: "npm test" } });
tjek("vagt: tilladt kald giver intet svar", r.kode === 0 && r.ud === "", r.ud + r.fejl);
tjek("vagt: husker chattens start", fs.existsSync(sessionFil));

r = vagt({ tool_name: "Bash", tool_input: { command: "git commit --no-verify -m x" } });
let svar = {}; try { svar = JSON.parse(r.ud); } catch { /* fanges af tjekket */ }
tjek("vagt: forbudt kald afvises i Codex' format", r.kode === 0 && svar.hookSpecificOutput && svar.hookSpecificOutput.hookEventName === "PreToolUse" && svar.hookSpecificOutput.permissionDecision === "deny" && svar.hookSpecificOutput.permissionDecisionReason.length > 20, r.ud + r.fejl);

r = vagt({ tool_name: "apply_patch", tool_input: { command: "*** Begin Patch\n*** Update File: .codex/hooks.json\n+{}\n*** End Patch" } });
tjek("vagt: ændring af en kontrol afvises", /"deny"/.test(r.ud), r.ud);

r = vagt(null, "det her er ikke json");
tjek("vagt: ulæseligt input afvises (lukker, hvor den kan)", r.kode === 0 && /"deny"/.test(r.ud), r.ud + r.fejl);

r = vagt({ tool_name: "Bash", tool_input: { command: "ls" }, cwd: os.tmpdir() });
tjek("vagt: virker også uden for et git-projekt", r.kode === 0 && r.ud === "", r.ud + r.fejl);

// ---- færdig-tjekket ----
r = faerdig();
tjek("færdig-tjek: tier, når koden ikke er ændret", r.kode === 0 && r.ud === "", r.ud + r.fejl);

skriv(rod, "README.md", "# Prøve\n\nMere tekst.\n");
r = faerdig();
tjek("færdig-tjek: tier ved rene tekstændringer", r.ud === "", r.ud);

skriv(rod, "src/a.js", "module.exports = 2;\n");
r = faerdig();
let blok = {}; try { blok = JSON.parse(r.ud); } catch { /* fanges af tjekket */ }
tjek("færdig-tjek: beder om bevis, når koden er ændret", r.kode === 0 && blok.decision === "block" && /bevis\.js/.test(blok.reason) && /ikke noget bevis/.test(blok.reason), r.ud + r.fejl);

r = faerdig({ stop_hook_active: true });
tjek("færdig-tjek: beder kun én gang pr. stop (ingen løkke)", r.kode === 0 && r.ud === "", r.ud);

saetTjek([ROED]);
r = bevis();
tjek("bevis: rød kommando giver rødt bevis", r.kode === 1 && /RØDT/.test(r.ud), r.ud + r.fejl);
r = faerdig();
tjek("færdig-tjek: afviser ved rødt bevis", /er rødt/.test(r.ud), r.ud);

saetTjek([GROEN, GROEN]);
r = bevis();
const gemt = JSON.parse(fs.readFileSync(path.join(rod, ".startkit", "bevis.json"), "utf8"));
tjek("bevis: grønne kommandoer giver grønt bevis", r.kode === 0 && gemt.ok === true && gemt.resultater.length === 2 && typeof gemt.fingeraftryk === "string", r.ud + r.fejl);
r = faerdig();
tjek("færdig-tjek: slipper igennem med grønt bevis", r.ud === "", r.ud);

git(rod, "add", "src/a.js", "README.md");
git(rod, "commit", "-q", "-m", "ændring");
r = faerdig();
tjek("færdig-tjek: beviset gælder stadig, når arbejdet er gemt i git", r.ud === "", r.ud);

skriv(rod, "src/b.js", "module.exports = 3;\n");
r = faerdig();
tjek("færdig-tjek: en ny fil efter beviset kræver nyt bevis", /ændret, siden beviset/.test(r.ud), r.ud);

saetTjek([]);
r = bevis();
tjek("bevis: uden tjek-kommandoer siges det ærligt", r.kode === 0 && /INGEN tjek-kommandoer/.test(r.ud) && JSON.parse(fs.readFileSync(path.join(rod, ".startkit", "bevis.json"), "utf8")).ingenTjek === true, r.ud);

r = koer("node", [path.join(rod, "scripts", "startkit", "faerdig.js")], { cwd: rod, input: "ikke json" });
tjek("færdig-tjek: defekt input låser ikke chatten", r.kode === 0 && r.ud === "", r.ud + r.fejl);

// ---- forbrug og overblik ----
r = koer("node", [path.join(rod, "scripts", "startkit", "forbrug-gem.js"), "--5t", "40", "--uge", "90"], { cwd: rod });
tjek("forbrug-gem: gemmer tal", r.kode === 0 && JSON.parse(fs.readFileSync(path.join(rod, ".startkit", "forbrug.json"), "utf8")).uge === 90, r.ud + r.fejl);
r = koer("node", [path.join(rod, "scripts", "startkit", "forbrug-gem.js"), "--5t", "400"], { cwd: rod });
tjek("forbrug-gem: afviser umulige tal", r.kode === 2, r.ud);

skriv(rod, "STATUS.md", "# Status\n\n## Nu\n- Bygger <login>\n\n## Næste skridt\n- Test betaling\n");
skriv(rod, "docs/gentagne-fejl.md", "| Dato | Hvad | Årsag | Låst af |\n|---|---|---|---|\n| 2026-11-01 | a | b | hook |\n| 2026-11-02 | c | d | nej |\n");
skriv(rod, ".startkit/config.json", JSON.stringify({ tjek: [], modelguide: ["Lille model: enkle rettelser"], graense_procent: 85 }));
r = koer("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod });
tjek("overblik: viser status, og tegn i teksten gøres ufarlige", r.kode === 0 && r.ud.includes("Bygger &lt;login&gt;") && r.ud.includes("Test betaling"), r.fejl);
tjek("overblik: tæller fejl uden lås", /2 nedskrevne fejl, heraf <b>1<\/b> uden en lås/.test(r.ud), r.ud.slice(0, 300));
tjek("overblik: viser modelguide og advarer over grænsen", r.ud.includes("Lille model: enkle rettelser") && /Uge: <b>90 %<\/b> <span class="roed">/.test(r.ud));
tjek("overblik: viser gult bevis, når intet er afprøvet", /gult/.test(r.ud));

try { fs.unlinkSync(sessionFil); } catch { /* ikke vigtigt */ }
slut("hooks");
