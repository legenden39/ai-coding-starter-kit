// Fælles hjælp til vagten, færdig-tjekket og beviset: hvor er projektets rod, og hvordan ser koden ud lige nu?
const { execFileSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

function git(cwd, ...args) {
  try { return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }).replace(/\s+$/, ""); }
  catch { return null; }
}
const rod = (cwd) => git(cwd || process.cwd(), "rev-parse", "--show-toplevel");

// Det her tæller ikke som kode: tekst, billeder, kittets egne mapper og låsefiler.
const IKKE_KODE = /(^|\/)(docs|\.startkit|\.codex|\.claude|\.githooks|node_modules)\/|\.(md|txt|png|jpe?g|gif|webp|svg|ico|pdf|lock)$|(^|\/)package-lock\.json$/i;

// Et fingeraftryk af al kode i projektet (gemt og ikke gemt). Det er det samme før og efter en commit,
// så et grønt bevis ikke bliver ugyldigt, bare fordi arbejdet bliver gemt i git.
function fingeraftryk(root) {
  const liste = git(root, "-c", "core.quotepath=off", "ls-files", "--cached", "--others", "--exclude-standard");
  if (liste === null) return null;
  const filer = [...new Set(liste.split("\n").filter(Boolean))].filter((f) => !IKKE_KODE.test(f)).sort();
  const h = crypto.createHash("sha1");
  const mange = filer.length > 5000;
  for (const f of filer) {
    h.update(f + "\0");
    try {
      if (mange) { const s = fs.statSync(path.join(root, f)); h.update(`${s.size}:${s.mtimeMs}`); }
      else h.update(fs.readFileSync(path.join(root, f)));
    } catch { h.update("mangler"); }
  }
  return h.digest("hex");
}

// Hver chat får en lille fil i systemets midlertidige mappe med, hvordan koden så ud, da chatten begyndte.
const sessionFil = (id) => path.join(os.tmpdir(), `startkit-${String(id || "ukendt").replace(/[^\w-]/g, "_").slice(0, 80)}.json`);
function huskStart(id, root) {
  const fil = sessionFil(id);
  if (fs.existsSync(fil)) return;
  fs.writeFileSync(fil, JSON.stringify({ start: fingeraftryk(root), at: new Date().toISOString() }));
}
function laesStart(id) {
  try { return JSON.parse(fs.readFileSync(sessionFil(id), "utf8")).start || null; } catch { return null; }
}

// Pulsen: hver gang AI-værktøjet kalder vagten, noteres tidspunktet. Så kan man se, om hooks faktisk kører
// (på Windows er der meldinger om, at de nogle gange ikke gør, og det sker uden en fejlbesked).
// Der gemmes kun tidspunkt og værktøjets navn, aldrig hvad AI'en var ved at gøre.
const pulsFil = (root) => path.join(root, ".startkit", "vagt-puls.json");
function slaaPuls(root, vaerktoej) {
  if (!fs.existsSync(path.join(root, ".startkit"))) return; // kittet er ikke sat op her
  fs.writeFileSync(pulsFil(root), JSON.stringify({ at: new Date().toISOString(), vaerktoej: String(vaerktoej || "").slice(0, 40) }) + "\n");
}
function laesPuls(root) {
  try { const p = JSON.parse(fs.readFileSync(pulsFil(root), "utf8")); return isNaN(Date.parse(p.at)) ? null : p; } catch { return null; }
}

module.exports = { git, rod, fingeraftryk, huskStart, laesStart, sessionFil, slaaPuls, laesPuls, IKKE_KODE };
