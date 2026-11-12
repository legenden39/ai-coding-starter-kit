// Overblik: en lille side, der viser, hvor projektet står lige nu. Kun læsning.
//
//   node scripts/startkit/overblik.js      (åbn adressen, der skrives)
//
//  * Læser STATUS.md, git (gren, ændringer, seneste commits), beviset, listen over gentagne fejl,
//    modelguiden og de forbrugstal, du selv har gemt med forbrug-gem.js.
//  * Viser kun målte fakta, aldrig gæt. Skriver aldrig til projektet. Ingen internet, ingen nøgler.
//  * Lytter kun på din egen computer (127.0.0.1).
//
// Dette er udgangspunktet. Siden bygges videre efter dine egne ønsker (se startkittets fase 8).
const http = require("http");
const fs = require("fs");
const path = require("path");
const { git, rod, laesPuls } = require("./tilstand");
const gemmepunkt = require("./gemmepunkt");
const { t, fil, laesConfig } = require("./tekster");

const HOST = "127.0.0.1";
const PORT = Number(process.env.OVERBLIK_PORT) || 4311;
const REPO = rod(process.cwd()) || process.cwd();

const laes = (rel) => { try { return fs.readFileSync(path.join(REPO, rel), "utf8"); } catch { return null; } };
const json = (rel) => { try { return JSON.parse(laes(rel)); } catch { return null; } };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tid = (iso) => { const d = new Date(iso); return isNaN(d) ? t("ov.ukendt.tid") : d.toLocaleString(t("ov.locale")); };
const liste = (xs, tom) => (xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="lille">${esc(tom)}</p>`);

// STATUS.md deles i afsnit efter "## Overskrift".
function status() {
  const tekst = laes("STATUS.md");
  if (!tekst) return `<p class="lille">${t("ov.ingen.status")}</p>`;
  const afsnit = tekst.split(/^## /m).slice(1).map((a) => { const [h, ...rest] = a.split("\n"); return { h: h.trim(), linjer: rest.map((l) => l.trim()).filter((l) => l && !l.startsWith("<!--")) }; });
  if (!afsnit.length) return `<pre>${esc(tekst.slice(0, 2000))}</pre>`;
  return afsnit.map((a) => `<h3>${esc(a.h)}</h3>${liste(a.linjer.map((l) => l.replace(/^[-*] /, "")), t("ov.intet.skrevet"))}`).join("");
}

function bevis() {
  const b = json(".startkit/bevis.json");
  if (!b) return `<p class="lille">${t("ov.intet.bevis")}</p>`;
  const farve = t(b.ok ? (b.ingenTjek ? "ov.gult" : "ov.groent") : "ov.roedt");
  return `<p>${t("ov.seneste.bevis")} <b>${esc(farve)}</b> <span class="lille">(${esc(tid(b.at))})</span></p>${liste((b.resultater || []).map((x) => `${x.ok ? "✅" : "❌"} ${x.kommando}`), "")}`;
}

function gemmepunkter() {
  const alle = gemmepunkt.liste(REPO);
  return `<p class="lille">${alle.length ? t("ov.gp.ja", { tid: esc(tid(alle[0].at)), antal: alle.length }) : t("ov.gp.nej")}</p>`;
}

// Har AI-værktøjet faktisk kaldt vagten? (Se tilstand.js: pulsen.)
function puls() {
  const p = laesPuls(REPO);
  return p ? `<p class="lille">${t("ov.puls.ja", { tid: esc(tid(p.at)) })}</p>` : `<p class="advarsel">${esc(t("ov.puls.nej"))}</p>`;
}

function forbrug(graense) {
  const f = json(".startkit/forbrug.json");
  if (!f) return `<p class="lille">${t("ov.ingen.tal")}</p>`;
  const gammel = Date.now() - Date.parse(f.opdateret) > 6 * 3600 * 1000;
  const linje = (navn, p) => (typeof p === "number" ? `<li>${navn}: <b>${p} %</b>${p >= graense ? ` <span class="roed">${t("ov.over.graense", { graense })}</span>` : ""}</li>` : "");
  return `<ul>${linje(t("ov.5t"), f.femTimer)}${linje(t("ov.uge"), f.uge)}</ul><p class="lille">${t("ov.gemt", { tid: esc(tid(f.opdateret)) })}${gammel ? t("ov.gamle.tal") : ""}</p>`;
}

function side() {
  const erGit = git(REPO, "rev-parse", "--is-inside-work-tree") === "true";
  const gren = erGit ? git(REPO, "branch", "--show-current") || t("ov.ingen.gren") : null;
  const aendret = erGit ? (git(REPO, "-c", "core.quotepath=off", "status", "--short") || "").split("\n").filter(Boolean) : [];
  const log = erGit ? (git(REPO, "log", "-5", "--format=%h %s (%cr)") || "").split("\n").filter(Boolean) : [];
  const hookTil = erGit && (git(REPO, "config", "core.hooksPath") || "").replace(/\/$/, "") === ".githooks";
  const fejl = laes(fil("fejl"));
  const raekker = fejl ? fejl.split("\n").filter((l) => /^\| \d{4}-\d{2}-\d{2} /.test(l)) : [];
  const ulaast = raekker.filter((l) => /\|\s*(nej|tekstregel|no|text rule)?\s*\|\s*$/i.test(l)).length;
  const config = laesConfig(json(".startkit/config.json"));
  const graense = Number(config.graense_procent) || 85;
  const guide = Array.isArray(config.modelguide) ? config.modelguide : [];

  return `<!doctype html><html lang="${t("ov.lang")}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15"><title>${t("ov.titel")}</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:780px;margin:0 auto;padding:16px;background:#fafafa;color:#222}
h1{font-size:1.4rem}h2{font-size:1.05rem;margin:1.4rem 0 .3rem}h3{font-size:.95rem;margin:.8rem 0 0}.kort{background:#fff;border:1px solid #ddd;border-radius:8px;padding:6px 14px;margin:8px 0}
code,pre{background:#eee;padding:1px 4px;border-radius:3px}ul{margin:.3rem 0;padding-left:1.2rem}.lille{color:#666;font-size:.9rem}.roed{color:#b00020}
.advarsel{background:#fff3cd;border:1px solid #e0c060;padding:8px 14px;border-radius:8px}
@media(prefers-color-scheme:dark){body{background:#181818;color:#eee}.kort{background:#222;border-color:#444}code,pre{background:#333}.lille{color:#aaa}.roed{color:#ff8a80}.advarsel{background:#4a3d10;border-color:#8a7020}}</style></head><body>
<h1>${t("ov.titel")}: ${esc(path.basename(REPO))}</h1><p class="lille">${t("ov.opdaterer")}</p>
${erGit ? "" : `<p class="advarsel">${t("ov.ikke.git.endnu")}</p>`}
${erGit && !hookTil ? `<p class="advarsel">${t("ov.hook.fra")}</p>` : ""}
<h2>${t("ov.h.hvor")}</h2><div class="kort">${status()}</div>
<h2>${t("ov.h.aendringer")}</h2><div class="kort">${erGit ? `<p>${t("ov.gren")} <b>${esc(gren)}</b></p>${liste(aendret, t("ov.alt.gemt"))}${gemmepunkter()}` : `<p class="lille">${t("ov.ikke.git")}</p>`}</div>
<h2>${t("ov.h.seneste")}</h2><div class="kort">${liste(log, t("ov.ingen.commits"))}</div>
<h2>${t("ov.h.virker")}</h2><div class="kort">${bevis()}${puls()}</div>
<h2>${t("ov.h.fejl")}</h2><div class="kort"><p>${fejl === null ? t("ov.ingen.liste") : `${t("ov.fejl.antal", { antal: raekker.length })}${raekker.length ? t("ov.fejl.ulaast", { ulaast }) : ""}.`}</p></div>
<h2>${t("ov.h.model")}</h2><div class="kort">${liste(guide, t("ov.ingen.guide"))}</div>
<h2>${t("ov.h.forbrug")}</h2><div class="kort">${forbrug(graense)}</div>
</body></html>`;
}

if (require.main === module) {
  const server = http.createServer((req, res) => {
    const vaert = String(req.headers.host || "").split(":")[0];
    if (vaert !== "127.0.0.1" && vaert !== "localhost") { res.writeHead(403); return res.end(t("ov.forbudt")); }
    if (req.method !== "GET" || req.url.split("?")[0] !== "/") { res.writeHead(404); return res.end(t("ov.ikke.fundet")); }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(side());
  });
  // --aabn (eller --open): åbn siden i browseren (bruges af genvejen overblik.cmd). Fejler det, står adressen stadig på skærmen.
  const adresse = `http://${HOST}:${PORT}`;
  const aabn = () => {
    if (!process.argv.includes("--aabn") && !process.argv.includes("--open")) return;
    const { spawn } = require("child_process");
    const [program, args] = process.platform === "win32" ? ["cmd", ["/c", "start", "", adresse]] : process.platform === "darwin" ? ["open", [adresse]] : ["xdg-open", [adresse]];
    try { spawn(program, args, { stdio: "ignore", detached: true }).on("error", () => {}).unref(); } catch { /* adressen står på skærmen */ }
  };
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") { console.error(t("ov.port", { port: PORT, adresse })); aabn(); }
    else console.error(e.message);
    process.exit(1);
  });
  server.listen(PORT, HOST, () => { console.log(t("ov.koerer", { adresse })); aabn(); });
}

module.exports = { side };
