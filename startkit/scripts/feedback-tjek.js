// Ser feedback-filen efter, før den sendes: må ikke indeholde nøgler, e-mailadresser eller stier med brugernavn.
// Viser kun linjenummer og slags, aldrig selve indholdet. Sender ingenting nogen steder hen.
//
//   node feedback-tjek.js <projektmappe>
const fs = require("fs");
const path = require("path");
const { harNoegle } = require("./projekt/regler");

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
const BRUGERMAPPE = /[A-Za-z]:[\\/]Users[\\/][^\\/\s<]|\/(Users|home)\/[A-Za-z0-9]/;
const HEMMELIGHED = /(SECRET|TOKEN|PASSWORD|ADGANGSKODE|API_?KEY|PRIVATE_?KEY)[A-Z_]*\s*[=:]\s*["']?[A-Za-z0-9/+_.-]{16,}/i;

// Finder det, der ikke må med. Returnerer [{linje, slags}].
function fund(tekst) {
  const ud = [];
  String(tekst).split(/\r?\n/).forEach((l, i) => {
    if (harNoegle(l) || HEMMELIGHED.test(l)) ud.push({ linje: i + 1, slags: "noget, der ligner en nøgle eller adgangskode" });
    if (EMAIL.test(l)) ud.push({ linje: i + 1, slags: "en e-mailadresse" });
    if (BRUGERMAPPE.test(l)) ud.push({ linje: i + 1, slags: "en sti med et brugernavn" });
  });
  return ud;
}

if (require.main === module) {
  const root = path.resolve(process.argv[2] || process.cwd());
  const fil = path.join(root, ".startkit", "feedback.md");
  let tekst;
  try { tekst = fs.readFileSync(fil, "utf8"); } catch { console.error("Der er ingen feedback-fil endnu (.startkit/feedback.md)."); process.exit(2); }
  const f = fund(tekst);
  if (!f.length) { console.log("Feedback-filen er set efter: ingen nøgler, e-mailadresser eller stier med brugernavn fundet.\nLæs den selv igennem, før du sender den. Kun du ved, hvad der er privat."); process.exit(0); }
  console.error("Feedback-filen indeholder noget, der ikke bør sendes:\n");
  for (const x of f) console.error(`  linje ${x.linje}: ${x.slags}`);
  console.error("\nRet linjerne i .startkit/feedback.md, og kør tjekket igen.");
  process.exit(1);
}

module.exports = { fund };
