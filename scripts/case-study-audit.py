#!/usr/bin/env python3
"""Say what the case study page (https://croftweaver.com/case-study) needs this week.

    python3 scripts/case-study-audit.py [--ref origin/main] [--no-fetch]

Run it in the site's repository. It writes nothing there: every file comes from the one commit --ref
names (after `git fetch origin main`, unless --no-fetch), never from the working tree, because the
site's folder is often on another branch. A session that updates the page on its branch runs it with
--ref HEAD. Four checks, one block each:
  AI check data, Search Console data   the two files in public/data/ against a fresh run of that
                                       commit's scripts/export-own-site.py, byte for byte
  Weekly AI check                      the newest croftweaver.com run in the fresh AI check file is
                                       at most 6 days old
  Pull requests                        croftweaver-site pull requests merged after UPDATED
                                       (src/data/case-study.ts) that LOG (src/data/case-study-log.ts)
                                       does not hold; those from the previous UPDATED to UPDATED are
                                       shown once more and never make the check fail
Exit 0: all clear. 1: something is due. 2: a check could not run (it is never reported as clear).
2 wins over 1, and 1 over 0. --history and --google-data are passed on to the exporter.
Needs git, gh (signed in) and Node 22.18 or newer (it loads LOG, a TypeScript file).
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import tempfile

REPO = 'karero/croftweaver-site'
LIMIT = 200
MAX_AGE_DAYS = 6
AI_FILE = 'croftweaver-com-ai-check.csv'
GSC_FILE = 'croftweaver-com-search-console.csv'
UPDATED_RE = re.compile(r"^export const UPDATED = \{ iso: '(\d{4}-\d{2}-\d{2})'", re.M)
PR_URL_RE = re.compile(r'^https://github\.com/karero/croftweaver-site/pull/(\d+)$')
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
          'October', 'November', 'December']
# Loads the log module and prints the pull request address of every change, as a JSON list.
NODE_PRINT_LOG = (
    "import { pathToFileURL } from 'node:url';"
    "const m = await import(pathToFileURL(process.argv[1]).href);"
    "console.log(JSON.stringify(m.LOG.filter((e) => e.kind === 'change').map((e) => e.pr)));"
)
NAMES = ['AI check data', 'Search Console data', 'Weekly AI check', 'Pull requests']


class CannotCheck(Exception):
    pass


def day_label(iso):
    d = datetime.date.fromisoformat(iso)
    return f'{d.day} {MONTHS[d.month - 1]} {d.year}'


def ago(days):
    return 'today' if days == 0 else f'{days} day{"" if days == 1 else "s"} ago'


def first_line(raw):
    lines = [x.strip() for x in raw.decode(errors='replace').strip().splitlines() if x.strip()]
    return lines[0] if lines else 'no message'


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True)
    except FileNotFoundError:
        raise CannotCheck(f'{cmd[0]} is not installed')


def git(*args):
    p = run(['git', *args])
    if p.returncode:
        raise CannotCheck(f'git {" ".join(args)} failed ({first_line(p.stderr)})')
    return p.stdout


def updated_at(ref):
    """The iso date UPDATED holds in src/data/case-study.ts at `ref`, or None."""
    p = run(['git', 'show', f'{ref}:src/data/case-study.ts'])
    m = None if p.returncode else UPDATED_RE.search(p.stdout.decode())
    return m.group(1) if m else None


def previous_updated(ref):
    """The date UPDATED held before the last commit that changed it (first-parent walk, newest first)."""
    for commit in git('log', '--first-parent', '--format=%H', ref, '--', 'src/data/case-study.ts').decode().split():
        now, before = updated_at(commit), updated_at(f'{commit}^')
        if now is None or before is None:
            raise CannotCheck(f'cannot read UPDATED in src/data/case-study.ts at {commit[:7]} or at its first parent')
        if now != before:
            return before
    raise CannotCheck('cannot find an earlier UPDATED in the history of src/data/case-study.ts')


def fresh_export(ref, tmp, passed_on):
    """Run the ref's own exporter into a temp folder; return {file name: bytes}."""
    exporter = os.path.join(tmp, 'export-own-site.py')
    with open(exporter, 'wb') as f:
        f.write(git('show', f'{ref}:scripts/export-own-site.py'))
    out = os.path.join(tmp, 'out')
    os.mkdir(out)
    p = run([sys.executable, exporter, '--out-dir', out, *passed_on])
    if p.returncode:
        raise CannotCheck('the export stopped: ' + first_line(p.stderr))
    result = {}
    for name in (AI_FILE, GSC_FILE):
        with open(os.path.join(out, name), 'rb') as f:
            result[name] = f.read()
    return result


