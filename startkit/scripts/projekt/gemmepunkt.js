// Gemmepunkter: et øjebliksbillede af projektets filer, taget automatisk i starten af hver chat (se vagt.js).
// Går noget galt, kan man hente filerne tilbage med fortryd.js, også det, der aldrig nåede at blive gemt i git.
//
//  * Et gemmepunkt rører hverken dine filer, din gren eller din git-historik. Det ligger for sig selv i git
//    (under refs/startkit/gemmepunkt/) og bliver på din egen computer; det sendes ikke med op til GitHub.
//  * Filer, der står i .gitignore (fx .env med dine nøgler), kommer aldrig med i et gemmepunkt.
//  * Kun de nyeste gemmes (se BEHOLD). Er intet ændret siden sidste gemmepunkt eller sidste commit, laves der ikke et nyt.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REF = "refs/startkit/gemmepunkt/";
const BEHOLD = 30;
// Git kræver et navn på den, der gemmer. Personens eget navn bruges ikke, og intet her forlader computeren.
const HVEM = { GIT_AUTHOR_NAME: "startkit", GIT_AUTHOR_EMAIL: "startkit@example.invalid", GIT_COMMITTER_NAME: "startkit", GIT_COMMITTER_EMAIL: "startkit@example.invalid" };

// Git må ikke lave linjeskift om, hverken når et gemmepunkt tages, eller når filer hentes tilbage (på Windows gør git det
// som standard). Ellers ville en fil komme tilbage med andre linjeskift, end den havde.
const UROERT = ["-c", "core.autocrlf=false", "-c", "core.safecrlf=false"];
function git(root, args, env) {
  try { return execFileSync("git", [...UROERT, ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024, env: { ...process.env, ...env } }).replace(/\s+$/, ""); }
  catch { return null; }
}

// Alle gemmepunkter, nyeste først: [{ ref, id, at }]
function liste(root) {
  const ud = git(root, ["for-each-ref", "--sort=-refname", "--format=%(refname) %(objectname) %(committerdate:iso-strict)", REF]);
  if (!ud) return [];
  return ud.split("\n").filter(Boolean).map((l) => { const [ref, id, at] = l.split(" "); return { ref, id, at }; });
}

// Laver et gemmepunkt af alt, der ligger i projektet lige nu (også filer, git ikke kender endnu).
// Svarer { lavet: true, ref } eller { lavet: false, grund }. Kaster aldrig.
function lav(root, besked = "gemmepunkt") {
  try {
    const gitdir = git(root, ["rev-parse", "--absolute-git-dir"]);
    if (!gitdir) return { lavet: false, grund: "ikke-git" };
    // Et midlertidigt register, så personens eget (det, der er klar til commit) ikke bliver rørt.
    const index = path.join(gitdir, `startkit-index.${process.pid}`);
    try {
      // Registret starter tomt med vilje: så læser git hver fils indhold. Et kopieret register kan overse en ændring,
      // der er lavet i samme sekund og har samme størrelse som før, og et gemmepunkt må aldrig mangle noget.
      const env = { ...HVEM, GIT_INDEX_FILE: index };
      if (git(root, ["add", "-A"], env) === null) return { lavet: false, grund: "kunne-ikke-laese" };
      const trae = git(root, ["write-tree"], env);
      if (!trae) return { lavet: false, grund: "kunne-ikke-laese" };
      const hoved = git(root, ["rev-parse", "--verify", "-q", "HEAD"]);
      const sidste = liste(root)[0];
      const sammeSom = (commit) => commit && git(root, ["rev-parse", `${commit}^{tree}`]) === trae;
      if (sammeSom(hoved) || sammeSom(sidste && sidste.id)) return { lavet: false, grund: "intet-nyt" };
      if (!hoved && trae === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") return { lavet: false, grund: "intet-nyt" }; // tomt projekt
      const commit = git(root, ["commit-tree", trae, ...(hoved ? ["-p", hoved] : []), "-m", besked], env);
      if (!commit) return { lavet: false, grund: "kunne-ikke-gemme" };
      // Navnet er tidspunktet plus et løbenummer med faste cifre, så de altid står i rækkefølge, også når to laves i samme sekund.
      const stempel = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
      const navn = (n) => `${REF}${stempel}-${String(n).padStart(3, "0")}`;
      let n = 1;
      while (git(root, ["rev-parse", "--verify", "-q", navn(n)])) n++;
      const ref = navn(n);
      if (git(root, ["update-ref", ref, commit]) === null) return { lavet: false, grund: "kunne-ikke-gemme" };
      for (const gammel of liste(root).slice(BEHOLD)) git(root, ["update-ref", "-d", gammel.ref]);
      return { lavet: true, ref };
    } finally { try { fs.unlinkSync(index); } catch { /* fandtes ikke */ } try { fs.unlinkSync(index + ".lock"); } catch { /* fandtes ikke */ } }
  } catch { return { lavet: false, grund: "fejl" }; }
}

// De filer, der er anderledes nu end i gemmepunktet (ændret, slettet eller kommet til siden).
function forskel(root, gemmepunkt) {
  const gitdir = git(root, ["rev-parse", "--absolute-git-dir"]);
  if (!gitdir) return [];
  const index = path.join(gitdir, `startkit-index.${process.pid}`);
  try {
    const env = { GIT_INDEX_FILE: index };
    git(root, ["add", "-A"], env);
    const ud = git(root, ["-c", "core.quotepath=off", "diff", "--cached", "--name-status", gemmepunkt.id], env);
    // Set fra gemmepunktet: A = filen er kommet til siden, D = filen er væk nu, M = filen er ændret.
    return (ud || "").split("\n").filter(Boolean).map((l) => { const [slags, ...fil] = l.split("\t"); return { slags: slags[0], fil: fil.join("\t") }; });
  } finally { try { fs.unlinkSync(index); } catch { /* fandtes ikke */ } }
}

// Henter filer tilbage fra et gemmepunkt. Filer, der er kommet til siden, bliver liggende; intet slettes.
function hent(root, gemmepunkt, filer = []) {
  const args = ["restore", "--source", gemmepunkt.id, "--worktree", "--overlay", "--", ...(filer.length ? filer : ["."])];
  try { execFileSync("git", [...UROERT, ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); return { ok: true }; }
  catch (e) { return { ok: false, fejl: String(e.stderr || e.message).trim().split("\n")[0] }; }
}

module.exports = { lav, liste, forskel, hent, REF, BEHOLD };
