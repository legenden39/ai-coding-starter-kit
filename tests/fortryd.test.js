// Fortryd-hjælpen: gemmepunkter i starten af hver chat, programmet, der henter filer tilbage, og statusfilen ved chattens start.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv } = require("./hjaelp");

const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
function koer(program, args, { cwd, input, vaerktoej, sprog } = {}) {
  const env = { ...process.env };
  delete env.STARTKIT_VAERKTOEJ; delete env.STARTKIT_SPROG;
  if (vaerktoej) env.STARTKIT_VAERKTOEJ = vaerktoej;
  if (sprog) env.STARTKIT_SPROG = sprog;
  const r = spawnSync(program, args, { cwd, input, encoding: "utf8", env });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
}
const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const eksempel = () => laes(__dirname, "eksempel-profil.json");
const gemmepunkt = require(path.join(KIT, "scripts", "projekt", "gemmepunkt.js"));
let nr = 0;
const nyChat = () => `fortryd-test-${process.pid}-${++nr}`;
const sessioner = [];

for (const vaerktoej of ["codex", "claude"]) {
  const rod = nytProjekt();
  // Ingen navn og e-mail i git: gemmepunkter skal virke alligevel (de bruger ikke personens navn).
  git(rod, "config", "--unset", "user.email"); git(rod, "config", "--unset", "user.name");
  skriv(rod, ".startkit/profil.json", eksempel());
  let r = koer("node", [OPSAET, rod], { vaerktoej });
  tjek(`${vaerktoej}: opsætningen lykkes og skriver fortryd-hjælpen`, r.kode === 0 && laes(rod, ".startkit/saadan-fortryder-du.md") !== null && laes(rod, "scripts/startkit/fortryd.js") !== null && laes(rod, "scripts/startkit/gemmepunkt.js") !== null, r.ud + r.fejl);
  const side = laes(rod, ".startkit/saadan-fortryder-du.md") || "";
  tjek(`${vaerktoej}: fortryd-siden nævner det rigtige værktøj og ærlige grænser`, (vaerktoej === "claude" ? /\/rewind/.test(side) && /henter den dem ikke/.test(side) && !/Codex/.test(side) : /Regn ikke med den/.test(side) && !/Claude/.test(side)) && /ikke en sikkerhedskopi/.test(side) && /kommer aldrig med/.test(side) && /fortryde en fortrydelse/.test(side));
  tjek(`${vaerktoej}: reglerne peger på fortryd-siden`, (laes(rod, vaerktoej === "claude" ? "CLAUDE.md" : "AGENTS.md") || "").includes(".startkit/saadan-fortryder-du.md"));

  const vagt = (session, kommando = "git status") => { sessioner.push(session); return koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify({ session_id: session, cwd: rod, hook_event_name: "PreToolUse", tool_name: "Bash", tool_input: { command: kommando } }) }); };
  const fortryd = (...args) => koer("node", [path.join(rod, "scripts", "startkit", "fortryd.js"), ...args], { cwd: rod });
  const filerI = (g) => git(rod, "ls-tree", "-r", "--name-only", g.id).split("\n").filter(Boolean);

  // ---- før første commit ----
  skriv(rod, "src/a.js", "udgave 1\n");
  skriv(rod, ".env", "HEMMELIG=ja\n");
  r = fortryd();
  tjek(`${vaerktoej}: uden gemmepunkter siger programmet det`, r.kode === 0 && /ingen gemmepunkter endnu/.test(r.ud), r.ud + r.fejl);
  const s1 = nyChat();
  r = vagt(s1);
  let alle = gemmepunkt.liste(rod);
  tjek(`${vaerktoej}: første værktøjskald i en chat tager et gemmepunkt, også før første commit og uden navn i git`, r.kode === 0 && r.ud === "" && alle.length === 1, r.ud + r.fejl);
  tjek(`${vaerktoej}: gemmepunktet rummer filer, git ikke kender endnu, men aldrig .env`, alle.length === 1 && filerI(alle[0]).includes("src/a.js") && !filerI(alle[0]).some((f) => /(^|\/)\.env$/.test(f)), alle.length ? filerI(alle[0]).join(", ") : "");
  tjek(`${vaerktoej}: gemmepunktet rører ikke det, der er klar til commit, og laver ingen commit`, git(rod, "status", "--short").includes("?? src/") && koer("git", ["rev-parse", "--verify", "-q", "HEAD"], { cwd: rod }).kode !== 0);
  vagt(s1, "npm test");
  tjek(`${vaerktoej}: kun ét gemmepunkt pr. chat`, gemmepunkt.liste(rod).length === 1);
  vagt(nyChat());
  tjek(`${vaerktoej}: en ny chat uden ændringer tager ikke et nyt gemmepunkt`, gemmepunkt.liste(rod).length === 1);

  // ---- efter en commit ----
  git(rod, "config", "user.email", "test@example.com"); git(rod, "config", "user.name", "Test");
  git(rod, "add", "-A"); git(rod, "commit", "-q", "-m", "start");
  vagt(nyChat());
  tjek(`${vaerktoej}: er alt gemt i git, tages der ikke et gemmepunkt (commit'en er gemmepunktet)`, gemmepunkt.liste(rod).length === 1);
  skriv(rod, "src/a.js", "udgave 2 (ikke gemt i git)\n");
  skriv(rod, "src/ny.js", "en ny fil\n");
  git(rod, "add", "src/ny.js");
  const foerIndex = git(rod, "status", "--short");
  vagt(nyChat());
  alle = gemmepunkt.liste(rod);
  tjek(`${vaerktoej}: arbejde, der ikke er gemt i git, kommer med i gemmepunktet, og git-status er urørt`, alle.length === 2 && git(rod, "show", `${alle[0].id}:src/a.js`) === "udgave 2 (ikke gemt i git)\n" && git(rod, "status", "--short") === foerIndex && git(rod, "log", "--oneline").trim().split("\n").length === 1, git(rod, "status", "--short"));
  tjek(`${vaerktoej}: ingen midlertidige filer efterlades i .git`, !fs.readdirSync(path.join(rod, ".git")).some((f) => /^startkit-index/.test(f)));

  // ---- "AI'en" ødelægger noget, og vi går tilbage ----
  skriv(rod, "src/a.js", "ødelagt\n");
  fs.unlinkSync(path.join(rod, "src", "ny.js"));
  skriv(rod, "src/senere.js", "lavet efter gemmepunktet\n");
  r = fortryd();
  tjek(`${vaerktoej}: listen viser gemmepunkterne med, hvor mange filer der er anderledes`, r.kode === 0 && /Gemmepunkter \(nyeste først\)/.test(r.ud) && /1\. .+\(3 filer er anderledes nu\)/.test(r.ud) && /--hent <nummer>/.test(r.ud), r.ud + r.fejl);
  r = fortryd("--vis", "1");
  tjek(`${vaerktoej}: --vis siger for hver fil, om den er ændret, slettet eller kommet til`, r.kode === 0 && /src\/a\.js  \(ændret siden\)/.test(r.ud) && /src\/ny\.js  \(slettet siden; kan hentes tilbage\)/.test(r.ud) && /src\/senere\.js  \(kommet til siden; bliver liggende\)/.test(r.ud), r.ud + r.fejl);
  r = fortryd("--vis", "9");
  tjek(`${vaerktoej}: et nummer, der ikke findes, giver en forklaring og ændrer intet`, r.kode === 2 && /ikke noget gemmepunkt nummer 9/.test(r.fejl) && laes(rod, "src/a.js") === "ødelagt\n", r.ud + r.fejl);
  r = fortryd("--hent", "1", "src/a.js");
  tjek(`${vaerktoej}: --hent med et filnavn henter kun den fil`, r.kode === 0 && laes(rod, "src/a.js") === "udgave 2 (ikke gemt i git)\n" && laes(rod, "src/ny.js") === null, r.ud + r.fejl);
  tjek(`${vaerktoej}: før der hentes, gemmes det, der lå der, som et nyt gemmepunkt (en fortrydelse kan fortrydes)`, gemmepunkt.liste(rod).length === 3 && git(rod, "show", `${gemmepunkt.liste(rod)[0].id}:src/a.js`) === "ødelagt\n");
  skriv(rod, "src/a.js", "ødelagt igen\n");
  r = fortryd("--hent", "2");
  tjek(`${vaerktoej}: --hent uden filnavn henter alt tilbage, også slettede filer, og sletter intet nyt`, r.kode === 0 && laes(rod, "src/a.js") === "udgave 2 (ikke gemt i git)\n" && laes(rod, "src/ny.js") === "en ny fil\n" && laes(rod, "src/senere.js") === "lavet efter gemmepunktet\n" && /er ikke slettet/.test(r.ud), r.ud + r.fejl);
  tjek(`${vaerktoej}: .env er urørt af det hele`, laes(rod, ".env") === "HEMMELIG=ja\n" && gemmepunkt.liste(rod).every((g) => !filerI(g).some((f) => /(^|\/)\.env$/.test(f))));
  fortryd("--gem");
  r = fortryd("--gem");
  tjek(`${vaerktoej}: --gem siger ærligt, når der ikke er noget nyt at gemme`, r.kode === 0 && /ikke taget et nyt/.test(r.ud), r.ud);
  skriv(rod, "src/a.js", "udgave 3\n");
  r = fortryd("--gem");
  tjek(`${vaerktoej}: --gem tager et gemmepunkt nu`, r.kode === 0 && /Gemmepunkt taget/.test(r.ud) && git(rod, "show", `${gemmepunkt.liste(rod)[0].id}:src/a.js`) === "udgave 3\n", r.ud);
  tjek(`${vaerktoej}: gemmepunkter sendes ikke med op (de ligger uden for grenene)`, gemmepunkt.liste(rod).every((g) => g.ref.startsWith("refs/startkit/gemmepunkt/")) && !git(rod, "branch", "-a").includes("startkit"));

  // ---- vagten: AI'en må bruge fortryd-programmet, men ikke rette i det ----
  const vagtSvar = (tool_name, tool_input) => koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify({ cwd: rod, tool_name, tool_input }) }).ud;
  tjek(`${vaerktoej}: AI'en må køre fortryd-programmet`, vagtSvar("Bash", { command: "node scripts/startkit/fortryd.js --vis 1" }) === "" && vagtSvar("Bash", { command: "node scripts/startkit/fortryd.js --hent 1 src/a.js" }) === "");
  tjek(`${vaerktoej}: en sammensat kommando, der kun ser og skriver tekst ud, er ikke en ændring af kontrollerne`, vagtSvar("Bash", { command: "cd . && node scripts/startkit/fortryd.js; echo ---; node scripts/startkit/fortryd.js --vis 1; echo ---; git status --short" }) === "" && /"deny"/.test(vagtSvar("Bash", { command: "echo x > scripts/startkit/fortryd.js" })) && /"deny"/.test(vagtSvar("Bash", { command: "echo x | tee scripts/startkit/fortryd.js" })));
  tjek(`${vaerktoej}: AI'en må ikke rette i fortryd-programmet eller gemmepunkt-programmet`, /"deny"/.test(vagtSvar("Write", { file_path: path.join(rod, "scripts/startkit/fortryd.js"), content: "" })) && /"deny"/.test(vagtSvar("Bash", { command: "echo x > scripts/startkit/gemmepunkt.js" })));

  // ---- overblikket og tjekket ----
  const html = koer("node", ["-e", "process.stdout.write(require('./scripts/startkit/overblik.js').side())"], { cwd: rod }).ud;
  tjek(`${vaerktoej}: overblikket viser seneste gemmepunkt og hvor mange der er`, /Seneste gemmepunkt: .+\(\d+ i alt\)/.test(html), (html.match(/.{0,40}emmepunkt.{0,80}/) || [""])[0]);
  git(rod, "config", "core.hooksPath", ".githooks");
  r = koer("node", [path.join(KIT, "scripts", "tjek-opsaetning.js"), rod], { vaerktoej });
  tjek(`${vaerktoej}: tjekket af opsætningen er grønt og ser fortryd-hjælpen`, r.kode === 0 && /✅ \.startkit\/saadan-fortryder-du\.md findes/.test(r.ud) && /✅ scripts\/startkit\/fortryd\.js findes/.test(r.ud) && (vaerktoej === "claude") === /✅ Statusfilen læses automatisk ind/.test(r.ud), r.ud + r.fejl);

  // En ændring, der hverken flytter filens tidspunkt eller størrelse, må ikke blive overset (git ser ellers kun på de to ting).
  {
    const gammel = new Date(Date.now() - 60000);
    const f = path.join(rod, "samme.txt");
    skriv(rod, "samme.txt", "abcd\n"); fs.utimesSync(f, gammel, gammel); git(rod, "add", "samme.txt");
    skriv(rod, "samme.txt", "wxyz\n"); fs.utimesSync(f, gammel, gammel);
    const g = gemmepunkt.lav(rod, "test");
    tjek(`${vaerktoej}: en ændring med samme tidspunkt og samme størrelse kommer med i gemmepunktet`, g.lavet && git(rod, "show", `${gemmepunkt.liste(rod)[0].id}:samme.txt`) === "wxyz\n", JSON.stringify(g));
    git(rod, "rm", "-q", "--cached", "samme.txt"); fs.unlinkSync(f);
  }

  // ---- kun de nyeste gemmes ----
  for (let i = 0; i < gemmepunkt.BEHOLD + 3; i++) { skriv(rod, "src/a.js", `runde ${i}\n`); gemmepunkt.lav(rod, "test"); }
  tjek(`${vaerktoej}: kun de ${gemmepunkt.BEHOLD} nyeste gemmepunkter beholdes`, gemmepunkt.liste(rod).length === gemmepunkt.BEHOLD && git(rod, "show", `${gemmepunkt.liste(rod)[0].id}:src/a.js`) === `runde ${gemmepunkt.BEHOLD + 2}\n`, String(gemmepunkt.liste(rod).length));

  // ---- statusfilen ved chattens start ----
  const start = (input) => koer("node", [path.join(rod, "scripts", "startkit", "start.js")], { cwd: rod, input });
  skriv(rod, "STATUS.md", "# Status\n\n## Nu\n- Bygger login\n\n## Næste skridt\n- Test betaling\n");
  r = start(JSON.stringify({ session_id: "x", cwd: rod, hook_event_name: "SessionStart", source: "startup" }));
  tjek(`${vaerktoej}: start.js skriver statusfilen ud, og kun den, når fejllisten er tom`, r.kode === 0 && /Startkit: sådan står projektet/.test(r.ud) && /Test betaling/.test(r.ud) && !/fejl, der ikke må ske igen/.test(r.ud), r.ud + r.fejl);
  skriv(rod, "docs/gentagne-fejl.md", "| Dato | Hvad | Årsag | Låst af |\n|---|---|---|---|\n| 2026-11-01 | glemte test | hastværk | nej |\n");
  r = start(JSON.stringify({ cwd: rod, source: "compact" }));
  tjek(`${vaerktoej}: start.js tager fejllisten med, når der står noget i den`, /fejl, der ikke må ske igen \(docs\/gentagne-fejl\.md\)/.test(r.ud) && /glemte test/.test(r.ud), r.ud);
  skriv(rod, "STATUS.md", Array.from({ length: 200 }, (_, i) => `- linje ${i}`).join("\n") + "\n");
  r = start("{}");
  tjek(`${vaerktoej}: en lang statusfil forkortes, så den ikke koster tokens i hver chat`, /linje 59/.test(r.ud) && !/linje 60\b/.test(r.ud) && /forkortet/.test(r.ud), String(r.ud.split("\n").length));
  r = start("ikke json");
  tjek(`${vaerktoej}: start.js tåler defekt input`, r.kode === 0, r.ud + r.fejl);
  const tom = nytProjekt();
  r = koer("node", [path.join(rod, "scripts", "startkit", "start.js")], { cwd: tom, input: JSON.stringify({ cwd: tom }) });
  tjek(`${vaerktoej}: start.js skriver ingenting i et projekt uden statusfil`, r.kode === 0 && r.ud === "", r.ud + r.fejl);
  const hooks = JSON.parse(laes(rod, vaerktoej === "claude" ? ".claude/settings.local.json" : ".codex/hooks.json"));
  tjek(`${vaerktoej}: ${vaerktoej === "claude" ? "statusfilen kobles på chattens start" : "Codex' hooks er uændrede (ingen ny hook, der skulle godkendes igen)"}`, vaerktoej === "claude" ? hooks.hooks.SessionStart.length === 1 && hooks.hooks.SessionStart[0].matcher === "startup|resume|clear|compact" && /^node ".+\/scripts\/startkit\/start\.js"$/.test(hooks.hooks.SessionStart[0].hooks[0].command) : !hooks.hooks.SessionStart && Object.keys(hooks.hooks).sort().join() === "PreToolUse,Stop", JSON.stringify(hooks.hooks).slice(0, 200));
}

