# Installerer startkittet som en skill til Codex.
# Det eneste, scriptet goer, er at kopiere mappen "startkit" til din brugermappe under .agents\skills.
# Det henter ikke noget fra nettet og aendrer ingen indstillinger.
# (Teksten er skrevet uden danske bogstaver med vilje, saa den vises rigtigt i alle terminaler.)
#
# -Til <mappe> bruges kun af testene, saa de ikke roerer din rigtige brugermappe.
# -Sprog en    installerer den engelske udgave (det er det, install-english.cmd goer). Uden den er det dansk.
param([string]$Til, [string]$Sprog = "da")
$ErrorActionPreference = "Stop"

$en = ($Sprog -eq "en")
# Sig <dansk> <engelsk>: skriver teksten paa det valgte sprog.
function Sig([string]$da, [string]$eng) { if ($en) { Write-Host $eng } else { Write-Host $da } }

$fra = Join-Path $PSScriptRoot "startkit"
$til = if ($Til) { $Til } else { Join-Path $HOME ".agents\skills\startkit" }
$version = if ($en) { "unknown" } else { "ukendt" }
if (Test-Path (Join-Path $fra "VERSION")) { $version = (Get-Content (Join-Path $fra "VERSION") -TotalCount 1).Trim() }

Write-Host ""
Sig "Startkit (version $version) - installation" "Starter kit (version $version) - installation"
Write-Host "==========================================="

if (-not (Test-Path (Join-Path $fra "SKILL.md"))) {
  Sig "Kan ikke finde mappen 'startkit' ved siden af denne fil." "Cannot find the folder 'startkit' next to this file."
  Sig "Har du pakket zip-filen ud? Hoejreklik paa zip-filen, vaelg 'Udpak alle', og koer installationen fra den udpakkede mappe." "Have you unpacked the zip file? Right-click the zip file, choose 'Extract All', and run the installation from the unpacked folder."
  exit 1
}

Write-Host ""
Sig "Det her sker, hvis du siger ja:" "This happens if you say yes:"
Sig "  1. Mappen 'startkit' kopieres hertil: $til" "  1. The folder 'startkit' is copied to: $til"
Sig "     Det er der, Codex leder efter den slags." "     That is where Codex looks for this kind of thing."
Sig "  2. Intet andet. Der hentes ikke noget fra nettet, og ingen indstillinger aendres." "  2. Nothing else. Nothing is downloaded from the internet, and no settings are changed."
if (Test-Path $til) {
  Write-Host ""
  Sig "Bemaerk: startkittet er allerede installeret. Siger du ja, bliver den gamle udgave erstattet af denne." "Note: the starter kit is already installed. If you say yes, the old edition is replaced by this one."
  Sig "Dine projekter bliver ikke roert." "Your projects are not touched."
}
Write-Host ""
$spoerg = if ($en) { "Do you want to continue? Type y for yes or n for no, and press Enter" } else { "Vil du fortsaette? Skriv j for ja eller n for nej, og tryk Enter" }
$svar = Read-Host $spoerg
$ja = if ($en) { @("y", "yes") } else { @("j", "ja") }
if ($ja -notcontains $svar) { Sig "Intet er aendret." "Nothing has been changed."; exit 0 }

if (Test-Path $til) { Remove-Item -Recurse -Force $til }
New-Item -ItemType Directory -Force (Split-Path $til) | Out-Null
Copy-Item -Recurse $fra $til

if ($en) {
  # Den engelske udgave: de engelske instruktioner laegges oeverst, og kittets programmer faar at vide, at sproget er engelsk.
  # (Filen hedder SKILL.en.md i pakken, saa Codex ikke tager den for en ekstra skill.)
  Copy-Item -Force (Join-Path $til "en\SKILL.en.md") (Join-Path $til "SKILL.md")
  Copy-Item -Force (Join-Path $til "en\openai.en.yaml") (Join-Path $til "agents\openai.yaml")
  Set-Content -Path (Join-Path $til "scripts\projekt\sprog.json") -Value '{"sprog": "en"}' -Encoding ASCII
}

Write-Host ""
Sig "Faerdig. Startkittet ligger nu i: $til" "Done. The starter kit is now in: $til"

foreach ($program in @("git", "node")) {
  if (-not (Get-Command $program -ErrorAction SilentlyContinue)) {
    $sted = if ($program -eq "git") { "git-scm.com" } elseif ($en) { "nodejs.org (choose LTS)" } else { "nodejs.org (vaelg LTS)" }
    Sig "Bemaerk: '$program' er ikke installeret endnu. Det goer ikke noget: startkittet hjaelper dig med det. (Det hentes fra $sted.)" "Note: '$program' is not installed yet. That is fine: the starter kit helps you with it. (You get it from $sted.)"
  }
}

Write-Host ""
Sig "Naeste skridt:" "Next steps:"
Sig "  1. Aabn Codex. Var Codex allerede aaben, saa luk den, og aabn den igen." "  1. Open Codex. If Codex was already open, close it, and open it again."
Sig "  2. Aabn den mappe, du vil bygge i, som projekt. En tom mappe er helt fin." "  2. Open the folder you want to build in as a project. An empty folder is perfectly fine."
Sig "  3. Skriv dette i chatten, og tryk Enter:   `$startkit" "  3. Type this in the chat, and press Enter:   `$startkit"
Write-Host ""
Sig "Dukker den ikke op, saa skriv /skills i Codex, og vaelg 'Startkit' paa listen." "If it does not show up, type /skills in Codex, and choose 'Startkit' in the list."
