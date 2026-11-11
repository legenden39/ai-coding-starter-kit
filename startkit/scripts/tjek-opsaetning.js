// Tjekker, at fundamentet faktisk er sat op i projektet. Ser på virkeligheden, ikke på en statusfil.
//
//   node tjek-opsaetning.js <projektmappe>
//
// Det her kan scriptet IKKE se: om hooks er godkendt i Codex (/hooks), og om de faktisk bliver kørt.
// Det prøves i startkittets fase 7.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(process.argv[2] || process.cwd());
const p = (...dele) => path.join(root, ...dele);
const laes = (rel) => { try { return fs.readFileSync(p(rel), "utf8"); } catch { return null; } };
const git = (...args) => { try { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return null; } };

const tjek = [];
const t = (navn, ok, hjaelp) => tjek.push({ navn, ok: !!ok, hjaelp });

t("Mappen er et git-projekt", git("rev-parse", "--is-inside-work-tree") === "true", "Kør: git init");
t("Node er version 18 eller nyere", Number(process.versions.node.split(".")[0]) >= 18, "Installer Node LTS fra nodejs.org");

const agents = laes("AGENTS.md");
t("AGENTS.md findes og har startkittets blok", agents && agents.includes("<!-- startkit:start") && agents.includes("<!-- startkit:slut -->"), "Kør opsætningen igen");
t("AGENTS.md er højst 80 linjer", agents && agents.split("\n").length <= 80, "Flyt lange afsnit til docs/");
t("STATUS.md findes", laes("STATUS.md") !== null, "Kør opsætningen igen");
t("docs/gentagne-fejl.md findes", laes("docs/gentagne-fejl.md") !== null, "Kør opsætningen igen");

for (const fil of ["regler.js", "tilstand.js", "vagt.js", "faerdig.js", "bevis.js", "overblik.js", "forbrug-gem.js"]) {
  t(`scripts/startkit/${fil} findes`, laes(`scripts/startkit/${fil}`) !== null, "Kør opsætningen igen");
}

t("Genvejen til overblikket findes (overblik.cmd)", laes("overblik.cmd") !== null, "Kør opsætningen igen");

let hooks = null;
try { hooks = JSON.parse(laes(".codex/hooks.json")); } catch { /* håndteres nedenfor */ }
const kommandoer = (event) => ((hooks && hooks.hooks && hooks.hooks[event]) || []).flatMap((g) => (g.hooks || []).map((h) => String(h.command || "")));
const peger = (event, fil) => kommandoer(event).some((k) => { const m = k.match(/"([^"]+)"/); return m && m[1].endsWith(`scripts/startkit/${fil}`) && fs.existsSync(m[1]); });
t(".codex/hooks.json kan læses", hooks, "Filen mangler eller er ikke gyldig JSON. Kør opsætningen igen");
t("Vagten er koblet til og peger på en fil, der findes", peger("PreToolUse", "vagt.js"), "Er mappen flyttet? Kør opsætningen igen");
t("Færdig-tjekket er koblet til og peger på en fil, der findes", peger("Stop", "faerdig.js"), "Er mappen flyttet? Kør opsætningen igen");

t("Nøgletjekket findes (.githooks/pre-commit)", laes(".githooks/pre-commit") !== null, "Kør opsætningen igen");
t("Nøgletjekket er tændt (core.hooksPath)", (git("config", "core.hooksPath") || "").replace(/\/$/, "") === ".githooks", "Kør: git config core.hooksPath .githooks");

let config = null;
try { config = JSON.parse(laes(".startkit/config.json")); } catch { /* håndteres nedenfor */ }
t(".startkit/config.json kan læses", config, "Kør opsætningen igen");
t("Der er mindst én tjek-kommando (ellers afprøver beviset ingenting)", config && Array.isArray(config.tjek) && config.tjek.length > 0, "Tilføj fx \"npm test\" under tjek i .startkit/config.json");

const gi = laes(".gitignore") || "";
t(".env er holdt ude af git (.gitignore)", /^\.env$/m.test(gi), "Kør opsætningen igen");

// Prøv vagten for alvor: send den et forbudt kald, og se, at den afviser.
let vagtVirker = false;
try {
  const ud = execFileSync("node", [p("scripts", "startkit", "vagt.js")], { cwd: root, encoding: "utf8", input: JSON.stringify({ tool_name: "Bash", tool_input: { command: "git commit --no-verify -m x" }, cwd: root }) });
  vagtVirker = JSON.parse(ud).hookSpecificOutput.permissionDecision === "deny";
} catch { /* vagtVirker forbliver false */ }
t("Vagten afviser et forbudt kald, når den køres direkte", vagtVirker, "Kør opsætningen igen, og tjek at Node virker");

for (const x of tjek) console.log(`${x.ok ? "✅" : "❌"} ${x.navn}${x.ok ? "" : `  →  ${x.hjaelp}`}`);
const roede = tjek.filter((x) => !x.ok).length;
console.log(roede ? `\n${roede} ting mangler.` : "\nAlt er sat op.");
console.log("Husk: om hooks er godkendt i Codex (/hooks) kan dette tjek ikke se. Det prøves ved at lade Codex forsøge et forbudt kald.");
process.exit(roede ? 1 : 0);
