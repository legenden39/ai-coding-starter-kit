// Gemmer de forbrugstal, du selv læser af (skriv /status i Codex), så overblikket kan vise dem.
//
//   node scripts/startkit/forbrug-gem.js --5t 40 --uge 12
//
// Tallene er procent brugt. Scriptet henter ikke selv noget og kender ikke din konto.
const fs = require("fs");
const path = require("path");
const { rod } = require("./tilstand");

const args = process.argv.slice(2);
const tal = (flag) => { const i = args.indexOf(flag); if (i < 0) return undefined; const n = Number(args[i + 1]); return Number.isFinite(n) && n >= 0 && n <= 100 ? n : NaN; };
const femTimer = tal("--5t"), uge = tal("--uge");
if ((femTimer === undefined && uge === undefined) || Number.isNaN(femTimer) || Number.isNaN(uge)) {
  console.error("Brug: node scripts/startkit/forbrug-gem.js --5t <procent> --uge <procent>   (tal mellem 0 og 100)");
  process.exit(2);
}
const r = rod(process.cwd()) || process.cwd();
fs.mkdirSync(path.join(r, ".startkit"), { recursive: true });
fs.writeFileSync(path.join(r, ".startkit", "forbrug.json"), JSON.stringify({ femTimer, uge, opdateret: new Date().toISOString() }, null, 2) + "\n");
console.log("Forbrug gemt.");