// ---- engelsk ----
{
  const rod = nytProjekt();
  skriv(rod, ".startkit/profile.json", JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Explain along the way." } }));
  let r = koer("node", [OPSAET, rod], { vaerktoej: "claude", sprog: "en" });
  const side = laes(rod, ".startkit/how-to-undo.md") || "";
  tjek("engelsk: fortryd-siden er på engelsk med de engelske flag, og reglerne peger på den", r.kode === 0 && /--restore 1/.test(side) && /\/rewind/.test(side) && !/[æøåÆØÅ]/.test(side) && !/Codex/.test(side) && (laes(rod, "CLAUDE.md") || "").includes(".startkit/how-to-undo.md") && laes(rod, ".startkit/saadan-fortryder-du.md") === null, r.ud + r.fejl);
  skriv(rod, "src/a.js", "version 1\n");
  const session = nyChat(); sessioner.push(session);
  koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify({ session_id: session, cwd: rod, tool_name: "Bash", tool_input: { command: "ls" } }) });
  skriv(rod, "src/a.js", "broken\n");
  r = koer("node", [path.join(rod, "scripts", "startkit", "fortryd.js")], { cwd: rod });
  tjek("engelsk: listen er på engelsk", r.kode === 0 && /Save points \(newest first\)/.test(r.ud) && /--restore <number>/.test(r.ud) && !/[æøåÆØÅ]/.test(r.ud), r.ud + r.fejl);
  tjek("engelsk: én fil skrives i ental", /\(1 file is different now\)/.test(r.ud), r.ud);
  r = koer("node", [path.join(rod, "scripts", "startkit", "fortryd.js"), "--show", "1"], { cwd: rod });
  tjek("engelsk: --show virker", r.kode === 0 && /src\/a\.js  \(changed since\)/.test(r.ud), r.ud + r.fejl);
  r = koer("node", [path.join(rod, "scripts", "startkit", "fortryd.js"), "--restore", "1"], { cwd: rod });
  tjek("engelsk: --restore henter filen tilbage", r.kode === 0 && /Restored from save point 1/.test(r.ud) && laes(rod, "src/a.js") === "version 1\n", r.ud + r.fejl);
  skriv(rod, "STATUS.md", "# Status\n\n## Now\n- Building login\n");
  r = koer("node", [path.join(rod, "scripts", "startkit", "start.js")], { cwd: rod, input: "{}" });
  tjek("engelsk: start.js taler engelsk", /Starter kit: this is where the project stands/.test(r.ud) && /Building login/.test(r.ud), r.ud);
}

for (const s of sessioner) { try { fs.unlinkSync(path.join(os.tmpdir(), `startkit-${s}.json`)); } catch { /* ikke vigtigt */ } }
slut("fortryd");
