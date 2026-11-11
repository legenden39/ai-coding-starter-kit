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
const { git, rod } = require("./tilstand");

const HOST = "127.0.0.1";
const PORT = Number(process.env.OVERBLIK_PORT) || 4311;
const REPO = rod(process.cwd()) || process.cwd();

const laes = (rel) => { try { return fs.readFileSync(path.join(REPO, rel), "utf8"); } catch { return null; } };
const json = (rel) => { try { return JSON.parse(laes(rel)); } catch { return null; } };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tid = (iso) => { const d = new Date(iso); return isNaN(d) ? "ukendt tidspunkt" : d.toLocaleString("da-DK"); };
const liste = (xs, tom) => (xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="lille">${esc(tom)}</p>`);

// STATUS.md deles i afsnit efter "## Overskrift".
function status() {
  const t = laes("STATUS.md");
  if (!t) return `<p class="lille">Ingen STATUS.md endnu. Den laves af startkittets opsætning.</p>`;
  const afsnit = t.split(/^## /m).slice(1).map((a) => { const [h, ...rest] = a.split("\n"); return { h: h.trim(), linjer: rest.map((l) => l.trim()).filter((l) => l && !l.startsWith("<!--")) }; });
  if (!afsnit.length) return `<pre>${esc(t.slice(0, 2000))}</pre>`;
  return afsnit.map((a) => `<h3>${esc(a.h)}</h3>${liste(a.linjer.map((l) => l.replace(/^[-*] /, "")), "Intet skrevet.")}`).join("");
}

function bevis() {
  const b = json(".startkit/bevis.json");
  if (!b) return `<p class="lille">Intet bevis endnu. Kør <code>node scripts/startkit/bevis.js</code>.</p>`;
  const farve = b.ok ? (b.ingenTjek ? "gult (ingen tjek sat op, så intet er afprøvet)" : "grønt") : "rødt";
  return `<p>Seneste bevis: <b>${esc(farve)}</b> <span class="lille">(${esc(tid(b.at))})</span></p>${liste((b.resultater || []).map((x) => `${x.ok ? "✅" : "❌"} ${x.kommando}`), "")}`;
}

function forbrug(graense) {
  const f = json(".startkit/forbrug.json");
  if (!f) return `<p class="lille">Ingen tal gemt endnu. Skriv <code>/status</code> i Codex, og gem tallene med <code>node scripts/startkit/forbrug-gem.js --5t 40 --uge 12</code>.</p>`;
  const gammel = Date.now() - Date.parse(f.opdateret) > 6 * 3600 * 1000;
  const linje = (navn, p) => (typeof p === "number" ? `<li>${navn}: <b>${p} %</b>${p >= graense ? ` <span class="roed">over din grænse på ${graense} %</span>` : ""}</li>` : "");
  return `<ul>${linje("5 timer", f.femTimer)}${linje("Uge", f.uge)}</ul><p class="lille">Gemt ${esc(tid(f.opdateret))}${gammel ? " (gamle tal: tjek /status, og gem igen)" : ""}</p>`;
}

function side() {
  const erGit = git(REPO, "rev-parse", "--is-inside-work-tree") === "true";
  const gren = erGit ? git(REPO, "branch", "--show-current") || "(ingen gren)" : null;
  const aendret = erGit ? (git(REPO, "-c", "core.quotepath=off", "status", "--short") || "").split("\n").filter(Boolean) : [];
  const log = erGit ? (git(REPO, "log", "-5", "--format=%h %s (%cr)") || "").split("\n").filter(Boolean) : [];
  const hookTil = erGit && (git(REPO, "config", "core.hooksPath") || "").replace(/\/$/, "") === ".githooks";
  const fejl = laes("docs/gentagne-fejl.md");
  const raekker = fejl ? fejl.split("\n").filter((l) => /^\| \d{4}-\d{2}-\d{2} /.test(l)) : [];
  const ulaast = raekker.filter((l) => /\|\s*(nej|tekstregel)?\s*\|\s*$/i.test(l)).length;
  const config = json(".startkit/config.json") || {};
  const graense = Number(config.graense_procent) || 85;
  const guide = Array.isArray(config.modelguide) ? config.modelguide : [];

  return `<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15"><title>Overblik</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:780px;margin:0 auto;padding:16px;background:#fafafa;color:#222}
h1{font-size:1.4rem}h2{font-size:1.05rem;margin:1.4rem 0 .3rem}h3{font-size:.95rem;margin:.8rem 0 0}.kort{background:#fff;border:1px solid #ddd;border-radius:8px;padding:6px 14px;margin:8px 0}
code,pre{background:#eee;padding:1px 4px;border-radius:3px}ul{margin:.3rem 0;padding-left:1.2rem}.lille{color:#666;font-size:.9rem}.roed{color:#b00020}
.advarsel{background:#fff3cd;border:1px solid #e0c060;padding:8px 14px;border-radius:8px}
@media(prefers-color-scheme:dark){body{background:#181818;color:#eee}.kort{background:#222;border-color:#444}code,pre{background:#333}.lille{color:#aaa}.roed{color:#ff8a80}.advarsel{background:#4a3d10;border-color:#8a7020}}</style></head><body>
<h1>Overblik: ${esc(path.basename(REPO))}</h1><p class="lille">Opdaterer sig selv hvert 15. sekund. Kun læsning.</p>
${erGit ? "" : `<p class="advarsel">Mappen er ikke et git-projekt endnu.</p>`}
${erGit && !hookTil ? `<p class="advarsel">Nøgletjekket før commit er ikke tændt. Tænd det med <code>git config core.hooksPath .githooks</code>.</p>` : ""}
<h2>Hvor er vi?</h2><div class="kort">${status()}</div>
<h2>Ændringer, der ikke er gemt</h2><div class="kort">${erGit ? `<p>Gren: <b>${esc(gren)}</b></p>${liste(aendret, "Ingen. Alt er gemt i git.")}` : `<p class="lille">Ikke et git-projekt.</p>`}</div>
<h2>Seneste gemte ændringer</h2><div class="kort">${liste(log, "Ingen commits endnu.")}</div>
<h2>Virker det?</h2><div class="kort">${bevis()}</div>
<h2>Gentagne fejl</h2><div class="kort"><p>${fejl === null ? "Ingen liste endnu." : `${raekker.length} nedskrevne fejl${raekker.length ? `, heraf <b>${ulaast}</b> uden en lås` : ""}.`}</p></div>
<h2>Hvilken model til hvad?</h2><div class="kort">${liste(guide, "Ingen modelguide endnu. Den laves i startkittets fase 5.")}</div>
<h2>Forbrug</h2><div class="kort">${forbrug(graense)}</div>
</body></html>`;
}

if (require.main === module) {
  const server = http.createServer((req, res) => {
    const vaert = String(req.headers.host || "").split(":")[0];
    if (vaert !== "127.0.0.1" && vaert !== "localhost") { res.writeHead(403); return res.end("Forbudt"); }
    if (req.method !== "GET" || req.url.split("?")[0] !== "/") { res.writeHead(404); return res.end("Ikke fundet"); }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(side());
  });
  server.on("error", (e) => { console.error(e.code === "EADDRINUSE" ? `Port ${PORT} er optaget. Kører overblikket allerede? Prøv http://${HOST}:${PORT}` : e.message); process.exit(1); });
  server.listen(PORT, HOST, () => console.log(`Overblik kører: http://${HOST}:${PORT}   (stop med Ctrl+C)`));
}

module.exports = { side };
