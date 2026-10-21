#!/usr/bin/env python3
"""Make the two data files of the case study page (croftweaver.com on its own site).

    python3 scripts/export-own-site.py --out-dir public/data

writes, only if both check out (and both or neither):
  public/data/croftweaver-com-ai-check.csv        the weekly AI check, counts only
  public/data/croftweaver-com-search-console.csv  daily clicks and impressions from Google

The owner's decisions (2026-10-21): the page has its own export, this one, for croftweaver.com only;
scripts/export-ai-check.py stays the genai-wednesday.de export and is not touched; counts only, no
answer text. tests/check_export_own_site.sh keeps those rules true; CI and the pre-push hook run it.

AI check: read from the tracker's history (search-console-insights skill, geo_check.py). Rows of
other sites and the branded question are dropped. The rules for reading a row are geo_check.py's:
  mode    finds -> with_search, knows -> without_search
  slot    broad -> question 1, narrow -> question 2 (one question per slot)
  answers = ok; but Google's "no AI Overview shown" / "no AI Mode answer" is not an answer
            (geo_check.py _counts): answers 0, no_answer 1
  named = named, sources_listed = cited_own (empty counts as 0): answers whose returned sources
            include croftweaver.com. Not called "cited": geo_check.py does not check, for every
            assistant, that the answer's text uses those sources.
  failed  = X in the status "X of Y failed" (0 when the status is "ok")
rev, config_rev, models_reported, route and a short fingerprint of the question's text are kept,
so the page can mark a break where the question, the settings, the model or the route changed
(geo_check.py --trend looks at the same five). Any other status, an assistant outside ENGINES, or
a value in those columns that is not plain stops the export: a new state or assistant in
geo_check.py must be read here on purpose.

Search Console: read from the report job's cache (search_report.py writes
~/.config/gsc-insights/reports/croftweaver.com/google-data.json). Only the croftweaver.com domain
property with no country filter is accepted. Days after the last finished day are left out.
Counts may come as whole numbers written as floats (2.0); they are written as whole numbers.

The script stops, and leaves both files as they were, on: two rows for one key, a column the
history lacks, a row cut short, a mode, slot, status, engine or date it does not know, counts that
cannot be true, or Search Console data for another property, a country, a repeated day, a count
that is not a whole number, or more clicks than impressions; on an existing output file it cannot
read; and on an output folder it cannot write, where a file replaced before the failure gets its
old contents back. If that putting-back fails too, the message names the file and either where its
old contents were saved or that saving them failed as well. Recovery files carry this run's process
id, so a later run never removes an earlier run's copy.
"""
import argparse
import hashlib
import csv
import datetime
import io
import json
import os
import re
import sys

SITE = 'croftweaver.com'
PROPERTY = 'sc-domain:croftweaver.com'
MODE = {'finds': 'with_search', 'knows': 'without_search'}
QUESTION = {'broad': 1, 'narrow': 2}
SKIPPED_SLOTS = {'branded'}
NO_ANSWER = {'no AI Overview shown', 'no AI Mode answer'}
# The assistants geo_check.py asks (its ENGINES). A name outside this list stops the export.
ENGINES = {'openai', 'perplexity', 'google-ai-mode', 'google-overview', 'gemini', 'anthropic'}
# The columns passed through as text: plain values only, no comma (the page reads them with a pattern).
PLAIN = {'run_id': r'[A-Za-z0-9-]+', 'rev': r'[0-9]+', 'config_rev': r'[A-Za-z0-9]*',
         'models_reported': r'[A-Za-z0-9._/:|-]*', 'route': r'[a-z]*'}
COLUMNS = {'date', 'run_id', 'site', 'engine', 'mode', 'slot', 'rev', 'query', 'models_reported', 'config_rev',
           'ok', 'named', 'cited_own', 'status', 'route'}
AI_FILE = 'croftweaver-com-ai-check.csv'
GSC_FILE = 'croftweaver-com-search-console.csv'
DEFAULT_HISTORY = os.path.expanduser('~/.config/gsc-insights/geo/geo_history.csv')
DEFAULT_GOOGLE = os.path.expanduser('~/.config/gsc-insights/reports/croftweaver.com/google-data.json')


def stop(message):
    sys.exit(f'export-own-site: {message} (nothing written)')


def count(value, what, where, empty_is_zero=False):
    if empty_is_zero and value == '':
        return 0
    if not re.fullmatch(r'\d+', value or ''):
        stop(f'{where}: {what} {value!r} is not a count')
    return int(value)


