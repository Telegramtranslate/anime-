#!/usr/bin/env bash
# One-click start (Mac/Linux): bash start.sh
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js not found. Install it from https://nodejs.org (LTS), then run again."
  exit 1
fi

echo "[*] Checking dependencies (first run takes about a minute)..."
npm install --no-audit --no-fund || { echo "[!] npm install failed."; exit 1; }

echo
echo "[*] Starting server... Open http://localhost:3000 in your browser."
echo
npm run dev
