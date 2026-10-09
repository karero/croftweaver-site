#!/usr/bin/env bash
# Regression guard for scripts/export-ai-check.py.
#
# The published AI-check file may hold ONE site, genai-wednesday.de, and counts only (owner,
# 2026-10-08: "only publish the GEO results for genai-wednesday.de"). The tracker's history holds
# other sites too, and nothing else in the repository would notice if the filter in the script
# were widened (a prefix match, a lower-cased compare), so this drives the real script with
# synthetic histories and asserts, per scenario, what is written and what stops it. A stop must
# also leave the --out file as it was.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
failures=0
pass() { echo "  ok   $1"; }
fail() { echo "  FAIL $1"; failures=$((failures + 1)); }

header='date,run_id,site,engine,mode,slot,rev,query,model_requested,models_reported,config_rev,ok,named,cited_own,cited_domains,searched,status,route'
# row DATE RUN SITE ENGINE MODE SLOT OK NAMED CITED STATUS
row() { printf '%s,%s,%s,%s,%s,%s,1,q,m,m,c,%s,%s,%s,,,%s,direct\n' "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9" "${10}"; }
history() { { echo "$header"; cat; } > "$tmp/$1.csv"; }
export_to_stdout() { python3 scripts/export-ai-check.py --history "$tmp/$1.csv" 2> "$tmp/stderr"; }

SITE=genai-wednesday.de

echo "scripts/export-ai-check.py"

# 1. Exactly one site, and the branded question never: a second site, look-alikes of the right
#    one (a prefix, a suffix, another case, a trailing space) and a branded row are all dropped.
{
  row 2026-10-08 r1 $SITE openai finds broad 3 2 2 ok
  row 2026-10-08 r1 $SITE openai finds narrow 3 3 3 ok
  row 2026-10-08 r1 $SITE openai finds branded 1 '' '' ok
  row 2026-10-08 r1 other.example openai finds broad 3 0 0 ok
  row 2026-10-08 r1 www.$SITE openai finds broad 3 0 0 ok
  row 2026-10-08 r1 $SITE.example openai finds broad 3 0 0 ok
  row 2026-10-08 r1 GENAI-WEDNESDAY.DE openai finds broad 3 0 0 ok
  row 2026-10-08 r1 "$SITE " openai finds broad 3 0 0 ok
} | history one-site
want=$'date,engine,mode,question,answers,named,cited,failed\n2026-10-08,openai,with_search,1,3,2,2,0\n2026-10-08,openai,with_search,2,3,3,3,0'
if [ "$(export_to_stdout one-site)" = "$want" ]; then pass "keeps one site, drops look-alikes and the branded question"; else fail "writes something else than the one site's counts"; fi

# 2. Failed calls and merged runs: "2 of 3 failed" is 1 answer and 2 failed calls; two runs on one
#    day are merged when they cover different assistants.
{
  row 2026-10-05 r1 $SITE anthropic finds broad 1 0 0 '2 of 3 failed'
  row 2026-10-05 r2 $SITE gemini knows broad 3 0 '' ok
} | history merged
want=$'date,engine,mode,question,answers,named,cited,failed\n2026-10-05,anthropic,with_search,1,1,0,0,2\n2026-10-05,gemini,without_search,1,3,0,0,0'
if [ "$(export_to_stdout merged)" = "$want" ]; then pass "reads failed calls, merges runs of one day"; else fail "failed calls or merged runs are read wrongly"; fi

# 2b. named and cited are counted apart, answer by answer: an answer can list the site among its sources
#     without naming it, so cited may be higher than named, for any assistant. (For Perplexity the count is
#     the sources it returned, whatever the text says.) Only answers bound them.
{
  row 2026-10-08 r1 $SITE perplexity finds broad 3 0 2 ok
  row 2026-10-08 r1 $SITE openai finds broad 3 1 3 ok
} | history apart
want=$'date,engine,mode,question,answers,named,cited,failed\n2026-10-08,openai,with_search,1,3,1,3,0\n2026-10-08,perplexity,with_search,1,3,0,2,0'
if [ "$(export_to_stdout apart)" = "$want" ]; then pass "cited above named is a valid count"; else fail "cited above named was refused or written wrongly"; fi

