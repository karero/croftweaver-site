#!/usr/bin/env bash
# Guard for the tests card on /case-study: newestTestCount on hand-built logs, and the built page against the
# log (tests/check_case_study_card.mjs). Reads dist/case-study.html, so CI runs it after `npm run build`.
# It loads src/data/case-study-log.ts with Node's type stripping (CI runs Node 24).
set -euo pipefail
CDPATH= cd -- "$(dirname -- "$0")/.."
if ! command -v node >/dev/null 2>&1; then
  echo "case study card check: node is not installed or not on PATH." >&2
  exit 1
fi
echo "tests/check_case_study_card.mjs"
exec node --no-warnings tests/check_case_study_card.mjs
