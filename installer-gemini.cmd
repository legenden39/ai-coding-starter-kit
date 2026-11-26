@echo off
rem Dobbeltklik paa denne fil for at installere startkittet til Antigravity (Gemini).
rem Den starter install.ps1, som ligger ved siden af. install.ps1 fortaeller, hvad der sker, og spoerger om ja, foer noget kopieres.
rem "-ExecutionPolicy Bypass" giver Windows lov til at koere netop den ene fil, denne ene gang. Ingen indstillinger aendres.
title Startkit til Antigravity (Gemini) - installation
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Vaerktoej gemini
echo.
echo Du kan lukke dette vindue nu.
pause >nul
