// Udgaven til Antigravity (Gemini): bygger, opsætning, hooks i Antigravitys camelCase-JSON, længdelås og installation på dansk og engelsk.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, falskNoegle } = require("./hjaelp");

const koer = (program, args, { cwd, input, env } = {}) => {
  const r = spawnSync(program, args, { cwd, input, env: env ? { ...process.env, ...env } : process.env, encoding: "utf8" });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
};

const ROD = path.join(KIT, "..");
const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const TJEK = path.join(KIT, "scripts", "tjek-opsaetning.js");
const profil = () => JSON.parse(fs.readFileSync(path.join(__dirname, "eksempel-profil.json"), "utf8"));
const laes = (rod, rel) => { try { return fs.readFileSync(path.join(rod, rel), "utf8"); } catch { return null; } };

// ---- bygger: startkit/gemini/ passer til kilden ----
let r = koer("node", [path.join(ROD, "tools", "byg-gemini.js"), "--tjek"]);
tjek("byg-gemini --tjek: grøn", r.kode === 0, r.ud + r.fejl);

// ---- opsætning, hooks, længdelås og tjek på begge sprog ----
for (const sprog of ["da", "en"]) {
  const env = { STARTKIT_VAERKTOEJ: "gemini", STARTKIT_SPROG: sprog };
  const rod = nytProjekt();
  skriv(rod, sprog === "en" ? ".startkit/profile.json" : ".startkit/profil.json", JSON.stringify(profil()));
  skriv(rod, ".agents/hooks.json", JSON.stringify({ "min-egen": { PreToolUse: [{ matcher: "run_command", hooks: [{ type: "command", command: "echo ok" }] }] } }));

  r = koer("node", [OPSAET, rod], { env });
  tjek(`gemini (${sprog}): opsaet.js lykkes`, r.kode === 0, r.ud + r.fejl);
  tjek(`gemini (${sprog}): skriver GEMINI.md (og ikke AGENTS.md/CLAUDE.md)`, laes(rod, "GEMINI.md") !== null && laes(rod, "AGENTS.md") === null && laes(rod, "CLAUDE.md") === null);
  tjek(`gemini (${sprog}): skriver vaerktoej.json = gemini`, JSON.parse(laes(rod, "scripts/startkit/vaerktoej.json") || "{}").vaerktoej === "gemini");
  tjek(`gemini (${sprog}): .gitignore holder .agents/hooks.json ude af git`, (laes(rod, ".gitignore") || "").split(/\r?\n/).includes(".agents/hooks.json"));

  const hooks = JSON.parse(laes(rod, ".agents/hooks.json") || "{}");
  tjek(`gemini (${sprog}): .agents/hooks.json har startkit-blok med alle 4 hændelser og bevarer egne hooks`,
    Boolean(hooks["min-egen"] && hooks.startkit && hooks.startkit.SessionStart && hooks.startkit.PreToolUse && hooks.startkit.PostToolUse && hooks.startkit.Stop),
    JSON.stringify(hooks));

  git(rod, "config", "core.hooksPath", ".githooks");
  r = koer("node", [TJEK, rod], { env });
  tjek(`gemini (${sprog}): tjek-opsaetning.js er grøn`, r.kode === 0, r.ud + r.fejl);

  // ---- vagt.js med Antigravitys camelCase JSON ----
  const vagt = (obj) => koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify(obj), env });
  const sid = `agy-chat-${sprog}-${Date.now()}`;

  r = vagt({ conversationId: sid, cwd: rod, hookEventName: "PreToolUse", toolCall: { id: "1", name: "run_command", args: { CommandLine: "echo hej" } } });
  tjek(`gemini (${sprog}): vagt tillader sikker kommando med decision=allow`, r.kode === 0 && JSON.parse(r.ud).decision === "allow", r.ud + r.fejl);

  r = vagt({ conversationId: sid, cwd: rod, hookEventName: "PreToolUse", toolCall: { id: "2", name: "run_command", args: { CommandLine: "git commit --no-verify -m x" } } });
  tjek(`gemini (${sprog}): vagt afviser --no-verify med decision=deny`, r.kode === 0 && JSON.parse(r.ud).decision === "deny" && JSON.parse(r.ud).reason.length > 10, r.ud + r.fejl);

  r = vagt({ conversationId: sid, cwd: rod, hookEventName: "PreToolUse", toolCall: { id: "3", name: "read_file", args: { Path: path.join(rod, ".env") } } });
  tjek(`gemini (${sprog}): vagt afviser read_file på .env`, r.kode === 0 && JSON.parse(r.ud).decision === "deny", r.ud + r.fejl);

  r = vagt({ conversationId: sid, cwd: rod, hookEventName: "PreToolUse", toolCall: { id: "4", name: "write_file", args: { Path: path.join(rod, ".agents", "hooks.json"), Content: "{}" } } });
  tjek(`gemini (${sprog}): vagt beskytter .agents/hooks.json`, r.kode === 0 && JSON.parse(r.ud).decision === "deny", r.ud + r.fejl);

  r = vagt({ conversationId: sid, cwd: rod, hookEventName: "PreToolUse", toolCall: { id: "5", name: "edit_file", args: { Path: path.join(rod, "app.js"), Replacement: `const k = "${falskNoegle()}";` } } });
  tjek(`gemini (${sprog}): vagt afviser nøgle i edit_file`, r.kode === 0 && JSON.parse(r.ud).decision === "deny", r.ud + r.fejl);

  // ---- start.js (SessionStart) ----
  r = koer("node", [path.join(rod, "scripts", "startkit", "start.js")], { cwd: rod, input: JSON.stringify({ conversationId: sid, cwd: rod }), env });
  const startSvar = JSON.parse(r.ud || "{}");
  tjek(`gemini (${sprog}): start.js returnerer injectSteps med STATUS.md`,
    r.kode === 0 && Array.isArray(startSvar.injectSteps) && /STATUS\.md/.test(startSvar.injectSteps[0].systemMessage.systemMessage), r.ud + r.fejl);

  // ---- fejl.js (PostToolUse) + loop-stop ----
  const fejl = (obj) => koer("node", [path.join(rod, "scripts", "startkit", "fejl.js")], { cwd: rod, input: JSON.stringify(obj), env });
  // Grøn kommando (ingen error) må ikke tælles
  r = fejl({ conversationId: sid, cwd: rod, toolCall: { name: "run_command", args: { CommandLine: "npm test" } }, error: "" });
  tjek(`gemini (${sprog}): fejl.js svarer {} ved grøn kommando`, r.kode === 0 && r.ud.trim() === "{}", r.ud + r.fejl);
  // To ens fejl udløser loop-stop i vagt.js
  fejl({ conversationId: sid, cwd: rod, toolCall: { name: "run_command", args: { CommandLine: "npm test" } }, error: "exit status 1\nError: boom" });
  fejl({ conversationId: sid, cwd: rod, toolCall: { name: "run_command", args: { CommandLine: "npm test" } }, error: "exit status 1\nError: boom" });
  r = vagt({ conversationId: sid, cwd: rod, toolCall: { name: "run_command", args: { CommandLine: "npm test" } } });
  tjek(`gemini (${sprog}): loop-stop afviser efter 2 ens fejl i PostToolUse`, r.kode === 0 && JSON.parse(r.ud).decision === "deny" && /boom/.test(JSON.parse(r.ud).reason), r.ud + r.fejl);

  // ---- faerdig.js (Stop) ----
  skriv(rod, "kode.js", "console.log(1);\n");
  const faerdig = (obj) => koer("node", [path.join(rod, "scripts", "startkit", "faerdig.js")], { cwd: rod, input: JSON.stringify(obj), env });
  r = faerdig({ conversationId: sid, cwd: rod, continuationActive: false });
  tjek(`gemini (${sprog}): faerdig.js blokerer med decision=continue uden bevis`, r.kode === 0 && JSON.parse(r.ud).decision === "continue", r.ud + r.fejl);
  r = faerdig({ conversationId: sid, cwd: rod, continuationActive: true });
  tjek(`gemini (${sprog}): faerdig.js tillader stop med {} når continuationActive=true`, r.kode === 0 && r.ud.trim() === "{}", r.ud + r.fejl);

  // ---- pre-commit længdelås på GEMINI.md ----
  git(rod, "add", ".");
  r = koer("git", ["commit", "-q", "-m", "start"], { cwd: rod });
  tjek(`gemini (${sprog}): første commit går igennem`, r.kode === 0, r.ud + r.fejl);
  skriv(rod, "GEMINI.md", laes(rod, "GEMINI.md") + "\n" + Array.from({ length: 65 }, (_, i) => `- regel ${i}`).join("\n") + "\n");
  git(rod, "add", "GEMINI.md");
  r = koer("git", ["commit", "-q", "-m", "lang"], { cwd: rod });
  tjek(`gemini (${sprog}): længdelås stopper for lang GEMINI.md`, r.kode !== 0 && /GEMINI\.md/.test(r.fejl), r.ud + r.fejl);
}

// ---- installation på Windows (install.ps1 -Vaerktoej gemini) ----
if (process.platform === "win32") {
  for (const [sprog, svar] of [["da", "j\n"], ["en", "y\n"]]) {
    const maal = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-agy-inst-")), "startkit");
    r = koer("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROD, "install.ps1"), "-Til", maal, "-Sprog", sprog, "-Vaerktoej", "gemini"], { input: svar });
    tjek(`install.ps1 gemini (${sprog}): kopierer SKILL.md og vaerktoej.json`,
      r.kode === 0
      && fs.existsSync(path.join(maal, "SKILL.md"))
      && /Antigravity/.test(fs.readFileSync(path.join(maal, "SKILL.md"), "utf8"))
      && JSON.parse(fs.readFileSync(path.join(maal, "scripts", "projekt", "vaerktoej.json"), "utf8")).vaerktoej === "gemini"
      && (sprog === "da" || JSON.parse(fs.readFileSync(path.join(maal, "scripts", "projekt", "sprog.json"), "utf8")).sprog === "en"),
      r.ud + r.fejl);
  }
}

slut("gemini");
