# Plan: the case study says when it is due, and its tests card finds its own entry, 2026-11-03

Page: https://croftweaver.com/case-study (`src/data/case-study.ts`, data written by
`scripts/export-own-site.py`). Written against `main` at 0973ed8 plus the unmerged branch
`content/case-study-2026-11-02` (37ca9a4..1fbfbae), which adds the week to 2 November. This work
starts after that branch is merged, because both touch `src/data/case-study.ts`.

## What and why

1. **An upkeep check** (`scripts/case-study-audit.py`, new) and a **weekly reminder** that runs it.
   The page's weekly upkeep lapsed for two weeks without anyone noticing: the exported data stopped
   at 19 October, sixteen merged pull requests had no entry, and a one-off reminder for 28 October
   ran only on 2 November. Nothing today says the page is due; the only guard
   (`case-study.ts`: `LOG.some((e) => e.date > UPDATED.iso)`) refuses an entry dated after UPDATED.
2. **The tests card picks its entry itself.** Today it cites one log entry by date and exact title,
   moved by hand each time a newer change states a test count. A missed move leaves the card on an
   old count with no error.

Out of scope: the indexing and Bing cards (they cite observations whose wording is chosen by hand);
writing log entries by code; the toolkit and genai-wednesday.de pull requests (most of them are not
about croftweaver.com, so they stay a judgment made by hand; the check says so in its output).

## Scenarios (given / when / then)

- **A1, data out of date.** Given the weekly AI check ran on Monday 9 November and `public/data/` on
  `origin/main` still holds the export of 2 November, when the check runs, then it says the AI check
  file differs from a fresh export (with both row counts as a hint) and gives the newest AI check
  day, and exits 1.
- **A2, no weekly run.** Given the newest croftweaver.com run in the AI check history is 2 November
  and the check runs at the Monday reminder on 9 November, then it says no weekly AI check ran in the
  last 6 days, and exits 1. One missed Monday run is enough to flag.
- **A3, unlogged pull requests.** Given UPDATED is 2 November and croftweaver-site pull request 165
  (merged 3 November) is not in LOG, when the check runs, then it lists it with merge day and title
  under "merged since the last update, not in the log: log it or leave it out", and exits 1. "Since"
  means a merge day (UTC, as GitHub gives it) after UPDATED.
- **A3b, one more look.** Pull requests merged on or after the previous UPDATED and up to and
  including the current one, and not in LOG, are listed under a second heading, "left out at the last update;
  shown once more", and do not change the exit status. The previous UPDATED is the date UPDATED held
  before the last commit that changed its date (a label-only edit does not count). On 3 November, with the branch merged, that is 25 October to
  2 November: 129, 140, 143, 157, 159, 160, 161, 162 and 164. So a pull request left out on purpose never makes
  the check fail after the update that judged it, and one that update missed is still shown, however
  long the gap before it.
- **A4, all clear.** Given both files match a fresh export, the newest run is at most 6 days old and
  no croftweaver-site pull request merged after UPDATED is missing from LOG, then it prints one line
  per check saying so, and exits 0.
- **A5, cannot check.** Given `gh` is missing or not signed in, or its answer reaches the limit the
  check asks for (200, so more may exist), or `git fetch` fails, or the export stops, or the log
  module cannot be loaded, or UPDATED or the previous UPDATED cannot be read, then it says which and
  exits 2. It never prints "all clear" for a check it could not run. Every check still prints
  its block; 2 wins over 1, and 1 over 0.
