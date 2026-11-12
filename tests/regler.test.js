// Vagtens regler: hvad bliver tilladt, og hvad bliver afvist.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { KIT, tjek, slut, falskNoegle } = require("./hjaelp");
const { decide } = require(path.join(KIT, "scripts", "projekt", "regler"));

const shell = (command) => decide({ tool_name: "Bash", tool_input: { command } });
const patch = (tekst) => decide({ tool_name: "apply_patch", tool_input: { command: tekst } });
const env = "." + "env"; // skrives i to stykker, så andre vagter ikke reagerer på selve testfilen

const TILLADT = [
  "npm test",
  "git status",
  'git commit -m "en almindelig commit"',
  'git add . && git commit -m "x"',
  'git commit -m "skriv om --no-verify i docs"',
  'git commit -am "nævner scripts/startkit i teksten"',
  "git push origin main",
  "git clean -n",
  "git config core.hooksPath .githooks",
  "git config --get core.hooksPath",
  "git config core.hooksPath",
  "node scripts/startkit/bevis.js",
  'node "C:/Mit projekt/scripts/startkit/bevis.js"',
  "node scripts\\startkit\\overblik.js",
  "cat scripts/startkit/vagt.js",
  "Get-Content .codex/hooks.json",
  "git diff -- .githooks/pre-commit",
  "sh .githooks/pre-commit --scan",
  `cat ${env}.example`,
  "node src/app.js > ud.txt",
];
for (const c of TILLADT) { const s = shell(c); tjek(`tilladt: ${c}`, s.decision === "allow", s.reason); }

const AFVIST = [
  'git commit --no-verify -m "x"',
  'git commit -nm "x"',
  "git push --force",
  "git push -f origin main",
  "git push origin +main",
  "git reset --hard HEAD~1",
  "git clean -fd",
  'git -c core.hooksPath=/dev/null commit -m "x"',
  'git config core.hooksPath ""',
  "git config core.hooksPath andet",
  "git config --unset core.hooksPath",
  `cat ${env}`,
  `Get-Content ${env}.local`,
  `echo HEJ=1 >> ${env}`,
  "echo x > scripts/startkit/vagt.js",
  "rm .codex/hooks.json",
  "Remove-Item -Recurse .githooks",
  "node scripts/startkit/bevis.js > .startkit/bevis.json",
  'node -e "require(\'fs\').writeFileSync(\'.startkit/config.json\',\'{}\')"',
  'bash -lc "git push --force"',
  'powershell -Command "git reset --hard"',
  "echo $(git push --force)",
  `curl -H "Authorization: ${falskNoegle()}" https://example.com`,
];
for (const c of AFVIST) { const s = shell(c); tjek(`afvist: ${c.slice(0, 60)}`, s.decision === "deny" && /hvorfor-blev-jeg-stoppet/.test(s.reason), JSON.stringify(s)); }

// git config --unset har ingen værdi, men er stadig en ændring: tjek, at den ikke slipper igennem som "ren læsning".
tjek("afvist: --unset tæller ikke som læsning", shell("git config --unset core.hooksPath").decision === "deny");

// Kommandoen kan komme som en liste (ældre Codex-format).
tjek("afvist: liste-kommando", decide({ tool_name: "Bash", tool_input: { command: ["bash", "-lc", "git push --force"] } }).decision === "deny");
tjek("tilladt: liste-kommando", decide({ tool_name: "Bash", tool_input: { command: ["bash", "-lc", "npm test"] } }).decision === "allow");

