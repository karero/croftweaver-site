#!/usr/bin/env bash
# Regression guard for scripts/export-own-site.py, the data of the case study page.
#
# The owner's rules (2026-10-21): the page's data holds ONE site, croftweaver.com, and counts only;
# the Search Console file holds the unfiltered croftweaver.com property and finished days only.
# This drives the real script with synthetic inputs and asserts, per scenario, what is written and
# what stops it. A stop must leave both output files as they were.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
failures=0
pass() { echo "  ok   $1"; }
fail() { echo "  FAIL $1"; failures=$((failures + 1)); }

header='date,run_id,site,engine,mode,slot,rev,query,model_requested,models_reported,config_rev,ok,named,cited_own,cited_domains,searched,status,route'
# row DATE RUN SITE ENGINE MODE SLOT OK NAMED CITED STATUS [REV MODEL CONFIG ROUTE]
row() { printf '%s,%s,%s,%s,%s,%s,%s,q,m,%s,%s,%s,%s,%s,,,%s,%s\n' "$1" "$2" "$3" "$4" "$5" "$6" "${11-1}" "${12-m}" "${13-c}" "$7" "$8" "$9" "${10}" "${14-direct}"; }
history() { { echo "$header"; cat; } > "$tmp/$1.csv"; }
# google NAME [PROPERTY COUNTRY FINISHED DAILY-JSON]
DAILY='[{"date":"2026-10-16","clicks":0,"impressions":2,"position":5},{"date":"2026-10-17","clicks":1,"impressions":3,"position":4}]'
google() {
  local daily=${5:-$DAILY}
  printf '{"property": "%s", "country": "%s", "finished": "%s", "daily": %s}\n' \
    "${2:-sc-domain:croftweaver.com}" "${3:-}" "${4:-2026-10-17}" "$daily" > "$tmp/$1.json"
}
run() { python3 scripts/export-own-site.py --history "$tmp/$1.csv" --google-data "$tmp/$2.json" 2> "$tmp/stderr"; }
ai_part() { sed -n '/^--- croftweaver-com-ai-check.csv$/,/^--- croftweaver-com-search-console.csv$/p' | sed '1d;$d'; }
gsc_part() { sed -n '/^--- croftweaver-com-search-console.csv$/,$p' | sed '1d'; }

SITE=croftweaver.com
AIHEAD='date,engine,mode,question,run_id,rev,question_text,config_rev,models_reported,route,answers,named,sources_listed,failed,no_answer'
Q=8e35c2cd  # the first 8 hex digits of sha256('q'), the question text row() writes
google good

echo "scripts/export-own-site.py"

# 1. One site only, and the branded question never: genai-wednesday.de and look-alikes of
#    croftweaver.com (a prefix, a suffix, another case, a trailing space) are dropped.
{
  row 2026-10-18 r1 $SITE openai finds broad 3 0 1 ok
  row 2026-10-18 r1 $SITE openai finds narrow 3 1 1 ok
  row 2026-10-18 r1 $SITE openai finds branded 1 '' '' ok
  row 2026-10-18 r1 genai-wednesday.de openai finds broad 3 3 3 ok
  row 2026-10-18 r1 www.$SITE openai finds broad 3 3 3 ok
  row 2026-10-18 r1 $SITE.example openai finds broad 3 3 3 ok
  row 2026-10-18 r1 CROFTWEAVER.COM openai finds broad 3 3 3 ok
  row 2026-10-18 r1 "$SITE " openai finds broad 3 3 3 ok
} | history one-site
want="$AIHEAD"$'\n'"2026-10-18,openai,with_search,1,r1,1,$Q,c,m,direct,3,0,1,0,0"$'\n'"2026-10-18,openai,with_search,2,r1,1,$Q,c,m,direct,3,1,1,0,0"
if [ "$(run one-site good | ai_part)" = "$want" ]; then pass "keeps croftweaver.com only, drops look-alikes and the branded question"; else fail "writes something else than croftweaver.com's counts"; fi

# 2. Google's "no AI Overview shown" is not an answer (geo_check.py counts it in ok); failed calls
#    are read; and the identifiers that mark a break (question, settings, model, route) are kept.
{
  row 2026-10-18 r1 $SITE google-overview finds broad 1 '' '' 'no AI Overview shown'
  row 2026-10-18 r1 $SITE anthropic finds broad 1 0 0 '2 of 3 failed'
  row 2026-10-19 r2 $SITE anthropic finds broad 3 0 0 ok 2 claude-x c2 openrouter
} | history states
want="$AIHEAD"$'\n'"2026-10-18,anthropic,with_search,1,r1,1,$Q,c,m,direct,1,0,0,2,0"$'\n'"2026-10-18,google-overview,with_search,1,r1,1,$Q,c,m,direct,0,0,0,0,1"$'\n'"2026-10-19,anthropic,with_search,1,r2,2,$Q,c2,claude-x,openrouter,3,0,0,0,0"
if [ "$(run states good | ai_part)" = "$want" ]; then pass "no AI Overview is not an answer; failed calls and break markers are kept"; else fail "states or break markers are read wrongly"; fi

