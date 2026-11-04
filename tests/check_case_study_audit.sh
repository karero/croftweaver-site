#!/usr/bin/env bash
# Regression guard for scripts/case-study-audit.py, the weekly upkeep check of the case study page.
#
# Drives the real script in throwaway git repositories with synthetic history, Google files and log
# modules, and a fake `gh` first on PATH. The fake answers from tests/fixtures/gh-2.103.3-pr-list-merged.json,
# a real `gh pr list` answer, and filters it by the merge day of `--search merged:>=DAY` the way GitHub does.
# Scenario names (A1 to A5; A6, the reminder, is not scripted) are those of docs/reviews/PLAN-2026-11-03-case-study-upkeep.md; the expected
# output is written by hand. Always --no-fetch and a local --ref, except the one fetch scenario.
set -euo pipefail
cd "$(dirname "$0")/.."
root=$PWD
unset $(git rev-parse --local-env-vars)

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
failures=0
pass() { echo "  ok   $1"; }
fail() { echo "  FAIL $1"; failures=$((failures + 1)); }

PY=$(command -v python3)
AUDIT=$root/scripts/case-study-audit.py
EXPORTER=$root/scripts/export-own-site.py
FIXTURE=$root/tests/fixtures/gh-2.103.3-pr-list-merged.json

# A fake gh: it checks the arguments it is given, records them, and answers from the capture.
mkdir "$tmp/bin"
cat > "$tmp/bin/gh" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$*" > "$FAKE_GH_LOG"
if [ "${FAKE_GH:-ok}" = fail ]; then echo "gh: To get started with GitHub CLI, please run:  gh auth login" >&2; exit 4; fi
if [ -n "${FAKE_GH_MOVE:-}" ]; then git update-ref refs/heads/main main~1; fi   # another session moves the ref mid-run
exec python3 - "$@" <<'PY'
import json, os, sys
a = sys.argv[1:]
want = ['pr', 'list', '-R', 'karero/croftweaver-site', '--state', 'merged']
if a[:6] != want or a[6] != '--search' or not a[7].startswith('merged:>=') or a[8] != '--limit' or a[10:] != ['--json', 'number,mergedAt,title']:
    sys.exit('fake gh: unexpected arguments: ' + ' '.join(a))
since = a[7][len('merged:>='):]
prs = [p for p in json.load(open(os.environ['FAKE_GH_FIXTURE'])) if p['mergedAt'][:10] >= since]
pad = int(os.environ.get('FAKE_GH_PAD', '0'))
prs += [{'mergedAt': '2026-12-31T00:00:00Z', 'number': 9000 + i, 'title': 'padding'} for i in range(pad - len(prs))]
print(json.dumps(prs[: int(a[9])], separators=(',', ':')))
PY
FAKE
chmod +x "$tmp/bin/gh"
export FAKE_GH_LOG=$tmp/gh-args FAKE_GH_FIXTURE=$FIXTURE
# A PATH with git, node and python but no gh.
mkdir "$tmp/nogh"
for tool in git node python3; do ln -s "$(command -v $tool)" "$tmp/nogh/$tool"; done

# ── Synthetic history and Google data, as tests/check_export_own_site.sh builds them ──────────────
header='date,run_id,site,engine,mode,slot,rev,query,model_requested,models_reported,config_rev,ok,named,cited_own,cited_domains,searched,status,route'
# row DATE RUN SLOT STATUS: one openai row for croftweaver.com
row() { printf '%s,%s,croftweaver.com,openai,finds,%s,1,q,m,m,c,3,0,0,,,%s,direct\n' "$1" "$2" "$3" "$4"; }
# runs NAME DATE...: a history with one weekly run (a broad and a narrow row) on each day
runs() { local name=$1; shift; { echo "$header"; for d in "$@"; do row "$d" "r$d" broad ok; row "$d" "r$d" narrow ok; done; } > "$tmp/$name.csv"; }
printf '{"property": "sc-domain:croftweaver.com", "country": "", "finished": "2026-11-01", "daily": [{"date":"2026-10-31","clicks":0,"impressions":2},{"date":"2026-11-01","clicks":1,"impressions":3}]}\n' > "$tmp/google.json"
runs h-nov2 2026-11-02
runs h-nov9 2026-11-02 2026-11-09
printf '{"property": "sc-domain:croftweaver.com", "country": "", "finished": "2026-11-02", "daily": [{"date":"2026-10-31","clicks":0,"impressions":2},{"date":"2026-11-01","clicks":1,"impressions":3},{"date":"2026-11-02","clicks":0,"impressions":4}]}\n' > "$tmp/google-nov2.json"

