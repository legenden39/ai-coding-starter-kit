// "Nyt projekt": det personlige hentes fra et tidligere projekt, og intet andet.
// Den vigtigste prøve: det, der hører til det gamle projekt (rigtig drift, sikkerhed, projekter), kommer ALDRIG med.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { KIT, tjek, slut, nytProjekt, skriv, falskNoegle } = require("./hjaelp");

const SCRIPT = path.join(KIT, "scripts", "nyt-projekt.js");
const { kopier, FELTER } = require(SCRIPT);
const { valider } = require(path.join(KIT, "scripts", "opsaet.js"));

function koer(gammel, ny, ekstra = [], sprog = "da") {
  const r = spawnSync(process.execPath, [SCRIPT, gammel, ny, ...ekstra], { encoding: "utf8", env: { ...process.env, STARTKIT_SPROG: sprog, STARTKIT_VAERKTOEJ: "claude" } });
  return { kode: r.status, ud: r.stdout || "", fejl: r.stderr || "", alt: (r.stdout || "") + (r.stderr || "") };
}
const laes = (rod, rel) => { try { return fs.readFileSync(path.join(rod, rel), "utf8"); } catch { return null; } };

// Et gammelt projekt med alt, hvad en fuld profil kan rumme, så vi kan se, hvad der IKKE kommer med.
const HEMMELIGE = ["Webshop-med-kort", "betaler-med-kort-ja", "kundelisten", "stripe-nøgletype", "npm run webshop-test", "mit-aabne-punkt", "Projektet Webshop"];
const gammelProfil = {
  vej: "kort",
  person: { navn: "Prøveperson", niveau: "lidt", bruger_ai_til: "kundelisten", maal: "Webshop-med-kort", andet: "mit-aabne-punkt" },
  regler: { aldrig_uden_ok: ["sletter filer", "lægger noget på nettet"], svarform: "Korte svar.", ved_tvivl: "spørg", bestemmer_selv: "udseende" },
  valgt_projekt: "Projektet Webshop", projektmappe: "C:/ikke/denne",
  projekter: [{ navn: "Projektet Webshop", beskrivelse: "Webshop-med-kort", start_kommando: "npm run webshop-test" }],
  virkelig: { skal_ud: "ja", betaling: "betaler-med-kort-ja", persondata: "kundelisten", login: "ja" },
  sikkerhed: { noegletyper: ["stripe-nøgletype"], git: true, kopi: false },
  vaerktoej: { plan: "pro", modeller: [] },
  tjek_kommandoer: ["npm run webshop-test"],
  aabne: ["mit-aabne-punkt"],
};
const gammel = nytProjekt();
skriv(gammel, ".startkit/profil.json", JSON.stringify(gammelProfil, null, 2));
const foer = laes(gammel, ".startkit/profil.json");

// ---- tørkørsel: viser, men skriver intet ----
let ny = nytProjekt();
let r = koer(gammel, ny, ["--toer"]);
tjek("tørkørsel: viser, hvad der hentes, og skriver intet", r.kode === 0 && /Prøveperson/.test(r.ud) && /intet er skrevet/.test(r.ud) && laes(ny, ".startkit/profil.json") === null, r.alt);

// ---- rigtig kørsel: kun den faste liste ----
r = koer(gammel, ny);
const nyTekst = laes(ny, ".startkit/profil.json");
const nyJson = JSON.parse(nyTekst || "{}");
tjek("henter navn, niveau og reglerne", r.kode === 0 && nyJson.person && nyJson.person.navn === "Prøveperson" && nyJson.person.niveau === "lidt" && JSON.stringify(nyJson.regler.aldrig_uden_ok) === JSON.stringify(["sletter filer", "lægger noget på nettet"]) && nyJson.regler.svarform === "Korte svar." && nyJson.regler.ved_tvivl === "spørg" && nyJson.regler.bestemmer_selv === "udseende", r.alt + nyTekst);
tjek("henter ALDRIG projekt, rigtig drift, sikkerhed, værktøj, tjek-kommandoer, åbne punkter eller vej", ["projekter", "valgt_projekt", "projektmappe", "virkelig", "sikkerhed", "vaerktoej", "tjek_kommandoer", "aabne", "vej"].every((k) => !(k in nyJson)), nyTekst);
tjek("henter heller ikke resten af person (mål, brug af AI, andet)", !("maal" in nyJson.person) && !("bruger_ai_til" in nyJson.person) && !("andet" in nyJson.person), nyTekst);
tjek("intet af det, der hører til det gamle projekt, står i den nye fil", HEMMELIGE.every((h) => !nyTekst.includes(h)), nyTekst);
tjek("det, der ikke hentes, nævnes ved navn, men uden indhold", /virkelig/.test(r.ud) && /sikkerhed/.test(r.ud) && HEMMELIGE.every((h) => !r.alt.includes(h)), r.alt);
tjek("den gamle mappe er uændret", laes(gammel, ".startkit/profil.json") === foer && fs.readdirSync(path.join(gammel, ".startkit")).length === 1);
tjek("den delvise profil er ikke færdig: opsætningen siger nej, til projektet er beskrevet", valider(nyJson).length > 0);
const nyMedProjekt = { ...nyJson, projekter: [{ navn: "Mit nye projekt", beskrivelse: "Et sted at prøve ting af." }], valgt_projekt: "Mit nye projekt" };
tjek("med projektet tilføjet er profilen gyldig", valider(nyMedProjekt).length === 0, JSON.stringify(valider(nyMedProjekt)));

