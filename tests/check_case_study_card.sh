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

# Without the log file the check must stop with its one plain line, not a stack trace.
tmp=$(mktemp -d)
mkdir "$tmp/tests"
cp tests/check_case_study_card.mjs "$tmp/tests/"
ln -s "$PWD/node_modules" "$tmp/node_modules"
status=0
out=$(cd "$tmp" && node --no-warnings tests/check_case_study_card.mjs 2>&1) || status=$?
rm -rf "$tmp"
if [ "$status" -ne 1 ] || [ "$out" != "case study card check: src/data/case-study-log.ts is missing, so there is no log to check." ]; then
  echo "  FAIL a missing log file: exit $status, output:" >&2
  printf '%s\n' "$out" >&2
  exit 1
fi
echo "  ok   a missing log file stops the check with one plain line"

exec node --no-warnings tests/check_case_study_card.mjs