# ── Throwaway repositories ────────────────────────────────────────────────────────────────────────
newrepo() { git init -q -b main "$1"; git -C "$1" config user.email t@example.com; git -C "$1" config user.name t
  git -C "$1" config commit.gpgsign false; git -C "$1" config core.hooksPath /dev/null; }
commit() { git -C "$1" add -A; git -C "$1" commit -q -m "$2"; }
# logfile NUMBER...: a log module that holds a change for each croftweaver-site pull request number given.
# With DECOYS set it also holds pull request addresses that must not count as logged: a commented-out
# entry (164), an observation's text (162), another repository's pull request 165, a trailing comment (157).
logfile() {
  echo "export type Entry = { kind: 'change' | 'observation'; date: string; title: string; pr?: string; seen?: string };"
  echo "export const LOG: readonly Entry[] = ["
  for n in "$@"; do echo "  { kind: 'change', date: '2026-10-29', title: 'change $n', pr: 'https://github.com/karero/croftweaver-site/pull/$n' },"; done
  if [ -n "${DECOYS:-}" ]; then
    echo "  // { kind: 'change', date: '2026-11-02', title: 'off', pr: 'https://github.com/karero/croftweaver-site/pull/164' },"
    echo "  { kind: 'observation', date: '2026-11-02', title: 'seen', seen: 'see https://github.com/karero/croftweaver-site/pull/162' },"
    echo "  { kind: 'change', date: '2026-11-02', title: 'toolkit', pr: 'https://github.com/karero/croftweaver/pull/165' },"
  fi
  echo "];"
  if [ -n "${DECOYS:-}" ]; then echo "// https://github.com/karero/croftweaver-site/pull/157"; fi
}
# site REPO ISO LABEL HISTORY NUMBER...: write the files the audit reads (the data from the real exporter).
site() {
  local r=$1 iso=$2 label=$3 hist=$4; shift 4
  mkdir -p "$r/scripts" "$r/src/data" "$r/public/data"
  cp "$EXPORTER" "$r/scripts/export-own-site.py"
  printf "// header\nexport const UPDATED = { iso: '%s', label: '%s' } as const;\n" "$iso" "$label" > "$r/src/data/case-study.ts"
  logfile "$@" > "$r/src/data/case-study-log.ts"
  "$PY" "$EXPORTER" --history "$tmp/$hist.csv" --google-data "$tmp/google.json" --out-dir "$r/public/data" 2>/dev/null
}
ALL="165 164 162 157 156 155 143 141 140 129"   # every pull request in the capture since 25 October
# A site on 2 November whose previous update was on 25 October, in two commits on main.
twoupdates() { # REPO DATA-HISTORY NUMBER...
  local r=$1 hist=$2; shift 2
  newrepo "$r"
  site "$r" 2026-10-25 '25 October 2026' h-nov2 $ALL; commit "$r" "update of 25 October"
  site "$r" 2026-11-02 '2 November 2026' "$hist" "$@"; commit "$r" "update of 2 November"
}

# audit REPO ARGS...: runs the real script in REPO; sets $out (standard output) and $code (exit status)
audit() {
  local r=$1; shift
  code=0
  out=$(cd "$r" && PATH="${AUDIT_PATH:-$tmp/bin:$PATH}" "$PY" "$AUDIT" "$@" 2> "$tmp/stderr") || code=$?
  if grep -q Traceback "$tmp/stderr"; then fail "a traceback, not a message: $(head -c 200 "$tmp/stderr")"; fi
}
# want_out NAME CODE: the output is exactly stdin, and the exit status CODE
want_out() {
  local expected; expected=$(cat)
  if [ "$code" = "$2" ] && [ "$out" = "$expected" ]; then pass "$1"
  else fail "$1 (exit $code, want $2)"; diff <(printf '%s\n' "$expected") <(printf '%s\n' "$out") | sed 's/^/       /' || true; fi
}
# want_has NAME CODE PHRASE...: exit status CODE, every phrase in the output, and no all-clear unless CODE is 0
want_has() {
  local name=$1 want=$2 p; shift 2
  if [ "$code" != "$want" ]; then fail "$name (exit $code, want $want): $out"; return; fi
  for p in "$@"; do
    if ! grep -qF -- "$p" <<<"$out"; then fail "$name: no \"$p\" in: $out"; return; fi
  done
  if [ "$want" != 0 ] && grep -q 'All clear' <<<"$out"; then fail "$name: prints an all-clear"; return; fi
  pass "$name"
}
TAIL='This lists croftweaver-site pull requests only. Changes to the toolkit (karero/croftweaver) and to genai-wednesday.de are a judgment by hand.'
IN_LOG='Pull requests: every croftweaver-site pull request merged after 2 November 2026 is in the log.'

