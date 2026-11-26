// Laver udgaven til Antigravity (Gemini) ud fra udgaven til @@CODEX@@, på dansk og engelsk.
//
//   node tools/byg-gemini.js          skriver filerne i startkit/gemini/
//   node tools/byg-gemini.js --tjek   skriver intet; fejler, hvis filerne i startkit/gemini/ ikke passer til kilden
//
// Følger samme mønster som tools/byg-claude.js: de tre udgaver har samme forløb og samme løfter.
// Fakta om Antigravity er slået op i den officielle dokumentation (antigravity.google/docs) i november 2026.
const fs = require("fs");
const path = require("path");

const KIT = path.join(__dirname, "..", "startkit");
const lf = (s) => String(s).replace(/\r\n/g, "\n");

// ---------- det, der bare hedder noget andet ----------
const FAELLES = [
  [/\.codex\/hooks\.json/g, ".agents/hooks.json"],
  [/AGENTS\.md/g, "GEMINI.md"],
  [/\$startkit/g, "/startkit"],
  [/~\/\.agents\/skills\/startkit/g, "~/.gemini/config/skills/startkit"],
  [/(?<![\w.])\/status(?![\w./])/g, "Settings"],
  [/`\/new`/g, "New Conversation"],
  [/Codex/g, "Antigravity"],
];
const STIER = {
  da: [[/(?<![\w/])references\//g, "gemini/references/"]],
  en: [[/(?<![\w/])en\/references\//g, "gemini/en/references/"]],
};

// ---------- det, der virker anderledes i Antigravity ----------
const SAERLIGE = {
  // ===== dansk =====
  "SKILL.md": [
    ["description: Startkit til Codex og ChatGPT.", "description: Startkit til Antigravity (Gemini)."],
    ["Kittet er bygget om fra en Claude-udgave og er ikke afprøvet i Codex af den, der har lavet det.", "Udgaven til Antigravity er bygget ud fra udgaven til @@CODEX@@. Delene er testet automatisk, og at Antigravity kalder hooks er prøvet på Windows, men hele forløbet er ikke kørt igennem i Antigravity af et menneske."],
    ["Bed personen skrive `/status` (forbrug og grænser) og `/model` (hvilke modeller der findes), og fortælle dig, hvad der står.", "Bed personen tjekke under **Settings → Model Selection** i Antigravity, hvilke modeller der kan vælges, og fortælle dig, hvad der står."],
    ["**Hooks skal godkendes af personen selv.** Codex kører ikke nye hooks, før de er set igennem: bed personen skrive `/hooks` og godkende de to fra startkittet, og sige ja til, at projektmappen er betroet. Start derefter en ny chat, så de bliver indlæst.",
      "**Start en ny chat, så hooks'ene bliver indlæst.** Antigravity indlæser automatisk `.agents/hooks.json` fra projektmappen (vagten under PreToolUse, færdig-tjekket under Stop, indlæsningen af statusfilen under SessionStart og loop-stoppet under PostToolUse). Start en ny chat i projektmappen, så de er aktive. Som ekstra lag kan personen også tilføje `read_file(.env)` under **Settings → Permission Grants (Deny)** (eller med `/permissions` i Antigravity CLI)."],
    ["(er hooken godkendt i `/hooks`? er det en ny chat?)", "(ligger `.agents/hooks.json` i projektmappen? er det en ny chat?)"],
  ],
  "references/intro.md": [
    ["Kittet er bygget om fra en udgave til Claude. Den, der har lavet det, bruger ikke ChatGPT og har derfor ikke kunnet afprøve det i Codex. De enkelte dele er testet hver for sig, men ikke hele forløbet.", "Udgaven til Antigravity er ny og er bygget ud fra udgaven til @@CODEX@@. De enkelte dele er testet hver for sig, men hele forløbet er ikke kørt igennem i Antigravity af et menneske."],
    ["Tjek dit forbrug med `/status`, før vi går i gang.", "Tjek dine indstillinger og modelvalg i Antigravity, før vi går i gang."],
  ],
  "references/vaerktoejer.md": [
    ["Sådan i appen:\n1. Tryk på **Plugins** i menuen i venstre side.\n2. Find **Superpowers**. Den står under afsnittet \"Coding\".\n3. Tryk på **+** ud for den, og følg det, der står på skærmen.\n\nSådan i terminalen:\n1. Skriv `/plugins`.\n2. Søg efter `superpowers`.\n3. Vælg \"Install Plugin\".",
      "Sådan i Antigravity:\n1. Åbn **Skills & Customizations** (eller **Plugins**) i venstre side.\n2. Se om **Superpowers** findes på listen, eller brug Antigravitys egne planlægningsfunktioner (`/plan`).\n3. Superpowers er helt valgfrit i Antigravity — spring bare videre uden."],
    ["Tjek: bed personen se, om Superpowers står som installeret under Plugins.", "Tjek: bed personen se under **Skills & Customizations**, eller gå videre uden."],
  ],
  "references/viden.md": [
    ["OpenAI skriver selv, at en hook, der fejler eller løber tør for tid, lader værktøjet køre videre, og at en kreativ kommando kan komme udenom et mønster.", "Antigravity kører hooks synkront, og en kreativ kommando kan stadig komme udenom et mønster."],
    ["Codex stopper desuden med at læse instruktionsfiler, når de tilsammen når en grænse (32 KiB som standard).", "Antigravity har en grænse på 24 KB pr. regelfil (`GEMINI.md`) og et samlet budget på 20.000 tokens for altid-aktive regler."],
    ["Tænkeniveau vælges sammen med modellen i `/model`. Forbrug ses med `/status` og på forbrugssiden under indstillinger.", "Model vælges under **Settings → Model Selection** (eller modelvælgeren i chatten)."],
  ],
  "references/interview.md": [
    ["i ChatGPT-chatten eller i Codex?", "i Gemini i browseren eller i Antigravity?"],
    ["(fx OpenAI, betaling, mail, database)", "(fx AI-tjenester, betaling, mail, database)"],
  ],
  "references/research.md": [
    ["(OpenAI's Codex-dokumentation, udbyderens egne sider", "(Googles Antigravity-dokumentation på antigravity.google/docs, udbyderens egne sider"],
    ["i OpenAI's dokumentation", "i Googles Antigravity-dokumentation"],
  ],
  "assets/hvorfor-blev-jeg-stoppet.md": [
    ["- Fejler en hook, eller løber den tør for tid, lader Codex værktøjet køre videre.\n- Nye eller ændrede hooks kører først, når du har godkendt dem med `/hooks`.",
      "- Antigravity indlæser `.agents/hooks.json` automatisk i en ny chat. Sletter du mappen `.agents/` midt i en chat, kan kommandoer fejle, til du starter en ny chat.\n- Som ekstra lag kan du også forbyde `.env`-filer i Antigravitys indstillinger (`read_file(.env)` under Deny)."],
  ],
  "assets/fortryd.md": [
    ["## 1. Fortryd i selve Codex\n\nOm Codex har en fortryd-knap, skifter fra udgave til udgave. Regn ikke med den. Brug gemmepunkterne herunder.",
      "## 1. Fortryd i selve Antigravity\n\nBrug gemmepunkterne herunder — de dækker både ændringer fra filværktøjer og fra terminalkommandoer."],
  ],
  "assets/forloeb.skabelon.md": [
    ["hooks godkendt med /hooks", "hooks indlæst fra .agents/hooks.json"],
  ],

  // ===== engelsk =====
  "en/SKILL.en.md": [
    ["description: Starter kit for Codex and ChatGPT.", "description: Starter kit for Antigravity (Gemini)."],
    ["The kit was rebuilt from a Claude edition and has not been tried in Codex by the person who made it.", "The edition for Antigravity is built from the edition for @@CODEX@@. The parts are tested automatically, and Antigravity calling hooks has been verified on Windows, but the whole run has not been taken through Antigravity by a human."],
    ["Ask the person to type `/status` (usage and limits) and `/model` (which models exist), and tell you what it says.", "Ask the person to check **Settings → Model Selection** in Antigravity to see which models can be chosen, and tell you what it says."],
    ["**The hooks must be approved by the person.** Codex does not run new hooks until they have been looked through: ask the person to type `/hooks` and approve the two from the starter kit, and say yes to trusting the project folder. Then start a new chat, so they are loaded.",
      "**Start a new chat so the hooks are loaded.** Antigravity automatically loads `.agents/hooks.json` from the project folder (the guard under PreToolUse, the done-check under Stop, loading of the status file under SessionStart, and the loop stop under PostToolUse). Start a new chat in the project folder so they are active. As an extra layer, the person can also add `read_file(.env)` under **Settings → Permission Grants (Deny)** (or with `/permissions` in Antigravity CLI)."],
    ["(is the hook approved in `/hooks`? is it a new chat?)", "(is `.agents/hooks.json` in the project folder? is it a new chat?)"],
  ],
  "en/references/intro.md": [
    ["The kit was rebuilt from an edition for Claude. The person who made it does not use ChatGPT and has therefore not been able to try it in Codex. The individual parts are tested one by one, but not the whole run.", "The edition for Antigravity is new and is built from the edition for @@CODEX@@. The individual parts are tested one by one, but the whole run has not been taken through Antigravity by a human."],
    ["Check your usage with `/status` before we begin.", "Check your settings and model choice in Antigravity before we begin."],
  ],
  "en/references/tools.md": [
    ["How in the app:\n1. Press **Plugins** in the menu on the left.\n2. Find **Superpowers**. It is under the section \"Coding\".\n3. Press **+** next to it, and follow what the screen says.\n\nHow in the terminal:\n1. Type `/plugins`.\n2. Search for `superpowers`.\n3. Choose \"Install Plugin\".",
      "How in Antigravity:\n1. Open **Skills & Customizations** (or **Plugins**) on the left.\n2. Check if **Superpowers** is listed, or use Antigravity's built-in planning (`/plan`).\n3. Superpowers is completely optional in Antigravity — feel free to move on without it."],
    ["Check: ask the person to see whether Superpowers is listed as installed under Plugins.", "Check: ask the person to check **Skills & Customizations**, or move on without it."],
  ],
  "en/references/knowledge.md": [
    ["OpenAI itself writes that a hook that fails or runs out of time lets the tool carry on, and that a creative command can get around a pattern.", "Antigravity runs hooks synchronously, and a creative command can still get around a pattern."],
    ["Codex also stops reading instruction files when together they reach a limit (32 KiB by default).", "Antigravity has a limit of 24 KB per rule file (`GEMINI.md`) and a shared budget of 20,000 tokens for always-on rules."],
    ["The thinking level is chosen together with the model in `/model`. Usage is seen with `/status` and on the usage page under settings.", "Model choice is set under **Settings → Model Selection** (or the model picker in the chat)."],
  ],
  "en/references/interview.md": [
    ["in the ChatGPT chat or in Codex?", "in Gemini in the browser or in Antigravity?"],
    ["(for example OpenAI, payment, email, database)", "(for example AI services, payment, email, database)"],
  ],
  "en/references/research.md": [
    ["(OpenAI's Codex documentation, the provider's own pages", "(Google's Antigravity documentation at antigravity.google/docs, the provider's own pages"],
    ["in OpenAI's documentation", "in Google's Antigravity documentation"],
  ],
  "en/assets/why-was-i-stopped.md": [
    ["- If a hook fails, or runs out of time, Codex lets the tool carry on.\n- New or changed hooks only run once you have approved them with `/hooks`.",
      "- Antigravity loads `.agents/hooks.json` automatically in a new chat. If you delete the `.agents/` folder mid-chat, commands may fail until you start a new chat.\n- As an extra layer, you can also deny `.env` files in Antigravity's settings (`read_file(.env)` under Deny)."],
  ],
  "en/assets/undo.md": [
    ["## 1. Undo in Codex itself\n\nWhether Codex has an undo button changes from one edition to the next. Do not count on it. Use the save points below.",
      "## 1. Undo in Antigravity itself\n\nUse the save points below — they cover changes made by both file tools and terminal commands."],
  ],
  "en/assets/progress.template.md": [
    ["hooks approved with /hooks", "hooks loaded from .agents/hooks.json"],
  ],
};

// Det må ikke stå tilbage i en fil til Antigravity.
const FORBUDT = /Codex|ChatGPT|OpenAI|\.codex\b|AGENTS\.md|\$startkit|\/plugins\b|`\/status`|`\/new`/;

function filer() {
  const ud = [{ fra: "SKILL.md", til: "gemini/SKILL.gemini.md", sprog: "da" }, { fra: "en/SKILL.en.md", til: "gemini/en/SKILL.gemini.en.md", sprog: "en" }];
  for (const f of fs.readdirSync(path.join(KIT, "references")).sort()) ud.push({ fra: `references/${f}`, til: `gemini/references/${f}`, sprog: "da" });
  for (const f of fs.readdirSync(path.join(KIT, "en", "references")).sort()) ud.push({ fra: `en/references/${f}`, til: `gemini/en/references/${f}`, sprog: "en" });
  for (const f of ["hvorfor-blev-jeg-stoppet.md", "fortryd.md", "forloeb.skabelon.md", "overblik.cmd"]) ud.push({ fra: `assets/${f}`, til: `gemini/assets/${f}`, sprog: "da" });
  for (const f of ["why-was-i-stopped.md", "undo.md", "progress.template.md", "overview.cmd"]) ud.push({ fra: `en/assets/${f}`, til: `gemini/en/assets/${f}`, sprog: "en" });
  return ud;
}

function oversaet(fra, sprog, kilde) {
  let tekst = lf(kilde);
  for (const [find, erstat] of SAERLIGE[fra] || []) {
    const antal = tekst.split(find).length - 1;
    if (antal !== 1) throw new Error(`${fra}: det særlige afsnit findes ${antal} gange i kilden (skal være præcis én):\n  ${find.slice(0, 120)}`);
    tekst = tekst.replace(find, () => erstat);
  }
  for (const [find, erstat] of [...FAELLES, ...STIER[sprog]]) tekst = tekst.replace(find, erstat);
  const rest = tekst.split("\n").map((l, i) => (FORBUDT.test(l) ? `  linje ${i + 1}: ${l.slice(0, 140)}` : null)).filter(Boolean);
  if (rest.length) throw new Error(`${fra}: der står stadig noget fra Codex i teksten til Antigravity:\n${rest.join("\n")}`);
  return tekst.replace(/@@CODEX@@/g, "Codex");
}

function byg() { return filer().map((f) => ({ ...f, indhold: oversaet(f.fra, f.sprog, fs.readFileSync(path.join(KIT, f.fra), "utf8")) })); }

function main() {
  const tjek = process.argv.includes("--tjek");
  let resultat;
  try { resultat = byg(); } catch (e) { console.error(e.message); return 1; }
  const forkerte = [];
  for (const f of resultat) {
    const sti = path.join(KIT, f.til);
    let nu = null;
    try { nu = lf(fs.readFileSync(sti, "utf8")); } catch { /* findes ikke endnu */ }
    if (nu === f.indhold) continue;
    forkerte.push(f.til);
    if (!tjek) { fs.mkdirSync(path.dirname(sti), { recursive: true }); fs.writeFileSync(sti, f.indhold); }
  }
  const kendte = new Set(resultat.map((f) => path.join(KIT, f.til)));
  const gamle = [];
  (function gaa(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) gaa(f); else if (!kendte.has(f)) gamle.push(path.relative(KIT, f)); } })(path.join(KIT, "gemini"));
  if (!tjek) for (const g of gamle) fs.unlinkSync(path.join(KIT, g));
  if (tjek && (forkerte.length || gamle.length)) {
    console.error("Udgaven til Antigravity passer ikke til kilden. Kør: node tools/byg-gemini.js\n" + [...forkerte, ...gamle].map((f) => "  " + f).join("\n"));
    return 1;
  }
  console.log(tjek ? `Udgaven til Antigravity passer til kilden (${resultat.length} filer).` : `Skrev ${forkerte.length} af ${resultat.length} filer i startkit/gemini/${gamle.length ? `, og slettede ${gamle.length} forældede` : ""}.`);
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { byg, oversaet, filer, FORBUDT };
