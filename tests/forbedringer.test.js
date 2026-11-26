// Reglerne fra et rigtigt projekt, som kittet nu lægger i hvert projekt: på dansk og engelsk.
// Det her viser, at reglerne og beskederne står der. Om AI'en følger dem, kan en test ikke vise.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, kopierScripts } = require("./hjaelp");
const laes = (...p) => fs.readFileSync(path.join(KIT, ...p), "utf8");

// ---- et samlet ja, ingen stilstand, prøv det som bruger ----
for (const [sprog, fil, krav] of [
  ["da", ["assets", "AGENTS.skabelon.md"], [/prøvet det som en bruger/, /saml alle dine spørgsmål i én liste/, /Ejerens ja til planen dækker det, der står i den/, /Slut hver tur med arbejde, der kører, eller ét konkret spørgsmål øverst/, /`--fuld` tvinger den/]],
  ["en", ["en", "assets", "AGENTS.template.md"], [/tried it as a user/, /gather all your questions in one list/, /The owner's yes to the plan covers what is in it/, /End every turn with work that is running, or one concrete question at the top/, /`--full` forces it/]],
]) {
  const t = laes(...fil);
  for (const k of krav) tjek(`${sprog}: regelfilen har ${k}`, k.test(t));
}

// Færdig-tjekket beder om at prøve det som bruger, når det stopper AI'en.
for (const [sprog, krav] of [["da", /Prøv det derefter som en bruger.+hvad du så/], ["en", /Then try it as a user.+what you saw/]]) {
  const rod = nytProjekt();
  kopierScripts(rod);
  skriv(rod, "a.js", "1\n");
  git(rod, "add", ".");
  git(rod, "commit", "-q", "-m", "start");
  const koer = (script, data) => spawnSync("node", [path.join(rod, "scripts", "startkit", script)], { cwd: rod, input: JSON.stringify({ session_id: `forb-${sprog}-${process.pid}`, cwd: rod, ...data }), encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
  koer("vagt.js", { hook_event_name: "PreToolUse", tool_name: "Edit", tool_input: { file_path: path.join(rod, "a.js") } });
  skriv(rod, "a.js", "2\n");
  const r = koer("faerdig.js", { hook_event_name: "Stop", stop_hook_active: false });
  let grund = ""; try { grund = JSON.parse(r.stdout).reason; } catch { /* intet svar */ }
  tjek(`${sprog}: færdig-tjekket beder om at prøve det som bruger`, krav.test(grund), r.stdout + r.stderr);
}

// ---- låsene i fejllisten tjekkes af beviset ----
for (const [sprog, fejlfil, vaek] of [["da", "docs/gentagne-fejl.md", /En lås i docs\/gentagne-fejl\.md findes ikke længere: tests\/login\.test\.js/], ["en", "docs/recurring-mistakes.md", /A lock in docs\/recurring-mistakes\.md no longer exists: tests\/login\.test\.js/]]) {
  const rod = nytProjekt();
  kopierScripts(rod);
  skriv(rod, ".startkit/config.json", JSON.stringify({ tjek: ["node -v"] }));
  skriv(rod, "tests/login.test.js", "\n");
  skriv(rod, fejlfil, "# Liste\n\n| Dato | Hvad | Årsag | Låst af |\n|---|---|---|---|\n| 2026-01-01 | x | y | `tests/login.test.js` |\n| 2026-01-02 | z | w | tekstregel (`CLAUDE.md` nævner det ikke) |\n| 2026-01-03 | q | r | `scripts/vagt.js:12`, se https://example.com |\n");
  skriv(rod, "scripts/vagt.js", "\n");
  const bevis = () => { const r = spawnSync("node", [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod, encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } }); return { kode: r.status, ud: r.stdout || "" }; };
  let r = bevis();
  tjek(`${sprog}: findes låsene, er beviset grønt (en sti med linjenummer tæller også)`, r.kode === 0, r.ud);
  fs.unlinkSync(path.join(rod, "tests", "login.test.js"));
  r = bevis();
  tjek(`${sprog}: forsvinder en lås, er beviset rødt og siger hvilken`, r.kode === 1 && vaek.test(r.ud), r.ud);
}

// ---- "hænger sammen": skabelonen lægges i projektet, og dens låse tjekkes også ----
for (const [sprog, liste, regel, besked] of [
  ["da", "docs/haenger-sammen.md", /se på ting af samme slags og i `docs\/haenger-sammen\.md`/, /En lås i docs\/haenger-sammen\.md findes ikke længere: tests\/steder\.test\.js/],
  ["en", "docs/what-goes-together.md", /look at things of the same kind and in `docs\/what-goes-together\.md`/, /A lock in docs\/what-goes-together\.md no longer exists: tests\/steder\.test\.js/],
]) {
  const skabelon = laes(...(sprog === "da" ? ["assets", "haenger-sammen.md"] : ["en", "assets", "what-goes-together.md"]));
  tjek(`${sprog}: skabelonen til "hænger sammen" har en tabel med en lås-kolonne`, /\| (Låst af|Locked by) \|/.test(skabelon));
  tjek(`${sprog}: regelfilen peger på "hænger sammen"`, regel.test(laes(...(sprog === "da" ? ["assets", "AGENTS.skabelon.md"] : ["en", "assets", "AGENTS.template.md"]))));
  const rod = nytProjekt();
  kopierScripts(rod);
  skriv(rod, ".startkit/config.json", JSON.stringify({ tjek: ["node -v"] }));
  skriv(rod, liste, skabelon + "| side for et sted | gennemgang | `tests/steder.test.js` |\n");
  const r = spawnSync("node", [path.join(rod, "scripts", "startkit", "bevis.js")], { cwd: rod, encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
  tjek(`${sprog}: en manglende lås i "hænger sammen" gør beviset rødt`, r.status === 1 && besked.test(r.stdout), r.stdout);
}
for (const [sprog, liste] of [["da", "docs/haenger-sammen.md"], ["en", "docs/what-goes-together.md"]]) {
  const rod = nytProjekt();
  skriv(rod, ".startkit/profil.json", fs.readFileSync(path.join(__dirname, "eksempel-profil.json"), "utf8"));
  const r = spawnSync("node", [path.join(KIT, "scripts", "opsaet.js"), rod], { encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
  tjek(`${sprog}: opsætningen lægger ${liste} i projektet`, r.status === 0 && fs.existsSync(path.join(rod, liste)), r.stdout + r.stderr);
}

// ---- statuslinjen (kun Claude Code) ----
for (const [sprog, ny, ok, fuld] of [["da", /^Chatten: ny$/, /^Chatten: 45 % brugt$/, /^Chatten: 72 % brugt · skift snart til en ny chat/], ["en", /^Chat: new$/, /^Chat: 45 % used$/, /^Chat: 72 % used · switch to a new chat soon/]]) {
  const linje = (input) => spawnSync("node", [path.join(KIT, "scripts", "projekt", "statuslinje.js")], { input, encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
  let r = linje(JSON.stringify({ context_window: { used_percentage: null } }));
  tjek(`${sprog}: statuslinjen uden tal (tidligt i chatten)`, r.status === 0 && ny.test(r.stdout), r.stdout + r.stderr);
  r = linje(JSON.stringify({ context_window: { used_percentage: 44.6 } }));
  tjek(`${sprog}: statuslinjen viser, hvor meget af chatten der er brugt`, ok.test(r.stdout), r.stdout);
  r = linje(JSON.stringify({ context_window: { used_percentage: 72 } }));
  tjek(`${sprog}: ved 70 % eller mere siger den, at det er tid til en ny chat`, fuld.test(r.stdout), r.stdout);
  r = linje("ikke json");
  tjek(`${sprog}: ødelagt input får ikke statuslinjen til at fejle`, r.status === 0 && ny.test(r.stdout), r.stdout + r.stderr);
}

// ---- opsætningen i Claude Code: statuslinje og spærring mod at skrive uden for projektmappen ----
const opsaetSom = (vaerktoej, rod) => spawnSync("node", [path.join(KIT, "scripts", "opsaet.js"), rod], { encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: "da", STARTKIT_VAERKTOEJ: vaerktoej } });
const medProfil = () => { const rod = nytProjekt(); skriv(rod, ".startkit/profil.json", fs.readFileSync(path.join(__dirname, "eksempel-profil.json"), "utf8")); return rod; };
let rod = medProfil();
let r = opsaetSom("claude", rod);
let ind = {}; try { ind = JSON.parse(fs.readFileSync(path.join(rod, ".claude", "settings.local.json"), "utf8")); } catch { /* ingen fil */ }
tjek("claude: opsætningen spærrer skrivning uden for projektmappen", r.status === 0 && ind.permissions && ind.permissions.blockWritesOutsideWorkingDirectories === true, r.stdout + r.stderr);
tjek("claude: opsætningen sætter statuslinjen op med kittets script", ind.statusLine && ind.statusLine.type === "command" && /scripts\/startkit\/statuslinje\.js/.test(ind.statusLine.command) && fs.existsSync(path.join(rod, "scripts", "startkit", "statuslinje.js")));
rod = medProfil();
skriv(rod, ".claude/settings.local.json", JSON.stringify({ statusLine: { type: "command", command: "min-egen.sh" }, permissions: { blockWritesOutsideWorkingDirectories: false } }));
opsaetSom("claude", rod);
ind = JSON.parse(fs.readFileSync(path.join(rod, ".claude", "settings.local.json"), "utf8"));
tjek("claude: personens egen statuslinje og eget valg om spærringen bevares", ind.statusLine.command === "min-egen.sh" && ind.permissions.blockWritesOutsideWorkingDirectories === false, JSON.stringify(ind));
rod = medProfil();
opsaetSom("codex", rod);
const codex = fs.readFileSync(path.join(rod, ".codex", "hooks.json"), "utf8");
tjek("codex: ingen statuslinje eller Claude-indstillinger i Codex' fil", !/statusLine|blockWritesOutside/.test(codex));

// ---- ugentligt sikkerhedstjek ----
tjek("da: regelfilen har det ugentlige sikkerhedstjek, der kun læser", /Én gang om ugen: tilbyd et sikkerhedstjek, der kun læser/.test(laes("assets", "AGENTS.skabelon.md")));
tjek("en: regelfilen har det ugentlige sikkerhedstjek, der kun læser", /Once a week: offer a security check that only reads/.test(laes("en", "assets", "AGENTS.template.md")));
tjek("projekttrinnet foreslår forbud mod direkte udrulning, på begge sprog", /den direkte kommando forbydes/.test(laes("references", "projekt-trin.md")) && /the direct command is forbidden/.test(laes("en", "references", "project-steps.md")));

slut("forbedringer");
