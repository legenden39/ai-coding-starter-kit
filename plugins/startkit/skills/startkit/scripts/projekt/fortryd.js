// Fortryd: se gemmepunkterne, og hent filer tilbage fra et af dem. (På engelsk: --show, --restore, --save.)
//
//   node scripts/startkit/fortryd.js                      liste over gemmepunkter, nyeste først
//   node scripts/startkit/fortryd.js --vis 2              hvilke filer er anderledes nu end i gemmepunkt 2
//   node scripts/startkit/fortryd.js --hent 2             hent alle filer tilbage fra gemmepunkt 2
//   node scripts/startkit/fortryd.js --hent 2 src/a.js    hent kun én fil
//   node scripts/startkit/fortryd.js --gem                tag et gemmepunkt nu (fx før noget risikabelt)
//
// Før noget hentes tilbage, gemmes filerne, som de ser ud lige nu, som et nyt gemmepunkt. Så kan også en fortrydelse fortrydes.
// Intet bliver slettet: filer, der er kommet til siden gemmepunktet, bliver liggende. Intet sendes nogen steder hen.
const { rod } = require("./tilstand");
const { lav, liste, forskel, hent } = require("./gemmepunkt");
const { t } = require("./tekster");

const args = process.argv.slice(2);
const har = (...flag) => args.some((a) => flag.includes(a));
const efter = (...flag) => { const i = args.findIndex((a) => flag.includes(a)); return i < 0 ? [] : args.slice(i + 1).filter((a) => !a.startsWith("--")); };
const root = rod(process.cwd());
if (!root) { console.error(t("ikke.git")); process.exit(2); }
const tid = (iso) => { const d = new Date(iso); return isNaN(d) ? t("ov.ukendt.tid") : d.toLocaleString(t("ov.locale")); };

if (har("--gem", "--save")) {
  console.log(t(lav(root, "gemt i hånden").lavet ? "fo.gemt" : "fo.gem.intet"));
  process.exit(0);
}

const alle = liste(root);
const vaelg = (tal) => { const n = Number(tal); const g = Number.isInteger(n) && n >= 1 ? alle[n - 1] : null; if (!g) { console.error(t("fo.ukendt", { nr: tal ?? "?" })); process.exit(2); } return { g, nr: n }; };

if (har("--vis", "--show")) {
  const { g, nr } = vaelg(efter("--vis", "--show")[0]);
  const f = forskel(root, g);
  if (!f.length) { console.log(t("fo.vis.ens", { nr })); process.exit(0); }
  console.log(t("fo.vis", { nr, tid: tid(g.at) }));
  for (const x of f) console.log(`  ${x.fil}  (${t("fo." + (["M", "D", "A"].includes(x.slags) ? x.slags : "M"))})`);
  process.exit(0);
}

if (har("--hent", "--restore")) {
  const [tal, ...filer] = efter("--hent", "--restore");
  const { g, nr } = vaelg(tal);
  lav(root, "før fortryd");
  const r = hent(root, g, filer);
  if (!r.ok) { console.error(t("fo.hent.fejl", { fejl: r.fejl })); process.exit(1); }
  console.log(t("fo.hentet", { nr, tid: tid(g.at) }));
  process.exit(0);
}

if (!alle.length) { console.log(t("fo.ingen")); process.exit(0); }
console.log(t("fo.overskrift"));
alle.forEach((g, i) => { const antal = forskel(root, g).length; console.log(t(antal === 1 ? "fo.linje.en" : antal ? "fo.linje" : "fo.linje.ens", { nr: i + 1, tid: tid(g.at), antal })); });
console.log(t("fo.brug"));