echo "scripts/case-study-audit.py"

# A1. The weekly check ran on 9 November; the committed data is still the export of 2 November.
twoupdates "$tmp/a1" h-nov2 $ALL
audit "$tmp/a1" --ref main --no-fetch --history "$tmp/h-nov9.csv" --google-data "$tmp/google.json" --today 2026-11-09
want_out "A1: data older than the AI check history: differs, both row counts, newest day, exit 1" 1 <<EOF
Case study audit of main, 2026-11-09.
AI check data: public/data/croftweaver-com-ai-check.csv at main differs from a fresh export (committed 2 rows, fresh 4 rows). The newest AI check day is 2026-11-09. Run the export and commit the two data files.
Search Console data: matches a fresh export (2 days).
Weekly AI check: the newest run is 2026-11-09, today.
$IN_LOG
$TAIL
Something is due. Say: update the case study.
EOF

# A1, the other file: Search Console has a finished day the committed file lacks. The AI check file matches.
audit "$tmp/a1" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google-nov2.json" --today 2026-11-03
want_has "A1: Search Console data older than the report cache: differs, both day counts, exit 1" 1 \
  "AI check data: matches a fresh export (2 rows)." \
  "Search Console data: public/data/croftweaver-com-search-console.csv at main differs from a fresh export (committed 2 days, fresh 3 days)."

# A2. The newest run is 2 November and the reminder runs on 9 November: seven days. Six days is still fine.
twoupdates "$tmp/a2" h-nov2 $ALL
audit "$tmp/a2" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-09
want_out "A2: no weekly run in the last 6 days, exit 1" 1 <<EOF
Case study audit of main, 2026-11-09.
AI check data: matches a fresh export (2 rows).
Search Console data: matches a fresh export (2 days).
Weekly AI check: no weekly AI check ran in the last 6 days. The newest run is 2026-11-02, 7 days ago.
$IN_LOG
$TAIL
Something is due. Say: update the case study.
EOF
audit "$tmp/a2" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-08
want_has "A2: six days old is still on time" 0 "Weekly AI check: the newest run is 2026-11-02, 6 days ago."

# A3 and A3b. Pull request 165 (merged 3 November) is not in the log: it is due. The ones merged from 25 October
# (the previous update) to 2 November are shown once more under their own heading, and do not make it fail.
# 164, 162 and 157 are named in a commented-out entry, an observation's text and a trailing comment, and
# 165 as another repository's pull request: none of those is logged. 143 and 140 were merged on the previous
# update's own day.
DECOYS=1 twoupdates "$tmp/a3" h-nov2 155 156 141
audit "$tmp/a3" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_out "A3, A3b: due list, then the once-more list; decoy addresses do not count as logged; exit 1" 1 <<EOF
Case study audit of main, 2026-11-03.
AI check data: matches a fresh export (2 rows).
Search Console data: matches a fresh export (2 days).
Weekly AI check: the newest run is 2026-11-02, 1 day ago.
Merged since the last update, not in the log: log it or leave it out.
  karero/croftweaver-site#165, merged 2026-11-03: /established-sites#help: say the work goes through M-Squad, link to its page
Left out at the last update; shown once more (merged from 25 October 2026 to 2 November 2026; this never makes the check fail):
  karero/croftweaver-site#140, merged 2026-10-25: Astro 7.4.2 and the Croftweaver 0.33 Node floor
  karero/croftweaver-site#143, merged 2026-10-25: Case study: three new pages, 22 in all, all indexed by Google
  karero/croftweaver-site#157, merged 2026-10-29: deps: fast-uri 3.1.9 (four Dependabot alerts)
  karero/croftweaver-site#129, merged 2026-11-02: Finish the draft wording on /why, the deck and llms.txt
  karero/croftweaver-site#162, merged 2026-11-02: Fall back to the cloud session's Chromium in tests and the deck script
  karero/croftweaver-site#164, merged 2026-11-02: README: status row 14 for the draft-notice pull requests 126 and 129
