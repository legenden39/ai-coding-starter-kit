# Installerer startkittet som en skill til Codex.
# Det eneste, scriptet goer, er at kopiere mappen "startkit" til din brugermappe under .agents\skills.
# (Teksten er skrevet uden danske bogstaver med vilje, saa den vises rigtigt i alle terminaler.)
$ErrorActionPreference = "Stop"

$fra = Join-Path $PSScriptRoot "startkit"
$til = Join-Path $HOME ".agents\skills\startkit"

if (-not (Test-Path (Join-Path $fra "SKILL.md"))) {
  Write-Host "Kan ikke finde mappen 'startkit' ved siden af dette script. Hent hele projektet (alle filer og mapper), og proev igen."
  exit 1
}

foreach ($program in @("git", "node")) {
  if (-not (Get-Command $program -ErrorAction SilentlyContinue)) {
    $sted = if ($program -eq "git") { "git-scm.com" } else { "nodejs.org (vaelg LTS)" }
    Write-Host "Bemaerk: '$program' er ikke installeret. Hent det fra $sted. Startkittet hjaelper dig ogsaa med det."
  }
}

if (Test-Path $til) {
  $svar = Read-Host "Startkittet er allerede installeret. Skal det erstattes med denne udgave? (j/n)"
  if ($svar -ne "j") { Write-Host "Intet er aendret."; exit 0 }
  Remove-Item -Recurse -Force $til
}

New-Item -ItemType Directory -Force (Split-Path $til) | Out-Null
Copy-Item -Recurse $fra $til

Write-Host ""
Write-Host "Startkittet er installeret i: $til"
Write-Host "Aabn nu Codex i den projektmappe, du vil arbejde i, og skriv:  `$startkit"
Write-Host "Dukker den ikke op, saa genstart Codex, eller find den under Skills."
