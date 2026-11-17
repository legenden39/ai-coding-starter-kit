// Loop-stoppet: fejltælleren (fejl.js) og vagten (vagt.js) kørt som rigtige programmer med den slags input,
// Claude Code sender ifølge dokumentationen (PostToolUseFailure og PreToolUse). På dansk og engelsk.
// Det her viser, at scriptene gør det rigtige, NÅR de bliver kaldt. Om Claude Code faktisk kalder dem, kan en test ikke vise.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, kopierScripts, falskNoegle } = require("./hjaelp");
const loopstop = require(path.join(KIT, "scripts", "projekt", "loopstop"));
const { voresHooks } = require(path.join(KIT, "scripts", "opsaet.js"));

const rod = nytProjekt();
kopierScripts(rod);
skriv(rod, "src/a.js", "module.exports = 1;\n");
git(rod, "add", ".");
git(rod, "commit", "-q", "-m", "start");

const sessioner = [];
function chat(navn, sprog = "da") {
  const session = `loop-${navn}-${process.pid}`;
  sessioner.push(session);
  const koer = (script, data) => { const r = spawnSync("node", [path.join(rod, "scripts", "startkit", script)], { cwd: rod, input: JSON.stringify({ session_id: session, transcript_path: "x", cwd: rod, permission_mode: "default", ...data }), encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog, STARTKIT_VAERKTOEJ: "claude" } }); return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" }; };
  return {
    session,
    fejler: (command, error, ekstra = {}) => koer("fejl.js", { hook_event_name: "PostToolUseFailure", tool_name: "Bash", tool_input: { command }, tool_use_id: "toolu_x", error, is_interrupt: false, duration_ms: 1234, ...ekstra }),
    vagt: (tool_name, tool_input) => { const r = koer("vagt.js", { hook_event_name: "PreToolUse", tool_name, tool_input, tool_use_id: "toolu_y" }); let grund = ""; try { grund = JSON.parse(r.ud).hookSpecificOutput.permissionDecisionReason; } catch { /* intet svar = tilladt */ } return { ...r, tavs: r.kode === 0 && r.ud === "", grund }; },
  };
}
const TEST = (n, sti = "C:\\proj\\src\\a.test.js") => `Exit code 1\nFAIL ${sti}\n  expected 3 but got ${n} (took ${100 + n} ms at 12:0${n}:33)\n    at ${sti}:${40 + n}:7`;
const KOER = { command: "npm test" }, RET = { file_path: path.join(rod, "src", "a.js"), old_string: "1", new_string: "2" };

