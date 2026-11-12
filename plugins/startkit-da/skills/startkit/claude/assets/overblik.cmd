@echo off
rem Dobbeltklik for at aabne overblikket over projektet i din browser.
rem Filen starter scripts\startkit\overblik.js, som kun laeser i projektet og kun kan ses paa din egen computer.
title Overblik
cd /d "%~dp0"
node scripts\startkit\overblik.js --aabn
echo.
echo Overblikket er stoppet. Virkede det ikke? Saa mangler Node maaske: skriv /startkit i Claude Code, og bed om hjaelp.
pause >nul
