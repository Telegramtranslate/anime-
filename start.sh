#!/usr/bin/env bash
# Запуск сайта на Mac/Linux: двойным кликом или `bash start.sh`
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js не найден. Скачай и установи с https://nodejs.org (кнопка LTS), затем запусти снова."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[*] Ставлю зависимости, подожди минуту..."
  npm install --no-audit --no-fund
fi

echo
echo "[*] Запускаю сайт... Открой браузер: http://localhost:3000"
echo
npm run dev