$TAIL
Something is due. Say: update the case study.
EOF
if [ "$(cat "$FAKE_GH_LOG")" = 'pr list -R karero/croftweaver-site --state merged --search merged:>=2026-10-25 --limit 200 --json number,mergedAt,title' ]; then pass "the query starts at the previous update's own day and asks for 200"; else fail "gh was asked: $(cat "$FAKE_GH_LOG")"; fi

# Only the pull requests left out at the last update, none due: exit 0, and they are listed.
twoupdates "$tmp/a3b" h-nov2 165 164 162 156 155 141 129
audit "$tmp/a3b" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_has "A3b: pull requests left out at the last update never change the exit status" 0 \
  "$IN_LOG" "karero/croftweaver-site#157, merged 2026-10-29" "karero/croftweaver-site#143, merged 2026-10-25" "All clear: nothing is due."

# A change of UPDATED that arrives by a merge, with a label-only edit after it: the previous UPDATED is still
# 25 October (not 30 October, which a side branch passed through, and not 2 November).
r=$tmp/merge; newrepo "$r"
site "$r" 2026-10-25 '25 October 2026' h-nov2 $ALL; commit "$r" "update of 25 October"
git -C "$r" switch -q -c side
site "$r" 2026-10-30 '30 October 2026' h-nov2 $ALL; commit "$r" "side: a first step"
site "$r" 2026-11-02 '2 November 2026' h-nov2 165 164 162 157 156 155 141 140 129; commit "$r" "side: the update of 2 November"
git -C "$r" switch -q main
echo other > "$r/other.txt"; commit "$r" "unrelated change on main"
git -C "$r" merge -q --no-ff side -m "merge side"
sed -i.bak "s/2 November 2026/2 Nov 2026/" "$r/src/data/case-study.ts"; rm "$r/src/data/case-study.ts.bak"; commit "$r" "label only"
audit "$r" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_has "an update that came by a merge, then a label-only edit: the previous UPDATED is 25 October" 0 \
  "from 25 October 2026 to 2 November 2026" "karero/croftweaver-site#143, merged 2026-10-25"

# A4. Everything matches and is logged; the working tree differs from the commit and must not matter.
twoupdates "$tmp/a4" h-nov2 $ALL
echo "raise SystemExit('a working-tree exporter that stops')" >> "$tmp/a4/scripts/export-own-site.py"
echo x >> "$tmp/a4/public/data/croftweaver-com-ai-check.csv"
sed -i.bak "s/2026-11-02/2026-12-24/" "$tmp/a4/src/data/case-study.ts"; rm "$tmp/a4/src/data/case-study.ts.bak"
before=$(git -C "$tmp/a4" status --porcelain)
audit "$tmp/a4" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_out "A4: all clear, one line per check, exit 0, from the commit and not the working tree" 0 <<EOF
Case study audit of main, 2026-11-03.
AI check data: matches a fresh export (2 rows).
Search Console data: matches a fresh export (2 days).
Weekly AI check: the newest run is 2026-11-02, 1 day ago.
$IN_LOG
$TAIL
All clear: nothing is due.
EOF
if [ "$(git -C "$tmp/a4" status --porcelain)" = "$before" ]; then pass "it changes no file in the repository"; else fail "it changed the working tree"; fi