# 3. Search Console: finished days only, sorted.
google later sc-domain:croftweaver.com '' 2026-10-16 '[{"date":"2026-10-17","clicks":0,"impressions":5,"position":3},{"date":"2026-10-16","clicks":0,"impressions":2,"position":5}]'
if [ "$(run one-site later | gsc_part)" = $'date,clicks,impressions\n2026-10-16,0,2' ]; then pass "keeps finished days only"; else fail "kept a day after the last finished day"; fi

# 4. Each of these must stop the script: a non-zero exit, nothing on standard output, no traceback,
#    and a message with PHRASE, so it stops for the right reason.
stops() { # HISTORY GOOGLE WHAT PHRASE
  local out
  if out=$(run "$1" "$2"); then fail "$3: did not stop"
  elif [ -n "$out" ]; then fail "$3: stopped, but wrote output first"
  elif grep -q Traceback "$tmp/stderr"; then fail "$3: stopped with a Python traceback, not a message"
  elif ! grep -q -- "$4" "$tmp/stderr"; then fail "$3: stopped, but not for that reason ($(head -c 120 "$tmp/stderr"))"
  else pass "stops on $3"; fi
}
{ row 2026-10-18 a $SITE openai finds broad 3 0 0 ok; row 2026-10-18 b $SITE openai finds broad 3 0 0 ok; } | history s-dup
stops s-dup good "two runs for one assistant, mode and question" "two runs"
row 2026-10-18 a $SITE openai finds broad 3 0 0 weird | history s-status;        stops s-status good "an unknown status" "unexpected status"
row 2026-10-18 a $SITE openai finds typo 3 0 0 ok | history s-slot;              stops s-slot good "an unknown slot" "unexpected slot"
row 2026-10-18 a $SITE openai weird broad 3 0 0 ok | history s-mode;            stops s-mode good "an unknown mode" "unexpected mode"
row 2026-02-31 a $SITE openai finds broad 3 0 0 ok | history s-day;             stops s-day good "a date that is not a real day" "is not a day"
row 2026-10-18 a $SITE 'Open AI' finds broad 3 0 0 ok | history s-name;         stops s-name good "an assistant name with a space" "unexpected assistant name"
row 2026-10-18 a $SITE openai finds broad 3 4 0 ok | history s-named;           stops s-named good "named above answers" "cannot be true"
row 2026-10-18 a $SITE openai finds broad 3 0 4 ok | history s-sources;         stops s-sources good "sources above answers" "cannot be true"
row 2026-10-18 a $SITE google-overview finds broad 1 1 0 'no AI Overview shown' | history s-noans
stops s-noans good "a named count on a no-answer row" "no AI Overview shown"
row 2026-10-18 a $SITE openai finds broad 2 0 0 '2 of 3 failed' | history s-sum; stops s-sum good "answers and failed calls that do not add up" "do not add up"
row 2026-10-18 a genai-wednesday.de openai finds broad 3 3 3 ok | history s-none; stops s-none good "no row for croftweaver.com at all" "no rows for"
{ echo "$header"; row 2026-10-18 a $SITE openai finds broad 3 0 0 ok; echo "2026-10-18,b,croftweav"; } > "$tmp/s-short.csv"
stops s-short good "a row cut short" "cut short"
google other sc-domain:genai-wednesday.de;   stops one-site other "another Search Console property" "property"
google country sc-domain:croftweaver.com deu; stops one-site country "a country filter" "country"
google dupday sc-domain:croftweaver.com '' 2026-10-17 '[{"date":"2026-10-16","clicks":0,"impressions":2},{"date":"2026-10-16","clicks":0,"impressions":2}]'
stops one-site dupday "a day twice" "twice"
google clicks sc-domain:croftweaver.com '' 2026-10-17 '[{"date":"2026-10-16","clicks":3,"impressions":2}]'
stops one-site clicks "more clicks than impressions" "clicks but"
google nocount sc-domain:croftweaver.com '' 2026-10-17 '[{"date":"2026-10-16","clicks":"1","impressions":2}]'
stops one-site nocount "a count that is not a number" "not counts"
google nodays sc-domain:croftweaver.com '' 2026-10-10
stops one-site nodays "no finished day" "no finished days"

