// Sætter det faste fundament op i et projekt ud fra profilen (.startkit/profil.json).
//
//   node opsaet.js <projektmappe> --toer     viser, hvad der vil ske, uden at skrive noget (på engelsk: --dry-run)
//   node opsaet.js <projektmappe>            skriver filerne
//
// Samme profil giver altid samme resultat, og scriptet kan køres igen uden at lave dubletter.
// Personens egne filer overskrives ikke: i AGENTS.md røres kun blokken mellem startkittets mærker,
// i .codex/hooks.json røres kun startkittets egne poster, og STATUS.md m.fl. laves kun, hvis de mangler.
const fs = require("fs");
const path = require("path");
const { harNoegle } = require("./projekt/regler");
const { t, sprog, fil } = require("./projekt/tekster");

const ASSETS = path.join(__dirname, "..", "assets");
// De engelske skabeloner ligger i en/assets og hedder noget andet. Resten (nøgletjekket, .gitignore-tillægget) er fælles.
const EN_ASSETS = path.join(__dirname, "..", "en", "assets");
const EN_NAVNE = { "AGENTS.skabelon.md": "AGENTS.template.md", "projektstatus.skabelon.md": "project-status.template.md", "gentagne-fejl.md": "recurring-mistakes.md", "hvorfor-blev-jeg-stoppet.md": "why-was-i-stopped.md", "forloeb.skabelon.md": "progress.template.md", "feedback.skabelon.md": "feedback.template.md", "overblik.cmd": "overview.cmd" };
const skabelon = (navn) => (sprog() === "en" && EN_NAVNE[navn] ? laes(path.join(EN_ASSETS, EN_NAVNE[navn])) : laes(path.join(ASSETS, navn)));
const PROJEKT_SCRIPTS = path.join(__dirname, "projekt");
const START = "<!-- startkit:start", SLUT = "<!-- startkit:slut -->";
const lf = (s) => String(s).replace(/\r\n/g, "\n");
const laes = (p) => { try { return lf(fs.readFileSync(p, "utf8")); } catch { return null; } };

// En profil skrevet af den engelske udgave har engelske feltnavne. Her får de de navne, resten af scriptet bruger.
function normaliser(profil) {
  if (!profil || typeof profil !== "object" || Array.isArray(profil)) return profil;
  const p = { ...profil };
  const flyt = (obj, fra, til) => { if (obj[til] === undefined && obj[fra] !== undefined) obj[til] = obj[fra]; };
  if (p.person && typeof p.person === "object") { p.person = { ...p.person }; flyt(p.person, "name", "navn"); }
  flyt(p, "chosen_project", "valgt_projekt");
  flyt(p, "projects", "projekter");
  flyt(p, "rules", "regler");
  flyt(p, "check_commands", "tjek_kommandoer");
  if (Array.isArray(p.projekter)) p.projekter = p.projekter.map((x) => { if (!x || typeof x !== "object") return x; const y = { ...x }; flyt(y, "name", "navn"); flyt(y, "description", "beskrivelse"); return y; });
  if (p.regler && typeof p.regler === "object") { p.regler = { ...p.regler }; flyt(p.regler, "never_without_ok", "aldrig_uden_ok"); flyt(p.regler, "answer_style", "svarform"); flyt(p.regler, "when_in_doubt", "ved_tvivl"); }
  return p;
}

function valider(raa) {
  const profil = normaliser(raa);
  const fejl = [];
  const tekst = (v) => typeof v === "string" && v.trim().length > 0;
  if (!profil || typeof profil !== "object") return [t("ops.ikke.objekt")];
  if (!tekst(profil.person && profil.person.navn)) fejl.push(t("ops.navn"));
  const projekter = Array.isArray(profil.projekter) ? profil.projekter : [];
  const valgt = projekter.find((p) => p && p.navn === profil.valgt_projekt) || projekter[0];
  if (!valgt || !tekst(valgt.navn) || !tekst(valgt.beskrivelse)) fejl.push(t("ops.projekt"));
  const regler = profil.regler || {};
  if (!Array.isArray(regler.aldrig_uden_ok) || !regler.aldrig_uden_ok.filter(tekst).length) fejl.push(t("ops.aldrig"));
  if (!tekst(regler.svarform)) fejl.push(t("ops.svarform"));
  if (profil.tjek_kommandoer !== undefined && !(Array.isArray(profil.tjek_kommandoer) && profil.tjek_kommandoer.every((k) => typeof k === "string"))) fejl.push(t("ops.tjek"));
  if (harNoegle(JSON.stringify(profil))) fejl.push(t("ops.noegle"));
  return fejl;
}

