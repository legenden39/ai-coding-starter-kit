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

const r = rod(process.cwd());
if (!r) { console.error("Ikke et git-projekt. Kør først: git init"); process.exit(2); }

let config = {};
try { config = JSON.parse(fs.readFileSync(path.join(r, ".startkit", "config.json"), "utf8")); } catch { /* ingen indstillinger endnu */ }
const tjek = Array.isArray(config.tjek) ? config.tjek.filter((k) => typeof k === "string" && k.trim()) : [];

const resultater = [];
for (const kommando of tjek) {
  console.log(`\n▶ ${kommando}`);
  let ok = true;
  try { execSync(kommando, { cwd: r, stdio: "inherit", timeout: 9 * 60 * 1000 }); } catch { ok = false; }
  console.log(ok ? "  ✅ grøn" : "  ❌ rød");
  resultater.push({ kommando, ok });
  if (!ok) break;
}

const ok = resultater.every((x) => x.ok);
const bevis = { ok, ingenTjek: tjek.length === 0, at: new Date().toISOString(), fingeraftryk: fingeraftryk(r), resultater };
fs.mkdirSync(path.join(r, ".startkit"), { recursive: true });
fs.writeFileSync(path.join(r, ".startkit", "bevis.json"), JSON.stringify(bevis, null, 2) + "\n");

console.log("");
if (bevis.ingenTjek) {
  console.log("Bevis gemt, men der er INGEN tjek-kommandoer sat op, så intet er afprøvet automatisk.");
  console.log("Sig det ærligt til ejeren, og foreslå en første test. Kommandoer tilføjes i .startkit/config.json (det gør ejeren selv).");
} else {
  console.log(ok ? "Bevis: GRØNT. Alle tjek gik igennem." : "Bevis: RØDT. Find og ret årsagen, og kør beviset igen.");
}
process.exit(ok ? 0 : 1);