# 4b. More inputs that must stop it: an assistant geo_check.py does not ask, and a value that is not plain.
row 2026-10-18 a $SITE cohere finds broad 3 0 0 ok | history s-cohere;          stops s-cohere good "an assistant outside the list" "unexpected assistant name"
row 2026-10-18 a $SITE openai finds broad 3 0 0 ok 1 m c Direct | history s-route; stops s-route good "a route that is not plain" "unexpected route"
row 2026-10-18 a $SITE openai finds broad 3 0 0 ok 1 'gpt 6' c direct | history s-model; stops s-model good "a model name with a space" "unexpected models_reported"
# 4c. Accepted on purpose: every call failed (geo_check.py then writes no model name), and Google counts as floats.
row 2026-10-18 r1 $SITE openai finds broad 0 '' '' '3 of 3 failed' 1 '' c direct | history allfail
if [ "$(run allfail good | ai_part)" = "$AIHEAD"$'\n'"2026-10-18,openai,with_search,1,r1,1,$Q,c,,direct,0,0,0,3,0" ]; then pass "every call failed: no model name, 0 answers, 3 failed"; else fail "a run where every call failed is refused or written wrongly"; fi
google floats sc-domain:croftweaver.com '' 2026-10-17 '[{"date":"2026-10-16","clicks":1.0,"impressions":2.0}]'
if [ "$(run one-site floats | gsc_part)" = $'date,clicks,impressions\n2026-10-16,1,2' ]; then pass "whole numbers written as floats are written as whole numbers"; else fail "float counts are refused or written as floats"; fi
google half sc-domain:croftweaver.com '' 2026-10-17 '[{"date":"2026-10-16","clicks":0.5,"impressions":2}]'
stops one-site half "a count that is not whole" "not counts"
if out=$(python3 scripts/export-own-site.py --history "$tmp/one-site.csv" --google-data "$tmp/good.json" --out-dir "$tmp/no-such-dir" 2> "$tmp/stderr"); then fail "an output folder that does not exist: did not stop"
elif grep -q Traceback "$tmp/stderr"; then fail "an output folder that does not exist: a traceback, not a message"
elif grep -q "cannot write" "$tmp/stderr"; then pass "stops on an output folder it cannot write"; else fail "an output folder that does not exist: wrong message"; fi

# 5. --out-dir writes both files only when both check out: a stop in either leaves both as they were.
mkdir "$tmp/out"
echo KEEP > "$tmp/out/croftweaver-com-ai-check.csv"; echo KEEP > "$tmp/out/croftweaver-com-search-console.csv"
python3 scripts/export-own-site.py --history "$tmp/one-site.csv" --google-data "$tmp/other.json" --out-dir "$tmp/out" >/dev/null 2>&1 || true
if [ "$(cat "$tmp/out/croftweaver-com-ai-check.csv")" = KEEP ] && [ "$(cat "$tmp/out/croftweaver-com-search-console.csv")" = KEEP ]; then pass "--out-dir: a stop leaves both files as they were"; else fail "--out-dir: a stop changed a file"; fi
python3 scripts/export-own-site.py --history "$tmp/one-site.csv" --google-data "$tmp/good.json" --out-dir "$tmp/out" 2>/dev/null
if [ "$(head -1 "$tmp/out/croftweaver-com-ai-check.csv")" = "$AIHEAD" ] && [ "$(head -1 "$tmp/out/croftweaver-com-search-console.csv")" = "date,clicks,impressions" ] && ! compgen -G "$tmp/out/*.tmp" >/dev/null; then pass "--out-dir: writes both files, no temporary file left"; else fail "--out-dir: wrong files, or a temporary file is left"; fi

# 5b. A failure on the second file after the first was replaced (the Search Console file is a folder
#     here): the first file gets its exact old contents back, nothing is left over, and the script
#     says why it stopped. Old contents with a line that has no newline at its end, to see they
#     come back byte for byte.
mkdir "$tmp/out2" "$tmp/out2/croftweaver-com-search-console.csv"; printf 'KEEP\nno newline' > "$tmp/out2/croftweaver-com-ai-check.csv"; cp "$tmp/out2/croftweaver-com-ai-check.csv" "$tmp/old-ai.csv"
if python3 scripts/export-own-site.py --history "$tmp/one-site.csv" --google-data "$tmp/good.json" --out-dir "$tmp/out2" >/dev/null 2> "$tmp/stderr"; then fail "--out-dir: a failed second write did not stop"
elif grep -q Traceback "$tmp/stderr"; then fail "--out-dir: a failed second write raised a traceback"
elif cmp -s "$tmp/out2/croftweaver-com-ai-check.csv" "$tmp/old-ai.csv" && ! compgen -G "$tmp/out2/*.tmp" >/dev/null && ! compgen -G "$tmp/out2/*.restore" >/dev/null && grep -q "cannot write" "$tmp/stderr"; then pass "--out-dir: a failed second write puts the first file back exactly"
else fail "--out-dir: a failed second write left a new first file or a temporary file"; fi
# The same on a first publication: there was no first file, so the new one goes again.
mkdir "$tmp/out3" "$tmp/out3/croftweaver-com-search-console.csv"
python3 scripts/export-own-site.py --history "$tmp/one-site.csv" --google-data "$tmp/good.json" --out-dir "$tmp/out3" >/dev/null 2>&1 || true
if [ ! -e "$tmp/out3/croftweaver-com-ai-check.csv" ] && ! compgen -G "$tmp/out3/*.tmp" >/dev/null; then pass "--out-dir: a failed first publication leaves no file"
else fail "--out-dir: a failed first publication left a file behind"; fi
printf '[1, 2]\n' > "$tmp/list.json"; stops one-site list "a cache that is not a record" "not the report cache"
stops no-such-history good "a history that does not exist" "cannot read"

if [ "$failures" -ne 0 ]; then echo "$failures check(s) failed"; exit 1; fi
echo "all checks passed"
