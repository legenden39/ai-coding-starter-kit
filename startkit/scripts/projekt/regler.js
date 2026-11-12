// Vagtens regler. Rene funktioner uden bivirkninger, så de kan testes uden et AI-værktøj.
// Eneste ting, de rører ved i filsystemet, er et skrivebeskyttet kig på, om et mål for en sletning er en fil (se erFil).
//
//   decide({tool_name, tool_input}) → {decision: "allow" | "deny", reason}
//
// Der findes kun "tillad" og "afvis" (Codex kan ikke vise en godkend-knap fra en hook, og reglerne er fælles for Codex og Claude Code).
// Hver afvisning siger, hvordan ejeren selv gør det, hvis det er med vilje.
// Ærlig grænse: mønstre på kommandotekst kan omgås. Vagten er et sikkerhedsnet, ikke en mur.
const fs = require("fs");
const path = require("path");
const { t, fil } = require("./tekster");

const allow = () => ({ decision: "allow", reason: "" });
const deny = (noegle, vaerdier) => ({ decision: "deny", reason: t(noegle, vaerdier) + t("vagt.se", { fil: fil("hvorfor") }) });
const skraa = (s) => String(s || "").replace(/\\/g, "/");

function normSti(p) {
  const n = path.posix.normalize(skraa(p).trim().toLowerCase());
  return n.length > 1 ? n.replace(/\/+$/, "") : n;
}

// Kittets egne kontroller: AI'en må ikke ændre dem (så kunne den slå dem fra).
const BESKYTTET = [
  /(^|\/)\.codex\/(hooks\.json|config\.toml)$/,
  /(^|\/)\.claude\/settings(\.local)?\.json$/,
  /(^|\/)scripts\/startkit(\/|$)/,
  /(^|\/)\.githooks(\/|$)/,
  /(^|\/)\.git\/hooks(\/|$)/,
  /(^|\/)\.startkit\/(config|bevis|vagt-puls)\.json$/,
];
const BESKYTTET_I_TEKST = [
  /\.codex\/(hooks\.json|config\.toml)/,
  /\.claude\/settings(\.local)?\.json/,
  /scripts\/startkit\b/,
  /\.githooks\b/,
  /\.git\/hooks\b/,
  /\.startkit\/(config|bevis|vagt-puls)\.json/,
];

