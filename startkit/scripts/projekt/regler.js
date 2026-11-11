// Vagtens regler. Rene funktioner uden bivirkninger, så de kan testes uden Codex.
//
//   decide({tool_name, tool_input}) → {decision: "allow" | "deny", reason}
//
// Codex kan ikke vise en godkend-knap fra en hook, så der findes kun "tillad" og "afvis".
// Hver afvisning siger, hvordan ejeren selv gør det, hvis det er med vilje.
// Ærlig grænse: mønstre på kommandotekst kan omgås. Vagten er et sikkerhedsnet, ikke en mur.
const path = require("path");

const HVORFOR = " Se .startkit/hvorfor-blev-jeg-stoppet.md.";
const allow = () => ({ decision: "allow", reason: "" });
const deny = (reason) => ({ decision: "deny", reason: reason + HVORFOR });
const skraa = (s) => String(s || "").replace(/\\/g, "/");

function normSti(p) {
  const n = path.posix.normalize(skraa(p).trim().toLowerCase());
  return n.length > 1 ? n.replace(/\/+$/, "") : n;
}

// Kittets egne kontroller: AI'en må ikke ændre dem (så kunne den slå dem fra).
const BESKYTTET = [
  /(^|\/)\.codex\/(hooks\.json|config\.toml)$/,
  /(^|\/)scripts\/startkit(\/|$)/,
  /(^|\/)\.githooks(\/|$)/,
  /(^|\/)\.git\/hooks(\/|$)/,
  /(^|\/)\.startkit\/(config|bevis)\.json$/,
];
const BESKYTTET_I_TEKST = [
  /\.codex\/(hooks\.json|config\.toml)/,
  /scripts\/startkit\b/,
  /\.githooks\b/,
  /\.git\/hooks\b/,
  /\.startkit\/(config|bevis)\.json/,
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
const prog = (t) => skraa(t).split("/").pop().replace(/\.(cmd|exe|ps1)$/i, "").toLowerCase();

function hoved(words) {
  let i = 0;
  while (i < words.length && (/^\w+=/.test(words[i]) || INDPAKNING.has(words[i].toLowerCase()))) i++;
  return { navn: prog(words[i]), args: words.slice(i + 1) };
}
const klynge = (f, bogstav) => /^-[a-zA-Z]+$/.test(f) && f.slice(1).split(/[mFcC]/)[0].includes(bogstav);

function regelGit(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith("-")) {
    if ((args[i] === "-c" || args[i] === "-C") && i + 1 < args.length) {
      if (args[i] === "-c" && /^core\.hookspath=/i.test(args[i + 1])) return deny("Man må ikke flytte git-hooks (core.hooksPath): nøgletjekket skal køre.");
      if (args[i] === "-c" && /^alias\./i.test(args[i + 1])) return deny("Et git-alias kan skjule --no-verify eller --force. Ejeren kører selv kommandoen, hvis det er med vilje.");
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
    return deny("Man må ikke flytte eller slukke git-hooks (core.hooksPath): nøgletjekket skal køre.");
  }
  const flag = [];
  for (let k = 0; k < rest.length; k++) { if (/^(-m|--message|-F|--file|-c|-C)$/.test(rest[k])) { k++; continue; } flag.push(rest[k]); }
  if (sub === "commit" && flag.some((f) => /^--no-v/.test(f) || klynge(f, "n"))) return deny("git commit --no-verify springer nøgletjekket over. Stopper tjekket en commit, så find årsagen i stedet.");
  if (sub === "push" && flag.some((f) => /^--for/.test(f) || klynge(f, "f") || f.startsWith("+"))) return deny("git push --force kan overskrive arbejde, der ikke kan hentes igen. Ejeren kører selv kommandoen, hvis det er med vilje.");
  if (sub === "reset" && flag.includes("--hard")) return deny("git reset --hard sletter ændringer, der ikke er gemt. Ejeren kører selv kommandoen, hvis det er med vilje.");
  if (sub === "clean" && flag.some((f) => /^--force$/.test(f) || klynge(f, "f"))) return deny("git clean sletter filer, der ikke er gemt i git. Ejeren kører selv kommandoen, hvis det er med vilje.");
  return null;
}

// Kommandoer, der kun læser eller kører kittets egne scripts: nævner de en beskyttet sti, er det ikke en ændring.
const KUN_LAESNING = /^(cat|head|tail|ls|dir|type|cd|pwd|grep|rg|wc|get-content|gc|get-childitem|gci|select-string|test-path|git\s+(diff|log|show|status|ls-files|add|commit)|git\s+config\s+core\.hookspath\s+\.githooks\/?|node\s+[\w:./_-]*scripts\/startkit\/(bevis|overblik|forbrug-gem)\.js|sh\s+[\w:./_-]*\.githooks\/pre-commit)(\s|$)/i;
function kunLaesning(command) {
  // Tekst i anførselstegn gøres "flad", så et mellemrum eller et | inde i en sti ikke deler kommandoen.
  const flad = skraa(command).replace(/"([^"]*)"|'([^']*)'/g, (_, a, b) => (a ?? b ?? "").replace(/[\s;|&<>]/g, "_"));
  const uden = flad.replace(/\d*>&\d+|\d*>\s*\/dev\/null|\d*>\s*\$null|\d*>\s*nul\b/gi, "");
  if (/[<>]/.test(uden)) return false;
  return uden.split(/&&|\|\||;|\||&|\n/).map((s) => s.trim()).filter(Boolean).every((seg) => KUN_LAESNING.test(seg));
}

