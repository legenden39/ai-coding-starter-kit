// Laver udgaven til Claude Code ud fra udgaven til @@CODEX@@, på dansk og engelsk.
//
//   node tools/byg-claude.js          skriver filerne i startkit/claude/
//   node tools/byg-claude.js --tjek   skriver intet; fejler, hvis filerne i startkit/claude/ ikke passer til kilden
//
// Hvorfor: de to udgaver har samme forløb og samme løfter. Kun navne på filer og kommandoer er forskellige,
// og nogle få afsnit, hvor Claude Code virker anderledes end Codex. Ved at lave Claude-udgaven ud fra
// Codex-udgaven kan de to ikke komme ud af trit: en rettelse i en vejledning gælder begge, når dette program er kørt.
//
// Sådan virker det: hver fil læses fra Codex-udgaven. Først byttes de særlige afsnit (SAERLIGE) ud. Hver af dem
// SKAL findes præcis én gang i kilden; ellers stopper programmet, så en ændret kildetekst ikke bliver overset.
// Derefter byttes de almindelige navne (FAELLES). Til sidst tjekkes det, at intet fra Codex er blevet tilbage.
//
// Programmet bruges kun af den, der vedligeholder kittet. Det følger ikke med i den ZIP-fil, brugerne henter.
const fs = require("fs");
const path = require("path");

const KIT = path.join(__dirname, "..", "startkit");
const lf = (s) => String(s).replace(/\r\n/g, "\n");

