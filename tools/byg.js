// Kører begge byggetrin i den rigtige rækkefølge:  node tools/byg.js
// Først udgaven til Claude Code (startkit/claude/), så plugin-mapperne (plugins/), som bygger på den.
const { spawnSync } = require("child_process");
const path = require("path");
for (const f of ["byg-claude.js", "byg-plugin.js"]) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f), ...process.argv.slice(2)], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status || 1);
}
