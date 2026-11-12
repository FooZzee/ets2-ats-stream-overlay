@echo off
chcp 65001 >nul
title ETS2 / ATS Stream Overlay Installer
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0scripts\installer.ps1"