// Filændringer
const p = (fil, linjer = "+const a = 1;") => `*** Begin Patch\n*** Update File: ${fil}\n@@\n${linjer}\n*** End Patch`;
tjek("tilladt: patch af almindelig fil", patch(p("src/app.js")).decision === "allow");
tjek("tilladt: patch af AGENTS.md", patch(p("AGENTS.md", "+En ny regel.")).decision === "allow");
tjek("tilladt: ny testfil", patch("*** Begin Patch\n*** Add File: tests/ny.test.js\n+test();\n*** End Patch").decision === "allow");
for (const fil of [".codex/hooks.json", ".codex/config.toml", "scripts/startkit/vagt.js", "scripts\\startkit\\regler.js", ".githooks/pre-commit", ".startkit/config.json", ".startkit/bevis.json", "./scripts/../scripts/startkit/faerdig.js", env, `app/${env}.production`]) {
  tjek(`afvist: patch af ${fil}`, patch(p(fil)).decision === "deny");
}
tjek("afvist: patch, der flytter en fil ind i kontrollerne", patch("*** Begin Patch\n*** Update File: a.js\n*** Move to: scripts/startkit/vagt.js\n*** End Patch").decision === "deny");
tjek("afvist: patch med nøgle", patch(p("src/config.js", `+const k = "${falskNoegle()}";`)).decision === "deny");
tjek("tilladt: patch, der FJERNER en nøgle", patch(p("src/config.js", `-const k = "${falskNoegle()}";\n+const k = process.env.NOEGLE;`)).decision === "allow");
tjek("afvist: patch sendt gennem skallen", shell(`apply_patch <<'EOF'\n${p(".codex/hooks.json")}\nEOF`).decision === "deny");
tjek("afvist: Edit-værktøj på en kontrol", decide({ tool_name: "Edit", tool_input: { file_path: ".startkit/config.json", new_string: "{}" } }).decision === "deny");
tjek("afvist: Write-værktøj med nøgle", decide({ tool_name: "Write", tool_input: { file_path: "src/a.js", content: falskNoegle() } }).decision === "deny");

// Tomt og mærkeligt input må ikke vælte reglerne.
tjek("tomt input tillades", decide({}).decision === "allow");
tjek("ukendt værktøj tillades", decide({ tool_name: "mcp__noget__andet", tool_input: { query: "hej" } }).decision === "allow");

// ---- sletning af filer og mapper, og git-kommandoer der smider ændringer væk ----
// Reglen: sletning uden for projektmappen, sletning af "alt", og sletning af en hel mappe med indhold afvises.
// Mapper, der kan laves igen (node_modules, dist, build ...), og enkelte filer inde i projektet er stadig i orden.
const PROJEKT = "/work/mit-projekt";
const WIN = "D:\\arbejde\\mit projekt";
const i = (command, cwd = PROJEKT) => decide({ tool_name: "Bash", cwd, tool_input: { command } });
const SLET_TILLADT = [
  "rm gammel.txt",
  "rm -f ud.log",
  "rm src/gammel.js",
  "rm -rf node_modules",
  "rm -rf ./node_modules",
  "rm -rf dist build .next",
  "rm -rf src/node_modules",
  "rm -rf .cache coverage",
  "rm *.log",
  "rm -rf /tmp/min-test",
  `rm -rf ${PROJEKT}/dist`,
  "rm -rf node_modules && npm install",
  "rmdir tom-mappe",
  "del ud.log",
  "del /q ud.log",
  "Remove-Item ud.log",
  "Remove-Item -Recurse -Force node_modules",
  "Remove-Item -Recurse -Force .\\dist",
  "cmd /c rmdir /s /q node_modules",
  'cmd /c "rmdir /s /q dist"',
  'bash -lc "rm -rf node_modules"',
  "find . -name '*.pyc' -delete",
  "find src -name .DS_Store -delete",
  "git checkout main",
  "git checkout -b ny-gren",
  "git checkout -- src/app.js",
  "git restore src/app.js",
  "git restore --staged .",
  "git restore -S .",
  "git switch main",
  "git switch -c ny",
  "git stash",
  "git stash pop",
  "git branch ny",
  "git branch -d faerdig",
  "git branch -a",
  "ls -la ~",
  "cat ~/noter.txt",
];
for (const c of SLET_TILLADT) { const s = i(c); tjek(`tilladt: ${c}`, s.decision === "allow", s.reason); }

