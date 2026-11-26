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

slut("forbedringer");
