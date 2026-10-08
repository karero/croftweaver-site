#!/usr/bin/env python3
"""Make public/data/genai-wednesday-de-ai-check.csv from the AI check tracker's history.

    python3 scripts/export-ai-check.py > public/data/genai-wednesday-de-ai-check.csv

The history (search-console-insights skill, geo_check.py) holds the results for several sites.
This script keeps ONE site, genai-wednesday.de, and writes nothing about any other: that is
the rule for what is published (owner, 2026-10-08). It also drops the branded question, which
is read and never scored, and the answers themselves, which are never published.

Mapping, checked on 2026-10-08 by regenerating the 26 and 28 September 2026 rows that were
already published (all 37 lines identical):
  mode    finds -> with_search, knows -> without_search
  slot    broad -> question 1, narrow -> question 2
  answers = ok, named = named, cited = cited_own (empty counts as 0),
  failed  = X in the status "X of Y failed" (0 when the status is "ok")
Several runs on one day are merged. Each assistant, mode and question must come from exactly
one run; the script stops if two runs claim the same one.

Usage: export-ai-check.py [--history PATH]
"""
import csv
import os
import re
import sys

SITE = 'genai-wednesday.de'
MODE = {'finds': 'with_search', 'knows': 'without_search'}
QUESTION = {'broad': 1, 'narrow': 2}
DEFAULT_HISTORY = os.path.expanduser('~/.config/gsc-insights/geo/geo_history.csv')

history = sys.argv[sys.argv.index('--history') + 1] if '--history' in sys.argv else DEFAULT_HISTORY

kept = {}
for row in csv.DictReader(open(history, newline='')):
    if row['site'] != SITE or row['slot'] not in QUESTION:
        continue
    key = (row['date'], row['engine'], MODE[row['mode']], QUESTION[row['slot']])
    if key in kept:
        sys.exit(f'{key}: two runs, {kept[key]["run"]} and {row["run_id"]}')
    failed = re.fullmatch(r'(\d+) of (\d+) failed', row['status'])
    if not failed and row['status'] != 'ok':
        sys.exit(f'{key}: unexpected status {row["status"]!r}')
    kept[key] = {
        'run': row['run_id'],
        'answers': int(row['ok']),
        'named': int(row['named'] or 0),
        'cited': int(row['cited_own'] or 0),
        'failed': int(failed.group(1)) if failed else 0,
    }

if not kept:
    sys.exit(f'no rows for {SITE} in {history}')

out = csv.writer(sys.stdout, lineterminator='\n')
out.writerow(['date', 'engine', 'mode', 'question', 'answers', 'named', 'cited', 'failed'])
for (date, engine, mode, question), v in sorted(kept.items()):
    out.writerow([date, engine, mode, question, v['answers'], v['named'], v['cited'], v['failed']])

days = sorted({k[0] for k in kept})
print(f'{len(kept)} rows for {SITE}, {len(days)} days, {days[0]} to {days[-1]}', file=sys.stderr)
