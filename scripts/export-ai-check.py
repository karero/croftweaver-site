#!/usr/bin/env python3
"""Make public/data/genai-wednesday-de-ai-check.csv from the AI check tracker's history.

    python3 scripts/export-ai-check.py --out public/data/genai-wednesday-de-ai-check.csv

The history (search-console-insights skill, geo_check.py) holds the results for several sites.
This script keeps ONE site, genai-wednesday.de, and writes nothing about any other: that is
the rule for what is published (owner, 2026-10-08). It also drops the branded question, which
is read and never scored, and the answers themselves, which are never published.
tests/check_export_ai_check.sh keeps the one-site rule true; CI and the pre-push hook run it.

Mapping, checked on 2026-10-08 by regenerating the 26 and 28 September 2026 rows that were
already published (all 37 lines identical):
  mode    finds -> with_search, knows -> without_search
  slot    broad -> question 1, narrow -> question 2 (branded is skipped)
  answers = ok, named = named, cited = cited_own (empty counts as 0),
  failed  = X in the status "X of Y failed" (0 when the status is "ok")
Several runs on one day are merged. Each assistant, mode and question must come from exactly
one run. The script stops, and leaves the --out file as it was, on two runs for one key, on a
column the history lacks, on a mode, slot, status, date or engine it does not know, and on
counts that cannot be true (named above answers, cited above named, answers and failed calls
not adding up to the calls asked).

The tracker records no skipped run. When the check was not run for an assistant on the latest
day, say so in NOT_RUN in src/data/proof.ts.
"""
import argparse
import csv
import io
import os
import re
import sys

SITE = 'genai-wednesday.de'
MODE = {'finds': 'with_search', 'knows': 'without_search'}
QUESTION = {'broad': 1, 'narrow': 2}
SKIPPED_SLOTS = {'branded'}
COLUMNS = {'date', 'run_id', 'site', 'engine', 'mode', 'slot', 'ok', 'named', 'cited_own', 'status'}
DEFAULT_HISTORY = os.path.expanduser('~/.config/gsc-insights/geo/geo_history.csv')

parser = argparse.ArgumentParser(description='Export the AI check counts for ' + SITE + ' as the published CSV.')
parser.add_argument('--history', default=DEFAULT_HISTORY, help='the tracker history (default: %(default)s)')
parser.add_argument('--out', help='write the CSV here, in one step, and only if everything checks out (default: standard output)')
args = parser.parse_args()

reader = csv.DictReader(open(args.history, newline=''))
missing = COLUMNS - set(reader.fieldnames or [])
if missing:
    sys.exit(f'{args.history}: the history has no column {", ".join(sorted(missing))}')

kept = {}
others = branded = 0
for row in reader:
    if row['site'] != SITE:
        others += 1
        continue
    if row['slot'] in SKIPPED_SLOTS:
        branded += 1
        continue
    where = f'{row["date"]} {row["engine"]}'
    if row['slot'] not in QUESTION:
        sys.exit(f'{where}: unexpected slot {row["slot"]!r}')
    if row['mode'] not in MODE:
        sys.exit(f'{where}: unexpected mode {row["mode"]!r}')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', row['date']):
        sys.exit(f'{where}: unexpected date {row["date"]!r}')
    if not re.fullmatch(r'[a-z-]+', row['engine']):
        sys.exit(f'{where}: unexpected assistant name {row["engine"]!r}')
    key = (row['date'], row['engine'], MODE[row['mode']], QUESTION[row['slot']])
    if key in kept:
        sys.exit(f'{key}: two runs, {kept[key]["run"]} and {row["run_id"]}')
    failed = re.fullmatch(r'(\d+) of (\d+) failed', row['status'])
    if not failed and row['status'] != 'ok':
        sys.exit(f'{key}: unexpected status {row["status"]!r}')
    v = {
        'run': row['run_id'],
        'answers': int(row['ok']),
        'named': int(row['named'] or 0),
        'cited': int(row['cited_own'] or 0),
        'failed': int(failed.group(1)) if failed else 0,
    }
    if v['named'] > v['answers'] or v['cited'] > v['named']:
        sys.exit(f'{key}: counts that cannot be true (answers {v["answers"]}, named {v["named"]}, cited {v["cited"]})')
    if failed and v['answers'] + v['failed'] != int(failed.group(2)):
        sys.exit(f'{key}: {v["answers"]} answers and {v["failed"]} failed calls do not add up to the {failed.group(2)} calls in {row["status"]!r}')
    kept[key] = v

if not kept:
    sys.exit(f'no rows for {SITE} in {args.history}')

text = io.StringIO()
out = csv.writer(text, lineterminator='\n')
out.writerow(['date', 'engine', 'mode', 'question', 'answers', 'named', 'cited', 'failed'])
for (date, engine, mode, question), v in sorted(kept.items()):
    out.writerow([date, engine, mode, question, v['answers'], v['named'], v['cited'], v['failed']])

if args.out:
    tmp = args.out + '.tmp'
    with open(tmp, 'w', newline='') as f:
        f.write(text.getvalue())
    os.replace(tmp, args.out)
else:
    sys.stdout.write(text.getvalue())

days = sorted({k[0] for k in kept})
print(f'{len(kept)} rows for {SITE}, {len(days)} days, {days[0]} to {days[-1]}; left out {others} rows of other sites and {branded} branded rows', file=sys.stderr)