function regelKommando(command, dybde = 0) {
  const tekst = String(command || "").replace(/\\\r?\n/g, " ");
  if (dybde < 3) {
    for (const re of [/\$\(([^()]*)\)/g, /`([^`]*)`/g]) {
      for (let m; (m = re.exec(tekst)); ) { const hit = regelKommando(m[1], dybde + 1); if (hit) return hit; }
    }
  }
  for (const words of tokenize(tekst)) {
    const { navn, args } = hoved(words);
    const hit = (navn === "git" && regelGit(args))
      || (SKALLER.has(navn) && dybde < 3 && args.length && regelKommando(args[args.length - 1], dybde + 1));
    if (hit) return hit;
  }
  return null;
}

function shellRegler(command) {
  if (naevnerEnvFil(command)) return deny("Kommandoen rører en .env-fil. Nøgler læses og skrives aldrig af AI'en; ejeren lægger dem selv ind.");
  if (harNoegle(command)) return deny("Kommandoen indeholder noget, der ligner en nøgle. Skriv aldrig rigtige nøgler.");
  const hit = regelKommando(command);
  if (hit) return hit;
  if (BESKYTTET_I_TEKST.some((re) => re.test(skraa(command).toLowerCase())) && !kunLaesning(command)) {
    return deny("Kommandoen rører en af startkittets kontroller (vagt, færdig-tjek, nøgletjek eller deres indstillinger). Ejeren ændrer dem selv, eller kører startkittets opsætning igen.");
  }
  return null;
}

// ---------- filændringer (apply_patch) ----------

function patchFiler(tekst) {
  const filer = [];
  for (const m of String(tekst).matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$|^\*\*\* Move to: (.+)$/gm)) filer.push((m[1] || m[2]).trim());
  return filer;
}
const patchTilfoejet = (tekst) => String(tekst).split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).join("\n");

function filRegler(filer, indhold) {
  for (const f of filer) {
    if (erEnvFil(f)) return deny(`${f} er en .env-fil. Nøgler læses og skrives aldrig af AI'en; ejeren lægger dem selv ind.`);
    if (BESKYTTET.some((re) => re.test(normSti(f)))) return deny(`${f} er en af startkittets kontroller. Ejeren ændrer den selv, eller kører startkittets opsætning igen.`);
  }
  if (harNoegle(indhold)) return deny("Indholdet ligner en nøgle eller en hemmelighed. Skriv aldrig rigtige nøgler i filer.");
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
  const erPatchVaerktoej = /^(apply_patch|Edit|Write)$/.test(navn);
  if (erPatchVaerktoej || /^\*\*\* Begin Patch/m.test(tekst) || ti.file_path) {
    const filer = [...patchFiler(tekst), ti.file_path].filter(Boolean);
    const indhold = [patchTilfoejet(tekst), ti.content, ti.new_string].filter(Boolean).join("\n");
    fund.push(filRegler(filer, indhold));
  }
  if (!erPatchVaerktoej) fund.push(shellRegler(tekst));
  return fund.find(Boolean) || allow();
}

module.exports = { decide, normSti, harNoegle, NOEGLE };
