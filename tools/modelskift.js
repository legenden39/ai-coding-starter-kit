// FORSØG (ikke en del af kittet): kører lige efter et modelskift i Claude Code (hook: PostModelSwitch).
// Det, scriptet skriver, får AI'en at se ved næste besked. Så bliver den mindet om at vurdere modellen
// præcis dér, hvor den blev skiftet, og ikke i resten af chatten.
//
// Scriptet kender ikke opgaven og dømmer ikke, om modellen er god nok. Det beder kun AI'en sige det højt.
// Det skriver også én linje i .claude/modelskift-log.txt, så vi kan se, om hook'en overhovedet kørte.
// Kun læsning af input og én logfil. Fejler det, skriver det ingenting, og chatten fortsætter som normalt.
const fs = require("fs");
const path = require("path");

function besked(input) {
  const fra = String(input.from_model || "").trim(), til = String(input.to_model || "").trim();
  // Når en chat tages op igen, bliver modellen sat tilbage til den samme. Det er ikke et skift.
  if (!til || fra === til) return "";
  return `Modellen er lige skiftet${fra ? ` fra ${fra}` : ""} til ${til}. Sig i én linje til ejeren, om ${til} passer til den opgave, I er i gang med (stærk model til fejlsøgning, gennemgang, design og sikkerhedsregler; billig til tekst og rutine), før du fortsætter. Passer den ikke, så sig fra.`;
}

if (require.main === module) {
  try {
    let input = {};
    try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { /* køres også i hånden uden input */ }
    const tekst = besked(input);
    try {
      const mappe = path.join(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd(), ".claude");
      fs.mkdirSync(mappe, { recursive: true });
      fs.appendFileSync(path.join(mappe, "modelskift-log.txt"), `${new Date().toISOString()} kilde=${input.source || "?"} fra=${input.from_model || "?"} til=${input.to_model || "?"} besked=${tekst ? "ja" : "nej"}\n`);
    } catch { /* en logfil, der ikke kan skrives, må ikke stoppe noget */ }
    if (tekst) process.stdout.write(tekst + "\n");
  } catch { /* en defekt hook må aldrig forstyrre chatten */ }
}
module.exports = { besked };