- **A6, the reminder.** Mondays 11:30 local time (the Mac is in Berlin), a scheduled task runs the
  check read-only and tells Daniel in plain words what is due and the one thing to say ("update the
  case study"). What the app does when it is closed at 11:30 is not checked here. A missed reminder
  loses nothing: the next check still lists everything merged since UPDATED. The harness's
  `scheduler_watch` already reports a registered task that did not run. A6 is done only when both
  are seen: (1) the scheduler lists the task with cron `30 11 * * 1`, its `jitterSeconds`, and a
  `nextRunAt` of 11:30 Berlin time plus at most that jitter. The scheduler reads cron in the Mac's
  local time, summer time included: the Crashlytics task's `0 14 * * 1,4` started at 12:02 UTC on
  22 October (14:02 summer time) and at 13:02 UTC on 2 November (14:02 winter time); (2) on the
  first Monday by whose 11:30 both the check's merge and the task's registration have happened, the
  run list shows a run the task started itself, within 30 minutes after the listed `nextRunAt`,
  that reported rather than failed.
  Until then its status row says "not yet seen running on its own"; if that Monday passes without
  one, Daniel is told.
- **C1, newest count wins.** Given the newest croftweaver-site change whose checks start with
  "N tests;" is #155 (29 October, 499 tests), then the card shows 499, #155, 29 October. Today's page
  does not change.
- **C2, same day.** "Newer" means a later date, or the same date and later in LOG. Entries have been
  added in merge order (true for #102/#105, #147/#146 and #155/#156, checked against GitHub), and
  the comment above LOG says so. If the order on one day is wrong, the card shows the other entry of
  that day, which may give a different count.
- **C3, other repositories.** A genai-wednesday.de or toolkit change with a test count never becomes
  the card's entry: the card says "Tests that ran on a change to this site".
- **C4, a count written another way.** Given a croftweaver-site change newer than the chosen one has
  "N tests" in its checks but not as the leading "N tests;" (for example "458 tests and a check of …"
  or "499 tests, no flakes"), then the build fails and names the entry. Other wordings ("499 passing
  tests", "75 SEO tests") are not caught; a comment on the `checks` field says a suite count goes
  first, as "N tests;".
- **C5, none.** Given no croftweaver-site change states a count, the build fails and says so.

## How

**Log module** (`src/data/case-study-log.ts`, new): the `Change`, `Observation` and `Entry` types,
`PR_REPOS`, `PRIVATE_REPOS` and `LOG` move here unchanged, and the new `newestTestCount(log)` (below)
lives here too. The module imports nothing, so a Playwright spec can import them (`case-study.ts` imports `?raw` CSVs, which
Playwright's loader cannot read). `case-study.ts` imports and re-exports them, so no other file
changes its imports; its checks and CARDS stay where they are.

**Card:** `newestTestCount(log)` keeps croftweaver-site changes whose checks match the card's
existing `/^(\d+) tests;/` and returns the newest (C2's order). It throws for C4 when a newer
croftweaver-site change matches `/\b\d+ tests\b/` but not `/^(\d+) tests;/`, and for C5. It replaces
`cited('<date>', '<title>')` for the tests card; `CARDS.tests` and `TESTS_PR` keep their shape, so
`case-study.astro` does not change.

**Check** (`scripts/case-study-audit.py`, Python 3 standard library, like the export):
- `--ref` (default `origin/main`, after `git fetch origin main`; `--no-fetch` skips the fetch). A
  session updating the page on its branch runs `--ref HEAD`. The log file, both `public/data/`
  files and the exporter itself are read from that one commit with `git show`, never from the
  working tree, because the site's one folder is often on another branch.
- Data: the ref's `export-own-site.py` is written to a temp dir and run there with `--out-dir`
  (the existing, tested write path). The check takes `--history` and `--google-data` and passes them
  on; their defaults are the exporter's. The exporter reads only its two inputs outside the repository
  (`--history`, `--google-data`) and the standard library; two runs on the same inputs gave
  identical files (checked 3 November). Each file is compared byte for byte with the ref's copy.
  Newest run day: the largest `date` in the fresh AI check file, which holds croftweaver.com rows only
  (the exporter skips every other site, `export-own-site.py` line 107).
- UPDATED: one literal regex over `case-study.ts` at the ref, reading the `iso` date. The previous
  UPDATED: walk `git log --first-parent <ref> -- src/data/case-study.ts` newest first, and take the
  first commit whose `iso` date differs from its first parent's; the parent's date is the previous
  UPDATED. First-parent walking sees a change that arrived by a merge (reproduced on 3 November: on
  `main`, the first-parent commits that touch the file are merges, and the merge of #143 is the
  first whose date differs from its parent's), and comparing dates skips a label-only edit. On `main` at 0973ed8 (before the branch is merged) this gives 24 October, through
  the merge of #143; on the branch's head 1fbfbae it gives 25 October, through 37ca9a4, and skips
  84fb2f9, which kept the date. No match is A5.
- Pull requests: `gh pr list -R karero/croftweaver-site --state merged --search "merged:>=<since>"
  --limit 200 --json number,mergedAt,title`, with `<since>` the previous UPDATED itself, so a pull
  request merged later on that day is still seen (A3b includes that day). Run on 3 November with
  25 October, the query returned the 24 pull requests merged since. Logged ones are the
  `pr` fields of LOG's changes: the ref's `case-study-log.ts` is written to the temp dir and loaded
  with Node (which strips its types; checked with Node 26.13), and the script reads the list Node
  prints. An address in a comment or in an observation's text never counts.
- Output: plain sentences, one block per check; exit codes as in A5.
- The `case-study.ts` header comment's upkeep line names the script.

**Reminder:** a recurring scheduled task `croftweaver-case-study-weekly`, Mondays 11:30 Berlin time,
as cron `30 11 * * 1` in the Mac's local time (the weekly
AI job runs at 09:45). It runs the check and reports; it changes no working-tree file, local
branch or page. Its `git fetch` writes only Git's own records (`origin/main`, `FETCH_HEAD`). It replaces the one-off
reminders; `croftweaver-case-study-week-2` has fired and is left as it is. This is a harness change:
a row in `~/.claude/HARNESS.md` and an entry in `~/.claude/HARNESS-CHANGES.md`.

## How it is tested

- `tests/check_case_study_audit.sh` (new, wired into CI next to `check_export_own_site.sh`): drives
  the real script in a throwaway git repository with synthetic history and Google files, always
  with `--no-fetch` and a local `--ref` (except the one fetch scenario below), and a fake `gh` first on `PATH` that prints a committed
  capture. One scenario each for A1, A2, A3, A3b, A4, and each A5 cause, with expected output
  written by hand. A branch whose working-tree exporter differs from the ref's must still pass A4.
  An address in a trailing comment, a commented-out entry and an observation's text must not count
  as logged. A change of UPDATED that arrives by a merge, and a label-only edit after an update, must
  give the right previous UPDATED. An unlogged pull request merged on the previous UPDATED's own day
  must be fetched and listed under A3b. One scenario runs without `--no-fetch` in a repository with no
  `origin` remote, and must exit 2 with the fetch named and no all-clear.
- The capture: `tests/fixtures/gh-2.103.3-pr-list-merged.json`, a real `gh pr list` answer for this
  repository, entries cut, nothing edited.
- `tests/case-study-card.spec.ts` (new): C1 to C5 on hand-built logs passed to `newestTestCount`, and
  one check on the served production build that the tests row on /case-study shows the figure,
  pull request and day of the entry `newestTestCount(LOG)` returns.
- Mutations, before review (`mutation-check`): the tie rule reversed, the repository filter dropped,
  C4's guard removed, the 6-day limit removed, A3b's lower bound taken from UPDATED instead of the
  previous UPDATED, A3b counted as due, logged numbers read from the file's text instead of LOG.
  Each must fail a test.
- The full suite and `astro check` before round 1 and after the last edit.
- A6: `scheduler_watch` lists the task with its schedule, one manual run reports, and the automatic
  run on A6's Monday is looked for in the task's run list.

## Cost

PLAN gate at Normal, Codex and GLM 5.3: round 1 took 76.7k and 16.1k tokens, round 2 56.3k and
26.8k; 1 more round expected. No red team: the work reads only, writes only temp files, and touches no box, user data,
login, money, deletion or schema. The build after Daniel's go: one pull request on croftweaver-site,
about 300 lines with tests, then the DIFF gate.
