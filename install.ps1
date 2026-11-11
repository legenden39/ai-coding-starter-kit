# Installerer startkittet som en skill til Codex.
# Det eneste, scriptet goer, er at kopiere mappen "startkit" til din brugermappe under .agents\skills.
# Det henter ikke noget fra nettet og aendrer ingen indstillinger.
# (Teksten er skrevet uden danske bogstaver med vilje, saa den vises rigtigt i alle terminaler.)
#
# -Til <mappe> bruges kun af testene, saa de ikke roerer din rigtige brugermappe.
param([string]$Til)
$ErrorActionPreference = "Stop"

$fra = Join-Path $PSScriptRoot "startkit"
$til = if ($Til) { $Til } else { Join-Path $HOME ".agents\skills\startkit" }
$version = "ukendt"
if (Test-Path (Join-Path $fra "VERSION")) { $version = (Get-Content (Join-Path $fra "VERSION") -TotalCount 1).Trim() }

Write-Host ""
Write-Host "Startkit (version $version) - installation"
Write-Host "==========================================="

if (-not (Test-Path (Join-Path $fra "SKILL.md"))) {
  Write-Host "Kan ikke finde mappen 'startkit' ved siden af denne fil."
  Write-Host "Har du pakket zip-filen ud? Hoejreklik paa zip-filen, vaelg 'Udpak alle', og koer installationen fra den udpakkede mappe."
  exit 1
}

Write-Host ""
Write-Host "Det her sker, hvis du siger ja:"
Write-Host "  1. Mappen 'startkit' kopieres hertil: $til"
Write-Host "     Det er der, Codex leder efter den slags."
Write-Host "  2. Intet andet. Der hentes ikke noget fra nettet, og ingen indstillinger aendres."
if (Test-Path $til) {
  Write-Host ""
  Write-Host "Bemaerk: startkittet er allerede installeret. Siger du ja, bliver den gamle udgave erstattet af denne."
  Write-Host "Dine projekter bliver ikke roert."
}
Write-Host ""
$svar = Read-Host "Vil du fortsaette? Skriv j for ja eller n for nej, og tryk Enter"
if ($svar -ne "j" -and $svar -ne "ja") { Write-Host "Intet er aendret."; exit 0 }

if (Test-Path $til) { Remove-Item -Recurse -Force $til }
New-Item -ItemType Directory -Force (Split-Path $til) | Out-Null
Copy-Item -Recurse $fra $til

Write-Host ""
Write-Host "Faerdig. Startkittet ligger nu i: $til"

foreach ($program in @("git", "node")) {
  if (-not (Get-Command $program -ErrorAction SilentlyContinue)) {
    $sted = if ($program -eq "git") { "git-scm.com" } else { "nodejs.org (vaelg LTS)" }
    Write-Host "Bemaerk: '$program' er ikke installeret endnu. Det goer ikke noget: startkittet hjaelper dig med det. (Det hentes fra $sted.)"
  }
}

Write-Host ""
Write-Host "Naeste skridt:"
Write-Host "  1. Aabn Codex. Var Codex allerede aaben, saa luk den, og aabn den igen."
Write-Host "  2. Aabn den mappe, du vil bygge i, som projekt. En tom mappe er helt fin."
Write-Host "  3. Skriv dette i chatten, og tryk Enter:   `$startkit"
Write-Host ""
Write-Host "Dukker den ikke op, saa skriv /skills i Codex, og vaelg 'Startkit' paa listen."
