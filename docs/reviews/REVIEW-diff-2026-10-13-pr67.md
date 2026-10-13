# DIFF review — karero/croftweaver-site#67 — Tests: the suites of toolkit release 0.31 (13 suites, with the placeholders test)

Base `0d77ac2` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer · verdict: **no BUG open** — 1 BUG found by the new tests and fixed in this change; 1 RISK and 2 NITs left, with the reason in the table. The RISK is a choice the owner should confirm.

This review was made by the session that wrote the change. It is not an independent read. The change touches `tests/` and one component, so an outside reviewer before the merge is worth asking for; the owner decides.

Files in the change: `tests/` (`placeholders.spec.ts` new; `_helpers.ts`, `email.spec.ts`, `seo.spec.ts`, `tone.spec.ts`, `check_ship_push.sh`, `TESTS-VERSION`), `src/components/EmailLink.astro`, `src/data/suites.ts`, `src/pages/checks.astro`, `public/croftweaver-why.pdf`, `scripts/deck.lock.json`, `POSITIONING.md`, `STORY.md`, `CONTENT_GUIDE.md`, `README.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `0d77ac2`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 1 / 1 / 2 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| B1 | BUG | the new test in `email.spec.ts` | an address with a `%` in it reached the mail program changed: `a%41@…` opened a mail to `aA@…` | fixed in this change — locally_verified | `EmailLink.astro` escapes `%` as `%25`, the one line the toolkit's component has; the test passes. No address on this site holds a `%`, so no visitor met it |
| B2 | RISK | pass 2 | `tests/TESTS-VERSION` now names release 0.31, but that stamp is also the baseline the toolkit's `scripts/whats-new.sh` uses for template files outside `tests/`, which this change does not bring up to date. The report will no longer list them | left, recorded; owner to confirm | README status row 11 names every such file and the command that shows the changes. The other choice was to leave the stamp at `8ea17a7`: then `/checks` would say the suites are the template of 26 September while listing a suite that did not exist then |
| B3 | NIT | pass 2 | `tests/check_analytics_gate.sh` is this site's own copy and was not compared line by line with the toolkit's at release 0.31 | left | its header says a refresh must keep it; it is in README row 11 |
| B4 | NIT | pass 1 | the toolkit's `EmailLink` also gained a `lang` property; it is not taken over | left | this site has one language, and the new test that the hint speaks the page's language passes without it |

## What the change does

- Merges the toolkit template's test changes from commit `8ea17a7` (the copy of 26 September 2026) to release 0.31 (`0597a28`) into this site's copies, three ways (template then, template now, this site's file). `_helpers.ts`, `seo.spec.ts` and `check_ship_push.sh` merged without a conflict. `email.spec.ts` and `tone.spec.ts` each had additions on both sides at the same place; both sides are kept. Nothing was removed from a test, and no test is skipped.
- `tone.spec.ts`: the rules moved to `_helpers.ts` (`toneViolations`) in the toolkit. This site's own test of the slide deck now calls that function with `en`, which applies the same universal and English rules it applied before.
- Adds `tests/placeholders.spec.ts` as release 0.31 ships it. Its list `UNFILLED_UNTIL_LAUNCH` is emptied, as its first run asked: `/privacy` and the manifest are clean, and this site has no `/impressum`. So every page is checked from now on.
- `src/data/suites.ts` describes the new suite, so the count on the pages becomes 13. `/checks`, `POSITIONING.md`, `STORY.md`, `CONTENT_GUIDE.md` and the README follow. The slide deck is rebuilt (`npm run deck`), because it prints the count.

## Checked beyond the findings

- Toolkit tag `v0.31` is commit `0597a282412eeae9461e7e95efb009ca218a8457`; its `tests/` holds 13 spec files, and tag `v0.29` has no `placeholders.spec.ts`.
- What `src/data/suites.ts` says the new suite reads and does not read matches the comment at the top of `placeholders.spec.ts`.
- `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: clean. `npx playwright test`: 259 passed, none skipped (224 before).
- The first run of the new suite found no leftover on any page.

## Not checked

- `bash tests/check_analytics_gate.sh` was not run locally (four builds); CI runs it.
- The rebuilt PDF was not opened page by page; the test that compares it with `/why` and `/checks` passes.
- The pages in a browser other than Chromium.
