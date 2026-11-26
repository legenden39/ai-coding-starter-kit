// Chattens start: Claude Code kører dette script, når en chat begynder, fortsætter eller bliver kortet ned (hook: SessionStart).
// Det, scriptet skriver, får AI'en at se, før den første besked. Så ved den, hvor projektet står, og hvilke fejl der
// ikke må ske igen, uden at du skal bede den læse filerne.
//
// Kun læsning. Kører aldrig noget og bruger ikke internettet. Fejler det, skriver det ingenting, og chatten starter som normalt.
const fs = require("fs");
const path = require("path");
const { rod } = require("./tilstand");
const { t, fil, vaerktoej } = require("./tekster");

const HOEJST = 60; // linjer pr. fil: lange filer koster tokens i hver chat
let erAgy = vaerktoej() === "gemini";
try {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { /* køres også i hånden uden input */ }
  if ("conversationId" in input) erAgy = true;
  const r = rod(input.cwd || process.cwd()) || process.cwd();
  const laes = (rel) => { try { return fs.readFileSync(path.join(r, rel), "utf8").replace(/\r\n/g, "\n").trim(); } catch { return null; } };
  const kort = (tekst) => { const l = tekst.split("\n"); return l.length > HOEJST ? l.slice(0, HOEJST).join("\n") + "\n" + t("start.kort") : tekst; };
  const dele = [];
  const status = laes("STATUS.md");
  if (status) dele.push(t("start.status") + "\n\n" + kort(status));
  const fejl = laes(fil("fejl"));
  // Listen over fejl er kun værd at sende med, når der står noget i den (en række med en dato).
  if (fejl && /^\| \d{4}-\d{2}-\d{2} /m.test(fejl)) dele.push(t("start.fejl", { fil: fil("fejl") }) + "\n\n" + kort(fejl));
  if (erAgy) {
    process.stdout.write(dele.length ? JSON.stringify({ injectSteps: [{ systemMessage: { systemMessage: dele.join("\n\n") } }] }) : "{}");
  } else if (dele.length) {
    process.stdout.write(dele.join("\n\n") + "\n");
  }
} catch { if (erAgy) process.stdout.write("{}"); /* en defekt start må aldrig forhindre en chat i at begynde */ }
