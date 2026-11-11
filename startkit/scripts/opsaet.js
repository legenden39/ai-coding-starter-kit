// Sætter det faste fundament op i et projekt ud fra profilen (.startkit/profil.json).
//
//   node opsaet.js <projektmappe> --toer     viser, hvad der vil ske, uden at skrive noget
//   node opsaet.js <projektmappe>            skriver filerne
//
// Samme profil giver altid samme resultat, og scriptet kan køres igen uden at lave dubletter.
// Personens egne filer overskrives ikke: i AGENTS.md røres kun blokken mellem startkittets mærker,
// i .codex/hooks.json røres kun startkittets egne poster, og STATUS.md m.fl. laves kun, hvis de mangler.
const fs = require("fs");
const path = require("path");
const { harNoegle } = require("./projekt/regler");

const ASSETS = path.join(__dirname, "..", "assets");
const PROJEKT_SCRIPTS = path.join(__dirname, "projekt");
const START = "<!-- startkit:start", SLUT = "<!-- startkit:slut -->";
const lf = (s) => String(s).replace(/\r\n/g, "\n");
const laes = (p) => { try { return lf(fs.readFileSync(p, "utf8")); } catch { return null; } };

function valider(profil) {
  const fejl = [];
  const tekst = (v) => typeof v === "string" && v.trim().length > 0;
  if (!profil || typeof profil !== "object") return ["Profilen er ikke et JSON-objekt."];
  if (!tekst(profil.person && profil.person.navn)) fejl.push("person.navn mangler.");
  const projekter = Array.isArray(profil.projekter) ? profil.projekter : [];
  const valgt = projekter.find((p) => p && p.navn === profil.valgt_projekt) || projekter[0];
  if (!valgt || !tekst(valgt.navn) || !tekst(valgt.beskrivelse)) fejl.push("Der mangler et projekt med navn og beskrivelse (projekter[] og valgt_projekt).");
  const regler = profil.regler || {};
  if (!Array.isArray(regler.aldrig_uden_ok) || !regler.aldrig_uden_ok.filter(tekst).length) fejl.push("regler.aldrig_uden_ok skal være en liste med mindst én ting.");
  if (!tekst(regler.svarform)) fejl.push("regler.svarform mangler.");
  if (profil.tjek_kommandoer !== undefined && !(Array.isArray(profil.tjek_kommandoer) && profil.tjek_kommandoer.every((k) => typeof k === "string"))) fejl.push("tjek_kommandoer skal være en liste af tekster.");
  if (harNoegle(JSON.stringify(profil))) fejl.push("Profilen indeholder noget, der ligner en nøgle. Fjern den (og skift nøglen hos udbyderen); nøgler må aldrig stå i profilen.");
  return fejl;
}

const enLinje = (s) => String(s).replace(/\s+/g, " ").trim();

function agentsBlok(profil) {
  const projekter = profil.projekter || [];
  const valgt = projekter.find((p) => p.navn === profil.valgt_projekt) || projekter[0];
  const regler = profil.regler;
  const udfyld = {
    PROJEKT: enLinje(valgt.navn),
    BESKRIVELSE: enLinje(valgt.beskrivelse),
    NAVN: enLinje(profil.person.navn),
    ALDRIG_UDEN_OK: regler.aldrig_uden_ok.map(enLinje).filter(Boolean).join("; "),
    VED_TVIVL: enLinje(regler.ved_tvivl || "spørg ejeren"),
    SVARFORM: enLinje(regler.svarform),
  };
  return laes(path.join(ASSETS, "AGENTS.skabelon.md")).replace(/\{\{(\w+)\}\}/g, (_, k) => udfyld[k] ?? "").trim();
}

function flettAgents(eksisterende, blok) {
  if (eksisterende === null) return blok + "\n";
  const a = eksisterende.indexOf(START), b = eksisterende.indexOf(SLUT);
  if (a >= 0 && b > a) return eksisterende.slice(0, a) + blok + eksisterende.slice(b + SLUT.length);
  return eksisterende.replace(/\s*$/, "") + "\n\n" + blok + "\n";
}

