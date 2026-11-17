// Det, personen selv læser, må ikke bruge tekniske ord uden forklaring. Testen går de brugerrettede tekster igennem
// (programmernes beskeder, introduktionen og statusskabelonen) og fejler, hvis et fagord står uden for en parentes
// eller en kommando i kodeformat. Ordlisten ligger i startkit/references/sprog.md. Testen kan ikke afgøre,
// om AI'en selv bruger de almindelige ord i en rigtig chat.
const fs = require("fs");
const path = require("path");
const { KIT, tjek, slut } = require("./hjaelp");
const { TEKSTER, TEKSTER_CLAUDE } = require(path.join(KIT, "scripts", "projekt", "tekster.js"));

const laes = (...d) => { try { return fs.readFileSync(path.join(KIT, ...d), "utf8"); } catch { return ""; } };

// Fagord. Ord, der står som en del af et filnavn eller en sti (ved siden af / eller .), tæller ikke.
const FORBUDT = {
  da: /(?<![\/.\w-])(hooks?|commits?|git|JSON|scripts?|config|worktree|pre-commit|hooksPath|sti|stien)(?![\/.\w])/i,
  en: /(?<![\/.\w-])(hooks?|commits?|git|JSON|scripts?|config|worktree|pre-commit|hooksPath)(?![\/.\w])/i,
};
// Det, der må stå: forklaringen i en parentes, en kommando i kodeformat, <code>, og pladsholdere.
const rens = (s) => s.replace(/`[^`]*`/g, "").replace(/<code>.*?<\/code>/g, "").replace(/\([^)]*\)/g, "").replace(/\{\w+\}/g, "");
const BRUGERRETTET = /^(ops\.(n\.|naeste|lang|ingen\.tjek|vil|saetter|h\.)|tj\.|ov\.|fo\.|start\.)/;

for (const sprog of ["da", "en"]) {
  const fund = [];
  const kilder = [["tekster", TEKSTER[sprog]], ["tekster for Claude Code", TEKSTER_CLAUDE[sprog]]];
  for (const [navn, tekster] of kilder) {
    for (const [noegle, tekst] of Object.entries(tekster)) {
      if (!BRUGERRETTET.test(noegle)) continue;
      const m = rens(tekst).match(FORBUDT[sprog]);
      if (m) fund.push(`${navn} ${noegle}: "${m[0]}"`);
    }
  }
  tjek(`${sprog}: programmernes beskeder til personen bruger ingen fagord uden forklaring`, fund.length === 0, fund.join("\n     "));

  const filer = sprog === "da"
    ? ["references/intro.md", "assets/forloeb.skabelon.md", "references/kort-vej.md"]
    : ["en/references/intro.md", "en/assets/progress.template.md", "en/references/short-path.md"];
  for (const f of filer) {
    const m = rens(laes(f)).match(new RegExp(FORBUDT[sprog].source, "gi"));
    tjek(`${sprog}: ${f} bruger ingen fagord uden forklaring`, !m, m ? m.join(", ") : "");
  }

  const ordliste = laes(sprog === "da" ? "references/sprog.md" : "en/references/language.md");
  tjek(`${sprog}: ordlisten findes og har de vigtigste ord`, ["git", "commit", "hook", "JSON", "token", "terminal"].every((o) => new RegExp("^\\| " + o + " ", "mi").test(ordliste)), ordliste.slice(0, 60));
  const skill = laes(sprog === "da" ? "SKILL.md" : "en/SKILL.en.md");
  tjek(`${sprog}: SKILL-filen peger på ordlisten og siger, at kittets beskeder skal oversættes`, sprog === "da"
    ? /references\/sprog\.md/.test(skill) && /oversæt kittets egne beskeder/.test(skill)
    : /en\/references\/language\.md/.test(skill) && /translate the kit's own messages/.test(skill));
}

// Skellet: programmernes tekster er dansk og engelsk side om side, og ingen af dem er blevet tomme.
tjek("de brugerrettede tekster findes på begge sprog", Object.keys(TEKSTER.da).filter((k) => BRUGERRETTET.test(k)).every((k) => TEKSTER.en[k] && TEKSTER.en[k].trim()));
slut("sprog");
