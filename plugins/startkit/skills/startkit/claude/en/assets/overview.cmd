@echo off
rem Double-click to open the overview of the project in your browser.
rem The file starts scripts\startkit\overblik.js, which only reads in the project and can only be seen on your own computer.
title Overview
cd /d "%~dp0"
node scripts\startkit\overblik.js --open
echo.
echo The overview has stopped. Did it not work? Node may be missing: type /startkit in Claude Code, and ask for help.
pause >nul