// ---------- det, der bare hedder noget andet ----------
const FAELLES = [
  [/\.codex\/hooks\.json/g, ".claude/settings.local.json"],
  [/AGENTS\.md/g, "CLAUDE.md"],
  [/\$startkit/g, "/startkit"],
  [/~\/\.agents\/skills\/startkit/g, "~/.claude/skills/startkit"],
  [/(?<![\w.])\/status(?![\w./])/g, "/usage"],
  [/`\/new`/g, "`/clear`"],
  [/Codex/g, "Claude Code"],
];
// Vejledningerne til Claude Code ligger i deres egen mappe.
const STIER = {
  da: [[/(?<![\w/])references\//g, "claude/references/"]],
  en: [[/(?<![\w/])en\/references\//g, "claude/en/references/"]],
};

// ---------- det, der virker anderledes i Claude Code ----------
// Fakta er slået op i Anthropics dokumentation til Claude Code (code.claude.com/docs) i november 2026.
const SAERLIGE = {
  // ===== dansk =====
  "SKILL.md": [
    ["description: Startkit til Codex og ChatGPT.", "description: Startkit til Claude Code."],
    // Kun personen selv starter kittet (svarer til allow_implicit_invocation: false i Codex-udgaven).
    ["Ikke til almindelige opgaver.\n---", "Ikke til almindelige opgaver.\ndisable-model-invocation: true\n---"],
    ["Kittet er bygget om fra en Claude-udgave og er ikke afprøvet i Codex af den, der har lavet det.", "Udgaven til Claude Code er bygget ud fra udgaven til @@CODEX@@. Delene er testet automatisk, men hele forløbet er ikke kørt igennem i Claude Code af et menneske."],
    ["og `/model` (hvilke modeller der findes)", "og `/model` (hvilke modeller der kan vælges)"],
    ["**Hooks skal godkendes af personen selv.** Codex kører ikke nye hooks, før de er set igennem: bed personen skrive `/hooks` og godkende de to fra startkittet, og sige ja til, at projektmappen er betroet. Start derefter en ny chat, så de bliver indlæst.",
      "**Personen skal se, at hooks'ene er indlæst.** Claude Code har ingen godkendelse af hver enkelt hook: den kører dem, der står i projektets indstillinger. Spørger Claude Code, om personen stoler på mappen, så forklar, hvad det betyder (Claude Code må køre projektets egne indstillinger og hooks), og lad personen svare. Bed personen skrive `/hooks` og se, at de tre fra startkittet står der: vagten under PreToolUse, færdig-tjekket under Stop, og indlæsningen af statusfilen under SessionStart. Start derefter en ny chat, så de helt sikkert er indlæst. Opsætningen har også skrevet Claude Codes egne forbudsregler for `.env`-filer i samme fil (`permissions.deny`). De er et ekstra lag, hvis en hook en dag ikke bliver kørt."],
    ["(er hooken godkendt i `/hooks`? er det en ny chat?)", "(står hooken i `/hooks`? er mappen betroet? er det en ny chat?)"],
  ],
  "references/intro.md": [
    ["Kittet er bygget om fra en udgave til Claude. Den, der har lavet det, bruger ikke ChatGPT og har derfor ikke kunnet afprøve det i Codex. De enkelte dele er testet hver for sig, men ikke hele forløbet.", "Udgaven til Claude Code er ny og er bygget ud fra udgaven til @@CODEX@@. De enkelte dele er testet hver for sig, men hele forløbet er ikke kørt igennem i Claude Code af et menneske."],
  ],
  "references/vaerktoejer.md": [
    ["Sådan i appen:\n1. Tryk på **Plugins** i menuen i venstre side.\n2. Find **Superpowers**. Den står under afsnittet \"Coding\".\n3. Tryk på **+** ud for den, og følg det, der står på skærmen.\n\nSådan i terminalen:\n1. Skriv `/plugins`.\n2. Søg efter `superpowers`.\n3. Vælg \"Install Plugin\".",
      "Sådan:\n1. Bed personen skrive dette i chatten og trykke Enter: `/plugin install superpowers@claude-plugins-official`\n2. Følg det, der står på skærmen, og sig ja til at installere.\n\nVirker kommandoen ikke:\n1. Skriv `/plugin`.\n2. Find **Superpowers** på listen (den ligger i Anthropics officielle samling, `claude-plugins-official`).\n3. Vælg at installere den."],
    ["Tjek: bed personen se, om Superpowers står som installeret under Plugins.", "Tjek: bed personen skrive `/plugin` og se, om Superpowers står som installeret."],
  ],
  "references/viden.md": [
    ["Sådan i praksis: Bed AI'en om at forklare i ord, hvad den lige gjorde og hvorfor,", "Sådan i praksis: Claude Code har to indbyggede svarstile. `/output-style Explanatory` får AI'en til at lægge korte forklaringer af sine valg ind i chatten, mens den arbejder; den passer, hvis du ikke selv vil skrive kode. `/output-style Learning` gør det samme, men stopper også enkelte steder og venter, til du selv har skrevet et stykke kode, så den er kun for dig, der vil øve dig i at kode. Valget gælder fra din næste besked (i ældre udgaver af Claude Code først i en ny chat) og bliver ved med at gælde i projektet, til du ændrer det. `/output-style default` slår det fra igen, og `/output-style` uden mere viser, hvilken der er valgt. Eller bed AI'en om at forklare i ord, hvad den lige gjorde og hvorfor,"],
    ["OpenAI skriver selv, at en hook, der fejler eller løber tør for tid, lader værktøjet køre videre, og at en kreativ kommando kan komme udenom et mønster.", "Anthropic skriver selv, at en hook, der fejler eller løber tør for tid, lader værktøjet køre videre. Og en kreativ kommando kan komme udenom et mønster."],
    ["Codex stopper desuden med at læse instruktionsfiler, når de tilsammen når en grænse (32 KiB som standard).", "Anthropic anbefaler selv at sigte efter under 200 linjer pr. `CLAUDE.md`."],
    ["Tænkeniveau vælges sammen med modellen i `/model`. Forbrug ses med `/status` og på forbrugssiden under indstillinger.", "Tænkeniveau vælges med `/effort`. Forbrug ses med `/usage`."],
  ],
  "references/interview.md": [
    ["i ChatGPT-chatten eller i Codex?", "i Claude-chatten (claude.ai) eller i Claude Code?"],
    ["(fx OpenAI, betaling, mail, database)", "(fx AI-tjenester, betaling, mail, database)"],
  ],
  "references/research.md": [
    ["(OpenAI's Codex-dokumentation, udbyderens egne sider", "(Anthropics dokumentation til Claude Code, udbyderens egne sider"],
    ["i OpenAI's dokumentation", "i Anthropics dokumentation"],
  ],
  "assets/hvorfor-blev-jeg-stoppet.md": [
    ["- Nye eller ændrede hooks kører først, når du har godkendt dem med `/hooks`.", "- Claude Code har ingen godkendelse af hver enkelt hook. Skriv `/hooks` for at se, hvilke der er indlæst.\n- Som ekstra lag er `.env`-filer også spærret med Claude Codes egne forbudsregler (`permissions.deny` i `.claude/settings.local.json`)."],
  ],
  "assets/fortryd.md": [
    ["## 1. Fortryd i selve Codex\n\nOm Codex har en fortryd-knap, skifter fra udgave til udgave. Regn ikke med den. Brug gemmepunkterne herunder.",
      "## 1. Fortryd i selve Claude Code\n\nSkriv `/rewind` (eller tryk Esc to gange). Så kan du vælge et tidligere sted i chatten og få filerne tilbage, som de var dér.\n\nDet skal du vide: `/rewind` henter kun det tilbage, Claude har rettet med sine egne redigeringsværktøjer. Har en kommando ændret eller slettet filer (fx en sletning i terminalen), henter den dem ikke. Så brug gemmepunkterne herunder."],
  ],
  "en/assets/undo.md": [
    ["## 1. Undo in Codex itself\n\nWhether Codex has an undo button changes from one edition to the next. Do not count on it. Use the save points below.",
      "## 1. Undo in Claude Code itself\n\nType `/rewind` (or press Esc twice). Then you can choose an earlier point in the chat and get the files back as they were there.\n\nWhat you should know: `/rewind` only restores what Claude changed with its own editing tools. If a command changed or deleted files (for example a deletion in the terminal), it does not restore them. Then use the save points below."],
  ],
  "assets/forloeb.skabelon.md": [
    ["hooks godkendt med /hooks", "hooks set med /hooks"],
  ],

  // ===== engelsk =====
  "en/SKILL.en.md": [
    ["description: Starter kit for Codex and ChatGPT.", "description: Starter kit for Claude Code."],
    ["Not for ordinary tasks.\n---", "Not for ordinary tasks.\ndisable-model-invocation: true\n---"],
    ["The kit was rebuilt from a Claude edition and has not been tried in Codex by the person who made it.", "The edition for Claude Code is built from the edition for @@CODEX@@. The parts are tested automatically, but the whole run has not been taken through Claude Code by a human."],
    ["and `/model` (which models exist)", "and `/model` (which models can be chosen)"],
    ["**The hooks must be approved by the person.** Codex does not run new hooks until they have been looked through: ask the person to type `/hooks` and approve the two from the starter kit, and say yes to trusting the project folder. Then start a new chat, so they are loaded.",
      "**The person must see that the hooks are loaded.** Claude Code has no approval of each single hook: it runs the ones listed in the project's settings. If Claude Code asks whether the person trusts the folder, explain what that means (Claude Code may run the project's own settings and hooks), and let the person answer. Ask the person to type `/hooks` and see that the three from the starter kit are listed: the guard under PreToolUse, the done-check under Stop, and the loading of the status file under SessionStart. Then start a new chat, so they are certain to be loaded. The setup has also written Claude Code's own deny rules for `.env` files in the same file (`permissions.deny`). They are an extra layer in case a hook one day is not run."],
    ["(is the hook approved in `/hooks`? is it a new chat?)", "(is the hook listed in `/hooks`? is the folder trusted? is it a new chat?)"],
  ],
  "en/references/intro.md": [
    ["The kit was rebuilt from an edition for Claude. The person who made it does not use ChatGPT and has therefore not been able to try it in Codex. The individual parts are tested one by one, but not the whole run.", "The edition for Claude Code is new and is built from the edition for @@CODEX@@. The individual parts are tested one by one, but the whole run has not been taken through Claude Code by a human."],
  ],
  "en/references/tools.md": [
    ["How in the app:\n1. Press **Plugins** in the menu on the left.\n2. Find **Superpowers**. It is under the section \"Coding\".\n3. Press **+** next to it, and follow what the screen says.\n\nHow in the terminal:\n1. Type `/plugins`.\n2. Search for `superpowers`.\n3. Choose \"Install Plugin\".",
      "How:\n1. Ask the person to type this in the chat and press Enter: `/plugin install superpowers@claude-plugins-official`\n2. Follow what the screen says, and say yes to installing.\n\nIf the command does not work:\n1. Type `/plugin`.\n2. Find **Superpowers** in the list (it is in Anthropic's official collection, `claude-plugins-official`).\n3. Choose to install it."],
    ["Check: ask the person to see whether Superpowers is listed as installed under Plugins.", "Check: ask the person to type `/plugin` and see whether Superpowers is listed as installed."],
  ],
  "en/references/knowledge.md": [
    ["In practice: Ask the AI to explain in words what it just did and why,", "In practice: Claude Code has two built-in answer styles. `/output-style Explanatory` makes the AI add short explanations of its choices to the chat while it works; it fits if you do not want to write code yourself. `/output-style Learning` does the same, but also stops in a few places and waits until you have written a piece of code yourself, so it is only for you who want to practise coding. The choice applies from your next message (in older versions of Claude Code only in a new chat) and keeps applying in the project until you change it. `/output-style default` turns it off again, and `/output-style` on its own shows which one is set. Or ask the AI to explain in words what it just did and why,"],
    ["OpenAI itself writes that a hook that fails or runs out of time lets the tool carry on, and that a creative command can get around a pattern.", "Anthropic itself writes that a hook that fails or runs out of time lets the tool carry on. And a creative command can get around a pattern."],
    ["Codex also stops reading instruction files when together they reach a limit (32 KiB by default).", "Anthropic itself recommends aiming for under 200 lines per `CLAUDE.md`."],
    ["The thinking level is chosen together with the model in `/model`. Usage is seen with `/status` and on the usage page under settings.", "The thinking level is chosen with `/effort`. Usage is seen with `/usage`."],
  ],
  "en/references/interview.md": [
    ["in the ChatGPT chat or in Codex?", "in the Claude chat (claude.ai) or in Claude Code?"],
    ["(for example OpenAI, payment, email, database)", "(for example AI services, payment, email, database)"],
  ],
  "en/references/research.md": [
    ["(OpenAI's Codex documentation, the provider's own pages", "(Anthropic's documentation for Claude Code, the provider's own pages"],
    ["in OpenAI's documentation", "in Anthropic's documentation"],
  ],
  "en/assets/why-was-i-stopped.md": [
    ["- New or changed hooks only run once you have approved them with `/hooks`.", "- Claude Code has no approval of each single hook. Type `/hooks` to see which ones are loaded.\n- As an extra layer, `.env` files are also blocked by Claude Code's own deny rules (`permissions.deny` in `.claude/settings.local.json`)."],
  ],
  "en/assets/progress.template.md": [
    ["hooks approved with /hooks", "hooks seen with /hooks"],
  ],
};

// Det må ikke stå tilbage i en fil til Claude Code.
const FORBUDT = /Codex|ChatGPT|OpenAI|\.codex\b|AGENTS\.md|\$startkit|\.agents\/|\/plugins\b|`\/status`|`\/new`/;

// ---------- hvilke filer ----------
// Alle vejledninger laves (så SKILL-filen kan pege ét sted hen). Af skabelonerne laves kun dem, der nævner værktøjet;
// resten henter opsætningen fra de fælles mapper.
function filer() {
  const ud = [{ fra: "SKILL.md", til: "claude/SKILL.claude.md", sprog: "da" }, { fra: "en/SKILL.en.md", til: "claude/en/SKILL.claude.en.md", sprog: "en" }];
  for (const f of fs.readdirSync(path.join(KIT, "references")).sort()) ud.push({ fra: `references/${f}`, til: `claude/references/${f}`, sprog: "da" });
  for (const f of fs.readdirSync(path.join(KIT, "en", "references")).sort()) ud.push({ fra: `en/references/${f}`, til: `claude/en/references/${f}`, sprog: "en" });
  for (const f of ["hvorfor-blev-jeg-stoppet.md", "fortryd.md", "forloeb.skabelon.md", "overblik.cmd"]) ud.push({ fra: `assets/${f}`, til: `claude/assets/${f}`, sprog: "da" });
  for (const f of ["why-was-i-stopped.md", "undo.md", "progress.template.md", "overview.cmd"]) ud.push({ fra: `en/assets/${f}`, til: `claude/en/assets/${f}`, sprog: "en" });
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
  if (rest.length) throw new Error(`${fra}: der står stadig noget fra Codex i teksten til Claude Code:\n${rest.join("\n")}`);
  // Det ene sted, hvor Codex skal nævnes ved navn (Claude-udgaven er bygget ud fra den), skrives @@CODEX@@ i reglerne.
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
  // Filer i claude-mappen, som ingen kilde har længere, er forældede.
  const kendte = new Set(resultat.map((f) => path.join(KIT, f.til)));
  const gamle = [];
  (function gaa(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) gaa(f); else if (!kendte.has(f)) gamle.push(path.relative(KIT, f)); } })(path.join(KIT, "claude"));
  if (!tjek) for (const g of gamle) fs.unlinkSync(path.join(KIT, g));
  if (tjek && (forkerte.length || gamle.length)) {
    console.error("Udgaven til Claude Code passer ikke til kilden. Kør: node tools/byg-claude.js\n" + [...forkerte, ...gamle].map((f) => "  " + f).join("\n"));
    return 1;
  }
  console.log(tjek ? `Udgaven til Claude Code passer til kilden (${resultat.length} filer).` : `Skrev ${forkerte.length} af ${resultat.length} filer i startkit/claude/${gamle.length ? `, og slettede ${gamle.length} forældede` : ""}.`);
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { byg, oversaet, filer, FORBUDT };