const enLinje = (s) => String(s).replace(/\s+/g, " ").trim();

function agentsBlok(raa) {
  const profil = normaliser(raa);
  const projekter = profil.projekter || [];
  const valgt = projekter.find((p) => p.navn === profil.valgt_projekt) || projekter[0];
  const regler = profil.regler;
  const udfyld = {
    PROJEKT: enLinje(valgt.navn),
    BESKRIVELSE: enLinje(valgt.beskrivelse),
    NAVN: enLinje(profil.person.navn),
    ALDRIG_UDEN_OK: regler.aldrig_uden_ok.map(enLinje).filter(Boolean).join("; "),
    VED_TVIVL: enLinje(regler.ved_tvivl || t("ops.ved.tvivl")),
    SVARFORM: enLinje(regler.svarform),
  };
  return skabelon("AGENTS.skabelon.md").replace(/\{\{(\w+)\}\}/g, (_, k) => udfyld[k] ?? "").trim();
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
    PreToolUse: { matcher: "Bash|apply_patch|Edit|Write", hooks: [{ type: "command", command: sti("vagt.js"), timeout: 30, statusMessage: t("ops.status.hook1") }] },
    Stop: { hooks: [{ type: "command", command: sti("faerdig.js"), timeout: 60, statusMessage: t("ops.status.hook2") }] },
  };
}
const erVores = (gruppe) => Array.isArray(gruppe && gruppe.hooks) && gruppe.hooks.some((h) => /scripts\/startkit\//.test(String((h && h.command) || "").replace(/\\/g, "/")));

function flettHooks(eksisterendeTekst, root) {
  let data = {};
  if (eksisterendeTekst !== null && eksisterendeTekst.trim()) {
    try { data = JSON.parse(eksisterendeTekst); } catch { throw new Error(t("ops.hooks.json")); }
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
  return (eksisterende ? eksisterende.replace(/\s*$/, "") + "\n\n" : "") + t("ops.gitignore") + "\n" + mangler.join("\n") + "\n";
}

// Kittets version står ét sted (filen VERSION) og skrives i feedback-filen, så man kan se, hvilken udgave feedbacken gælder.
const version = () => (laes(path.join(__dirname, "..", "VERSION")) || t("ops.ukendt")).trim();
const feedbackSkabelon = () => skabelon("feedback.skabelon.md").replace(/\{\{VERSION\}\}/g, version());

// Regner ud, hvad der skal skrives. Skriver intet selv.
function plan(root, raa) {
  const profil = normaliser(raa);
  const en = sprog() === "en";
  const trin = [];
  const p = (...dele) => path.join(root, ...dele);
  const saet = (rel, indhold, note) => {
    const foer = laes(p(rel));
    trin.push({ rel, indhold, handling: foer === null ? "ny" : foer === lf(indhold) ? "uaendret" : "opdateres", note });
  };
  const kunHvisMangler = (rel, indhold, note) => {
    if (fs.existsSync(p(rel))) trin.push({ rel, indhold: null, handling: "findes", note });
    else trin.push({ rel, indhold, handling: "ny", note });
  };
  const projekter = profil.projekter || [];
  const valgt = projekter.find((x) => x.navn === profil.valgt_projekt) || projekter[0];

  const tjek = profil.tjek_kommandoer || [];
  const config = en ? { checks: tjek, model_guide: [], limit_percent: 85 } : { tjek, modelguide: [], graense_procent: 85 };
  saet("AGENTS.md", flettAgents(laes(p("AGENTS.md")), agentsBlok(profil)), t("ops.n.agents"));
  kunHvisMangler("STATUS.md", skabelon("projektstatus.skabelon.md").replace(/\{\{PROJEKT\}\}/g, enLinje(valgt.navn)), t("ops.n.status"));
  kunHvisMangler(fil("fejl"), skabelon("gentagne-fejl.md"), t("ops.n.fejl"));
  saet(fil("hvorfor"), skabelon("hvorfor-blev-jeg-stoppet.md"), t("ops.n.hvorfor"));
  kunHvisMangler(".startkit/status.md", skabelon("forloeb.skabelon.md"), t("ops.n.forloeb"));
  kunHvisMangler(".startkit/config.json", JSON.stringify(config, null, 2) + "\n", t("ops.n.config"));
  for (const navn of fs.readdirSync(PROJEKT_SCRIPTS).filter((f) => f !== "sprog.json").sort()) saet(`scripts/startkit/${navn}`, laes(path.join(PROJEKT_SCRIPTS, navn)), t("ops.n.scripts"));
  // Projektets scripts skal tale samme sprog som kittet. Dansk er standard og behøver ingen fil.
  if (en || fs.existsSync(p("scripts", "startkit", "sprog.json"))) saet("scripts/startkit/sprog.json", JSON.stringify({ sprog: sprog() }) + "\n", t("ops.n.scripts"));
  // Windows-genvej (dobbeltklik). Skrives med CRLF, som .cmd-filer forventer.
  saet(fil("genvej"), skabelon("overblik.cmd").replace(/\n/g, "\r\n"), t("ops.n.genvej"));
  kunHvisMangler(".startkit/feedback.md", feedbackSkabelon(), t("ops.n.feedback"));
  saet(".githooks/pre-commit", laes(path.join(ASSETS, "pre-commit")), t("ops.n.precommit"));
  saet(".codex/hooks.json", flettHooks(laes(p(".codex/hooks.json")), root), t("ops.n.hooks"));
  const gi = flettGitignore(laes(p(".gitignore")));
  if (gi !== laes(p(".gitignore"))) saet(".gitignore", gi, t("ops.n.ignore"));
  return trin;
}

function main() {
  const args = process.argv.slice(2);
  const toer = args.includes("--toer") || args.includes("--dry-run");
  const mappe = args.find((a) => !a.startsWith("--"));
  if (!mappe) { console.error(t("ops.brug")); return 2; }
  const root = path.resolve(mappe);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(t("mappe.findes.ikke", { mappe: root })); return 2; }
  // Profilen hedder profil.json på dansk og profile.json på engelsk. Begge navne læses, uanset sprog.
  const profilTekst = laes(path.join(root, fil("profil"))) ?? laes(path.join(root, ".startkit", "profil.json")) ?? laes(path.join(root, ".startkit", "profile.json"));
  if (profilTekst === null) { console.error(t("ops.ingen.profil")); return 2; }
  let profil;
  try { profil = JSON.parse(profilTekst); } catch { console.error(t("ops.profil.json")); return 2; }
  profil = normaliser(profil);
  const fejl = valider(profil);
  if (fejl.length) { console.error(t("ops.mangler") + "\n" + fejl.map((f) => "  - " + f).join("\n")); return 2; }

  let trin;
  try { trin = plan(root, profil); } catch (e) { console.error(e.message); return 2; }
  console.log(t(toer ? "ops.vil" : "ops.saetter", { root }));
  const etiket = { ny: "ops.h.ny", uaendret: "ops.h.uaendret", opdateres: "ops.h.opdateres", findes: "ops.h.findes" };
  for (const x of trin) {
    console.log(`  ${t(etiket[x.handling]).padEnd(20)} ${x.rel}  (${x.note})`);
    if (!toer && x.indhold !== null && x.handling !== "uaendret") {
      fs.mkdirSync(path.dirname(path.join(root, x.rel)), { recursive: true });
      fs.writeFileSync(path.join(root, x.rel), x.indhold);
    }
    // Mac og Linux kører kun en hook, der er markeret som kørbar. Windows er ligeglad.
    if (!toer && x.rel === ".githooks/pre-commit" && fs.existsSync(path.join(root, x.rel))) fs.chmodSync(path.join(root, x.rel), 0o755);
  }
  const agents = trin.find((x) => x.rel === "AGENTS.md").indhold.split("\n").length;
  if (agents > 80) console.log(t("ops.lang", { linjer: agents }));
  if (!(profil.tjek_kommandoer || []).length) console.log(t("ops.ingen.tjek"));
  if (!toer) console.log(t("ops.naeste"));
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { valider, normaliser, agentsBlok, flettAgents, flettHooks, flettGitignore, plan, voresHooks, version, feedbackSkabelon };
