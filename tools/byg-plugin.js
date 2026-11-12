// Pakker udgaven til Claude Code som to plugins: plugins/startkit (engelsk) og plugins/startkit-da (dansk).
//
//   node tools/byg-plugin.js          skriver mapperne
//   node tools/byg-plugin.js --tjek   skriver intet; fejler, hvis mapperne ikke passer til kilden
//
// Hvorfor: et plugin kan installeres med to kommandoer inde i Claude Code, uden at hente en ZIP-fil og dobbeltklikke.
// Lageret er selv kataloget (.claude-plugin/marketplace.json), så der skal ikke søges om noget noget sted.
//
// Et plugin kan ikke køre et installationsprogram, så det, install.ps1 ellers gør (lægge den rigtige SKILL.md øverst
// og skrive sprog.json og vaerktoej.json), er gjort på forhånd her. Hvert plugin rummer kun det, dets sprog skal bruge.
// Indholdet er en kopi af startkit/ og må ikke rettes i hånden: ret kilden, og kør dette program igen.
//
// Pluginnet sætter ikke selv hooks op. Det gør kittets opsætning i det enkelte projekt, efter at personen har sagt ja,
// præcis som ved den almindelige installation.
const fs = require("fs");
const path = require("path");

const ROD = path.join(__dirname, "..");
const KIT = path.join(ROD, "startkit");
const lf = (s) => String(s).replace(/\r\n/g, "\n");

const PLUGINS = [
  {
    navn: "startkit", sprog: "en",
    beskrivelse: "A free starter kit for people who are new to building with AI. It interviews you and sets up a foundation in your project: short rules, a guard, a done-check, a key check and an overview page. Runs only on your own computer and sends nothing anywhere. Start it with /startkit.",
    skill: "claude/en/SKILL.claude.en.md",
    mapper: ["assets", "en/assets", "claude/en/assets", "claude/en/references", "scripts"],
  },
  {
    navn: "startkit-da", sprog: "da",
    beskrivelse: "Et gratis startkit til dig, der er ny til at bygge med AI. Det interviewer dig og sætter et fundament op i dit projekt: korte regler, en vagt, et færdig-tjek, et nøgletjek og en overbliksside. Kører kun på din egen computer og sender ingenting nogen steder hen. Start det med /startkit.",
    skill: "claude/SKILL.claude.md",
    mapper: ["assets", "claude/assets", "claude/references", "scripts"],
  },
];
const KATALOG = "ai-coding-starter-kit";
const EJER = "legenden39";

function alleFiler(mappe, rel = "") {
  const ud = [];
  for (const e of fs.readdirSync(path.join(mappe, rel), { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) ud.push(...alleFiler(mappe, r)); else ud.push(r);
  }
  return ud;
}

// Regner ud, hvilke filer der skal ligge hvor. Skriver intet selv. Stier er i forhold til lagerets rod.
function byg() {
  const filer = {};
  const json = (x) => JSON.stringify(x, null, 2) + "\n";
  for (const p of PLUGINS) {
    const rod = `plugins/${p.navn}`, skill = `${rod}/skills/startkit`;
    filer[`${rod}/.claude-plugin/plugin.json`] = json({
      name: p.navn, description: p.beskrivelse, author: { name: EJER },
      homepage: `https://github.com/${EJER}/${KATALOG}`, repository: `https://github.com/${EJER}/${KATALOG}`, license: "MIT",
      keywords: ["beginner", "starter-kit", "guardrails", "hooks", "safety"],
    });
    filer[`${rod}/LICENSE`] = lf(fs.readFileSync(path.join(ROD, "LICENSE"), "utf8"));
    filer[`${skill}/SKILL.md`] = lf(fs.readFileSync(path.join(KIT, p.skill), "utf8"));
    filer[`${skill}/VERSION`] = lf(fs.readFileSync(path.join(KIT, "VERSION"), "utf8"));
    for (const m of p.mapper) for (const f of alleFiler(path.join(KIT, m))) {
      if (/(^|\/)(sprog|vaerktoej)\.json$/.test(f)) continue; // skrives herunder
      filer[`${skill}/${m}/${f}`] = lf(fs.readFileSync(path.join(KIT, m, f), "utf8"));
    }
    filer[`${skill}/scripts/projekt/vaerktoej.json`] = '{"vaerktoej": "claude"}\n';
    if (p.sprog === "en") filer[`${skill}/scripts/projekt/sprog.json`] = '{"sprog": "en"}\n';
  }
  filer[".claude-plugin/marketplace.json"] = json({
    name: KATALOG, owner: { name: EJER },
    metadata: { description: "AI Coding Starter Kit for Claude Code, in English (startkit) and Danish (startkit-da)." },
    plugins: PLUGINS.map((p) => ({ name: p.navn, source: `./plugins/${p.navn}`, description: p.beskrivelse })),
  });
  return filer;
}

function main() {
  const tjek = process.argv.includes("--tjek");
  const filer = byg();
  const forkerte = [];
  for (const [rel, indhold] of Object.entries(filer)) {
    let nu = null;
    try { nu = lf(fs.readFileSync(path.join(ROD, rel), "utf8")); } catch { /* findes ikke endnu */ }
    if (nu === indhold) continue;
    forkerte.push(rel);
    if (!tjek) { fs.mkdirSync(path.dirname(path.join(ROD, rel)), { recursive: true }); fs.writeFileSync(path.join(ROD, rel), indhold); }
  }
  const gamle = fs.existsSync(path.join(ROD, "plugins")) ? alleFiler(path.join(ROD, "plugins")).map((f) => `plugins/${f}`).filter((f) => !(f in filer)) : [];
  if (!tjek) for (const g of gamle) fs.unlinkSync(path.join(ROD, g));
  if (tjek && (forkerte.length || gamle.length)) {
    console.error("Plugin-mapperne passer ikke til kilden. Kør: node tools/byg-plugin.js\n" + [...forkerte, ...gamle].slice(0, 20).map((f) => "  " + f).join("\n"));
    return 1;
  }
  const antal = Object.keys(filer).length;
  console.log(tjek ? `Plugin-mapperne passer til kilden (${antal} filer).` : `Skrev ${forkerte.length} af ${antal} filer${gamle.length ? `, og slettede ${gamle.length} forældede` : ""}.`);
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { byg, PLUGINS, KATALOG, EJER };
