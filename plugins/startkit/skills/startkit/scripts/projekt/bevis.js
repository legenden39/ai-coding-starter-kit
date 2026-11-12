// Beviset: kører de kommandoer, der viser, at projektet virker, og gemmer resultatet.
//
//   node scripts/startkit/bevis.js
//
// Kommandoerne står i .startkit/config.json under "tjek" (fx ["npm test"]).
// Resultatet gemmes i .startkit/bevis.json sammen med et fingeraftryk af koden,
// så færdig-tjekket kan se, om beviset hører til den kode, der ligger der nu.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { rod, fingeraftryk } = require("./tilstand");
const { t, laesConfig } = require("./tekster");

const r = rod(process.cwd());
if (!r) { console.error(t("ikke.git")); process.exit(2); }

let config = {};
try { config = JSON.parse(fs.readFileSync(path.join(r, ".startkit", "config.json"), "utf8")); } catch { /* ingen indstillinger endnu */ }
const kommandoer = laesConfig(config).tjek;
const tjek = Array.isArray(kommandoer) ? kommandoer.filter((k) => typeof k === "string" && k.trim()) : [];

const resultater = [];
for (const kommando of tjek) {
  console.log(`\n▶ ${kommando}`);
  let ok = true;
  try { execSync(kommando, { cwd: r, stdio: "inherit", timeout: 9 * 60 * 1000 }); } catch { ok = false; }
  console.log(t(ok ? "bevis.groen" : "bevis.roed"));
  resultater.push({ kommando, ok });
  if (!ok) break;
}

const ok = resultater.every((x) => x.ok);
const bevis = { ok, ingenTjek: tjek.length === 0, at: new Date().toISOString(), fingeraftryk: fingeraftryk(r), resultater };
fs.mkdirSync(path.join(r, ".startkit"), { recursive: true });
fs.writeFileSync(path.join(r, ".startkit", "bevis.json"), JSON.stringify(bevis, null, 2) + "\n");

console.log("");
if (bevis.ingenTjek) {
  console.log(t("bevis.ingen1"));
  console.log(t("bevis.ingen2"));
} else {
  console.log(t(ok ? "bevis.groent" : "bevis.roedt"));
}
process.exit(ok ? 0 : 1);
