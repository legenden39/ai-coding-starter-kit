// Den fulde test én gang om ugen: beviset kører de hurtige tjek hver gang og den fulde test kun,
// når den seneste grønne fulde kørsel er over "fuld_dage" dage gammel, eller med --fuld. På dansk og engelsk.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { tjek, slut, nytProjekt, git, skriv, kopierScripts } = require("./hjaelp");

function projekt(sprog, config) {
  const rod = nytProjekt();
  kopierScripts(rod);
  skriv(rod, "hurtig.js", 'require("fs").appendFileSync("log.txt", "h");\n');
  skriv(rod, "fuld.js", 'require("fs").appendFileSync("log.txt", "F"); if (require("fs").existsSync("fejl")) process.exit(1);\n');
  skriv(rod, ".startkit/config.json", JSON.stringify(config));
  git(rod, "add", ".");
  git(rod, "commit", "-q", "-m", "start");
  const bevis = (...args) => {
    try { fs.unlinkSync(path.join(rod, "log.txt")); } catch { /* ingen log endnu */ }
    const r = spawnSync("node", [path.join(rod, "scripts", "startkit", "bevis.js"), ...args], { cwd: rod, encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog } });
    let log = ""; try { log = fs.readFileSync(path.join(rod, "log.txt"), "utf8"); } catch { /* intet kørt */ }
    let b = {}; try { b = JSON.parse(fs.readFileSync(path.join(rod, ".startkit", "bevis.json"), "utf8")); } catch { /* intet bevis */ }
    return { kode: r.status, ud: r.stdout || "", log, b };
  };
  const markoer = (dageSiden) => skriv(rod, ".startkit/fuld-tjek.json", JSON.stringify({ ok: true, at: new Date(Date.now() - dageSiden * 86400000).toISOString() }));
  return { rod, bevis, markoer };
}

for (const [sprog, cfg, nu, ikke, bedt] of [
  ["da", { tjek: ["node hurtig.js"], fuld_tjek: ["node fuld.js"], fuld_dage: 7 }, /Den fulde test køres nu/, /Den fulde test er ikke kørt: den var grøn for 2 dage siden/, "--fuld"],
  ["en", { checks: ["node hurtig.js"], full_checks: ["node fuld.js"], full_every_days: 7 }, /The full test is being run now/, /The full test was not run: it was green 2 days ago/, "--full"],
]) {
  const p = projekt(sprog, cfg);
  let r = p.bevis();
  tjek(`${sprog}: første gang (aldrig kørt) køres både hurtig og fuld test`, r.kode === 0 && r.log === "hF" && nu.test(r.ud) && r.b.fuldKoert === true, r.ud);
  tjek(`${sprog}: en grøn fuld kørsel gemmer tidspunktet`, fs.existsSync(path.join(p.rod, ".startkit", "fuld-tjek.json")));
  p.markoer(2);
  r = p.bevis();
  tjek(`${sprog}: er den fulde test grøn for 2 dage siden, køres kun den hurtige`, r.kode === 0 && r.log === "h" && ikke.test(r.ud) && r.b.ok === true && r.b.fuldKoert === false, r.ud + r.log);
  r = p.bevis(bedt);
  tjek(`${sprog}: ${bedt} tvinger den fulde test`, r.log === "hF", r.log);
  p.markoer(8);
  r = p.bevis();
  tjek(`${sprog}: er den over 7 dage gammel, køres den igen`, r.log === "hF" && nu.test(r.ud), r.log);
  p.markoer(8);
  skriv(p.rod, "fejl", "");
  r = p.bevis();
  const m = JSON.parse(fs.readFileSync(path.join(p.rod, ".startkit", "fuld-tjek.json"), "utf8"));
  tjek(`${sprog}: en rød fuld test giver rødt bevis og flytter ikke tidspunktet`, r.kode === 1 && r.b.ok === false && Date.now() - Date.parse(m.at) > 7 * 86400000, r.ud);
}

// Uden en fuld test er alt som før: kun de almindelige tjek.
const u = projekt("da", { tjek: ["node hurtig.js"] });
const r = u.bevis();
tjek("uden fuld_tjek køres kun tjek, og intet tidspunkt gemmes", r.kode === 0 && r.log === "h" && !/fulde test/.test(r.ud) && !fs.existsSync(path.join(u.rod, ".startkit", "fuld-tjek.json")), r.ud);
const ingen = projekt("da", {});
tjek("uden nogen tjek står beviset stadig som 'ingen tjek'", ingen.bevis().b.ingenTjek === true);

slut("fuldtest");