const SLET_AFVIST = [
  "rm -rf ~/",
  "rm -rf ~",
  "rm -rf $HOME",
  "rm -rf ${HOME}/arbejde",
  "rm -rf /",
  "rm -rf /work",
  "rm -rf /work/andet-projekt",
  "rm -rf ../andet-projekt",
  "rm ../noter.txt",
  'rm -rf "$TOM/"',
  "rm -rf $DIR/*",
  "rm -rf $(pwd)",
  "rm -rf `pwd`",
  "rm -rf src",
  "rm -rf ./src",
  "rm -r src/komponenter",
  "rm -rf node_modules/../src",
  "rm -rf dist/../src",
  "rm -fr docs",
  "rm -Rf docs",
  "rm --recursive --force docs",
  "rm -rf *",
  "rm -rf .",
  "rm -rf ./",
  "rm -rf ./*",
  "rm *",
  "rm -rf .git",
  "rm -rf src node_modules",
  "sudo rm -rf src",
  "rm -rf --no-preserve-root /",
  "Remove-Item -Recurse -Force C:/Users/<you>",
  "Remove-Item -Recurse -Force C:\\Users\\<you>",
  "Remove-Item -Recurse -Force $env:USERPROFILE",
  "Remove-Item -Recurse -Force src",
  "Remove-Item -Recurse src, docs",
  "rm -r -fo src",
  "ri -r -fo src",
  "rmdir /s /q src",
  "rd /s /q src",
  "del /s /q *.*",
  "del /s /q src",
  "del *.*",
  "rmdir /s /q %USERPROFILE%",
  "rmdir /s /q C:\\Users\\<you>",
  'cmd /c "rmdir /s /q src"',
  "cmd /c rmdir /s /q src",
  'bash -lc "rm -rf src"',
  'sh -c "rm -rf ~/"',
  'powershell -Command "Remove-Item -Recurse -Force src"',
  "pwsh -c Remove-Item -Recurse src",
  "echo $(rm -rf src)",
  "npm test && rm -rf src",
  "cd .. && rm -rf andet",
  "find . -delete",
  "find . -type f -delete",
  "find src -exec rm -rf {} +",
  "find . -type f -exec rm {} +",
  "find / -name '*.tmp' -delete",
  "git checkout .",
  "git checkout -- .",
  "git checkout HEAD -- .",
  "git checkout -f",
  "git checkout --force main",
  "git checkout ./",
  "git restore .",
  "git restore --worktree .",
  "git restore --source=HEAD~1 .",
  "git restore --staged --worktree .",
  "git restore :/",
  "git switch -f main",
  "git switch --discard-changes main",
  "git stash drop",
  "git stash drop stash@{1}",
  "git stash clear",
  "git branch -D main",
  "git branch -D gammel-gren",
  "git branch -d -f ny",
  "git branch --delete --force ny",
  "git -C andet checkout .",
  "bash -lc 'git checkout .'",
];
for (const c of SLET_AFVIST) { const s = i(c); tjek(`afvist: ${c.slice(0, 60)}`, s.decision === "deny" && /hvorfor-blev-jeg-stoppet/.test(s.reason), JSON.stringify(s)); }

// Et mål, der er en fil, tæller ikke som en mappe, selv om -r står i kommandoen. Her findes filerne og mapperne rigtigt.
const rigtig = fs.mkdtempSync(path.join(os.tmpdir(), "startkit-slet-"));
fs.mkdirSync(path.join(rigtig, "src")); fs.mkdirSync(path.join(rigtig, "node_modules"));
fs.writeFileSync(path.join(rigtig, "package-lock.json"), "{}"); fs.writeFileSync(path.join(rigtig, "src", "app.js"), "");
tjek("tilladt: rm -rf node_modules package-lock.json (den ene er en fil)", i("rm -rf node_modules package-lock.json", rigtig).decision === "allow");
tjek("tilladt: rm -rf på en enkelt fil", i("rm -rf package-lock.json", rigtig).decision === "allow");
tjek("tilladt: rm -rf på en fil i en mappe", i("rm -rf src/app.js", rigtig).decision === "allow");
tjek("afvist: rm -rf på en mappe, der findes", i("rm -rf src", rigtig).decision === "deny");
tjek("afvist: en fil og en mappe", i("rm -rf package-lock.json src", rigtig).decision === "deny");
tjek("afvist: en fil, der ikke findes, tæller ikke som en fil", i("rm -rf findes-ikke.json", rigtig).decision === "deny");
tjek("afvist: efter cd kender vi ikke mappen, så filtjekket gælder ikke", i("cd src && rm -rf package-lock.json", rigtig).decision === "deny");
fs.rmSync(rigtig, { recursive: true, force: true });

