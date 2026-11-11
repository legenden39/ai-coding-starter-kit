// Kører alle test-filer:  node tests/run.js
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

let roede = 0;
for (const fil of fs.readdirSync(__dirname).filter((f) => f.endsWith(".test.js")).sort()) {
  const r = spawnSync(process.execPath, [path.join(__dirname, fil)], { stdio: "inherit" });
  if (r.status !== 0) roede++;
}
console.log(roede ? `\n${roede} testfil(er) er røde.` : "\nAlle testfiler er grønne.");
process.exit(roede ? 1 : 0);
