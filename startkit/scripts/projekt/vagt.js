// Vagten: Codex kører dette script, før den bruger et værktøj (hook: PreToolUse).
// Den læser, hvad Codex er ved at gøre, og afviser det, reglerne i regler.js forbyder.
// Intet svar = tilladt. Kører aldrig noget selv og bruger ikke internettet.
const fs = require("fs");
const { decide } = require("./regler");
const { rod, huskStart } = require("./tilstand");

function afvis(reason) {
  fs.writeSync(1, JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
}

let input;
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); }
catch { afvis("Vagten kunne ikke læse, hvad der skulle ske, og afviser derfor for en sikkerheds skyld. Prøv igen; sker det flere gange, så sig det til ejeren."); process.exit(0); }

// Husk, hvordan koden så ud, da chatten begyndte (bruges af færdig-tjekket). Må aldrig vælte vagten.
try { const r = rod(input.cwd); if (r && input.session_id) huskStart(input.session_id, r); } catch { /* ikke vigtigt nok til at stoppe noget */ }

try {
  const svar = decide(input);
  if (svar.decision === "deny") afvis(svar.reason);
} catch (e) {
  afvis(`Vagten fejlede (${e.message}) og afviser derfor for en sikkerheds skyld. Sig det til ejeren.`);
}