// Startkittets hooks peger på scripts i projektet med fuld sti, så de virker, uanset hvilken mappe Codex står i.
function voresHooks(root) {
  const sti = (fil) => `node "${path.join(root, "scripts", "startkit", fil).replace(/\\/g, "/")}"`;
  return {
    PreToolUse: { matcher: "Bash|apply_patch|Edit|Write", hooks: [{ type: "command", command: sti("vagt.js"), timeout: 30, statusMessage: "Startkit: vagten tjekker" }] },
    Stop: { hooks: [{ type: "command", command: sti("faerdig.js"), timeout: 60, statusMessage: "Startkit: færdig-tjek" }] },
  };
}
const erVores = (gruppe) => Array.isArray(gruppe && gruppe.hooks) && gruppe.hooks.some((h) => /scripts\/startkit\//.test(String((h && h.command) || "").replace(/\\/g, "/")));

function flettHooks(eksisterendeTekst, root) {
  let data = {};
  if (eksisterendeTekst !== null && eksisterendeTekst.trim()) {
    try { data = JSON.parse(eksisterendeTekst); } catch { throw new Error(".codex/hooks.json findes, men kan ikke læses som JSON. Ret filen (eller flyt den), og kør opsætningen igen."); }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) data = {};
  if (!data.hooks || typeof data.hooks !== "object") data.hooks = {};
  for (const [event, gruppe] of Object.entries(voresHooks(root))) {
    const andre = (Array.isArray(data.hooks[event]) ? data.hooks[event] : []).filter((g) => !erVores(g));
    data.hooks[event] = [...andre, gruppe];
  }
  return JSON.stringify(data, null, 2) + "\n";
}

function flettGitignore(eksisterende) {
  const har = new Set((eksisterende || "").split("\n").map((l) => l.trim()));
  const mangler = laes(path.join(ASSETS, "gitignore-tillaeg.txt")).split("\n").map((l) => l.trim()).filter((l) => l && !har.has(l));
  if (!mangler.length) return eksisterende;
  return (eksisterende ? eksisterende.replace(/\s*$/, "") + "\n\n" : "") + "# Tilføjet af startkittet\n" + mangler.join("\n") + "\n";
}

// Kittets version står ét sted (filen VERSION) og skrives i feedback-filen, så man kan se, hvilken udgave feedbacken gælder.
const version = () => (laes(path.join(__dirname, "..", "VERSION")) || "ukendt").trim();
const feedbackSkabelon = () => laes(path.join(ASSETS, "feedback.skabelon.md")).replace(/\{\{VERSION\}\}/g, version());

// Regner ud, hvad der skal skrives. Skriver intet selv.
function plan(root, profil) {
  const trin = [];
  const p = (...dele) => path.join(root, ...dele);
  const saet = (rel, indhold, note) => {
    const foer = laes(p(rel));
    trin.push({ rel, indhold, handling: foer === null ? "ny" : foer === lf(indhold) ? "uændret" : "opdateres", note });
  };
  const kunHvisMangler = (rel, indhold, note) => {
    if (fs.existsSync(p(rel))) trin.push({ rel, indhold: null, handling: "findes (røres ikke)", note });
    else trin.push({ rel, indhold, handling: "ny", note });
  };
  const projekter = profil.projekter || [];
  const valgt = projekter.find((x) => x.navn === profil.valgt_projekt) || projekter[0];

  saet("AGENTS.md", flettAgents(laes(p("AGENTS.md")), agentsBlok(profil)), "korte, faste regler; kun startkittets blok ændres");
  kunHvisMangler("STATUS.md", laes(path.join(ASSETS, "projektstatus.skabelon.md")).replace(/\{\{PROJEKT\}\}/g, enLinje(valgt.navn)), "hvor vi er, fra gang til gang");
  kunHvisMangler("docs/gentagne-fejl.md", laes(path.join(ASSETS, "gentagne-fejl.md")), "fejl, der ikke må ske igen");
  saet(".startkit/hvorfor-blev-jeg-stoppet.md", laes(path.join(ASSETS, "hvorfor-blev-jeg-stoppet.md")), "forklaring af kontrollerne");
  kunHvisMangler(".startkit/status.md", laes(path.join(ASSETS, "forloeb.skabelon.md")), "hvor langt startkittet er");
  kunHvisMangler(".startkit/config.json", JSON.stringify({ tjek: profil.tjek_kommandoer || [], modelguide: [], graense_procent: 85 }, null, 2) + "\n", "hvilke kommandoer beviser, at det virker");
  for (const fil of fs.readdirSync(PROJEKT_SCRIPTS).sort()) saet(`scripts/startkit/${fil}`, laes(path.join(PROJEKT_SCRIPTS, fil)), "vagt, færdig-tjek, bevis og overblik");
  // Windows-genvej (dobbeltklik). Skrives med CRLF, som .cmd-filer forventer.
  saet("overblik.cmd", laes(path.join(ASSETS, "overblik.cmd")).replace(/\n/g, "\r\n"), "dobbeltklik for at åbne overblikket i browseren");
  kunHvisMangler(".startkit/feedback.md", feedbackSkabelon(), "din feedback på startkittet (sendes aldrig automatisk)");
  saet(".githooks/pre-commit", laes(path.join(ASSETS, "pre-commit")), "nøgletjek og længdelås før commit");
  saet(".codex/hooks.json", flettHooks(laes(p(".codex/hooks.json")), root), "tænder vagten og færdig-tjekket i Codex (skal godkendes med /hooks)");
  const gi = flettGitignore(laes(p(".gitignore")));
  if (gi !== laes(p(".gitignore"))) saet(".gitignore", gi, "holder nøglefiler ude af git");
  return trin;
}

function main() {
  const args = process.argv.slice(2);
  const toer = args.includes("--toer");
  const mappe = args.find((a) => !a.startsWith("--"));
  if (!mappe) { console.error("Brug: node opsaet.js <projektmappe> [--toer]"); return 2; }
  const root = path.resolve(mappe);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(`Mappen findes ikke: ${root}`); return 2; }
  const profilTekst = laes(path.join(root, ".startkit", "profil.json"));
  if (profilTekst === null) { console.error("Der er ingen profil endnu (.startkit/profil.json). Lav interviewet først."); return 2; }
  let profil;
  try { profil = JSON.parse(profilTekst); } catch { console.error(".startkit/profil.json kan ikke læses som JSON."); return 2; }
  const fejl = valider(profil);
  if (fejl.length) { console.error("Profilen mangler noget:\n" + fejl.map((f) => "  - " + f).join("\n")); return 2; }

  let trin;
  try { trin = plan(root, profil); } catch (e) { console.error(e.message); return 2; }
  console.log(toer ? `Det her vil blive sat op i ${root} (intet er skrevet endnu):\n` : `Sætter op i ${root}:\n`);
  for (const t of trin) {
    console.log(`  ${t.handling.padEnd(20)} ${t.rel}  (${t.note})`);
    if (!toer && t.indhold !== null && t.handling !== "uændret") {
      fs.mkdirSync(path.dirname(path.join(root, t.rel)), { recursive: true });
      fs.writeFileSync(path.join(root, t.rel), t.indhold);
    }
    // Mac og Linux kører kun en hook, der er markeret som kørbar. Windows er ligeglad.
    if (!toer && t.rel === ".githooks/pre-commit" && fs.existsSync(path.join(root, t.rel))) fs.chmodSync(path.join(root, t.rel), 0o755);
  }
  const agents = trin.find((t) => t.rel === "AGENTS.md").indhold.split("\n").length;
  if (agents > 80) console.log(`\nBemærk: AGENTS.md bliver på ${agents} linjer (højst 80). Flyt dine egne lange afsnit til docs/, ellers stopper længdelåsen næste commit.`);
  if (!(profil.tjek_kommandoer || []).length) console.log("\nBemærk: der er ingen tjek-kommandoer i profilen, så beviset kan ikke afprøve noget endnu. Tag en første test med i planen.");
  if (!toer) console.log("\nNæste skridt: tænd nøgletjekket (git config core.hooksPath .githooks), godkend hooks med /hooks i Codex, og start en ny chat.");
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { valider, agentsBlok, flettAgents, flettHooks, flettGitignore, plan, voresHooks, version, feedbackSkabelon };
