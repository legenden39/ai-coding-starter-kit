// Vagten: AI-værktøjet (Codex eller Claude Code) kører dette script, før det bruger et værktøj (hook: PreToolUse).
// Den læser, hvad AI'en er ved at gøre, og afviser det, reglerne i regler.js forbyder.
// Intet svar = tilladt. Kører aldrig noget selv og bruger ikke internettet.
const fs = require("fs");
const { decide } = require("./regler");
const { rod, huskStart, slaaPuls } = require("./tilstand");
const { t, laesConfig } = require("./tekster");

function afvis(reason) {
  fs.writeSync(1, JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
}

let input;
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); }
catch { afvis(t("vagt.ulaeselig")); process.exit(0); }

// Husk, hvordan koden så ud, da chatten begyndte (bruges af færdig-tjekket). Må aldrig vælte vagten.
// Slå også pulsen, så det kan ses, at AI-værktøjet faktisk kalder vagten. Kun rigtige kald har et chat-id.
let projektrod = null;
// Første værktøjskald i en chat: tag også et gemmepunkt af projektet, før AI'en ændrer noget (se gemmepunkt.js).
try {
  projektrod = rod(input.cwd);
  if (projektrod && input.session_id) {
    const foerste = huskStart(input.session_id, projektrod);
    slaaPuls(projektrod, input.tool_name);
    if (foerste && fs.existsSync(require("path").join(projektrod, ".startkit"))) require("./gemmepunkt").lav(projektrod, "start på chat");
  }
} catch { /* ikke vigtigt nok til at stoppe noget */ }

// Kun-registrér: bruges af kittets egen kilderepo, hvor vagtens egne filer er det, der bygges. Så tages gemmepunkt og start
// noteres (færdig-tjekket kræver det), men intet afvises. Står i .startkit/config.json: "vagt": "kun-registrer" (engelsk: "guard": "record-only").
// Kontakten gælder kun, når filen findes; fejl og ulæselig fil betyder den almindelige, strenge vagt.
try {
  if (projektrod) {
    const v = laesConfig(JSON.parse(fs.readFileSync(require("path").join(projektrod, ".startkit", "config.json"), "utf8"))).vagt;
    if (v === "kun-registrer" || v === "record-only") process.exit(0);
  }
} catch { /* ingen kontakt: almindelig vagt */ }

try {
  const svar = decide({ ...input, projektrod: projektrod || undefined }); // reglerne bruger projektmappen til at se, hvad der ligger uden for den
  if (svar.decision === "deny") { afvis(svar.reason); process.exit(0); }
} catch (e) {
  afvis(t("vagt.fejlede", { fejl: e.message }));
  process.exit(0);
}

// Loop-stop: er den samme kommando fejlet på samme måde to gange i denne chat, afvises denne ene handling med en besked
// om at finde årsagen først (se loopstop.js). Fejl tælles kun i Claude Code. Et defekt loop-stop må aldrig stoppe noget.
try {
  const stop = require("./loopstop").skalStoppe(input);
  if (stop) {
    const { fil } = require("./tekster");
    const fejl = stop.uddrag ? t("loop.fejl", { fejl: stop.uddrag }) : "";
    afvis(t(stop.antal > 2 ? "loop.igen" : "loop.anden", { antal: stop.antal, fil: fil("fejl") }) + fejl + t("vagt.se", { fil: fil("hvorfor") }));
  }
} catch { /* ikke vigtigt nok til at stoppe noget */ }
