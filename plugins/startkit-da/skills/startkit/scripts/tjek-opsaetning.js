// Tjekker, at fundamentet faktisk er sat op i projektet. Ser på virkeligheden, ikke på en statusfil.
//
//   node tjek-opsaetning.js <projektmappe>
//
// Det her kan scriptet IKKE se: om hooks er godkendt (Codex) eller indlæst (Claude Code), og om de faktisk bliver kørt.
// Det prøves i startkittets fase 7.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { t: tekst, fil, laesConfig, vt, vaerktoej, FORBUDSREGLER } = require("./projekt/tekster");
const { laesPuls } = require("./projekt/tilstand");

const root = path.resolve(process.argv[2] || process.cwd());
const p = (...dele) => path.join(root, ...dele);
const laes = (rel) => { try { return fs.readFileSync(p(rel), "utf8"); } catch { return null; } };
const git = (...args) => { try { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return null; } };

const tjek = [];
const igen = tekst("tj.igen");
const t = (navn, ok, hjaelp) => tjek.push({ navn, ok: !!ok, hjaelp });

t(tekst("tj.git"), git("rev-parse", "--is-inside-work-tree") === "true", tekst("tj.git.h"));
t(tekst("tj.node"), Number(process.versions.node.split(".")[0]) >= 18, tekst("tj.node.h"));

const agents = laes(vt("regelfil"));
t(tekst("tj.agents"), agents && agents.includes("<!-- startkit:start") && agents.includes("<!-- startkit:slut -->"), igen);
t(tekst("tj.agents.kort"), agents && agents.split("\n").length <= 80, tekst("tj.agents.kort.h"));
t(tekst("tj.findes", { fil: "STATUS.md" }), laes("STATUS.md") !== null, igen);
t(tekst("tj.findes", { fil: fil("fejl") }), laes(fil("fejl")) !== null, igen);

for (const navn of ["regler.js", "tekster.js", "tilstand.js", "vagt.js", "faerdig.js", "bevis.js", "overblik.js", "forbrug-gem.js", "gemmepunkt.js", "fortryd.js", "start.js", "del-tjek.js"]) {
  t(tekst("tj.findes", { fil: `scripts/startkit/${navn}` }), laes(`scripts/startkit/${navn}`) !== null, igen);
}

t(tekst("tj.genvej", { fil: fil("genvej") }), laes(fil("genvej")) !== null, igen);

let hooks = null;
try { hooks = JSON.parse(laes(vt("hookfil"))); } catch { /* håndteres nedenfor */ }
const kommandoer = (event) => ((hooks && hooks.hooks && hooks.hooks[event]) || []).flatMap((g) => (g.hooks || []).map((h) => String(h.command || "")));
const peger = (event, fil) => kommandoer(event).some((k) => { const m = k.match(/"([^"]+)"/); return m && m[1].endsWith(`scripts/startkit/${fil}`) && fs.existsSync(m[1]); });
t(tekst("tj.hooks"), hooks, tekst("tj.hooks.h"));
t(tekst("tj.vagt"), peger("PreToolUse", "vagt.js"), tekst("tj.flyttet"));
t(tekst("tj.faerdig"), peger("Stop", "faerdig.js"), tekst("tj.flyttet"));

if (vt("starthook")) t(tekst("tj.start"), peger("SessionStart", "start.js"), tekst("tj.flyttet"));
t(tekst("tj.findes", { fil: fil("fortryd") }), laes(fil("fortryd")) !== null, igen);
if (vaerktoej() === "claude") {
  const deny = (hooks && hooks.permissions && hooks.permissions.deny) || [];
  t(tekst("tj.deny"), FORBUDSREGLER.every((r) => deny.includes(r)), igen);
}

t(tekst("tj.noegletjek"), laes(".githooks/pre-commit") !== null, igen);
t(tekst("tj.taendt"), (git("config", "core.hooksPath") || "").replace(/\/$/, "") === ".githooks", tekst("tj.taendt.h"));

let config = null;
try { config = JSON.parse(laes(".startkit/config.json")); } catch { /* håndteres nedenfor */ }
t(tekst("tj.config"), config, igen);
const kommandoListe = laesConfig(config).tjek;
t(tekst("tj.kommando"), Array.isArray(kommandoListe) && kommandoListe.length > 0, tekst("tj.kommando.h"));

const gi = laes(".gitignore") || "";
t(tekst("tj.env"), /^\.env$/m.test(gi), igen);

// Prøv vagten for alvor: send den et forbudt kald, og se, at den afviser.
let vagtVirker = false;
try {
  const ud = execFileSync("node", [p("scripts", "startkit", "vagt.js")], { cwd: root, encoding: "utf8", input: JSON.stringify({ tool_name: "Bash", tool_input: { command: "git commit --no-verify -m x" }, cwd: root }) });
  vagtVirker = JSON.parse(ud).hookSpecificOutput.permissionDecision === "deny";
} catch { /* vagtVirker forbliver false */ }
t(tekst("tj.afviser"), vagtVirker, tekst("tj.afviser.h"));

for (const x of tjek) console.log(`${x.ok ? "✅" : "❌"} ${x.navn}${x.ok ? "" : `  →  ${x.hjaelp}`}`);

// Pulsen: har AI-værktøjet faktisk kaldt vagten? Køres dette tjek inde i en chat, er kommandoen selv et værktøjskald,
// så vagten skal lige have slået pulsen. Tæller ikke som en mangel, for uden for en chat kan det ikke afgøres.
const puls = laesPuls(root);
const siden = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return s < 90 ? tekst("tj.tid.sek", { n: s }) : s < 5400 ? tekst("tj.tid.min", { n: Math.round(s / 60) }) : s < 129600 ? tekst("tj.tid.timer", { n: Math.round(s / 3600) }) : tekst("tj.tid.dage", { n: Math.round(s / 86400) }); };
if (!puls) console.log(tekst("tj.puls.nej", { fil: fil("hvorfor") }));
else { const ms = Date.now() - Date.parse(puls.at); console.log(tekst(ms < 10 * 60 * 1000 ? "tj.puls.ja" : "tj.puls.gammel", { tid: siden(ms), fil: fil("hvorfor") })); }
const roede = tjek.filter((x) => !x.ok).length;
console.log(roede ? tekst("tj.mangler", { antal: roede }) : tekst("tj.alt"));
console.log(tekst("tj.husk"));
process.exit(roede ? 1 : 0);
