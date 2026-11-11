// Scanner et projekt for nøgler og adgangskoder. Viser kun filnavn og slags, aldrig selve nøglen.
//
//   node noeglescan.js <projektmappe>              alle filer i mappen (også dem, der ikke er gemt i git endnu)
//   node noeglescan.js <projektmappe> --historik   hele git-historikken
//
// Selve tjekket er det samme script, som git kører før hver commit (assets/pre-commit).
// Det er skrevet til "sh", som følger med Git, men som ikke altid kan findes fra PowerShell.
// Derfor finder dette script selv den sh, der hører til Git.
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

function findSh() {
  const kandidater = ["sh"];
  try {
    const exec = execFileSync("git", ["--exec-path"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    // Git for Windows: <git>\mingw64\libexec\git-core  →  <git>\bin\sh.exe eller <git>\usr\bin\sh.exe
    const gitRod = path.resolve(exec, "..", "..", "..");
    kandidater.push(path.join(gitRod, "bin", "sh.exe"), path.join(gitRod, "usr", "bin", "sh.exe"));
  } catch { /* git mangler: fanges nedenfor */ }
  for (const k of kandidater) {
    const r = spawnSync(k, ["-c", "exit 0"], { stdio: "ignore" });
    if (!r.error && r.status === 0) return k;
  }
  return null;
}

const args = process.argv.slice(2);
const mappe = path.resolve(args.find((a) => !a.startsWith("--")) || process.cwd());
const tilstand = args.includes("--historik") ? "--historik" : "--scan";
if (!fs.existsSync(mappe)) { console.error(`Mappen findes ikke: ${mappe}`); process.exit(2); }

const sh = findSh();
if (!sh) { console.error("Kan ikke finde 'sh'. Den følger med Git for Windows (git-scm.com). Installer Git, og prøv igen."); process.exit(2); }

const script = path.join(__dirname, "..", "assets", "pre-commit").replace(/\\/g, "/");
const r = spawnSync(sh, [script, tilstand], { cwd: mappe, stdio: "inherit" });
process.exit(r.status === null ? 2 : r.status);