# 3. Each of these must stop the script: a non-zero exit, nothing on standard output, and a message
#    that says why (a Python traceback is not a message) and says the right why: it must contain
#    PHRASE, or a history could stop for another reason (a file with nothing left has "no rows")
#    and pass. Each is made first, then checked in THIS shell: a check run at the end of a
#    pipeline loses its failures in a subshell.
stops() { # FILE-NAME WHAT PHRASE: the history in $tmp/FILE-NAME.csv must stop the script, saying PHRASE
  local file=$1 what=$2 phrase=$3 out
  if out=$(python3 scripts/export-ai-check.py --history "$tmp/$file.csv" 2> "$tmp/stderr"); then fail "$what: did not stop"
  elif [ -n "$out" ]; then fail "$what: stopped, but wrote output first"
  elif grep -q Traceback "$tmp/stderr"; then fail "$what: stopped with a Python traceback, not a message"
  elif [ ! -s "$tmp/stderr" ]; then fail "$what: stopped without saying why"
  elif ! grep -q -- "$phrase" "$tmp/stderr"; then fail "$what: stopped, but not for that reason ($(head -c 120 "$tmp/stderr"))"
  else pass "stops on $what"; fi
}
{ row 2026-10-08 a $SITE openai finds broad 3 3 3 ok; row 2026-10-08 b $SITE openai finds broad 3 3 3 ok; } | history s-dup
stops s-dup "two runs for one assistant, mode and question" "two runs"
row 2026-10-08 a $SITE openai finds broad 3 3 3 weird | history s-status;        stops s-status "an unknown status" "unexpected status"
row 2026-10-08 a $SITE openai finds typo 3 3 3 ok | history s-slot;              stops s-slot "an unknown slot" "unexpected slot"
row 2026-10-08 a $SITE openai weird broad 3 3 3 ok | history s-mode;            stops s-mode "an unknown mode" "unexpected mode"
row 8-Oct a $SITE openai finds broad 3 3 3 ok | history s-date;                 stops s-date "a date that is not YYYY-MM-DD" "unexpected date"
row 2026-02-31 a $SITE openai finds broad 3 3 3 ok | history s-day;             stops s-day "a date that is not a real day" "unexpected date"
row 2026-10-08 a $SITE 'Open AI' finds broad 3 3 3 ok | history s-name;         stops s-name "an assistant name with a space and capitals" "unexpected assistant name"
row 2026-10-08 a $SITE openai finds broad 3 4 3 ok | history s-named;           stops s-named "named above answers" "cannot be true"
row 2026-10-08 a $SITE openai finds broad 3 2 4 ok | history s-cited;           stops s-cited "cited above answers" "cannot be true"
row 2026-10-08 a $SITE openai finds broad 3 -1 -2 ok | history s-negative;      stops s-negative "counts below zero" "is not a count"
row 2026-10-08 a $SITE openai finds broad '' 3 3 ok | history s-empty;          stops s-empty "an empty count of answers" "is not a count"
row 2026-10-08 a $SITE openai finds broad 2 2 2 '2 of 3 failed' | history s-sum; stops s-sum "answers and failed calls that do not add up" "do not add up"
row 2026-10-08 a other.example openai finds broad 3 3 3 ok | history s-none;    stops s-none "no row for the site at all" "no rows for"
{ echo "$header"; echo "2026-10-08,a,$SITE,openai,finds,broad"; } > "$tmp/s-short.csv"; stops s-short "a row that is cut short" "cut short"
# These two sit beside a good row of the site: with nothing else in the file the script stops for
# "no rows" anyway, whether or not it looks at the cut-short row first.
{ echo "$header"; row 2026-10-08 a $SITE openai finds broad 3 3 3 ok; echo "2026-10-08,b,$SITE,openai,finds,branded"; } > "$tmp/s-short-branded.csv"
stops s-short-branded "a branded row that is cut short" "cut short"
{ echo "$header"; row 2026-10-08 a $SITE openai finds broad 3 3 3 ok; echo "2026-10-08,b,genai-wed"; } > "$tmp/s-short-site.csv"
stops s-short-site "a row cut off inside the site name" "cut short"
# A strange value in ANOTHER site's rows does not matter: only this site's rows are read.
{ row 2026-10-08 a other.example openai finds typo 3 3 3 weird; row 2026-10-08 a $SITE openai finds broad 3 3 3 ok; } | history other-odd
if export_to_stdout other-odd >/dev/null; then pass "ignores a strange value in another site's rows"; else fail "stopped on another site's row"; fi
printf 'date,engine,mode,slot,ok,named,status\n2026-10-08,openai,finds,broad,3,3,ok\n' > "$tmp/nocolumn.csv"
if python3 scripts/export-ai-check.py --history "$tmp/nocolumn.csv" >/dev/null 2>&1; then fail "a history without the site column did not stop it"; else pass "stops on a history without the site column"; fi

# 4. --out is written in one step and only on success: a stop leaves the file as it was.
echo KEEP > "$tmp/out.csv"
{ row 2026-10-08 a $SITE openai finds broad 3 3 3 ok; row 2026-10-08 b $SITE openai finds broad 3 3 3 ok; } | history dup
if python3 scripts/export-ai-check.py --history "$tmp/dup.csv" --out "$tmp/out.csv" >/dev/null 2>&1; then fail "--out: the script did not stop"; else
  if [ "$(cat "$tmp/out.csv")" = "KEEP" ]; then pass "--out: a stop leaves the file as it was"; else fail "--out: a stop changed the file"; fi
fi
python3 scripts/export-ai-check.py --history "$tmp/one-site.csv" --out "$tmp/out.csv" 2>/dev/null
if [ "$(wc -l < "$tmp/out.csv" | tr -d ' ')" = "3" ] && [ ! -e "$tmp/out.csv.tmp" ]; then pass "--out: writes the file in one step"; else fail "--out: wrong file, or a temporary file is left"; fi

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
