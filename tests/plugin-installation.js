// Afprøver plugin-udgaven med det rigtige Claude Code:  node tests/plugin-installation.js
// Kræver, at kommandoen "claude" er installeret. Derfor kører den ikke sammen med de andre test (node tests/run.js),
// men for sig selv hos GitHub, på Windows og Linux. Den logger ikke ind og bruger ingen AI.
// Den tilføjer lageret som katalog, installerer begge plugins, og sætter et projekt op fra den installerede kopi.
// Claude Codes indstillinger lægges i en midlertidig mappe, så din egen opsætning ikke røres.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv } = require("./hjaelp");

const ROD = path.join(KIT, "..");
const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
const indstillinger = fs.mkdtempSync(path.join(os.tmpdir(), "startkit-claude-"));
const env = { ...process.env, CLAUDE_CONFIG_DIR: indstillinger };
delete env.STARTKIT_VAERKTOEJ; delete env.STARTKIT_SPROG;

// På Windows er "claude" en .cmd-fil, og den kan kun startes gennem en skal.
function claude(...args) {
  const r = spawnSync(`claude ${args.map((a) => `"${a}"`).join(" ")}`, { shell: true, encoding: "utf8", env, cwd: indstillinger, timeout: 180000 });
  return { kode: r.status, ud: (r.stdout || "") + (r.stderr || "") };
}
function node(program, ...args) {
  const r = spawnSync(process.execPath, [program, ...args], { encoding: "utf8", env });
  return { kode: r.status, ud: (r.stdout || "") + (r.stderr || "") };
}
// Alle filer i en mappe, med stier skrevet ens på Windows og Linux. Claude Codes egen mærkefil (.in_use) tælles ikke med.
function filer(mappe, under = "") {
  let ud = [];
  for (const x of fs.readdirSync(path.join(mappe, under), { withFileTypes: true })) {
    const rel = under ? `${under}/${x.name}` : x.name;
    if (x.isDirectory()) ud = ud.concat(filer(mappe, rel));
    else if (x.name !== ".in_use") ud.push(rel);
  }
  return ud.sort();
}

let r = claude("--version");
tjek("Claude Code er installeret", r.kode === 0 && /\d+\.\d+\.\d+/.test(r.ud), r.ud);
if (r.kode !== 0) slut("plugin-installation");
console.log(`  Claude Code ${r.ud.trim()} på ${process.platform}`);

r = claude("plugin", "marketplace", "add", ROD);
tjek("kataloget kan tilføjes", r.kode === 0, r.ud);

for (const [navn, sprog, profilFil, profil, forventet] of [
  ["startkit-da", "da", ".startkit/profil.json", laes(__dirname, "eksempel-profil.json"), /Sætter op i/],
  ["startkit", "en", ".startkit/profile.json", JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Explain along the way." }, check_commands: ["node -e \"process.exit(0)\""] }), /Setting up in/],
]) {
  r = claude("plugin", "install", `${navn}@ai-coding-starter-kit`);
  tjek(`${navn}: kan installeres`, r.kode === 0, r.ud);

  // Claude Code lægger en kopi i sin egen mappe, i en undermappe med et versionsnavn.
  const hylde = path.join(indstillinger, "plugins", "cache", "ai-coding-starter-kit", navn);
  const versioner = fs.existsSync(hylde) ? fs.readdirSync(hylde) : [];
  tjek(`${navn}: der ligger præcis én installeret kopi`, versioner.length === 1, versioner.join(", "));
  if (versioner.length !== 1) continue;
  const kopi = path.join(hylde, versioner[0]), kilde = path.join(ROD, "plugins", navn);

  const a = filer(kilde), b = filer(kopi);
  tjek(`${navn}: kopien har de samme filer som mappen i lageret`, JSON.stringify(a) === JSON.stringify(b), a.filter((f) => !b.includes(f)).concat(b.filter((f) => !a.includes(f))).join(", "));
  const forskellige = a.filter((f) => b.includes(f) && !fs.readFileSync(path.join(kilde, f)).equals(fs.readFileSync(path.join(kopi, f))));
  tjek(`${navn}: filerne har samme indhold`, forskellige.length === 0, forskellige.join(", "));

  r = claude("plugin", "details", `${navn}@ai-coding-starter-kit`);
  tjek(`${navn}: Claude Code finder én skill, og den hedder startkit`, r.kode === 0 && /Skills \(1\)\s+startkit/.test(r.ud), r.ud);

  // Det, /startkit ender med at gøre: sæt et projekt op med programmerne fra den installerede kopi.
  const sm = path.join(kopi, "skills", "startkit");
  const p = nytProjekt();
  skriv(p, profilFil, profil);
  r = node(path.join(sm, "scripts", "opsaet.js"), p);
  tjek(`${navn}: opsætningen fra den installerede kopi skriver Claude Codes filer på det rigtige sprog`, r.kode === 0 && forventet.test(r.ud) && laes(p, "CLAUDE.md") !== null && laes(p, ".claude/settings.local.json") !== null && laes(p, "AGENTS.md") === null && laes(p, sprog === "en" ? "overview.cmd" : "overblik.cmd") !== null, r.ud);
  git(p, "config", "core.hooksPath", ".githooks");
  r = node(path.join(sm, "scripts", "tjek-opsaetning.js"), p);
  tjek(`${navn}: tjekket af opsætningen fra den installerede kopi er grønt`, r.kode === 0 && !/❌/.test(r.ud), r.ud);
}

r = claude("plugin", "list");
tjek("begge plugins står som installeret og slået til", r.kode === 0 && /startkit-da@ai-coding-starter-kit/.test(r.ud) && /startkit@ai-coding-starter-kit/.test(r.ud) && !/disabled/i.test(r.ud), r.ud);

slut("plugin-installation");
