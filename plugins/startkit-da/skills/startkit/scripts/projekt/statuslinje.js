// Statuslinjen (kun Claude Code): viser nederst, hvor fuld chatten er, og siger til ved ca. 70 %.
// Claude Code sender oplysningerne som JSON; feltet context_window.used_percentage er "hvor meget af chatten der er brugt".
// Scriptet må aldrig fejle højt: mangler noget, skrives en kort linje uden tal.
const fs = require("fs");
const { t } = require("./tekster");
const GRAENSE = 70;

let procent = null;
try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  const v = input && input.context_window && input.context_window.used_percentage;
  if (typeof v === "number" && isFinite(v)) procent = Math.round(v);
} catch { /* intet at vise */ }

if (procent === null) process.stdout.write(t("statuslinje.ny"));
else process.stdout.write(t(procent >= GRAENSE ? "statuslinje.fuld" : "statuslinje.ok", { procent }));
