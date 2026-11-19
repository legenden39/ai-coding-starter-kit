// Loop-stop: holder øje med, om den samme kommando fejler på samme måde igen og igen i én chat.
//
// Sådan hænger det sammen (kun Claude Code; Codex har ingen hændelse for fejl, så dér er det kun en regel i regelfilen):
//   1. fejl.js kaldes, når en kommando er fejlet (hook: PostToolUseFailure), og tæller fejlen her (noter).
//   2. vagt.js spørger her (skalStoppe), før AI'en ændrer eller kører noget igen. Er den samme fejl kommet to gange,
//      afvises den næste handling ÉN gang med en besked om at finde årsagen først. Kommer fejlen igen, stoppes der igen.
//
// "Samme fejl" = samme kommando og samme fejltekst, når tal, tidspunkter og stier er taget ud (rens).
// Kommandoen er med, så to forskellige kommandoer med samme korte fejl ("filen findes ikke") ikke tæller som en løkke.
// Der kan højst komme ét stop pr. fejl, så loop-stoppet kan aldrig selv låse chatten.
// Der gemmes kun et fingeraftryk, et antal og et kort uddrag af fejlen, i systemets midlertidige mappe.
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const GRAENSE = 2; // så mange gange skal den samme fejl komme, før der stoppes første gang
const TAELLER = /^(Bash|PowerShell)$/; // kun kommandoer tælles: en fejlet læsning eller rettelse er ikke en løkke
const STOPPES = /^(Bash|PowerShell|Edit|Write|MultiEdit|NotebookEdit|apply_patch)$/; // læsning stoppes aldrig: den er en del af at finde årsagen

const fil = (id) => path.join(os.tmpdir(), `startkit-${String(id || "ukendt").replace(/[^\w-]/g, "_").slice(0, 80)}-fejl.json`);

// Fjerner det, der skifter fra gang til gang, selv om fejlen er den samme.
function rens(tekst) {
  return String(tekst || "")
    .replace(/\x1b\[[0-9;]*[A-Za-z]/g, "") // farvekoder
    .replace(/\r/g, "")
    .toLowerCase()
    .replace(/\b[a-z]:[\\/](?:[^\\/\n"'()<>:]+[\\/])*[^\s\\/"'()<>:]*/g, "<sti>") // C:\mappe\fil, også med mellemrum i mappenavne
    .replace(/(?:\.{1,2}|~)?(?:[\\/][\w.@~+-]+){2,}/g, "<sti>") // /mappe/fil og ./mappe/fil
    .replace(/\b[0-9a-f]{7,}\b/g, "#") // fingeraftryk og id'er
    .replace(/\d+/g, "#") // tal, tidspunkter, linjenumre
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

const kommando = (ti) => { const k = ti && (ti.command ?? ti.input); return (Array.isArray(k) ? k.join(" ") : String(k ?? "")).replace(/\s+/g, " ").trim(); };
const aftryk = (input) => crypto.createHash("sha1").update(kommando(input.tool_input) + "\0" + rens(input.error)).digest("hex");

// Et kort uddrag til beskeden: første linje med indhold, uden den faste "Exit code N"-linje. Vises aldrig, hvis det ligner en nøgle.
function uddrag(fejl) {
  const linjer = String(fejl || "").replace(/\x1b\[[0-9;]*[A-Za-z]/g, "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const linje = linjer.find((l) => !/^exit code \d+$/i.test(l)) || linjer[0] || "";
  let harNoegle = () => false;
  try { harNoegle = require("./regler").harNoegle; } catch { /* uden reglerne vises uddraget ikke */ return ""; }
  return harNoegle(linje) ? "" : linje.slice(0, 160);
}

function laes(id) { try { const d = JSON.parse(fs.readFileSync(fil(id), "utf8")); return d && typeof d === "object" && !Array.isArray(d) ? d : {}; } catch { return {}; } }
function gem(id, data) { fs.writeFileSync(fil(id), JSON.stringify(data)); }

// Kaldes, når et værktøj er fejlet. Svarer med, hvor mange gange netop den fejl nu er set i chatten (0 = tælles ikke).
function noter(input = {}) {
  if (!input.session_id || input.is_interrupt === true || !TAELLER.test(String(input.tool_name || ""))) return 0;
  if (!kommando(input.tool_input) || !String(input.error || "").trim()) return 0;
  const data = laes(input.session_id);
  const noegle = aftryk(input);
  const post = data[noegle] || { antal: 0, stoppet: 0 };
  post.antal += 1;
  post.uddrag = uddrag(input.error);
  data[noegle] = post;
  gem(input.session_id, data);
  return post.antal;
}

// Kaldes af vagten, før et værktøj bruges. Svarer null (fortsæt) eller { antal, uddrag } (afvis denne ene handling).
// Et stop bliver "brugt", når det er givet, så den næste handling går igennem.
function skalStoppe(input = {}) {
  if (!input.session_id || !STOPPES.test(String(input.tool_name || ""))) return null;
  if (!fs.existsSync(fil(input.session_id))) return null;
  const data = laes(input.session_id);
  const ramt = Object.values(data).filter((p) => p && p.antal >= GRAENSE && p.antal > (p.stoppet || 0)).sort((a, b) => b.antal - a.antal)[0];
  if (!ramt) return null;
  for (const p of Object.values(data)) if (p && p.antal >= GRAENSE) p.stoppet = p.antal;
  gem(input.session_id, data);
  return { antal: ramt.antal, uddrag: ramt.uddrag || "" };
}

module.exports = { noter, skalStoppe, rens, fil, GRAENSE };
