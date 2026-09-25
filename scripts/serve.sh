#!/usr/bin/env bash
# Самовосстанавливающийся запуск сайта: если песочница «спала» и стёрла
# node_modules/.next — всё ставится и собирается заново, затем поднимается
# продакшен-сервер на 0.0.0.0:3000.
set -e
cd "$(dirname "$0")/.."

if [ ! -x node_modules/.bin/next ]; then
  echo "[serve] installing dependencies..."
  npm install --no-audit --no-fund
fi

if [ ! -f .next/BUILD_ID ]; then
  echo "[serve] building..."
  npm run build
fi

echo "[serve] starting on :3000"
exec npm run start -- -H 0.0.0.0 -p 3000