# A5. A check that cannot run says which and exits 2, never an all-clear; the other blocks still print.
twoupdates "$tmp/a5" h-nov2 $ALL
a5=(--ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03)
AUDIT_PATH=$tmp/nogh audit "$tmp/a5" "${a5[@]}"
want_has "A5: gh is missing" 2 "Pull requests: could not be checked. gh is not installed." "AI check data: matches a fresh export"
FAKE_GH=fail audit "$tmp/a5" "${a5[@]}"
want_has "A5: gh is not signed in" 2 "Pull requests: could not be checked. gh failed (gh: To get started with GitHub CLI"
FAKE_GH_PAD=200 audit "$tmp/a5" "${a5[@]}"
want_has "A5: gh answers with the limit it was asked for" 2 "gh returned 200 pull requests, the limit asked for; more may exist"
FAKE_GH_PAD=199 audit "$tmp/a5" "${a5[@]}"
if [ "$code" = 1 ] && grep -q 'karero/croftweaver-site#9188, merged' <<<"$out" && ! grep -q 'could not be checked' <<<"$out"; then pass "A5: one below the limit is an answer"; else fail "A5: 199 pull requests were not read as an answer (exit $code)"; fi
audit "$tmp/a5" --ref main --no-fetch --history "$tmp/no-such-history.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_has "A5: the export stops" 2 "AI check data: could not be checked. the export stopped:" "Weekly AI check: could not be checked." "Search Console data: could not be checked." "$IN_LOG"
audit "$tmp/a5" --ref nosuchref --no-fetch --today 2026-11-03
want_has "A5: a ref that does not exist" 2 "AI check data: could not be checked. git rev-parse --verify nosuchref^{commit} failed"

# A5, one fault at a time in the committed files.
twoupdates "$tmp/a5log" h-nov2 $ALL
echo "export const LOG = [" > "$tmp/a5log/src/data/case-study-log.ts"; commit "$tmp/a5log" "a log that does not load"
audit "$tmp/a5log" "${a5[@]}"
want_has "A5: the log module cannot be loaded" 2 "Pull requests: could not be checked. the log module cannot be loaded:" "Weekly AI check: the newest run"
twoupdates "$tmp/a5up" h-nov2 $ALL
echo "// no UPDATED here" > "$tmp/a5up/src/data/case-study.ts"; commit "$tmp/a5up" "UPDATED gone"
audit "$tmp/a5up" "${a5[@]}"
want_has "A5: UPDATED cannot be read" 2 "Pull requests: could not be checked. cannot read UPDATED in src/data/case-study.ts at main"
newrepo "$tmp/a5prev"; site "$tmp/a5prev" 2026-11-02 '2 November 2026' h-nov2 $ALL; commit "$tmp/a5prev" "the only commit"
audit "$tmp/a5prev" "${a5[@]}"
want_has "A5: the previous UPDATED cannot be read" 2 "Pull requests: could not be checked. cannot read UPDATED in src/data/case-study.ts at" "or at its first parent"

# 2 wins over 1: data that is out of date and a gh that is missing.
twoupdates "$tmp/a5mix" h-nov2 $ALL
AUDIT_PATH=$tmp/nogh audit "$tmp/a5mix" --ref main --no-fetch --history "$tmp/h-nov9.csv" --google-data "$tmp/google.json" --today 2026-11-09
want_has "A5: exit 2 wins over 1, and the due item is still named" 2 "differs from a fresh export" "gh is not installed" "Something else is due. Say: update the case study."

# A5: the ref moves while the check runs (the fake gh moves main): no commit mixing, no all-clear.
twoupdates "$tmp/a5m" h-nov2 $ALL
FAKE_GH_MOVE=1 audit "$tmp/a5m" "${a5[@]}"
want_has "A5: the ref moves during the run" 2 "AI check data: could not be checked. main moved while the check ran; run it again."
if [ "$(grep -c 'could not be checked' <<<"$out")" = 4 ]; then pass "A5: all four checks say so after the ref moved"; else fail "A5: a check still reported after the ref moved"; fi
# A5: an error the script did not expect ends as exit 2 with a message, not as a traceback (audit() fails on one).
audit "$tmp/a5" --ref main --no-fetch --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today not-a-date
want_has "A5: an unexpected error is exit 2 with a message" 2 "The check stopped before it finished (ValueError:" "This is not an all-clear."

# A5: git fetch fails (this repository has no origin). Run without --no-fetch.
audit "$tmp/a5" --ref main --history "$tmp/h-nov2.csv" --google-data "$tmp/google.json" --today 2026-11-03
want_has "A5: git fetch fails, every check says so" 2 "AI check data: could not be checked. git fetch origin main failed" "Pull requests: could not be checked. git fetch origin main failed"
if [ "$(grep -c 'could not be checked' <<<"$out")" = 4 ]; then pass "A5: nothing is checked after a failed fetch"; else fail "A5: a check ran after a failed fetch"; fi

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
