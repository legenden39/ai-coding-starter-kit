// Henter det personlige fra et tidligere projekts profil til et nyt projekt, så personen ikke spørges om det samme igen.
//
//   node nyt-projekt.js <gammel-projektmappe> <ny-projektmappe> --toer     viser, hvad der ville blive hentet (på engelsk: --dry-run)
//   node nyt-projekt.js <gammel-projektmappe> <ny-projektmappe>            skriver en delvis profil i den nye mappe
//
// Kun en FAST liste af felter hentes (FELTER herunder): navn, niveau og personens regler. Alt andet bliver ikke hentet,
// især ikke det, der hører til selve projektet: projekter, rigtig drift (betaling, persondata, mails), sikkerhed (nøgletyper),
// tjek-kommandoer og åbne punkter. Så kan et nyt projekt ikke arve et gammelt projekts "nej tak" til tjeklisten for rigtig drift.
// Scriptet skriver aldrig i den gamle mappe, overskriver aldrig en profil i den nye, og sender intet nogen steder hen.
// Profilen i den nye mappe er med vilje ikke færdig: projektspørgsmålene mangler, så opsætningen (opsaet.js) siger nej, til de er besvaret.
const fs = require("fs");
const path = require("path");
const { fund } = require("./feedback-tjek");
const { t, sprog, fil } = require("./projekt/tekster");

// Det eneste, der må hentes. `da` og `en` er feltets sti i en profil skrevet af den danske og den engelske udgave.
const FELTER = [
  { da: ["person", "navn"], en: ["person", "name"], type: "tekst" },
  { da: ["person", "niveau"], en: ["person", "level"], type: "tekst" },
  { da: ["regler", "aldrig_uden_ok"], en: ["rules", "never_without_ok"], type: "liste" },
  { da: ["regler", "svarform"], en: ["rules", "answer_style"], type: "tekst" },
  { da: ["regler", "ved_tvivl"], en: ["rules", "when_in_doubt"], type: "tekst" },
  { da: ["regler", "bestemmer_selv"], en: ["rules", "decides_myself"], type: "tekst" },
];
const TOPNIVEAU = new Set(["person", "regler", "rules"]);
const MAX_TEKST = 300, MAX_LISTE = 10;

const hent = (obj, sti) => sti.reduce((o, k) => (o && typeof o === "object" && !Array.isArray(o) ? o[k] : undefined), obj);
function saet(obj, sti, vaerdi) {
  let o = obj;
  sti.slice(0, -1).forEach((k) => { o = o[k] = o[k] || {}; });
  o[sti[sti.length - 1]] = vaerdi;
}
// Ren tekst på én linje, uden styretegn, af rimelig længde. Alt andet afvises.
function renTekst(v) {
  if (typeof v !== "string") return null;
  const s = v.replace(/\s+/g, " ").trim();
  return s && s.length <= MAX_TEKST && !/[\u0000-\u001f\u007f]/.test(s) ? s : null;
}
function renVaerdi(type, v) {
  if (type === "tekst") return renTekst(v);
  if (!Array.isArray(v) || v.length === 0 || v.length > MAX_LISTE) return null;
  const liste = v.map(renTekst);
  return liste.every((x) => x !== null) ? liste : null;
}

// Tager en indlæst profil og giver det, der må hentes. Rører ikke profilen.
//   felter: { "person.navn": "…", … } (navnene er altid de danske)  ·  sprunget: felter, der lignede en nøgle, en e-mail eller en sti
//   ikkeHentet: profilens øvrige hovednøgler (kun navne)
function kopier(profil) {
  const felter = {}, sprunget = [];
  if (!profil || typeof profil !== "object" || Array.isArray(profil)) return { felter, sprunget, ikkeHentet: [] };
  for (const f of FELTER) {
    const raa = hent(profil, f.da) !== undefined ? hent(profil, f.da) : hent(profil, f.en);
    if (raa === undefined) continue;
    const navn = f.da.join(".");
    const v = renVaerdi(f.type, raa);
    if (v === null) continue;
    // Nøgler, e-mailadresser og stier med brugernavn hentes ikke, uanset hvor de står.
    if (fund(Array.isArray(v) ? v.join("\n") : v).length) { sprunget.push(navn); continue; }
    felter[navn] = v;
  }
  const ikkeHentet = Object.keys(profil).filter((k) => !TOPNIVEAU.has(k));
  return { felter, sprunget, ikkeHentet };
}

// Bygger den nye, delvise profil med feltnavne på det aktuelle sprog.
function nyProfil(felter) {
  const ud = {};
  for (const f of FELTER) {
    const navn = f.da.join(".");
    if (felter[navn] !== undefined) saet(ud, sprog() === "en" ? f.en : f.da, felter[navn]);
  }
  return ud;
}

const laes = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const PROFILNAVNE = [".startkit/profil.json", ".startkit/profile.json"];

function main() {
  const args = process.argv.slice(2);
  const toer = args.includes("--toer") || args.includes("--dry-run");
  const mapper = args.filter((a) => !a.startsWith("--"));
  // En tom mappe ("") ville ellers blive til arbejdsmappen, og så ville profilen blive skrevet det forkerte sted.
  if (mapper.length !== 2 || mapper.some((m) => !m.trim())) { console.error(t("np.brug")); return 2; }
  const [gammel, ny] = mapper.map((m) => path.resolve(m));
  for (const m of [gammel, ny]) {
    if (!fs.existsSync(m) || !fs.statSync(m).isDirectory()) { console.error(t("mappe.findes.ikke", { mappe: m })); return 2; }
  }
  if (path.relative(gammel, ny) === "") { console.error(t("np.samme")); return 2; }
  if (PROFILNAVNE.some((n) => fs.existsSync(path.join(ny, n)))) { console.error(t("np.findes", { fil: fil("profil") })); return 2; }

  const tekst = PROFILNAVNE.map((n) => laes(path.join(gammel, n))).find((x) => x !== null);
  if (tekst === undefined) { console.error(t("np.ingen.gammel")); return 2; }
  let profil;
  try { profil = JSON.parse(tekst); } catch { console.error(t("np.profil.json")); return 2; }

  const { felter, sprunget, ikkeHentet } = kopier(profil);
  if (!Object.keys(felter).length) { console.error(t("np.tomt")); return 2; }

  console.log(t(toer ? "np.vil" : "np.henter", { fil: fil("profil") }));
  for (const [navn, v] of Object.entries(felter)) console.log(`  ${navn}: ${Array.isArray(v) ? v.join("; ") : v}`);
  if (sprunget.length) console.log(t("np.sprunget", { felter: sprunget.join(", ") }));
  console.log(t("np.ikke", { noegler: ikkeHentet.length ? ikkeHentet.join(", ") : "-" }));

  if (!toer) {
    const mal = path.join(ny, fil("profil"));
    fs.mkdirSync(path.dirname(mal), { recursive: true });
    fs.writeFileSync(mal, JSON.stringify(nyProfil(felter), null, 2) + "\n");
    console.log(t("np.naeste"));
  }
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { kopier, nyProfil, FELTER };
