// Færdig-tjekket: AI-værktøjet (Codex eller Claude Code) kører dette script, når AI'en vil stoppe (hook: Stop).
// Er koden ændret i denne chat, og findes der ikke et grønt bevis for netop den kode,
// bliver AI'en bedt om at køre beviset først. Den bliver højst bedt om det én gang pr. stop,
// så den aldrig kan hænge fast i en løkke.
const fs = require("fs");
const path = require("path");
const { rod, fingeraftryk, laesStart } = require("./tilstand");
const { t, vaerktoej } = require("./tekster");

let erAgy = vaerktoej() === "gemini";
function fortsaet(reason) { fs.writeSync(1, JSON.stringify({ decision: erAgy ? "continue" : "block", reason })); }
function stopOk() { if (erAgy) fs.writeSync(1, "{}"); process.exit(0); }

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  if ("continuationActive" in input || "conversationId" in input) erAgy = true;
  if (input.stop_hook_active || input.continuationActive) stopOk(); // er allerede blevet bedt om det én gang
  const r = rod(input.cwd);
  if (!r) stopOk(); // ikke et git-projekt: intet at sammenligne med
  const start = laesStart(input.session_id || input.conversationId);
  if (!start) stopOk(); // intet værktøj er brugt i denne chat
  const nu = fingeraftryk(r);
  if (!nu || nu === start) stopOk(); // koden er ikke ændret

  let bevis = null;
  try { bevis = JSON.parse(fs.readFileSync(path.join(r, ".startkit", "bevis.json"), "utf8")); } catch { /* intet bevis endnu */ }
  if (bevis && bevis.ok === true && bevis.fingeraftryk === nu) stopOk();

  const hvorfor = t(!bevis ? "faerdig.intet" : bevis.ok !== true ? "faerdig.roedt" : "faerdig.aendret");
  fortsaet(t("faerdig.besked", { hvorfor }));
} catch {
  stopOk(); // et defekt færdig-tjek må ikke låse chatten
}
