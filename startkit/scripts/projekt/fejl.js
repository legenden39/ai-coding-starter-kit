// Fejltælleren: Claude Code kører dette script, når en kommando er fejlet (hook: PostToolUseFailure).
// Den tæller, hvor mange gange den samme kommando er fejlet på samme måde i chatten (se loopstop.js).
// Selve stoppet giver vagten, før den næste handling. Dette script afviser intet og skriver intet til AI'en.
//
// Codex har ingen hændelse for fejl, så dér bliver scriptet aldrig kaldt. Kører aldrig noget selv og bruger ikke internettet.
const fs = require("fs");
try {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  require("./loopstop").noter(input);
} catch { /* en defekt tæller må aldrig forstyrre chatten */ }