def day(value, where):
    try:
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value or ''):
            raise ValueError
        return datetime.date.fromisoformat(value)
    except ValueError:
        stop(f'{where}: {value!r} is not a day')


def ai_check(path):
    try:
        reader = csv.DictReader(open(path, newline=''))
    except OSError as e:
        stop(f'{path}: cannot read ({e.strerror})')
    missing = COLUMNS - set(reader.fieldnames or [])
    if missing:
        stop(f'{path}: the history has no column {", ".join(sorted(missing))}')
    kept = {}
    for row in reader:
        where = f'{row.get("date")} {row.get("engine")}'
        if None in row or None in row.values():
            stop(f'{where}: the row is cut short or has too many fields')
        if row['site'] != SITE or row['slot'] in SKIPPED_SLOTS:
            continue
        if row['slot'] not in QUESTION:
            stop(f'{where}: unexpected slot {row["slot"]!r}')
        if row['mode'] not in MODE:
            stop(f'{where}: unexpected mode {row["mode"]!r}')
        day(row['date'], where)
        if row['engine'] not in ENGINES:
            stop(f'{where}: unexpected assistant name {row["engine"]!r}')
        for col, pattern in PLAIN.items():
            if not re.fullmatch(pattern, row[col]):
                stop(f'{where}: unexpected {col} {row[col]!r}')
        key = (row['date'], row['engine'], MODE[row['mode']], QUESTION[row['slot']])
        if key in kept:
            stop(f'{key}: two runs, {kept[key]["run_id"]} and {row["run_id"]}')
        status = row['status']
        failed = re.fullmatch(r'(\d+) of (\d+) failed', status)
        if status not in NO_ANSWER and status != 'ok' and not failed:
            stop(f'{key}: unexpected status {status!r}')
        v = {
            'run_id': row['run_id'], 'rev': row['rev'], 'config_rev': row['config_rev'],
            'question_text': hashlib.sha256(row['query'].encode()).hexdigest()[:8],
            'models_reported': row['models_reported'], 'route': row['route'] or 'direct',
            'answers': count(row['ok'], 'ok', where),
            'named': count(row['named'], 'named', where, True),
            'sources_listed': count(row['cited_own'], 'cited_own', where, True),
            'failed': int(failed.group(1)) if failed else 0,
            'no_answer': 0,
        }
        if status in NO_ANSWER:
            if v['named'] or v['sources_listed']:
                stop(f'{key}: {status!r} but named {v["named"]}, sources {v["sources_listed"]}')
            v['answers'], v['no_answer'] = 0, 1
        if v['named'] > v['answers'] or v['sources_listed'] > v['answers']:
            stop(f'{key}: counts that cannot be true (answers {v["answers"]}, named {v["named"]}, sources {v["sources_listed"]})')
        if failed and v['answers'] + v['failed'] != int(failed.group(2)):
            stop(f'{key}: {v["answers"]} answers and {v["failed"]} failed calls do not add up to {failed.group(2)}')
        kept[key] = v
    if not kept:
        stop(f'no rows for {SITE} in {path}')
    text = io.StringIO()
    out = csv.writer(text, lineterminator='\n')
    fields = ['run_id', 'rev', 'question_text', 'config_rev', 'models_reported', 'route', 'answers', 'named', 'sources_listed', 'failed', 'no_answer']
    out.writerow(['date', 'engine', 'mode', 'question'] + fields)
    for key, v in sorted(kept.items()):
        out.writerow(list(key) + [v[f] for f in fields])
    return text.getvalue(), len(kept)


