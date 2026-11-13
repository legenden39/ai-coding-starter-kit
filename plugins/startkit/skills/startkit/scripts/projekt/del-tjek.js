// Del-tjek: se efter hemmelige nøgler i det, der er ved at blive lagt ud til andre. (Hører til tjeklisten "Før du deler".)
//
//   node scripts/startkit/del-tjek.js            leder selv efter mappen med det byggede (dist, build, out, public ...)
//   node scripts/startkit/del-tjek.js <mappe>    tjekker netop den mappe
//
// Hvorfor: nøgletjekket før commit ser kun det, der gemmes i git. Det, der bliver lagt ud på nettet, er som regel bygget
// i en mappe, git ikke kender (fx dist), og det er dér, en nøgle fra en .env-fil kan være blevet bagt ind.
//
//  * Viser kun filnavn og slags, aldrig selve nøglen. Kun læsning. Ingen internet.
//  * Finder: mønstre, der ligner nøgler; Supabase-nøgler af typen service_role; .env-filer og .git-mapper i det, der lægges ud;
//    og indstillinger med hemmelige navne, som bliver sendt med ud til browseren (fx NEXT_PUBLIC_..._SECRET).
//  * Finder IKKE: om en database står åben, om login virker, eller nøgler, der er gemt på andre måder. Det er ikke en sikkerhedsgennemgang.
const fs = require("fs");
const path = require("path");
const { rod, git } = require("./tilstand");
const { NOEGLE } = require("./regler");
const { t, fil } = require("./tekster");

const BYGGEMAPPER = ["dist", "build", "out", "public", ".next/static", ".output/public", "_site", "www"];
const STOR = 3 * 1024 * 1024, HOEJST = 5000;
const IKKE_TEKST = /\.(png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|br|woff2?|ttf|otf|eot|mp[34]|mov|webm|wasm)$/i;
const JWT = /eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g;
const UDSTILLET_NAVN = /\b(?:NEXT_PUBLIC|VITE|REACT_APP|EXPO_PUBLIC|NUXT_PUBLIC|GATSBY|PUBLIC)_[A-Z0-9_]*(?:SECRET|SERVICE_ROLE|PRIVATE|PASSWORD)[A-Z0-9_]*/;

// En Supabase-nøgle er en JWT. Står der "service_role" i den, giver den fuld adgang uden om alle regler.
function harServiceRole(tekst) {
  for (const m of tekst.matchAll(JWT)) {
    try { if (JSON.parse(Buffer.from(m[1], "base64url").toString("utf8")).role === "service_role") return true; } catch { /* ikke en JWT alligevel */ }
  }
  return false;
}

function filerI(mappe) {
  const ud = [];
  (function gaa(d) {
    if (ud.length > HOEJST) return;
    let navne = [];
    try { navne = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of navne) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name === ".git") ud.push({ f, git: true }); else if (e.name !== "node_modules") gaa(f); }
      else if (e.isFile()) ud.push({ f });
    }
  })(mappe);
  return ud;
}

// Ser én fil efter. Svarer en liste af slags ("noegle", "service", "navn:NAVNET").
function seEfter(f, { navne }) {
  let st; try { st = fs.statSync(f); } catch { return null; }
  if (st.size > STOR || IKKE_TEKST.test(f)) return null;
  let tekst; try { tekst = fs.readFileSync(f, "utf8"); } catch { return null; }
  if (tekst.includes("\u0000")) return null;
  const fund = [];
  if (harServiceRole(tekst)) fund.push("service");
  if (NOEGLE.some((re) => re.test(tekst))) fund.push("noegle");
  if (navne) { const m = tekst.match(UDSTILLET_NAVN); if (m) fund.push("navn:" + m[0]); }
  return fund;
}

function tjek(root, mappe) {
  const fund = [], rel = (f) => path.relative(root, f).replace(/\\/g, "/");
  let sprunget = 0, udgivet = 0, kilde = 0;
  if (mappe) {
    for (const x of filerI(mappe)) {
      if (x.git) { fund.push({ fil: rel(x.f), slags: "git" }); continue; }
      udgivet++;
      const navn = path.basename(x.f);
      if (/^\.env(\.|$)/.test(navn) && !/\.(example|sample)$/.test(navn)) fund.push({ fil: rel(x.f), slags: "env" });
      const r = seEfter(x.f, { navne: false });
      if (r === null) sprunget++; else for (const s of r) fund.push({ fil: rel(x.f), slags: s });
    }
  }
  // Kildekoden: kun det, git kender eller kunne kende (så .env og node_modules er ude).
  const liste = git(root, "-c", "core.quotepath=off", "ls-files", "--cached", "--others", "--exclude-standard");
  const inde = mappe ? rel(mappe) + "/" : null;
  for (const f of (liste || "").split("\n").filter(Boolean).slice(0, HOEJST)) {
    if ((inde && f.startsWith(inde)) || /^(scripts\/startkit|\.githooks|docs)\//.test(f) || /\.md$/i.test(f)) continue;
    kilde++;
    const r = seEfter(path.join(root, f), { navne: true });
    if (r === null) sprunget++; else for (const s of r) fund.push({ fil: f, slags: s });
  }
  return { fund, sprunget, udgivet, kilde };
}

function main() {
  const root = rod(process.cwd());
  if (!root) { console.error(t("ikke.git")); return 2; }
  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  let mappe = null;
  if (arg) {
    mappe = path.resolve(arg);
    if (!fs.existsSync(mappe) || !fs.statSync(mappe).isDirectory()) { console.error(t("mappe.findes.ikke", { mappe })); return 2; }
  } else {
    const fundet = BYGGEMAPPER.map((m) => path.join(root, m)).find((m) => fs.existsSync(m) && fs.statSync(m).isDirectory());
    if (fundet) mappe = fundet; else console.log(t("dt.ingen.mappe", { mapper: BYGGEMAPPER.join(", ") }));
  }
  const r = tjek(root, mappe);
  if (mappe) console.log(t("dt.mappe", { mappe: path.relative(root, mappe).replace(/\\/g, "/") || ".", antal: r.udgivet }));
  console.log(t("dt.kilde", { antal: r.kilde }));
  if (r.sprunget) console.log(t("dt.sprunget", { antal: r.sprunget }));
  if (r.fund.length) {
    console.error(t("dt.fund", { antal: r.fund.length }));
    for (const x of r.fund) console.error("  " + (x.slags.startsWith("navn:") ? t("dt.f.navn", { fil: x.fil, navn: x.slags.slice(5) }) : t("dt.f." + x.slags, { fil: x.fil })));
    console.error(t("dt.hvad.nu"));
  } else console.log(t("dt.rent"));
  console.log(t("dt.ikke", { fil: fil("deling") }));
  return r.fund.length ? 1 : 0;
}

if (require.main === module) process.exit(main());
module.exports = { tjek, harServiceRole, BYGGEMAPPER };
