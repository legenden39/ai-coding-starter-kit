// Tilvalg: forklar-tilstand (regler, der kun kommer med, når personen har bedt om det) og del-tjekket (nøgler i det, der lægges ud).
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, git, skriv, falskNoegle } = require("./hjaelp");

const laes = (...dele) => { try { return fs.readFileSync(path.join(...dele), "utf8"); } catch { return null; } };
function koer(program, args, { cwd, input, vaerktoej, sprog } = {}) {
  const env = { ...process.env };
  delete env.STARTKIT_VAERKTOEJ; delete env.STARTKIT_SPROG;
  if (vaerktoej) env.STARTKIT_VAERKTOEJ = vaerktoej;
  if (sprog) env.STARTKIT_SPROG = sprog;
  const r = spawnSync(program, args, { cwd, input, encoding: "utf8", env });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "" };
}
const OPSAET = path.join(KIT, "scripts", "opsaet.js");
const profil = (ekstra = {}) => JSON.stringify({ ...JSON.parse(laes(__dirname, "eksempel-profil.json")), ...ekstra });

// ---- forklar-tilstand ----
for (const [vaerktoej, regelfil] of [["codex", "AGENTS.md"], ["claude", "CLAUDE.md"]]) {
  const rod = nytProjekt();
  skriv(rod, ".startkit/profil.json", profil());
  let r = koer("node", [OPSAET, rod], { vaerktoej });
  const uden = laes(rod, regelfil) || "";
  tjek(`${vaerktoej}: uden tilvalg står der intet om forklar-tilstand, og ingen tomme huller`, r.kode === 0 && !/Forklar-tilstand/.test(uden) && !/\n\n\n/.test(uden) && !/\{\{/.test(uden) && !/Forklar-tilstand er slået til/.test(r.ud), uden);
  skriv(rod, ".startkit/profil.json", profil({ forklar: true }));
  r = koer("node", [OPSAET, rod], { vaerktoej });
  const med = laes(rod, regelfil) || "";
  tjek(`${vaerktoej}: med "forklar": true kommer de tre regler med, og opsætningen siger, at svarene bliver længere`, r.kode === 0 && /## Forklar-tilstand \(ejeren har bedt om det\)/.test(med) && /Det gjorde jeg, og hvorfor/.test(med) && /hvert fagord første gang/.test(med) && /koster lidt flere tokens/.test(r.ud) && med.indexOf("## Forklar-tilstand") < med.indexOf("## Når opgaven er slut") && med.split("<!-- startkit:start").length === 2, med);
  tjek(`${vaerktoej}: regelfilen er stadig kort med forklar-tilstand (højst 45 linjer)`, med.split("\n").length <= 45 && uden.split("\n").length === med.split("\n").length - 5, `${uden.split("\n").length} og ${med.split("\n").length}`);
  skriv(rod, ".startkit/profil.json", profil({ forklar: false }));
  koer("node", [OPSAET, rod], { vaerktoej });
  tjek(`${vaerktoej}: forklar-tilstand kan slås fra igen`, laes(rod, regelfil) === uden);
  skriv(rod, ".startkit/profil.json", profil({ forklar: "ja" }));
  r = koer("node", [OPSAET, rod], { vaerktoej });
  tjek(`${vaerktoej}: andet end true og false afvises med en forklaring`, r.kode === 2 && /forklar skal være true eller false/.test(r.fejl) && laes(rod, regelfil) === uden, r.fejl);
}
{
  const rod = nytProjekt();
  skriv(rod, ".startkit/profile.json", JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Explain along the way." }, explain: true }));
  const r = koer("node", [OPSAET, rod], { vaerktoej: "claude", sprog: "en" });
  const regler = laes(rod, "CLAUDE.md") || "";
  tjek("engelsk: explain mode skrives på engelsk", r.kode === 0 && /## Explain mode \(the owner asked for it\)/.test(regler) && /What I did, and why/.test(regler) && !/[æøåÆØÅ]/.test(regler) && /Explain mode is switched on/.test(r.ud), regler + r.fejl);
}
for (const [f, ord] of [["references/interview.md", "forklar-tilstand"], ["references/kort-vej.md", "forklar-tilstand"], ["en/references/interview.md", "explain mode"], ["en/references/short-path.md", "explain mode"], ["claude/references/interview.md", "forklar-tilstand"], ["claude/en/references/short-path.md", "explain mode"]]) {
  tjek(`${f}: tilbyder forklar-tilstand og siger ærligt, at den koster flere tokens`, (laes(KIT, f) || "").includes(ord) && /flere tokens|more tokens/.test(laes(KIT, f) || ""));
}

// ---- del-tjekket ----
// En falsk Supabase-nøgle af typen service_role, bygget af stykker, så den ikke står som ét ord i nogen fil.
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (role) => [b64({ alg: "HS256", typ: "JWT" }), b64({ iss: "supabase", ref: "abcdefghijklmnop", role, iat: 1700000000 }), "x".repeat(43)].join(".");
const noegle = falskNoegle();

for (const sprog of ["da", "en"]) {
  const rod = nytProjekt();
  skriv(rod, sprog === "en" ? ".startkit/profile.json" : ".startkit/profil.json", sprog === "en" ? JSON.stringify({ person: { name: "Sample" }, projects: [{ name: "Sample project", description: "A place to try things." }], rules: { never_without_ok: ["delete files"], answer_style: "Short." } }) : profil());
  koer("node", [OPSAET, rod], { vaerktoej: "claude", sprog });
  const dt = (...args) => koer("node", [path.join(rod, "scripts", "startkit", "del-tjek.js"), ...args], { cwd: rod });
  const tjekliste = laes(rod, sprog === "en" ? "docs/before-you-share.md" : "docs/foer-du-deler.md") || "";
  tjek(`${sprog}: tjeklisten "Før du deler" peger på del-tjekket`, tjekliste.includes("node scripts/startkit/del-tjek.js"));

  skriv(rod, "src/app.js", "const url = 'https://example.com';\n");
  let r = dt();
  tjek(`${sprog}: uden en bygget mappe siger tjekket det og tjekker kildekoden alligevel`, r.kode === 0 && (sprog === "en" ? /Found no folder/.test(r.ud) && /Checking the source code/.test(r.ud) && /not a security review/.test(r.ud) : /Fandt ingen mappe/.test(r.ud) && /Tjekker kildekoden/.test(r.ud) && /ikke en sikkerhedsgennemgang/.test(r.ud)), r.ud + r.fejl);

  // En ren bygget mappe, med en offentlig (anon) nøgle, som gerne må ligge der.
  skriv(rod, ".gitignore", (laes(rod, ".gitignore") || "") + "dist/\n");
  skriv(rod, "dist/index.html", "<html><script src=app.js></script></html>\n");
  skriv(rod, "dist/app.js", `const offentlig = "${jwt("anon")}";\n`);
  fs.writeFileSync(path.join(rod, "dist", "billede.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3]));
  r = dt();
  tjek(`${sprog}: en ren bygget mappe går igennem, og en offentlig (anon) nøgle er ikke et fund`, r.kode === 0 && /dist/.test(r.ud) && (sprog === "en" ? /No keys found/ : /Ingen nøgler fundet/).test(r.ud), r.ud + r.fejl);

  // Nu bages hemmeligheder ind i det byggede (som git ikke ser).
  skriv(rod, "dist/assets/bundle.js", `x="${noegle}";y="${jwt("service_role")}";\n`);
  skriv(rod, "dist/.env", "A=1\n");
  skriv(rod, "dist/.git/HEAD", "ref: refs/heads/main\n");
  r = dt();
  const alt = r.ud + r.fejl;
  tjek(`${sprog}: finder nøgle, service_role-nøgle, .env og .git i det byggede, og stopper`, r.kode === 1 && /dist\/assets\/bundle\.js: .*(hemmelig nøgle|secret key)/.test(r.fejl) && /dist\/assets\/bundle\.js: .*service_role/.test(r.fejl) && /dist\/\.env: /.test(r.fejl) && /dist\/\.git: /.test(r.fejl), alt);
  tjek(`${sprog}: viser aldrig selve nøglen, kun filnavn og slags`, !alt.includes(noegle) && !alt.includes(jwt("service_role")) && !/eyJ/.test(alt) && (sprog === "en" ? /never the key itself/ : /aldrig selve nøglen/).test(alt), alt);
  tjek(`${sprog}: siger, at nøglen er brændt og skal skiftes først`, (sprog === "en" ? /burnt: change it at the provider first/ : /brændt: skift den hos udbyderen først/).test(r.fejl), r.fejl);
  tjek(`${sprog}: git og nøgletjekket før commit ser ikke den byggede mappe (derfor findes del-tjekket)`, !git(rod, "status", "--short").includes("dist"));
  fs.rmSync(path.join(rod, "dist"), { recursive: true });

  // Kildekoden: en indstilling med hemmeligt navn, der sendes til browseren, og en service_role-nøgle i en fil.
  skriv(rod, "src/config.js", "const k = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;\nconst ok = process.env.NEXT_PUBLIC_SUPABASE_URL;\n");
  r = dt();
  tjek(`${sprog}: finder en indstilling med hemmeligt navn, der sendes med ud til browseren, og ikke den harmløse`, r.kode === 1 && /src\/config\.js: .*NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/.test(r.fejl) && !/NEXT_PUBLIC_SUPABASE_URL\b/.test(r.fejl), r.ud + r.fejl);
  skriv(rod, "src/config.js", `const k = "${jwt("service_role")}";\n`);
  r = dt();
  tjek(`${sprog}: finder en service_role-nøgle i kildekoden`, r.kode === 1 && /src\/config\.js: .*service_role/.test(r.fejl), r.ud + r.fejl);
  fs.unlinkSync(path.join(rod, "src", "config.js"));
  skriv(rod, ".env", `HEMMELIG=${noegle}\n`);
  r = dt();
  tjek(`${sprog}: projektets egen .env (som git holder ude) er ikke et fund og bliver ikke læst op`, r.kode === 0 && !(r.ud + r.fejl).includes(noegle), r.ud + r.fejl);

  skriv(rod, "hjemmeside/index.html", `<script>k="${noegle}"</script>\n`);
  r = dt("hjemmeside");
  tjek(`${sprog}: en mappe kan gives med, når det byggede ligger et andet sted`, r.kode === 1 && /hjemmeside\/index\.html/.test(r.fejl), r.ud + r.fejl);
  r = dt("findes-ikke");
  tjek(`${sprog}: en mappe, der ikke findes, giver en forklaring`, r.kode === 2 && r.fejl.length > 10, r.fejl);

  const vagtSvar = (tool_input) => koer("node", [path.join(rod, "scripts", "startkit", "vagt.js")], { cwd: rod, input: JSON.stringify({ cwd: rod, tool_name: "Bash", tool_input }) }).ud;
  tjek(`${sprog}: AI'en må køre del-tjekket, men ikke rette i det`, vagtSvar({ command: "node scripts/startkit/del-tjek.js dist" }) === "" && /"deny"/.test(vagtSvar({ command: "echo x > scripts/startkit/del-tjek.js" })));
}
const kode = laes(KIT, "scripts", "projekt", "del-tjek.js") || "";
tjek("del-tjekket sender ingenting (ingen netværkskode) og skriver ingen filer", !/require\("(https?|net|dgram|tls)"\)|fetch\(/.test(kode) && !/writeFileSync|appendFileSync|unlinkSync|rmSync/.test(kode));
const { harServiceRole } = require(path.join(KIT, "scripts", "projekt", "del-tjek.js"));
tjek("service_role genkendes kun i en rigtig nøgle, ikke i almindelig tekst", harServiceRole(jwt("service_role")) && !harServiceRole(jwt("anon")) && !harServiceRole("role: service_role") && !harServiceRole("eyJhbGciOi.ikke-en-noegle.abc"));

slut("tilvalg");
