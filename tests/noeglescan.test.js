// Nøglescannet må ikke blive langsomt i et projekt med mange filer.
//
// Baggrund: scannet tog over to minutter på 222 filer på Windows. Det hang ikke; det startede
// programmet grep ca. 14 gange pr. fil, og på Windows koster hver programstart ca. 50-70 ms.
// Tid er upålidelig at teste på, så testen tæller i stedet, hvor mange gange grep bliver startet.
// Det gør den med en lille "tælle-grep", der lægges forrest i PATH og sender videre til den rigtige.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, falskNoegle } = require("./hjaelp");

const SCRIPT = path.join(KIT, "assets", "pre-commit").replace(/\\/g, "/");
const kasse = fs.mkdtempSync(path.join(os.tmpdir(), "startkit-grep-"));
const taeller = path.join(kasse, "taeller.txt");
fs.mkdirSync(path.join(kasse, "shim"));
// Tælle-grep: skriv én linje i tælleren, fjern dig selv fra PATH, og kør den rigtige grep.
fs.writeFileSync(path.join(kasse, "shim", "grep"), '#!/bin/sh\necho x >> "$GREP_TAELLER"\nPATH="${PATH#*:}" exec grep "$@"\n', { mode: 0o755 });

function miljoe() {
  const env = { ...process.env, GREP_TAELLER: taeller, STARTKIT_SPROG: "da" };
  const noegle = Object.keys(env).find((k) => k.toUpperCase() === "PATH") || "PATH";
  env[noegle] = path.join(kasse, "shim") + path.delimiter + (env[noegle] || "");
  return env;
}
function sh(program, args, cwd) {
  fs.writeFileSync(taeller, "");
  const r = spawnSync(program, args, { cwd, encoding: "utf8", env: miljoe() });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "", fejlet: !!r.error, grep: fs.readFileSync(taeller, "utf8").split("\n").length - 1 };
}

// Find en sh, hvor tælle-grep'en faktisk bliver brugt. (Git for Windows' bin\sh.exe sætter sine egne mapper forrest i PATH.)
const kandidater = ["sh"];
try {
  const rod = path.resolve(execFileSync("git", ["--exec-path"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(), "..", "..", "..");
  kandidater.push(path.join(rod, "usr", "bin", "sh.exe"), path.join(rod, "bin", "sh.exe"));
} catch { /* git mangler: så fejler resten af testene alligevel */ }
const SH = kandidater.find((k) => { const r = sh(k, ["-c", "echo a | grep -q a"]); return !r.fejlet && r.kode === 0 && r.grep === 1; });
tjek("tælle-grep: der findes en sh, hvor grep-starter kan tælles", !!SH, `prøvet: ${kandidater.join(", ")}`);

if (SH) {
  // ---- 60 rene filer: antallet af grep-starter må ikke vokse med antallet af filer ----
  const rod = nytProjekt();
  const ANTAL = 60;
  for (let i = 0; i < ANTAL; i++) skriv(rod, `mappe ${i % 3}/fil ${i}.txt`, `helt almindelig tekst nummer ${i}\n`);
  skriv(rod, "billede.png", "ikke et rigtigt billede\n");
  let r = sh(SH, [SCRIPT, "--scan"], rod);
  tjek("scan af 60 rene filer: melder rent", r.kode === 0 && /Ingen nøgler fundet \(scan\)/.test(r.ud), r.ud + r.fejl);
  tjek(`scan af 60 rene filer: starter grep færre gange, end der er filer (var ${r.grep})`, r.grep > 0 && r.grep < ANTAL, `grep blev startet ${r.grep} gange`);

  // ---- det hurtige scan finder stadig det samme ----
  skriv(rod, "mappe 1/min nøgle fil.txt", `noegle = ${falskNoegle()}\n`);
  skriv(rod, "-streg.txt", "en fil, der starter med en streg\n");
  skriv(rod, "foto.png", `noegle = ${falskNoegle()}\n`);
  skriv(rod, "hemmelig.pem", "ingenting\n");
  r = sh(SH, [SCRIPT, "--scan"], rod);
  tjek("scan med mange filer: finder nøglen i en fil med mellemrum og æøå i navnet", r.kode === 1 && /mappe 1\/min nøgle fil\.txt: Anthropic-nøgle/.test(r.fejl), r.ud + r.fejl);
  tjek("scan med mange filer: viser ikke selve nøglen", !r.fejl.includes(falskNoegle()) && !r.ud.includes(falskNoegle()), r.ud + r.fejl);
  tjek("scan med mange filer: billeder springes over, og hemmelighedsfiler meldes efter navn", !/foto\.png/.test(r.fejl) && /hemmelig\.pem: filtypen/.test(r.fejl), r.fejl);
  tjek("scan med mange filer: kun de to fund meldes", r.fejl.split("\n").filter((l) => /^ {2}\S/.test(l)).length === 2, r.fejl);

  // ---- hooken før commit: samme lås, og samme fund ----
  for (const f of ["mappe 1/min nøgle fil.txt", "foto.png", "hemmelig.pem"]) fs.unlinkSync(path.join(rod, f));
  git(rod, "add", "-A");
  r = sh(SH, [SCRIPT], rod);
  tjek(`hook med 60 rene filer: går igennem og starter grep færre gange, end der er filer (var ${r.grep})`, r.kode === 0 && r.grep > 0 && r.grep < ANTAL, `kode ${r.kode}, grep blev startet ${r.grep} gange\n${r.fejl}`);
  skriv(rod, "mappe 2/ny fil.txt", `noegle = ${falskNoegle()}\n`);
  git(rod, "add", "-A");
  r = sh(SH, [SCRIPT], rod);
  tjek("hook med mange filer: stopper stadig en commit med en nøgle", r.kode === 1 && /COMMIT STOPPET/.test(r.fejl) && /mappe 2\/ny fil\.txt: Anthropic-nøgle/.test(r.fejl) && !r.fejl.includes(falskNoegle()), r.ud + r.fejl);
}

slut("noeglescan");
