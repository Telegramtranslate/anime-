@echo off
title ANIVERSE
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
  ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\nodejs;%APPDATA%\npm"
  )
)

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js not found.
  echo     Download and install it from https://nodejs.org (LTS button),
  echo     then RESTART the PC and run this file again.
  pause
  exit /b 1
)

echo [*] Checking dependencies (first run takes about a minute)...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo [!] npm install failed. Check your internet connection and run again.
  pause
  exit /b 1
)

echo.
echo [*] Starting server... Open http://localhost:3000 in your browser.
echo     Keep this window open while using the site.
echo.
call npm run dev
pause
