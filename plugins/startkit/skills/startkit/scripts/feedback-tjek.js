// Ser feedback-filen efter, før den sendes: må ikke indeholde nøgler, e-mailadresser eller stier med brugernavn.
// Viser kun linjenummer og slags, aldrig selve indholdet. Sender ingenting nogen steder hen.
//
//   node feedback-tjek.js <projektmappe>
const fs = require("fs");
const path = require("path");
const { harNoegle } = require("./projekt/regler");
const { t } = require("./projekt/tekster");

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
const BRUGERMAPPE = /[A-Za-z]:[\\/]Users[\\/][^\\/\s<]|\/(Users|home)\/[A-Za-z0-9]/;
const HEMMELIGHED = /(SECRET|TOKEN|PASSWORD|ADGANGSKODE|API_?KEY|PRIVATE_?KEY)[A-Z_]*\s*[=:]\s*["']?[A-Za-z0-9/+_.-]{16,}/i;

// Finder det, der ikke må med. Returnerer [{linje, slags}].
function fund(tekst) {
  const ud = [];
  String(tekst).split(/\r?\n/).forEach((l, i) => {
    if (harNoegle(l) || HEMMELIGHED.test(l)) ud.push({ linje: i + 1, slags: t("fb.noegle") });
    if (EMAIL.test(l)) ud.push({ linje: i + 1, slags: t("fb.email") });
    if (BRUGERMAPPE.test(l)) ud.push({ linje: i + 1, slags: t("fb.sti") });
  });
  return ud;
}

if (require.main === module) {
  const root = path.resolve(process.argv[2] || process.cwd());
  const fil = path.join(root, ".startkit", "feedback.md");
  let tekst;
  try { tekst = fs.readFileSync(fil, "utf8"); } catch { console.error(t("fb.ingen.fil")); process.exit(2); }
  const f = fund(tekst);
  if (!f.length) { console.log(t("fb.ren")); process.exit(0); }
  console.error(t("fb.fund"));
  for (const x of f) console.error(t("fb.linje", x));
  console.error(t("fb.ret"));
  process.exit(1);
}

module.exports = { fund };
