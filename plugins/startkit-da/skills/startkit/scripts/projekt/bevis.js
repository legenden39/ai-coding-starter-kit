// Beviset: kører de kommandoer, der viser, at projektet virker, og gemmer resultatet.
//
//   node scripts/startkit/bevis.js
//
// Kommandoerne står i .startkit/config.json under "tjek" (fx ["npm test"]): de hurtige tjek, der køres hver gang.
// Er der en langsom fuld test, står den under "fuld_tjek". Den køres kun, når den seneste grønne fulde kørsel
// er mere end "fuld_dage" dage gammel (standard 7), eller med --fuld. Tidspunktet gemmes i .startkit/fuld-tjek.json.
// Resultatet gemmes i .startkit/bevis.json sammen med et fingeraftryk af koden,
// så færdig-tjekket kan se, om beviset hører til den kode, der ligger der nu.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { rod, fingeraftryk } = require("./tilstand");
const { t, laesConfig, fil } = require("./tekster");

const r = rod(process.cwd());
if (!r) { console.error(t("ikke.git")); process.exit(2); }

let config = {};
try { config = JSON.parse(fs.readFileSync(path.join(r, ".startkit", "config.json"), "utf8")); } catch { /* ingen indstillinger endnu */ }
const kommandoer = laesConfig(config).tjek;
const rens = (l) => (Array.isArray(l) ? l.filter((k) => typeof k === "string" && k.trim()) : []);
const tjek = rens(kommandoer);
const fuld = rens(laesConfig(config).fuld_tjek);
const graense = Number(laesConfig(config).fuld_dage) > 0 ? Number(laesConfig(config).fuld_dage) : 7;
const MARKOER = path.join(r, ".startkit", "fuld-tjek.json");
let sidst = null;
try { const m = JSON.parse(fs.readFileSync(MARKOER, "utf8")); if (m && m.ok === true && !isNaN(Date.parse(m.at))) sidst = Date.parse(m.at); } catch { /* aldrig kørt */ }
const dage = sidst === null ? null : Math.floor((Date.now() - sidst) / 86400000);
const bedt = process.argv.includes("--fuld") || process.argv.includes("--full");
const koerFuld = fuld.length > 0 && (bedt || dage === null || dage >= graense);
if (koerFuld) console.log(t("bevis.fuld.nu", { hvorfor: bedt ? t("bevis.fuld.bedt") : dage === null ? t("bevis.fuld.aldrig") : t("bevis.fuld.gammel", { dage, graense }) }));

// Låsene i fejllisten: står der en sti i backticks under "Låst af", skal filen findes. Ellers er låsen væk.
function manglendeLaase() {
  let tekst = "";
  try { tekst = fs.readFileSync(path.join(r, fil("fejl")), "utf8"); } catch { return []; }
  const mangler = [];
  for (const linje of tekst.split(/\r?\n/)) {
    if (!/^\s*\|/.test(linje) || /^\s*\|[\s|:-]+\|?\s*$/.test(linje)) continue;
    const celler = linje.trim().replace(/^\||\|$/g, "").split("|");
    const laast = (celler[celler.length - 1] || "").trim();
    if (/^(tekstregel|text rule|nej|no|ikke|not)\b/i.test(laast)) continue; // en svag lås nævner måske en fil, men er ikke en lås
    for (const [, sti] of laast.matchAll(/`([^`\s]+)`/g)) {
      const ren = sti.replace(/:\d+$/, "");
      if (/[\/.]/.test(ren) && !/^https?:/.test(ren) && !fs.existsSync(path.join(r, ren))) mangler.push(ren);
    }
  }
  return mangler;
}

const resultater = [];
const vaek = manglendeLaase();
if (vaek.length) {
  console.log(t("bevis.laas.vaek", { fejlfil: fil("fejl"), stier: vaek.join(", ") }));
  resultater.push({ kommando: t("bevis.laas.navn"), ok: false });
}
for (const kommando of vaek.length ? [] : koerFuld ? [...tjek, ...fuld] : tjek) {
  console.log(`\n▶ ${kommando}`);
  let ok = true;
  try { execSync(kommando, { cwd: r, stdio: "inherit", timeout: 9 * 60 * 1000 }); } catch { ok = false; }
  console.log(t(ok ? "bevis.groen" : "bevis.roed"));
  resultater.push({ kommando, ok });
  if (!ok) break;
}

const ok = resultater.every((x) => x.ok);
fs.mkdirSync(path.join(r, ".startkit"), { recursive: true });
if (koerFuld && ok) fs.writeFileSync(MARKOER, JSON.stringify({ ok: true, at: new Date().toISOString() }, null, 2) + "\n");
const bevis = { ok, ingenTjek: tjek.length === 0 && fuld.length === 0 && !vaek.length, fuldKoert: koerFuld, at: new Date().toISOString(), fingeraftryk: fingeraftryk(r), resultater };
fs.mkdirSync(path.join(r, ".startkit"), { recursive: true });
fs.writeFileSync(path.join(r, ".startkit", "bevis.json"), JSON.stringify(bevis, null, 2) + "\n");

console.log("");
if (vaek.length) {
  console.log(t("bevis.roedt"));
} else if (bevis.ingenTjek) {
  console.log(t("bevis.ingen1"));
  console.log(t("bevis.ingen2"));
} else {
  console.log(t(ok ? "bevis.groent" : "bevis.roedt"));
  if (fuld.length && !koerFuld) console.log(t("bevis.fuld.ikke", { dage }));
}
process.exit(ok ? 0 : 1);