// ---- overskriver aldrig ----
const fed = JSON.stringify({ person: { navn: "Anden" } });
skriv(ny, ".startkit/profil.json", fed);
r = koer(gammel, ny);
tjek("overskriver aldrig en profil i det nye projekt", r.kode === 2 && /bliver ikke overskrevet/.test(r.fejl) && laes(ny, ".startkit/profil.json") === fed, r.alt);

// ---- nøgler, e-mails og stier hentes ikke ----
const falsk = falskNoegle();
const mailAdresse = "test" + "@" + "example.com";
const sti = "C:" + "\\Users\\" + "nogen\\projekt";
const snavset = { person: { navn: "Prøveperson", niveau: falsk }, regler: { aldrig_uden_ok: ["sletter filer", mailAdresse], svarform: "Korte svar.", ved_tvivl: sti } };
const g2 = nytProjekt(), n2 = nytProjekt();
skriv(g2, ".startkit/profil.json", JSON.stringify(snavset));
r = koer(g2, n2);
const t2 = laes(n2, ".startkit/profil.json") || "";
tjek("nøgle, e-mailadresse og sti med brugernavn hentes ikke", r.kode === 0 && !t2.includes(falsk) && !t2.includes(mailAdresse) && !t2.includes("nogen") && /Prøveperson/.test(t2) && /Korte svar/.test(t2), r.alt + t2);
tjek("de nævnes ved felt, aldrig med indholdet", /person\.niveau/.test(r.ud) && /regler\.aldrig_uden_ok/.test(r.ud) && /regler\.ved_tvivl/.test(r.ud) && !r.alt.includes(falsk) && !r.alt.includes(mailAdresse) && !r.alt.includes("nogen"), r.alt);

// ---- for lange eller forkerte værdier afvises ----
const stor = kopier({ person: { navn: "x".repeat(301), niveau: 5 }, regler: { aldrig_uden_ok: Array(11).fill("a"), svarform: "ok" } });
tjek("for lang tekst, forkert type og for lang liste afvises", Object.keys(stor.felter).join() === "regler.svarform", JSON.stringify(stor.felter));
const styre = kopier({ person: { navn: "A\u0001B" } });
tjek("styretegn afvises", Object.keys(styre.felter).length === 0);

// ---- fejl, der skal stoppe ----
r = koer(gammel, gammel);
tjek("samme mappe to gange stoppes", r.kode === 2 && /den samme/.test(r.fejl), r.alt);
const tom = nytProjekt();
r = koer(tom, nytProjekt());
tjek("ingen profil i den gamle mappe stoppes med en venlig besked", r.kode === 2 && /ingen profil/.test(r.fejl), r.alt);
r = koer(gammel, path.join(tom, "findes-ikke"));
tjek("en ny mappe, der ikke findes, stoppes", r.kode === 2 && /findes ikke/.test(r.fejl), r.alt);
const g3 = nytProjekt(); skriv(g3, ".startkit/profil.json", "{ikke json");
r = koer(g3, nytProjekt());
tjek("en profil, der ikke kan læses, stoppes", r.kode === 2 && /JSON/.test(r.fejl), r.alt);
const g4 = nytProjekt(); skriv(g4, ".startkit/profil.json", JSON.stringify({ projekter: [{ navn: "x" }] }));
r = koer(g4, nytProjekt());
tjek("en profil uden noget at hente stoppes", r.kode === 2 && /intet at hente|ikke noget at hente/.test(r.fejl), r.alt);
const cwdFoer = fs.existsSync(path.join(process.cwd(), ".startkit", "profil.json"));
r = koer(gammel, "");
tjek("en tom mappe giver brugsvejledning og skriver ikke i arbejdsmappen", r.kode === 2 && /Brug:/.test(r.fejl) && fs.existsSync(path.join(process.cwd(), ".startkit", "profil.json")) === cwdFoer, r.alt);
r = spawnSync(process.execPath, [SCRIPT, gammel], { encoding: "utf8" });
tjek("kun én mappe giver brugsvejledning", r.status === 2 && /Brug:/.test(r.stderr), r.stderr);

