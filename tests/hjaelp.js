// Fælles hjælp til testene. Ingen pakker; kun Node og git.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const KIT = path.join(__dirname, "..", "startkit");
let antal = 0, fejl = 0;

function tjek(navn, betingelse, detalje) {
  antal++;
  if (betingelse) return;
  fejl++;
  console.error(`  ❌ ${navn}${detalje ? `\n     ${String(detalje).slice(0, 600)}` : ""}`);
}
function slut(navn) {
  console.log(`${fejl ? "❌" : "✅"} ${navn}: ${antal - fejl}/${antal} tjek`);
  process.exit(fejl ? 1 : 0);
}

// En tom projektmappe med git, i en sti med mellemrum og æ (det, der oftest går galt på Windows).
function nytProjekt() {
  const rod = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "startkit-test-")), "mit prøve projekt");
  fs.mkdirSync(rod, { recursive: true });
  git(rod, "init", "-q");
  git(rod, "config", "user.email", "test@example.com");
  git(rod, "config", "user.name", "Test");
  git(rod, "config", "commit.gpgsign", "false");
  return rod;
}
function git(cwd, ...args) { return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
function koer(program, args, { cwd, input } = {}) {
  const r = spawnSync(program, args, { cwd, input, encoding: "utf8" });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
}
function skriv(rod, rel, indhold) {
  fs.mkdirSync(path.dirname(path.join(rod, rel)), { recursive: true });
  fs.writeFileSync(path.join(rod, rel), indhold);
}
function kopierScripts(rod) {
  const fra = path.join(KIT, "scripts", "projekt");
  for (const f of fs.readdirSync(fra)) skriv(rod, `scripts/startkit/${f}`, fs.readFileSync(path.join(fra, f)));
}
// En falsk nøgle, bygget af stykker, så den ikke står som ét ord i nogen fil.
const falskNoegle = () => "sk-" + "ant-" + "a1B2".repeat(8);

module.exports = { KIT, tjek, slut, nytProjekt, git, koer, skriv, kopierScripts, falskNoegle };