def rows(data):
    return max(len(data.decode().splitlines()) - 1, 0)


def check_data(ref, fresh, name, label, unit):
    committed = git('show', f'{ref}:public/data/{name}')
    if committed == fresh[name]:
        return False, f'{label}: matches a fresh export ({rows(fresh[name])} {unit}).'
    return True, (f'{label}: public/data/{name} at {ref} differs from a fresh export '
                  f'(committed {rows(committed)} {unit}, fresh {rows(fresh[name])} {unit}).')


def logged_numbers(ref, tmp):
    """Numbers of this repository's pull requests that LOG holds, read by loading the log module with Node."""
    folder = os.path.join(tmp, 'log')
    os.mkdir(folder)
    with open(os.path.join(folder, 'package.json'), 'w') as f:
        f.write('{"type": "module"}\n')
    module = os.path.join(folder, 'case-study-log.ts')
    with open(module, 'wb') as f:
        f.write(git('show', f'{ref}:src/data/case-study-log.ts'))
    p = run(['node', '--input-type=module', '-e', NODE_PRINT_LOG, module])
    if p.returncode:
        raise CannotCheck('the log module cannot be loaded: ' + first_line(p.stderr))
    try:
        urls = json.loads(p.stdout.decode())
        assert isinstance(urls, list) and all(isinstance(u, str) for u in urls)
    except (ValueError, AssertionError):
        raise CannotCheck('the log module did not print a list of pull request addresses')
    return {int(m.group(1)) for m in map(PR_URL_RE.match, urls) if m}


def merged_since(day):
    p = run(['gh', 'pr', 'list', '-R', REPO, '--state', 'merged', '--search', f'merged:>={day}',
             '--limit', str(LIMIT), '--json', 'number,mergedAt,title'])
    if p.returncode:
        raise CannotCheck('gh failed (' + first_line(p.stderr) + ')')
    try:
        prs = json.loads(p.stdout.decode())
        assert isinstance(prs, list)
        for x in prs:
            assert isinstance(x['number'], int) and isinstance(x['mergedAt'], str) and isinstance(x['title'], str)
            datetime.date.fromisoformat(x['mergedAt'][:10])
    except (ValueError, KeyError, TypeError, AssertionError):
        raise CannotCheck('gh did not answer with a list of pull requests (number, mergedAt, title)')
    if len(prs) >= LIMIT:
        raise CannotCheck(f'gh returned {len(prs)} pull requests, the limit asked for; more may exist')
    return prs


def check_pulls(ref, tmp):
    updated = updated_at(ref)
    if updated is None:
        raise CannotCheck(f'cannot read UPDATED in src/data/case-study.ts at {ref}')
    previous = previous_updated(ref)
    logged = logged_numbers(ref, tmp)
    prs = sorted(merged_since(previous), key=lambda x: (x['mergedAt'], x['number']))
    missing = [x for x in prs if x['number'] not in logged]

    def listed(items):
        return [f'  {REPO}#{x["number"]}, merged {x["mergedAt"][:10]}: {" ".join(x["title"].split())}' for x in items]

    due = [x for x in missing if x['mergedAt'][:10] > updated]
    again = [x for x in missing if x['mergedAt'][:10] <= updated]
    if due:
        lines = ['Merged since the last update, not in the log: log it or leave it out.', *listed(due)]
    else:
        lines = [f'{NAMES[3]}: every croftweaver-site pull request merged after {day_label(updated)} is in the log.']
    if again:
        lines += [f'Left out at the last update; shown once more (merged from {day_label(previous)} to {day_label(updated)}; '
                  'this never makes the check fail):', *listed(again)]
    return bool(due), lines


