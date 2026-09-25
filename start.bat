@echo off
chcp 65001 >nul
title ANIVERSE - запуск
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js не найден. Скачай и установи с https://nodejs.org (кнопка LTS), затем запусти этот файл снова.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [*] Ставлю зависимости, подожди минуту...
  call npm install --no-audit --no-fund
)

echo.
echo [*] Запускаю сайт... Открой браузер: http://localhost:3000
echo.
call npm run dev
pause
