# PLAN gate: case study upkeep check and tests card, 2026-11-03

Plan: `docs/reviews/PLAN-2026-11-03-case-study-upkeep.md`. Depth Normal. Seats: Codex and GLM 5.3 on
melious, both counted in every run. Gate 20261103T200451Z-38532: 3 rounds and 2 wording passes,
10 seat runs, 408,686 tokens logged.

| Run | Findings | BUGs |
|---|---|---|
| Round 1 | 15 (1 BUG, 8 RISK, 6 NIT) | Playwright cannot load `case-study.ts` (its `?raw` CSV imports) |
| Round 2 | 11 (6 RISK, 5 NIT) | none |
| Round 3 | 10 (6 RISK, 4 NIT) | none |
| Wording pass 1 (on 8cbd586..) | 10 (5 BUG, 3 RISK, 2 NIT) | contradictions added by the round 3 fixes |
| Wording pass 2 (on the pass-1 fixes) | 6 (1 BUG, 3 RISK, 2 NIT) | A3b's inclusive day had no test |

All BUGs fixed. Main changes from the findings: the log moves to its own module; the exporter, data
and log are read from one commit; logged pull requests are read by loading LOG with Node, not from
the file's text; A3b replaces an exclusion list and starts at the previous UPDATED, found by a
first-parent walk that compares dates; A6 needs the listed trigger and one run it started itself;
the C4 guarantee is narrowed to the wordings it catches.

Not adopted:
- An explicit suite-count field on log entries (round 1): every entry's `checks` text would change;
  the claim was narrowed instead.
- An exclusion list of left-out pull requests (round 1, both seats): A3b lists them without failing
  the check, so a left-out pull request needs no list.
- A build failure when the chosen day has two different counts (round 2 NIT, raised again as a
  follow-up): it fails on correct data; 24 October has 420, 421 and 439 in merge order.

Checked by running, 3 November: the exporter twice on the same inputs gives identical files; the
`gh pr list` query returns merged pull requests by merge day (24 since 25 October); Node 26.13 loads
a typed `.ts` log module and ignores commented-out entries; the first-parent walk gives 24 October
on `main` and 25 October on the case study branch; the scheduler fires cron in local time across
the 25 October clock change (the Crashlytics task's runs on 22 October and 2 November).

The fixes for wording pass 2 (evidence lines, one test line, the reminder's time zone) were not
reviewed again; the DIFF gate on the build reads the whole change.