def main():
    parser = argparse.ArgumentParser(description='Say what the case study page needs this week.')
    parser.add_argument('--ref', default='origin/main', help='the commit to read everything from (default: %(default)s)')
    parser.add_argument('--no-fetch', action='store_true', help='skip `git fetch origin main`')
    parser.add_argument('--history', help='the AI check history, passed on to scripts/export-own-site.py')
    parser.add_argument('--google-data', help='the report job cache, passed on to scripts/export-own-site.py')
    parser.add_argument('--today', help=argparse.SUPPRESS)
    args = parser.parse_args()
    today = datetime.date.fromisoformat(args.today) if args.today else datetime.date.today()
    passed_on = [x for flag, value in (('--history', args.history), ('--google-data', args.google_data)) if value for x in (flag, value)]

    blocks = []  # (status, lines): status is 'ok', 'due' or 'error'
    try:
        os.chdir(git('rev-parse', '--show-toplevel').decode().strip())
        if not args.no_fetch:
            git('fetch', 'origin', 'main')
        git('rev-parse', '--verify', f'{args.ref}^{{commit}}')
    except CannotCheck as e:
        blocks = [('error', [f'{n}: could not be checked. {e}.']) for n in NAMES]
    else:
        with tempfile.TemporaryDirectory() as tmp:
            try:
                fresh = fresh_export(args.ref, tmp, passed_on)
                days = [line.split(',')[0] for line in fresh[AI_FILE].decode().splitlines()[1:]]
                if not days:
                    raise CannotCheck('the fresh AI check file has no rows')
                newest = max(days)
                for name, label, unit in ((AI_FILE, NAMES[0], 'rows'), (GSC_FILE, NAMES[1], 'days')):
                    due, line = check_data(args.ref, fresh, name, label, unit)
                    if due and name == AI_FILE:
                        line += f' The newest AI check day is {newest}. Run the export and commit the two data files.'
                    blocks.append(('due' if due else 'ok', [line]))
                age = (today - datetime.date.fromisoformat(newest)).days
                if age > MAX_AGE_DAYS:
                    blocks.append(('due', [f'{NAMES[2]}: no weekly AI check ran in the last {MAX_AGE_DAYS} days. '
                                           f'The newest run is {newest}, {ago(age)}.']))
                else:
                    blocks.append(('ok', [f'{NAMES[2]}: the newest run is {newest}, {ago(age)}.']))
            except CannotCheck as e:
                blocks += [('error', [f'{n}: could not be checked. {e}.']) for n in NAMES[len(blocks):3]]
            try:
                due, lines = check_pulls(args.ref, tmp)
                blocks.append(('due' if due else 'ok', lines))
            except CannotCheck as e:
                blocks.append(('error', [f'{NAMES[3]}: could not be checked. {e}.']))

    out = [f'Case study audit of {args.ref}, {today.isoformat()}.']
    for _, lines in blocks:
        out += lines
    out.append('This lists croftweaver-site pull requests only. Changes to the toolkit (karero/croftweaver) and to '
               'genai-wednesday.de are a judgment by hand.')
    statuses = {s for s, _ in blocks}
    code = 2 if 'error' in statuses else 1 if 'due' in statuses else 0
    if code == 0:
        out.append('All clear: nothing is due.')
    elif code == 1:
        out.append('Something is due. Say: update the case study.')
    else:
        out.append('At least one check could not run, so this is not an all-clear.'
                   + (' Something else is due. Say: update the case study.' if 'due' in statuses else ''))
    print('\n'.join(out))
    sys.exit(code)


main()
