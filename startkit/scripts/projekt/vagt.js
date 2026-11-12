// Vagten: AI-værktøjet (Codex eller Claude Code) kører dette script, før det bruger et værktøj (hook: PreToolUse).
// Den læser, hvad AI'en er ved at gøre, og afviser det, reglerne i regler.js forbyder.
// Intet svar = tilladt. Kører aldrig noget selv og bruger ikke internettet.
const fs = require("fs");
const { decide } = require("./regler");
const { rod, huskStart, slaaPuls } = require("./tilstand");
const { t } = require("./tekster");

function afvis(reason) {
  fs.writeSync(1, JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
}

let input;
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); }
catch { afvis(t("vagt.ulaeselig")); process.exit(0); }

// Husk, hvordan koden så ud, da chatten begyndte (bruges af færdig-tjekket). Må aldrig vælte vagten.
// Slå også pulsen, så det kan ses, at AI-værktøjet faktisk kalder vagten. Kun rigtige kald har et chat-id.
let projektrod = null;
try { projektrod = rod(input.cwd); if (projektrod && input.session_id) { huskStart(input.session_id, projektrod); slaaPuls(projektrod, input.tool_name); } } catch { /* ikke vigtigt nok til at stoppe noget */ }

try {
  const svar = decide({ ...input, projektrod: projektrod || undefined }); // reglerne bruger projektmappen til at se, hvad der ligger uden for den
  if (svar.decision === "deny") afvis(svar.reason);
} catch (e) {
  afvis(t("vagt.fejlede", { fejl: e.message }));
}