def search_console(path):
    try:
        data = json.load(open(path))
    except (OSError, ValueError) as e:
        stop(f'{path}: cannot read ({e})')
    if not isinstance(data, dict) or not isinstance(data.get('daily', []), list):
        stop(f'{path}: not the report cache this script reads')
    if data.get('property') != PROPERTY:
        stop(f'{path}: property {data.get("property")!r}, not {PROPERTY}')
    if data.get('country') != '':
        stop(f'{path}: filtered to country {data.get("country")!r}; only unfiltered totals are published')
    finished = day(data.get('finished'), f'{path} finished')
    rows, seen = [], set()
    for r in data.get('daily') or []:
        if not isinstance(r, dict):
            stop(f'{path}: a daily entry that is not a record')
        d = day(r.get('date'), f'{path} daily')
        if d > finished:
            continue
        if d in seen:
            stop(f'{path}: {d} twice')
        seen.add(d)
        clicks, impressions = r.get('clicks'), r.get('impressions')
        def whole(x):
            return (isinstance(x, (int, float)) and not isinstance(x, bool) and x >= 0
                    and float(x).is_integer())
        if not (whole(clicks) and whole(impressions)):
            stop(f'{path}: {d}: clicks {clicks!r}, impressions {impressions!r} are not counts')
        clicks, impressions = int(clicks), int(impressions)
        if clicks > impressions:
            stop(f'{path}: {d}: {clicks} clicks but {impressions} impressions')
        rows.append((d.isoformat(), clicks, impressions))
    if not rows:
        stop(f'{path}: no finished days')
    rows.sort()
    text = io.StringIO()
    out = csv.writer(text, lineterminator='\n')
    out.writerow(['date', 'clicks', 'impressions'])
    out.writerows(rows)
    return text.getvalue(), len(rows)


parser = argparse.ArgumentParser(description='Export the case study data for ' + SITE + '.')
parser.add_argument('--history', default=DEFAULT_HISTORY, help='the AI check history (default: %(default)s)')
parser.add_argument('--google-data', default=DEFAULT_GOOGLE, help='the report job cache (default: %(default)s)')
parser.add_argument('--out-dir', help='write both files here, only if both check out (default: print both to standard output)')
args = parser.parse_args()

ai_text, ai_rows = ai_check(args.history)
gsc_text, gsc_rows = search_console(args.google_data)

if args.out_dir:
    # The old files are read into memory first. If replacing the second file fails after the first
    # was replaced, the first gets its old contents back (or is removed, if there was none), so both
    # files end up new or as they were. Only a failure inside that putting-back is left to the user,
    # and the message says exactly which file and what is left over.
    path = {name: os.path.join(args.out_dir, name) for name in (AI_FILE, GSC_FILE)}
    old = {}
    for name in path:
        try:
            if os.path.isfile(path[name]):
                with open(path[name], 'rb') as f:
                    old[name] = f.read()
            else:
                old[name] = None
        except OSError as e:
            stop(f'cannot read {path[name]} ({e.strerror})')
    replaced = []
    try:
        for name, text in ((AI_FILE, ai_text), (GSC_FILE, gsc_text)):
            with open(path[name] + '.tmp', 'w', newline='') as f:
                f.write(text)
        for name in (AI_FILE, GSC_FILE):
            os.replace(path[name] + '.tmp', path[name])
            replaced.append(name)
    except OSError as e:
        problems, kept = [], set()
        for name in replaced:
            if old[name] is None:
                try:
                    os.remove(path[name])
                except OSError as again:
                    problems.append(f'{path[name]} is new and could not be removed ({again.strerror})')
                continue
            restore = f'{path[name]}.restore-{os.getpid()}'
            # Written beside the file, then renamed over it: a failure here never leaves half a file.
            try:
                with open(restore, 'wb') as f:
                    f.write(old[name])
            except OSError as again:
                note = f'{path[name]} could not be put back ({again.strerror})'
                keep = f'{path[name]}.old-{os.getpid()}'
                try:
                    with open(keep, 'wb') as f:
                        f.write(old[name])
                    kept.add(keep)
                    note += f'; its old contents are in {keep}'
                except OSError:
                    note += '; its old contents could not be saved'
                problems.append(note)
                continue
            try:
                os.replace(restore, path[name])
            except OSError as again:
                # The old contents are complete in the .restore file: keep it and say so.
                kept.add(restore)
                problems.append(f'{path[name]} could not be put back ({again.strerror}); its old contents are in {restore}')
        for name in path:
            for leftover in (path[name] + '.tmp', f'{path[name]}.restore-{os.getpid()}'):
                if leftover in kept:
                    continue
                try:
                    if os.path.isfile(leftover):
                        os.remove(leftover)
                except OSError:
                    problems.append(f'{leftover} is left over')
        if problems:
            sys.exit(f'export-own-site: cannot write to {args.out_dir} ({e.strerror}); ' + '; '.join(problems))
        stop(f'cannot write to {args.out_dir} ({e.strerror})')
else:
    sys.stdout.write(f'--- {AI_FILE}\n{ai_text}--- {GSC_FILE}\n{gsc_text}')
print(f'{ai_rows} AI check rows and {gsc_rows} Search Console days for {SITE}', file=sys.stderr)
