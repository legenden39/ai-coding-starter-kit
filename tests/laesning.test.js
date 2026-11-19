// Vagten må ikke stoppe ufarlig læsning. Kendte læsekommandoer (git diff, git log, git status m.fl.) køres mod reglerne
// med forskellige filnavne i, også navnene på kittets egne kontroller, og ingen må blive stoppet.
// Det modsatte tjekkes også: det, der ligner læsning, men skriver en fil eller rører nøglefiler, stoppes stadig.
// Alt køres på dansk og på engelsk.
const path = require("path");
const { KIT, tjek, slut } = require("./hjaelp");
const { decide } = require(path.join(KIT, "scripts", "projekt", "regler"));

const env = "." + "env"; // skrives i to stykker, så andre vagter ikke reagerer på selve testfilen
const shell = (command, tool_name = "Bash") => decide({ tool_name, tool_input: { command }, cwd: "/work/mit-projekt" });

// Filnavne, der kan stå i en læsekommando. De sidste er kittets egne kontroller, som AI'en gerne må læse, men ikke ændre.
const FILER = [
  "", "src/app.js", "package.json", "package-lock.json", "supabase/", "README.md", `${env}.example`, '"en mappe/med mellemrum.js"',
  "scripts/startkit/vagt.js", "scripts/startkit/regler.js", "scripts/startkit/", ".codex/hooks.json", ".claude/settings.local.json", ".claude/settings.json", ".githooks/pre-commit", ".startkit/config.json", ".startkit/bevis.json",
];
// {f} bliver til et filnavn. Kommandoerne er den slags, en AI faktisk skriver, når den ser efter, hvad der er sket.
const LAESER = [
  "git status",
  "git status --short {f}",
  "git diff {f}",
  "git diff -- {f}",
  "git diff --stat HEAD~3 -- {f}",
  "git diff --cached -- {f}",
  "git log --oneline -5 -- {f}",
  "git log -p -3 -- {f}",
  "git show --stat HEAD -- {f}",
  "git ls-files {f}",
  "git blame {f}",
  "git --no-pager diff -- {f}",
  "git --no-pager log --oneline -10 -- {f}",
  "git -C . status --short {f}",
  "git diff --stat -- {f} | cut -c1-100",
  "git diff --name-only -- {f} | sort | uniq -c",
  "git log --oneline -- {f} | wc -l",
  "git log --oneline -- {f} | head -20",
  "git status --short {f} 2>&1 | sed -n 1,5p",
  "git diff -- {f} 2>/dev/null | tail -30",
  "cd /work/mit-projekt && git diff --stat abc1234..HEAD -- {f} | cut -d' ' -f2 ; echo ---; git log --oneline abc1234..HEAD -- {f}",
  "git status; git diff --stat -- {f}; git log --oneline -3",
];
// Det samme i PowerShell (Claude Code på Windows).
const LAESER_PS = [
  "git status --short {f}",
  "git diff --stat -- {f} | Select-Object -First 20",
  "git log --oneline -- {f} | Measure-Object",
  "git --no-pager diff -- {f} | Out-String",
];

// Ligner læsning, men er det ikke: skriver en fil, eller rører en fil med nøgler.
const STOPPES = [
  ["git diff --output=scripts/startkit/vagt.js", "skriver resultatet oven i vagten"],
  ["git diff --output scripts/startkit/regler.js HEAD~1", "skriver resultatet oven i reglerne"],
  ["git log -p --output=.githooks/pre-commit", "skriver oven i nøgletjekket"],
  ["git diff -- scripts/startkit/vagt.js > scripts/startkit/vagt.js", "skriver med >"],
  ["git diff -- src/app.js | sort -o .startkit/config.json", "sort -o skriver en fil"],
  ["git log --oneline | uniq - .codex/hooks.json", "uniq med to navne skriver det andet"],
  ["git diff -- src/app.js | tee scripts/startkit/vagt.js", "tee skriver en fil"],
  ["git diff -- src/app.js | sed -i s/a/b/ scripts/startkit/vagt.js", "sed -i ændrer en fil"],
  ["git diff --name-only | xargs rm scripts/startkit/vagt.js", "xargs starter et andet program"],
  ["git -c core.pager=less diff -- scripts/startkit/vagt.js", "-c kan sætte et program, git kører"],
  ["git status && echo x > .startkit/bevis.json", "en skrivning efter en læsning"],
  [`git diff -- ${env}`, "viser indholdet af en fil med nøgler"],
  [`git log -p -- ${env}.local`, "viser tidligere udgaver af en fil med nøgler"],
  [`git show HEAD:${env}`, "viser en fil med nøgler"],
];

for (const sprog of ["da", "en"]) {
  process.env.STARTKIT_SPROG = sprog;
  let antal = 0;
  const stoppet = [];
  for (const [liste, vaerktoej] of [[LAESER, "Bash"], [LAESER_PS, "PowerShell"]]) {
    for (const skabelon of liste) {
      for (const f of skabelon.includes("{f}") ? FILER : [""]) {
        const c = skabelon.replace(/\{f\}/g, f).replace(/\s+--\s*$/, "").replace(/ {2,}/g, " ").trim();
        antal++;
        const s = shell(c, vaerktoej);
        if (s.decision !== "allow") stoppet.push(`${c}  →  ${s.reason.slice(0, 80)}`);
      }
    }
  }
  tjek(`${sprog}: ingen af ${antal} ufarlige læsekommandoer bliver stoppet`, antal > 300 && stoppet.length === 0, `${stoppet.length} stoppet:\n     ` + stoppet.slice(0, 8).join("\n     "));

  for (const [c, hvorfor] of STOPPES) {
    const s = shell(c);
    tjek(`${sprog}: stoppes stadig (${hvorfor}): ${c.slice(0, 60)}`, s.decision === "deny" && (sprog === "da" ? /^Stoppet: .+ Hvorfor: .+ Hvad nu: /.test(s.reason) : /^Stopped: .+ Why: .+ What now: /.test(s.reason)), JSON.stringify(s));
  }
}
delete process.env.STARTKIT_SPROG;

// Claude Codes egne læseværktøjer må se kittets kontroller, men aldrig en fil med nøgler.
for (const f of ["scripts/startkit/vagt.js", ".claude/settings.local.json", ".startkit/config.json", "package.json"]) {
  tjek(`Read af ${f} er tilladt`, decide({ tool_name: "Read", tool_input: { file_path: f } }).decision === "allow");
}
tjek("Read af en fil med nøgler er stadig stoppet", decide({ tool_name: "Read", tool_input: { file_path: env } }).decision === "deny");

slut("laesning");
