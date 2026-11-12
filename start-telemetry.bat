@echo off
chcp 65001 >nul
title "ETS2 / ATS Native SCS SDK Telemetry Bridge -> OBS"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\udp-bridge.ps1"
echo.
pause