// Parenteser og kontrolord må ikke skjule en kommando.
for (const c of ["(rm -rf src)", "( rm -rf src )", "{ rm -rf src; }", "if true; then rm -rf src; fi", "for x in a; do rm -rf src; done", "while true; do rm -rf src; done", "! rm -rf src", "(cd . && rm -rf src)"]) { const s = i(c); tjek(`afvist: ${c}`, s.decision === "deny", JSON.stringify(s)); }
for (const c of ["(rm -rf node_modules)", "if true; then rm -rf dist; fi", "(cd app && npm test)", "{ echo hej; }"]) { const s = i(c); tjek(`tilladt: ${c}`, s.decision === "allow", s.reason); }

// Mapper kan have en anden sti på Windows, og en kommando kan køre i en undermappe af projektet.
tjek("tilladt (Windows): sletning inde i projektet", i('rm -rf "D:/arbejde/mit projekt/dist"', WIN).decision === "allow");
tjek("tilladt (Windows): Remove-Item af node_modules", i("Remove-Item -Recurse -Force node_modules", WIN).decision === "allow");
tjek("tilladt (Windows): sti med baglæns skråstreger", i('Remove-Item -Recurse -Force "D:\\arbejde\\mit projekt\\dist"', WIN).decision === "allow");
tjek("afvist (Windows): sletning af hele projektmappen", i('Remove-Item -Recurse -Force "D:\\arbejde\\mit projekt"', WIN).decision === "deny");
tjek("afvist (Windows): sletning ved siden af projektet", i("rmdir /s /q D:\\arbejde\\andet", WIN).decision === "deny");
tjek("afvist (Windows): sletning i hjemmemappen", i("Remove-Item -Recurse C:\\Users\\<you>\\Documents", WIN).decision === "deny");
tjek("tilladt: sletning i en undermappe, der peger på node_modules i roden", decide({ tool_name: "Bash", cwd: PROJEKT + "/app", projektrod: PROJEKT, tool_input: { command: "rm -rf ../node_modules" } }).decision === "allow");
tjek("afvist: sletning i en undermappe, der peger uden for projektet", decide({ tool_name: "Bash", cwd: PROJEKT + "/app", projektrod: PROJEKT, tool_input: { command: "rm -rf ../../andet" } }).decision === "deny");
tjek("afvist: hele projektmappen set fra en undermappe", decide({ tool_name: "Bash", cwd: PROJEKT + "/app", projektrod: PROJEKT, tool_input: { command: "rm -rf .." } }).decision === "deny");
tjek("afvist uden at kende mappen: absolut sti", decide({ tool_name: "Bash", tool_input: { command: "rm -rf /work/arbejde" } }).decision === "deny");
tjek("tilladt uden at kende mappen: node_modules", decide({ tool_name: "Bash", tool_input: { command: "rm -rf node_modules" } }).decision === "allow");
tjek("afvist uden at kende mappen: en almindelig mappe", decide({ tool_name: "Bash", tool_input: { command: "rm -rf src" } }).decision === "deny");

// Hver afvisning siger, hvad der er galt, og at ejeren selv kan gøre det.
for (const [c, m] of [["rm -rf ~/", /uden for projektmappen/], ["rm -rf *", /alt i mappen/], ["rm -rf src", /hele mappen/], ['rm -rf "$TOM/"', /variabel/], ["git checkout .", /ikke er gemt/], ["git stash drop", /stash/], ["git branch -D x", /gren/]]) {
  const s = i(c);
  tjek(`besked: ${c}`, m.test(s.reason) && /Ejeren/.test(s.reason), s.reason);
}
tjek("besked på engelsk", (() => { process.env.STARTKIT_SPROG = "en"; try { const s = i("rm -rf src"); return /whole folder/.test(s.reason) && /owner/.test(s.reason); } finally { delete process.env.STARTKIT_SPROG; } })());

// Den ærlige grænse: mønstre på tekst kan omgås. Det her er ikke en mur, men skal heller ikke gætte forkert på almindeligt arbejde.
for (const c of ["npm run build", "node scripts/ryd.js", "git log --oneline", "echo rm -rf src", "grep -r rm src", 'git commit -m "ret rm -rf i README"', "npm uninstall pakke", "cp -r src backup", "mv gammel ny", "mkdir -p dist/ud"]) {
  const s = i(c); tjek(`tilladt: ${c}`, s.decision === "allow", s.reason);
}

slut("regler");