const ENV_FIL = /(^|\/)\.env(\.[\w.-]+)?$/;
const erEnvFil = (p) => { const n = normSti(p); return ENV_FIL.test(n) && !/\.env\.(example|sample)$/.test(n); };
function naevnerEnvFil(tekst) {
  const re = /(?:^|[\s"'`/=(])(\.env(?:\.[\w.-]+)?)(?=$|[\s"'`|;&)<>*])/g;
  for (let m; (m = re.exec(skraa(tekst).toLowerCase())); ) if (!/\.env\.(example|sample)$/.test(m[1])) return true;
  return false;
}

// Mønstre, der ligner nøgler (samme slags som nøgletjekket før commit).
const NOEGLE = [/sk-ant-[A-Za-z0-9_-]{20,}/, /sk-(proj|svcacct|admin)-[A-Za-z0-9_-]{20,}/, /sk-[A-Za-z0-9]{40,}/, /[sr]k_(live|test)_[A-Za-z0-9]{16,}/, /sb_secret_[A-Za-z0-9_-]{16,}/, /AIza[0-9A-Za-z_-]{30,}/, /GOCSPX-[A-Za-z0-9_-]{16,}/, /gh[pousr]_[A-Za-z0-9]{30,}/, /AKIA[0-9A-Z]{16}/, /xox[baprs]-[A-Za-z0-9-]{20,}/, /re_[A-Za-z0-9]{24,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
const harNoegle = (tekst) => !!tekst && NOEGLE.some((re) => re.test(String(tekst)));

// ---------- kommandoer ----------

function tokenize(command) {
  const segs = [];
  let words = [], cur = "", has = false, q = null;
  const endWord = () => { if (has) words.push(cur); cur = ""; has = false; };
  const endSeg = () => { endWord(); if (words.length) segs.push(words); words = []; };
  const s = String(command || "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; else cur += c; continue; }
    if (c === '"' || c === "'") { q = c; has = true; continue; }
    if (/\s/.test(c)) { if (c === "\n") endSeg(); else endWord(); continue; }
    if (c === ";" || c === "|" || c === "&") { endSeg(); if ((c === "&" || c === "|") && s[i + 1] === c) i++; continue; }
    cur += c; has = true;
  }
  endSeg();
  return segs;
}

const INDPAKNING = new Set(["sudo", "time", "exec", "command", "cmd", "cmd.exe", "/c", "call", "env", "nohup", "&"]);
const SKALLER = new Set(["bash", "sh", "zsh", "powershell", "pwsh"]);
const POWERSHELL = new Set(["powershell", "pwsh"]);
const FLYT_MAPPE = new Set(["cd", "chdir", "pushd", "set-location", "sl"]);
const KONTROL = new Set(["if", "then", "else", "elif", "do", "while", "until", "!", "{", "(", "}", ")", "fi", "done"]);
const prog = (t) => skraa(t).split("/").pop().replace(/\.(cmd|exe|ps1)$/i, "").toLowerCase();

function hoved(raa) {
  // (rm -rf src) og if true; then rm -rf src; fi: parenteser, tuborg og kontrolord foran kommandoen skal ikke skjule den.
  const words = raa.slice();
  let aabnet = false;
  while (words.length) {
    const aaben = words[0].replace(/^[({]+/, "");
    if (aaben !== words[0]) { aabnet = true; words[0] = aaben; }
    if (words[0] === "" || KONTROL.has(words[0].toLowerCase())) words.shift(); else break;
  }
  if (aabnet && words.length) words[words.length - 1] = words[words.length - 1].replace(/[)}]+$/, "");
  let i = 0;
  while (i < words.length && (/^\w+=/.test(words[i]) || INDPAKNING.has(words[i].toLowerCase()))) i++;
  // En hel kommando i anførselstegn (cmd /c "rmdir /s /q src") er ét ord her: den skal læses som en kommando for sig.
  if (i > 0 && /\s/.test(words[i] || "")) return { navn: "", args: [], indre: words[i] };
  return { navn: prog(words[i]), args: words.slice(i + 1) };
}
// Det, en skal får at køre: ét ord i anførselstegn (bash -lc "..."), eller for PowerShell alt efter -Command (pwsh -c Remove-Item -Recurse x).
function skalKommando(navn, args) {
  if (POWERSHELL.has(navn)) {
    const k = args.findIndex((a) => /^-(c|command)$/i.test(a));
    if (k >= 0 && k + 1 < args.length) return args.slice(k + 1).join(" ");
  }
  return args[args.length - 1];
}
const klynge = (f, bogstav) => /^-[a-zA-Z]+$/.test(f) && f.slice(1).split(/[mFcC]/)[0].includes(bogstav);

function regelGit(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith("-")) {
    if ((args[i] === "-c" || args[i] === "-C") && i + 1 < args.length) {
      if (args[i] === "-c" && /^core\.hookspath=/i.test(args[i + 1])) return deny("vagt.hookspath.flyt");
      if (args[i] === "-c" && /^alias\./i.test(args[i + 1])) return deny("vagt.alias");
      i++;
    }
    i++;
  }
  const sub = args[i], rest = args.slice(i + 1);
  if (sub === "config" && rest.some((t) => /^core\.hookspath$/i.test(t))) {
    if (rest.some((t) => /^--(get|get-all|list|get-regexp)$/.test(t))) return null;
    const vaerdi = rest.filter((t) => !t.startsWith("-") && !/^core\.hookspath$/i.test(t));
    if (!vaerdi.length && !rest.some((t) => /^--(unset|unset-all|replace-all|add)$/.test(t))) return null; // ren læsning
    if (vaerdi.length === 1 && /^\.githooks\/?$/.test(vaerdi[0])) return null; // tænder nøgletjekket
    return deny("vagt.hookspath.sluk");
  }
  const flag = [];
  for (let k = 0; k < rest.length; k++) { if (/^(-m|--message|-F|--file|-c|-C)$/.test(rest[k])) { k++; continue; } flag.push(rest[k]); }
  if (sub === "commit" && flag.some((f) => /^--no-v/.test(f) || klynge(f, "n"))) return deny("vagt.noverify");
  if (sub === "push" && flag.some((f) => /^--for/.test(f) || klynge(f, "f") || f.startsWith("+"))) return deny("vagt.force");
  if (sub === "reset" && flag.includes("--hard")) return deny("vagt.reset");
  if (sub === "clean" && flag.some((f) => /^--force$/.test(f) || klynge(f, "f"))) return deny("vagt.clean");
  // Kommandoer, der smider ændringer væk, som ikke er gemt i en commit. Én enkelt fil må gerne rettes tilbage; hele træet må ikke.
  const tvang = flag.some((f) => f === "--force" || klynge(f, "f"));
  const alt = flag.some((f) => /^(\.|\.\/|\.\/\*|\*|:\/|:\(top\))$/.test(f));
  if (sub === "checkout" && (alt || tvang)) return deny("vagt.kasser", { k: "git checkout" });
  if (sub === "switch" && (tvang || flag.includes("--discard-changes"))) return deny("vagt.kasser", { k: "git switch" });
  if (sub === "restore" && alt) {
    const kunIndex = flag.some((f) => f === "--staged" || klynge(f, "S")) && !flag.some((f) => f === "--worktree" || klynge(f, "W"));
    if (!kunIndex) return deny("vagt.kasser", { k: "git restore" });
  }
  if (sub === "stash" && /^(drop|clear)$/.test(flag[0] || "")) return deny("vagt.stash");
  if (sub === "branch" && (flag.some((f) => klynge(f, "D")) || (flag.some((f) => f === "--delete" || klynge(f, "d")) && tvang))) return deny("vagt.gren");
  return null;
}

// ---------- sletning af filer og mapper ----------
// Tre ting afvises: sletning uden for projektmappen (eller i hjemmemappen), sletning af "alt", og sletning af en hel mappe med indhold,
// medmindre mappen kan laves igen (fx node_modules). Enkelte filer inde i projektet må AI'en gerne slette.
// Reglerne kender projektmappen fra vagten (input.projektrod) eller, ellers, den mappe, kommandoen kører i (input.cwd).
const SLET = new Set(["rm", "rmdir", "rd", "del", "erase", "remove-item", "ri", "unlink"]);
const CMD_STIL = new Set(["rmdir", "rd", "del", "erase"]);
const GENSKABELIG = new Set(["node_modules", "dist", "build", "out", ".next", ".nuxt", ".cache", ".turbo", ".parcel-cache", ".vite", "coverage", "__pycache__", ".pytest_cache", ".venv", "venv", "tmp", "temp", ".tmp"]);
const HJEMME = /^(~|\$home\b|\$\{home\}|\$env:(userprofile|homepath|home)\b|%(userprofile|homepath|home)%)/;
const drev = (s) => s.replace(/^\/([a-z])(\/|$)/, "$1:/"); // /c/Users (Git Bash) → c:/Users
const erAbsolut = (s) => /^([a-z]:|\/)/.test(s);

// Findes målet, og er det en fil? Så gælder -r ikke for det ("rm -rf node_modules package-lock.json"). Findes det ikke, eller kender vi ikke mappen, er svaret nej.
function erFil(m, ctx) {
  if (ctx.flyttet || !ctx.cwd || /[*?$%`~]/.test(m)) return false;
  try { return fs.lstatSync(path.resolve(String(ctx.cwd), skraa(m))).isFile(); } catch { return false; }
}

// Er det her mål (en sti) i orden at slette? Svarer med en afvisning eller null.
//   rekursiv: hele mappen med indhold. filtreret: find med -name o.l., der kun rammer nogle af filerne.
function regelMaal(m, rekursiv, ctx, filtreret = false) {
  const lille = skraa(m).trim().toLowerCase();
  if (HJEMME.test(lille)) return deny("vagt.slet.udenfor", { m });
  // En variabel i stien kan være tom, og så rammer kommandoen en helt anden mappe ("$DIR/*" bliver til "/*").
  if (/[$%`]/.test(lille) && (rekursiv || /[*?]|\/$/.test(lille))) return deny("vagt.slet.variabel", { m });
  let rel = drev(normSti(lille));
  const cwd = ctx.cwd ? drev(normSti(ctx.cwd)) : null;
  const rod = ctx.rod ? drev(normSti(ctx.rod)) : cwd;
  let abs = rel;
  if (!erAbsolut(rel) && cwd && !ctx.flyttet) abs = path.posix.normalize(cwd + "/" + rel);
  const indeni = !!rod && (abs === rod || abs.startsWith(rod + "/"));
  if (!indeni && /^\/tmp\/[^/]/.test(abs)) return null; // midlertidige filer uden for projektet
  if (erAbsolut(abs)) {
    if (!rod) return deny("vagt.slet.udenfor", { m });
    if (abs === rod) return filtreret ? null : deny("vagt.slet.alt", { m }); // hele projektmappen; find med -name starter dog gerne dér
    if (!abs.startsWith(rod + "/")) return deny("vagt.slet.udenfor", { m });
    rel = abs.slice(rod.length + 1);
  } else if (rel === ".." || rel.startsWith("../")) return deny("vagt.slet.udenfor", { m });
  const kanLavesIgen = rel.split("/").some((del) => GENSKABELIG.has(del));
  if (rel === ".git" || rel.startsWith(".git/")) return deny("vagt.slet.alt", { m });
  if (filtreret) return null;
  if (/(^|\/)(\*|\*\.\*|\.\*)$/.test(rel) && !kanLavesIgen) return deny("vagt.slet.alt", { m });
  if (rekursiv && !kanLavesIgen) return deny("vagt.slet.mappe", { m });
  return null;
}

function regelSlet(navn, args, ctx) {
  if (!SLET.has(navn)) return null;
  let rekursiv = false;
  const maal = [];
  for (const raa of args) {
    const lille = raa.toLowerCase();
    if (CMD_STIL.has(navn) && /^\/[a-z?](:\S*)?$/.test(lille)) { if (lille === "/s") rekursiv = true; continue; }
    if (/^-/.test(raa)) {
      if (/^-fo(r(ce?)?)?$/.test(lille)) continue; // PowerShell: -Force (og forkortelser) er ikke -r
      if (lille === "--recursive" || /^-rec/.test(lille) || (/^-[a-z]{1,4}$/.test(lille) && lille.includes("r"))) rekursiv = true;
      continue;
    }
    // PowerShell skriver flere mål med komma: Remove-Item -Recurse src, docs
    for (const del of raa.split(",")) if (del) maal.push(del);
  }
  if (rekursiv && !maal.length) return deny("vagt.slet.mappe", { m: navn }); // ingen mål at vurdere (fx via xargs): vi kan ikke se, hvad der slettes
  for (const m of maal) { const hit = regelMaal(m, rekursiv && !erFil(m, ctx), ctx); if (hit) return hit; }
  return null;
}

// find ... -delete og find ... -exec rm: de sletter alt, find rammer, og med et -name-filter kun nogle af filerne.
function regelFind(args, ctx) {
  let k = 0;
  const rodder = [];
  while (k < args.length && !/^(-|\(|!)/.test(args[k])) rodder.push(args[k++]);
  const resten = args.slice(k);
  const lille = resten.map((a) => a.toLowerCase());
  const exec = lille.some((a, n) => /^-(exec|execdir|ok|okdir)$/.test(a) && SLET.has(prog(resten[n + 1] || "")));
  if (!lille.includes("-delete") && !exec) return null;
  const filtreret = lille.some((a) => /^-(name|iname|path|ipath|regex|iregex)$/.test(a));
  for (const m of rodder.length ? rodder : ["."]) { const hit = regelMaal(m, true, ctx, filtreret); if (hit) return hit; }
  return null;
}

// Kommandoer, der kun læser eller kører kittets egne scripts: nævner de en beskyttet sti, er det ikke en ændring.
const KUN_LAESNING = /^(cat|head|tail|ls|dir|type|cd|pwd|echo|grep|rg|wc|get-content|gc|get-childitem|gci|select-string|test-path|git\s+(diff|log|show|status|ls-files|add|commit)|git\s+config\s+core\.hookspath\s+\.githooks\/?|node\s+[\w:./_-]*scripts\/startkit\/(bevis|overblik|forbrug-gem|fortryd|start)\.js|sh\s+[\w:./_-]*\.githooks\/pre-commit)(\s|$)/i;
function kunLaesning(command) {
  // Tekst i anførselstegn gøres "flad", så et mellemrum eller et | inde i en sti ikke deler kommandoen.
  const flad = skraa(command).replace(/"([^"]*)"|'([^']*)'/g, (_, a, b) => (a ?? b ?? "").replace(/[\s;|&<>]/g, "_"));
  const uden = flad.replace(/\d*>&\d+|\d*>\s*\/dev\/null|\d*>\s*\$null|\d*>\s*nul\b/gi, "");
  if (/[<>]/.test(uden)) return false;
  return uden.split(/&&|\|\||;|\||&|\n/).map((s) => s.trim()).filter(Boolean).every((seg) => KUN_LAESNING.test(seg));
}

function regelKommando(command, ctx = {}, dybde = 0) {
  const tekst = String(command || "").replace(/\\\r?\n/g, " ");
  if (dybde < 3) {
    for (const re of [/\$\(([^()]*)\)/g, /`([^`]*)`/g]) {
      for (let m; (m = re.exec(tekst)); ) { const hit = regelKommando(m[1], ctx, dybde + 1); if (hit) return hit; }
    }
  }
  // Skifter kommandoen mappe (cd ..), ved vi ikke, hvor stierne efter den peger hen. Så gælder kun reglerne, der ikke afhænger af mappen.
  let nu = ctx;
  for (const words of tokenize(tekst)) {
    const { navn, args, indre } = hoved(words);
    if (FLYT_MAPPE.has(navn)) nu = { ...nu, flyttet: true };
    const hit = (indre && dybde < 3 && regelKommando(indre, nu, dybde + 1))
      || (navn === "git" && regelGit(args))
      || regelSlet(navn, args, nu)
      || (navn === "find" && regelFind(args, nu))
      || (SKALLER.has(navn) && dybde < 3 && args.length && regelKommando(skalKommando(navn, args), nu, dybde + 1));
    if (hit) return hit;
  }
  return null;
}

function shellRegler(command, ctx) {
  if (naevnerEnvFil(command)) return deny("vagt.env.kommando");
  if (harNoegle(command)) return deny("vagt.noegle.kommando");
  const hit = regelKommando(command, ctx);
  if (hit) return hit;
  if (BESKYTTET_I_TEKST.some((re) => re.test(skraa(command).toLowerCase())) && !kunLaesning(command)) {
    return deny("vagt.kontrol.kommando");
  }
  return null;
}

// ---------- filændringer (apply_patch i Codex; Edit, Write m.fl. i Claude Code) ----------

function patchFiler(tekst) {
  const filer = [];
  for (const m of String(tekst).matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$|^\*\*\* Move to: (.+)$/gm)) filer.push((m[1] || m[2]).trim());
  return filer;
}
const patchTilfoejet = (tekst) => String(tekst).split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).join("\n");

function filRegler(filer, indhold) {
  for (const f of filer) {
    if (erEnvFil(f)) return deny("vagt.env.fil", { f });
    if (BESKYTTET.some((re) => re.test(normSti(f)))) return deny("vagt.kontrol.fil", { f });
  }
  if (harNoegle(indhold)) return deny("vagt.noegle.fil");
  return null;
}

function somTekst(raa) {
  if (Array.isArray(raa)) return raa.length >= 3 && /^-/.test(String(raa[1])) ? String(raa[raa.length - 1]) : raa.join(" ");
  return String(raa ?? "");
}

function decide(input = {}) {
  const navn = String(input.tool_name || "");
  const ti = input.tool_input || {};
  const tekst = somTekst(ti.command ?? ti.input ?? ti.patch ?? "");
  const fund = [];
  // Claude Code læser og søger med egne værktøjer. De må gerne se kittets kontroller, men aldrig en .env-fil.
  if (/^(Read|Grep|Glob)$/.test(navn)) {
    const f = [ti.file_path, ti.path].filter(Boolean).find(erEnvFil);
    return f ? deny("vagt.env.fil", { f }) : allow();
  }
  const erPatchVaerktoej = /^(apply_patch|Edit|Write|MultiEdit|NotebookEdit)$/.test(navn);
  if (erPatchVaerktoej || /^\*\*\* Begin Patch/m.test(tekst) || ti.file_path) {
    const filer = [...patchFiler(tekst), ti.file_path, ti.notebook_path].filter(Boolean);
    const flere = Array.isArray(ti.edits) ? ti.edits.map((e) => e && e.new_string) : [];
    const indhold = [patchTilfoejet(tekst), ti.content, ti.new_string, ti.new_source, ...flere].filter(Boolean).join("\n");
    fund.push(filRegler(filer, indhold));
  }
  if (!erPatchVaerktoej) fund.push(shellRegler(tekst, { cwd: input.cwd, rod: input.projektrod }));
  return fund.find(Boolean) || allow();
}

module.exports = { decide, normSti, harNoegle, NOEGLE };
