// Brugeren skal altid kunne se, hvor de er: én fælles plan med seks trin, ens i alle de filer, brugeren møder,
// og de faste regler for hvor-er-vi-linjer og valg. Testen kan kun låse teksten; om AI'en følger reglerne
// i en rigtig chat, kan den ikke afgøre.
const fs = require("fs");
const path = require("path");
const { KIT, tjek, slut } = require("./hjaelp");

const laes = (...d) => { try { return fs.readFileSync(path.join(KIT, ...d), "utf8"); } catch { return ""; } };
const TRIN = {
  da: ["Kom i gang", "Gør computeren klar", "Lær dig at kende", "Find det rigtige til dig", "Sæt sikkerhedsnettet op og prøv det", "Se overblikket og afslut"],
  en: ["Get started", "Get the computer ready", "Get to know you", "Find what is right for you", "Set up the safety net and try it", "See the overview and finish"],
};
const FILER = {
  da: { skill: "SKILL.md", intro: "references/intro.md", kort: "references/kort-vej.md", interview: "references/interview.md", status: "assets/forloeb.skabelon.md" },
  en: { skill: "en/SKILL.en.md", intro: "en/references/intro.md", kort: "en/references/short-path.md", interview: "en/references/interview.md", status: "en/assets/progress.template.md" },
};
const iRaekkefoelge = (tekst, dele) => { let pos = -1; for (const d of dele) { const p = tekst.indexOf(d, pos + 1); if (p < 0) return false; pos = p; } return true; };

for (const sprog of ["da", "en"]) {
  const f = Object.fromEntries(Object.entries(FILER[sprog]).map(([k, v]) => [k, laes(v)]));
  const trin = TRIN[sprog];
  const ord = sprog === "da" ? "Trin" : "Step";
  tjek(`${sprog}: planen har seks trin i SKILL-filen, i rækkefølge, med nummer`, iRaekkefoelge(f.skill, trin.map((t, i) => `${i + 1}. ${t} (`)));
  tjek(`${sprog}: introduktionen har de samme seks trin, i rækkefølge`, iRaekkefoelge(f.intro, trin.map((t, i) => `${i + 1}. **${t}:`)));
  tjek(`${sprog}: statusskabelonen har de samme seks trin som overskrifter`, iRaekkefoelge(f.status, trin.map((t, i) => `## ${ord} ${i + 1} ${sprog === "da" ? "af" : "of"} 6: ${t}`)));
  tjek(`${sprog}: statusskabelonen har "lige nu" og "næste"`, sprog === "da" ? /^Lige nu:/m.test(f.status) && /^Næste:/m.test(f.status) : /^Right now:/m.test(f.status) && /^Next:/m.test(f.status));
  tjek(`${sprog}: statusskabelonen viser ikke fasenumre som 2b eller 9c`, !/\b(2b|9b|9c)\b/.test(f.status));
  tjek(`${sprog}: interviewet siger trin og emne ved hver runde`, sprog === "da" ? /Trin 3 af 6, emne X af 8/.test(f.interview) : /Step 3 of 6, topic X of 8/.test(f.interview));
  tjek(`${sprog}: den korte vej siger, at trinene er de samme, og at trin 4 venter`, sprog === "da" ? /de samme seks trin/.test(f.kort) && /trin 4 venter/.test(f.kort) : /same six steps/.test(f.kort) && /step 4 waits/.test(f.kort));
  // reglerne i SKILL-filen
  const hv = sprog === "da" ? ["**Hvor vi er**", "**Nu**", "**Hvorfor**"] : ["**Where we are**", "**Now**", "**Why**"];
  tjek(`${sprog}: SKILL-filen har hvor-er-vi-linjerne (hvor, nu, hvorfor)`, iRaekkefoelge(f.skill, hv));
  tjek(`${sprog}: SKILL-filen har valgreglen: hvad valget handler om, hvad hver mulighed gør, begrundet anbefaling`,
    sprog === "da" ? /hvad valget handler om/.test(f.skill) && /hvad der sker, hvis personen vælger den/.test(f.skill) && /begrundelse på én linje/.test(f.skill)
      : /what the choice is about/.test(f.skill) && /what happens if the person picks it/.test(f.skill) && /reason on one line/.test(f.skill));
  tjek(`${sprog}: SKILL-filen siger, at sikkerhedsvalg ikke må have en anbefalet mulighed`,
    sprog === "da" ? /markér ikke nogen mulighed som den anbefalede/.test(f.skill) : /do not mark any option as the recommended one/.test(f.skill));
  tjek(`${sprog}: SKILL-filen siger, hvad værktøjets egne dialoger betyder, før de kommer`,
    sprog === "da" ? /sig før, hvad den spørger om, og hvad et ja betyder/.test(f.skill) : /say beforehand what it asks, and what a yes means/.test(f.skill));
  tjek(`${sprog}: SKILL-filen siger, at fasenumre ikke siges højt`, sprog === "da" ? /sig dem ikke højt/.test(f.skill) : /do not say them out loud/.test(f.skill));
  tjek(`${sprog}: genoptagelse viser trinene og hvor-er-vi-linjerne`, sprog === "da" ? /under de seks trin/.test(f.skill) && /skriv hvor-er-vi-linjerne/.test(f.skill) : /under the six steps/.test(f.skill) && /write the where-are-we lines/.test(f.skill));
}
slut("overblik");
