@echo off
rem Double-click this file to install the starter kit in English.
rem It starts install.ps1, which is next to it. install.ps1 says what will happen, and asks for a yes, before anything is copied.
rem "-ExecutionPolicy Bypass" lets Windows run that one file, this one time. No settings are changed.
title Starter kit - installation
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Sprog en
echo.
echo You can close this window now.
pause >nul