// ---- hovedforløbet, på begge sprog ----
for (const [sprog, anden, igen, fejllinje, fejlfil] of [["da", /^Stoppet: .+2 gange.+ Hvorfor: .+ Hvad nu: .+ejeren/, /^Stoppet: .+3 gange.+ Hvorfor: .+ Hvad nu: .+ny chat/, /Fejlen var: FAIL/, /docs\/gentagne-fejl\.md/], ["en", /^Stopped: .+2 times.+ Why: .+ What now: .+owner/, /^Stopped: .+3 times.+ Why: .+ What now: .+new chat/, /The error was: FAIL/, /docs\/recurring-mistakes\.md/]]) {
  const c = chat("hoved-" + sprog, sprog);
  let r = c.vagt("Bash", KOER);
  tjek(`${sprog}: uden fejl stopper vagten intet`, r.tavs, r.ud + r.fejl);
  r = c.fejler("npm test", TEST(1));
  tjek(`${sprog}: fejltælleren skriver intet og afviser intet`, r.kode === 0 && r.ud === "" && r.fejl === "", r.ud + r.fejl);
  r = c.vagt("Edit", RET);
  tjek(`${sprog}: én fejl giver intet stop`, r.tavs, r.ud);
  // Samme kommando, samme fejl, men andre tal, et andet tidspunkt og en anden sti: det er stadig den samme fejl.
  c.fejler("npm test", TEST(2, "D:/andet sted/src/a.test.js"));
  r = c.vagt("Read", { file_path: path.join(rod, "src", "a.js") });
  tjek(`${sprog}: læsning stoppes ikke (den er en del af at finde årsagen)`, r.tavs, r.ud);
  r = c.vagt("Edit", RET);
  tjek(`${sprog}: anden gang afvises den næste handling med hvad, hvorfor og hvad nu`, anden.test(r.grund) && fejllinje.test(r.grund), r.ud + r.fejl);
  tjek(`${sprog}: beskeden peger på forklaringen og er i Claude Codes format`, /hookEventName":"PreToolUse".+"permissionDecision":"deny"/.test(r.ud) && (sprog === "da" ? /hvorfor-blev-jeg-stoppet\.md/ : /why-was-i-stopped\.md/).test(r.grund), r.ud);
  r = c.vagt("Edit", RET);
  const r2 = c.vagt("Bash", KOER);
  tjek(`${sprog}: der stoppes kun én gang; derefter kan AI'en arbejde videre`, r.tavs && r2.tavs, r.ud + r2.ud);
  c.fejler("npm test", TEST(7));
  r = c.vagt("Bash", KOER);
  tjek(`${sprog}: tredje gang stoppes der igen, nu med besked om fejllisten og en ny chat`, igen.test(r.grund) && fejlfil.test(r.grund), r.ud + r.fejl);
  tjek(`${sprog}: ... og igen kun én gang`, c.vagt("Bash", KOER).tavs);
}

// ---- det, der ikke må tælle som en løkke ----
let c = chat("forskellige");
c.fejler("cat a.txt", "Exit code 1\ncat: a.txt: No such file or directory");
c.fejler("cat b.txt", "Exit code 1\ncat: b.txt: No such file or directory");
tjek("to forskellige kommandoer med samme korte fejl er ikke en løkke", c.vagt("Bash", KOER).tavs);

c = chat("forskellig-fejl");
c.fejler("npm test", "Exit code 1\nSyntaxError: Unexpected token");
c.fejler("npm test", "Exit code 1\nTypeError: x is not a function");
tjek("samme kommando med to forskellige fejl er ikke en løkke (der er sket noget nyt)", c.vagt("Bash", KOER).tavs);

c = chat("afbrudt");
c.fejler("npm test", TEST(1), { is_interrupt: true });
c.fejler("npm test", TEST(1), { is_interrupt: true });
tjek("en kommando, personen selv har afbrudt, tælles ikke", c.vagt("Bash", KOER).tavs);

c = chat("andre-vaerktoejer");
for (let n = 0; n < 3; n++) c.fejler(undefined, "String to replace not found in file", { tool_name: "Edit", tool_input: RET });
for (let n = 0; n < 3; n++) c.fejler(undefined, "File does not exist", { tool_name: "Read", tool_input: { file_path: "x" } });
tjek("fejlede rettelser og læsninger tælles ikke (kun kommandoer)", c.vagt("Bash", KOER).tavs);

c = chat("powershell");
c.fejler("npm test", TEST(1), { tool_name: "PowerShell" });
c.fejler("npm test", TEST(2), { tool_name: "PowerShell" });
tjek("PowerShell-kommandoer tælles som Bash", /^Stoppet: /.test(c.vagt("PowerShell", KOER).grund));

// Hver chat tæller for sig.
const a = chat("chat-a"), b = chat("chat-b");
a.fejler("npm test", TEST(1)); b.fejler("npm test", TEST(1));
tjek("fejl i én chat tæller ikke i en anden", a.vagt("Bash", KOER).tavs && b.vagt("Bash", KOER).tavs);

// ---- rækkefølgen med vagtens egne regler, og kontakten ----
c = chat("regel-foerst");
c.fejler("npm test", TEST(1)); c.fejler("npm test", TEST(2));
let r = c.vagt("Bash", { command: "git push --force" });
tjek("vagtens egne regler kommer først: en farlig kommando får sin egen besked", /overskrive/.test(r.grund) && !/samme kommando/.test(r.grund), r.grund);
r = c.vagt("Bash", KOER);
tjek("... og loop-stoppet venter til den næste almindelige handling", /^Stoppet: den samme kommando/.test(r.grund), r.ud);

c = chat("kun-registrer");
skriv(rod, ".startkit/config.json", JSON.stringify({ vagt: "kun-registrer" }));
c.fejler("npm test", TEST(1)); c.fejler("npm test", TEST(2));
tjek("kun-registrér (kittets egen kilderepo): loop-stoppet afviser heller ikke", c.vagt("Bash", KOER).tavs);
fs.rmSync(path.join(rod, ".startkit"), { recursive: true, force: true });

// ---- robusthed ----
c = chat("noegle");
c.fejler("node kald.js", "Exit code 1\nUnauthorized: " + falskNoegle());
c.fejler("node kald.js", "Exit code 1\nUnauthorized: " + falskNoegle());
r = c.vagt("Bash", KOER);
tjek("ligner fejlteksten en nøgle, vises den ikke i beskeden eller i tællerens fil", /^Stoppet: /.test(r.grund) && !r.grund.includes(falskNoegle()) && !fs.readFileSync(loopstop.fil(c.session), "utf8").includes(falskNoegle()), r.grund);

r = spawnSync("node", [path.join(rod, "scripts", "startkit", "fejl.js")], { cwd: rod, input: "ikke json", encoding: "utf8" });
tjek("fejltælleren: defekt input forstyrrer ikke chatten", r.status === 0 && r.stdout === "" && r.stderr === "", r.stdout + r.stderr);
c = chat("defekt-fil");
fs.writeFileSync(loopstop.fil(c.session), "ikke json");
tjek("vagten: en ødelagt tællerfil stopper ingenting", c.vagt("Bash", KOER).tavs);
r = c.fejler("npm test", TEST(1));
tjek("fejltælleren: en ødelagt tællerfil bliver bare skrevet forfra", r.kode === 0 && JSON.parse(fs.readFileSync(loopstop.fil(c.session), "utf8")) !== null);
tjek("uden chat-id tælles og stoppes der ikke", loopstop.noter({ tool_name: "Bash", tool_input: KOER, error: "x" }) === 0 && loopstop.skalStoppe({ tool_name: "Bash" }) === null);
const gemt = fs.readFileSync(loopstop.fil(chat("indhold").session.replace("indhold", "hoved-da")), "utf8");
tjek("tællerens fil gemmer kun antal og et kort uddrag, ikke kommandoen", !/npm test/.test(gemt) && /"antal":3/.test(gemt), gemt);

// rens: det, der skifter fra gang til gang, må ikke gøre to ens fejl forskellige.
tjek("rens: tal, tidspunkter, stier og farvekoder tages ud", loopstop.rens("\x1b[31mError\x1b[0m at C:\\Users\\x\\app.js:12:5 (took 340ms) 2026-11-17T10:22:01Z abc1234f") === loopstop.rens("Error at /home/y/z/app.js:99:1 (took 7ms) 2025-01-02T00:00:00Z 99fe0a1b"), loopstop.rens("Error at /home/y/z/app.js:99:1 (took 7ms)"));
tjek("rens: to forskellige fejl er stadig forskellige", loopstop.rens("SyntaxError: Unexpected token") !== loopstop.rens("TypeError: x is not a function"));

// ---- opsætningen: låsen kobles kun til, hvor værktøjet har en hændelse for fejl ----
for (const [vaerktoej, skalHave] of [["claude", true], ["codex", false]]) {
  process.env.STARTKIT_VAERKTOEJ = vaerktoej;
  const h = voresHooks(rod);
  tjek(`opsætning (${vaerktoej}): fejltælleren er ${skalHave ? "" : "ikke "}koblet til`, skalHave ? (h.PostToolUseFailure && h.PostToolUseFailure.matcher === "Bash|PowerShell" && /scripts\/startkit\/fejl\.js"$/.test(h.PostToolUseFailure.hooks[0].command)) : !h.PostToolUseFailure, JSON.stringify(h));
}
delete process.env.STARTKIT_VAERKTOEJ;

for (const s of sessioner) for (const f of [loopstop.fil(s), loopstop.fil(s).replace(/-fejl\.json$/, ".json")]) { try { fs.unlinkSync(f); } catch { /* ikke vigtigt */ } }
slut("loopstop");
