// Sætter kittets hooks op på startkit-repoet selv, kun på din egen computer (intet af det kommer med i git).
//
//   node tools/hooks-lokalt.js           skriver opsætningen
//   node tools/hooks-lokalt.js --toer    viser kun, hvad der vil ske
//
// Hvad det giver: gemmepunkt i starten af hver chat og færdig-tjek, når AI'en vil stoppe (se docs/hooks-paa-kittet-selv.md).
// Hvad det ikke giver: vagtens afvisninger. Vagten kører i kun-registrér-tilstand, fordi dens egne filer er det, projektet bygger.
// Der laves ingen kopi af kittets scripts: hooks peger direkte på startkit/scripts/projekt/. Kun en lille omdirigering
// (scripts/startkit/bevis.js) lægges lokalt, fordi færdig-tjekkets besked nævner den sti. Den holdes uden for git.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const toer = process.argv.includes("--toer") || process.argv.includes("--dry-run");
const rod = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: __dirname, encoding: "utf8" }).trim();
const p = (...d) => path.join(rod, ...d);
const slash = (s) => s.replace(/\\/g, "/");
const laesJson = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { if (e.code === "ENOENT") return {}; throw new Error(`${f} er ikke gyldig JSON. Ret eller slet den, og kør igen.`); } };
const skriv = (f, indhold) => { console.log((toer ? "vil skrive " : "skriver ") + path.relative(rod, f)); if (!toer) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, indhold); } };

// 1. Indstillinger: kun-registrér-kontakten og de to kommandoer, færdig-tjekket kræver et grønt bevis fra.
const config = laesJson(p(".startkit", "config.json"));
config.vagt = "kun-registrer";
if (!Array.isArray(config.tjek) || !config.tjek.length) config.tjek = ["node tools/byg.js --tjek", "node tests/run.js"];
skriv(p(".startkit", "config.json"), JSON.stringify(config, null, 2) + "\n");

// 2. Omdirigering, så "node scripts/startkit/bevis.js" virker uden en kopi af koden.
skriv(p("scripts", "startkit", "bevis.js"), 'require("../../startkit/scripts/projekt/bevis.js");\n');
const exclude = execFileSync("git", ["rev-parse", "--git-path", "info/exclude"], { cwd: rod, encoding: "utf8" }).trim();
const excludeFil = path.resolve(rod, exclude);
const har = fs.existsSync(excludeFil) ? fs.readFileSync(excludeFil, "utf8") : "";
if (!/^\/scripts\/startkit\/$/m.test(har)) skriv(excludeFil, har.replace(/\s*$/, "") + (har ? "\n" : "") + "/scripts/startkit/\n");

// 3. Hooks i .claude/settings.local.json (ligger uden for git). Kun kittets egne poster røres.
const sti = (fil) => `STARTKIT_VAERKTOEJ=claude node "${slash(p("startkit", "scripts", "projekt", fil))}"`;
const vores = { PreToolUse: { matcher: "Bash|PowerShell|Edit|Write|MultiEdit|NotebookEdit|Read|Grep", hooks: [{ type: "command", command: sti("vagt.js"), timeout: 30 }] }, Stop: { hooks: [{ type: "command", command: sti("faerdig.js"), timeout: 60 }] }, PostToolUseFailure: { matcher: "Bash|PowerShell", hooks: [{ type: "command", command: sti("fejl.js"), timeout: 15 }] } };
const erVores = (g) => Array.isArray(g && g.hooks) && g.hooks.some((h) => /startkit\/scripts\/projekt\/(vagt|faerdig|fejl)\.js/.test(slash(String((h && h.command) || ""))));
const settings = laesJson(p(".claude", "settings.local.json"));
settings.hooks = settings.hooks && typeof settings.hooks === "object" ? settings.hooks : {};
for (const [event, gruppe] of Object.entries(vores)) settings.hooks[event] = [...(Array.isArray(settings.hooks[event]) ? settings.hooks[event] : []).filter((g) => !erVores(g)), gruppe];
skriv(p(".claude", "settings.local.json"), JSON.stringify(settings, null, 2) + "\n");

console.log(toer ? "\nIntet er skrevet (--toer)." : "\nFærdig. Start en ny chat i projektet, så læses hooks ind. Se docs/hooks-paa-kittet-selv.md for at tjekke, at de kører.");