// ---- engelsk: feltnavne, filnavn og beskeder ----
const enGammel = nytProjekt(), enNy = nytProjekt();
skriv(enGammel, ".startkit/profile.json", JSON.stringify({
  person: { name: "Test Person", level: "a little", goal: "Secret goal" },
  rules: { never_without_ok: ["delete files"], answer_style: "Short answers.", when_in_doubt: "ask", decides_myself: "looks" },
  real_world: { payment: "yes" }, security: { key_types: ["payments"] }, projects: [{ name: "Shop", description: "A shop." }],
}));
r = koer(enGammel, enNy, [], "en");
const enTekst = laes(enNy, ".startkit/profile.json");
const enJson = JSON.parse(enTekst || "{}");
tjek("engelsk: skriver profile.json med engelske feltnavne", r.kode === 0 && enJson.person.name === "Test Person" && enJson.person.level === "a little" && enJson.rules.decides_myself === "looks" && enJson.rules.answer_style === "Short answers." && laes(enNy, ".startkit/profil.json") === null, r.alt + enTekst);
tjek("engelsk: intet fra det gamle projekt kommer med", !/real_world|security|projects|Secret goal|payments|Shop/.test(enTekst), enTekst);
tjek("engelsk: beskederne er på engelsk", /Brought over from the old project/.test(r.ud) && /Not brought over/.test(r.ud) && /Next step/.test(r.ud), r.alt);
tjek("engelsk: opsætningen læser den delvise profil og siger, hvad der mangler", valider(enJson).length > 0 && valider({ ...enJson, projects: [{ name: "New", description: "Something new." }] }).length === 0, JSON.stringify(valider(enJson)));
// En dansk profil kan hentes af den engelske udgave, og omvendt.
r = koer(gammel, nytProjekt(), ["--dry-run"], "en");
tjek("engelsk: --dry-run virker, og en dansk profil kan hentes", r.kode === 0 && /nothing has been written yet/.test(r.ud) && /Prøveperson/.test(r.ud), r.alt);
r = koer(enGammel, nytProjekt(), ["--toer"], "da");
tjek("dansk: en engelsk profil kan hentes", r.kode === 0 && /Test Person/.test(r.ud), r.alt);

// ---- selve listen er låst ----
tjek("listen rummer kun person og regler, og kun de seks felter", FELTER.length === 6 && FELTER.every((f) => ["person", "regler"].includes(f.da[0]) && ["person", "rules"].includes(f.en[0])), JSON.stringify(FELTER.map((f) => f.da.join("."))));
tjek("listen rummer ikke noget fra rigtig drift, sikkerhed eller projekterne", !FELTER.some((f) => /virkelig|real_world|sikkerhed|security|projekt|project|tjek|check|aabne|open/.test(f.da.join(".") + f.en.join("."))));
tjek("scriptet sender intet og rører ikke den gamle mappe (ingen netværkskode, ingen skrivning til den)", !/require\("(https?|net|dgram|tls)"\)|fetch\(/.test(fs.readFileSync(SCRIPT, "utf8")) && (fs.readFileSync(SCRIPT, "utf8").match(/writeFileSync|mkdirSync/g) || []).length === 2);

// ---- teksten i SKILL og den korte vej (dansk, engelsk og Claude Code-udgaverne) ----
const kit = (rel) => { try { return fs.readFileSync(path.join(KIT, rel), "utf8"); } catch { return ""; } };
const SKILLS = { "SKILL.md": "nyt-projekt.js", "en/SKILL.en.md": "nyt-projekt.js", "claude/SKILL.claude.md": "nyt-projekt.js", "claude/en/SKILL.claude.en.md": "nyt-projekt.js" };
for (const [f, s] of Object.entries(SKILLS)) {
  const x = kit(f);
  tjek(`${f}: nyt projekt henter kun det personlige, og projektets ting spørges om igen`, x.includes(s) && /--toer|--dry-run/.test(x) && /(hentes aldrig|never brought over)/.test(x) && /(passer det stadig|is this still right)/.test(x), f);
}
tjek("kort vej (dansk og engelsk): spørgsmål 3 og 7-11 stilles altid på ny", /3 og 7-11 stilles altid på ny/.test(kit("references/kort-vej.md")) && /3 and 7-11 are always asked again/.test(kit("en/references/short-path.md")));

slut("nytprojekt");
