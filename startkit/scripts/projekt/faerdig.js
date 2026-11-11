// Færdig-tjekket: Codex kører dette script, når den vil stoppe (hook: Stop).
// Er koden ændret i denne chat, og findes der ikke et grønt bevis for netop den kode,
// bliver Codex bedt om at køre beviset først. Den bliver højst bedt om det én gang pr. stop,
// så den aldrig kan hænge fast i en løkke.
const fs = require("fs");
const path = require("path");
const { rod, fingeraftryk, laesStart } = require("./tilstand");

function fortsaet(reason) { fs.writeSync(1, JSON.stringify({ decision: "block", reason })); }

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  if (input.stop_hook_active) process.exit(0); // er allerede blevet bedt om det én gang
  const r = rod(input.cwd);
  if (!r) process.exit(0); // ikke et git-projekt: intet at sammenligne med
  const start = laesStart(input.session_id);
  if (!start) process.exit(0); // intet værktøj er brugt i denne chat
  const nu = fingeraftryk(r);
  if (!nu || nu === start) process.exit(0); // koden er ikke ændret

  let bevis = null;
  try { bevis = JSON.parse(fs.readFileSync(path.join(r, ".startkit", "bevis.json"), "utf8")); } catch { /* intet bevis endnu */ }
  if (bevis && bevis.ok === true && bevis.fingeraftryk === nu) process.exit(0);

  const hvorfor = !bevis ? "Der findes ikke noget bevis endnu."
    : bevis.ok !== true ? "Det seneste bevis er rødt."
    : "Koden er ændret, siden beviset blev taget.";
  fortsaet(`Koden er ændret i denne chat, og det er ikke bevist, at den virker. ${hvorfor} Kør: node scripts/startkit/bevis.js. Er den rød, så find og ret årsagen (ikke symptomet), og kør den igen. Fortæl derefter ejeren kort: hvad der er lavet, hvad beviset viste, og hvad du IKKE har afprøvet.`);
} catch {
  process.exit(0); // et defekt færdig-tjek må ikke låse chatten
}
