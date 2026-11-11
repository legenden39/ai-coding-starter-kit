// Viser overblikssiden med opdigtede prøvedata, så man kan se, hvordan den ser ud:
//   node tests/demo-overblik.js      (åbn http://127.0.0.1:4311)
// Laver et midlertidigt prøveprojekt uden for kittet. Rører ingen rigtige projekter.
const path = require("path");
const { spawn } = require("child_process");
const { nytProjekt, git, skriv, kopierScripts } = require("./hjaelp");

const rod = nytProjekt();
kopierScripts(rod);
skriv(rod, "src/app.js", "module.exports = 1;\n");
git(rod, "add", ".");
git(rod, "commit", "-q", "-m", "Første udgave: gem et spil");
skriv(rod, "STATUS.md", "# Status: Kortspil-log\n\n## Nu\n- Bygger statistik-siden\n\n## Sidst lavet\n- Man kan gemme et spil\n- Listen over spil vises\n\n## Næste skridt\n- Graf over de seneste 30 dage\n\n## Åbne problemer\n- Datoer vises i forkert tidszone\n");
skriv(rod, "docs/gentagne-fejl.md", "| Dato | Hvad skete der | Årsag | Låst af |\n|---|---|---|---|\n| 2026-11-03 | Sagde færdig uden at prøve | Intet bevis krævet | hook |\n| 2026-11-08 | Lavede en ny mappe til kopier | Ingen regel | nej |\n");
skriv(rod, ".startkit/config.json", JSON.stringify({ tjek: ['node -e "process.exit(0)"'], modelguide: ["Mindste model: enkle rettelser og små spørgsmål", "Mellemmodel: almindelig bygning efter en plan", "Stærkeste model: arkitektur, penge, persondata og svære fejl"], graense_procent: 85 }));
skriv(rod, "src/statistik.js", "module.exports = 2;\n");
const node = process.execPath;
require("child_process").execFileSync(node, [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod, stdio: "ignore" });
require("child_process").execFileSync(node, [path.join(rod, "scripts", "startkit", "forbrug-gem.js"), "--5t", "40", "--uge", "88"], { cwd: rod, stdio: "ignore" });
spawn(node, [path.join(rod, "scripts", "startkit", "overblik.js")], { cwd: rod, stdio: "inherit" });
