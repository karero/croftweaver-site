# Review trail: diff, one test port per checkout (this site's copy)

Change: the toolkit's `playwright.config.ts`, `scripts/build-marker.mjs` and
`tests/served-build.spec.ts` (identical to the toolkit's, reviewed there as karero/croftweaver#424),
its comment fixes in this site's `ship.sh` and test scripts, and three site-only parts: the new
suite's card in `src/data/suites.ts`, the decks remade with slide 6's lists set tighter, and an
`added:` line in `tests/TESTS-VERSION` that /checks shows. DIFF gate, Normal depth
(`build-marker.mjs` runs in every production build). Seat: Codex (`--seat codex`, effort high);
GLM 5.3 on melious failed for balance ("Available: 0") on round 1, so the gate ran on Codex alone.

| Round | Seats | Findings | Time, tokens |
|-------|-------|----------|--------------|
| 1 | Codex | 1 RISK | Codex 399 s, 90,735 |
| 2 | Codex (`--verify`) | 1 BUG; S1-1's page fix confirmed | Codex 253 s, 70,191 |

## Round 1

Codex also checked, and found right: the port (4982 from the real config), Playwright's race
and env merge in its installed code, the spec's assertions (run in memory: matching ids pass;
wrong, missing and empty ids fail), the marker's two branches, the one-to-one suite list, and
both decks (`build-deck.mjs --check` passed; slide 6 shows every name; only why-deck pages 6
and 9 changed: 6 is the suite list, 9 carries the suite count).

| Id | Sev | Finding | Disposition | Evidence |
|----|-----|---------|-------------|----------|
| S1-1 | RISK | /checks says every suite is the template's at a1f3089, copied 25 October; the new suite is not | fixed: `tests/TESTS-VERSION` gets `added: served-build.spec.ts 3a0b7e14… 2026-10-26` (the toolkit commit that added the spec; the site's copy is identical and the spec is unchanged since on the toolkit branch); `suites.ts` reads such lines and /checks names each one's commit and date; a malformed line stops the build | built page: "The Own build suite comes from commit 3a0b7e1, copied on 26 October 2026, ahead of a template release." A line `added: nonsense.spec.ts abc 2026-02-31` stopped the build with its message |

## Tests on the built change

Plan tests 1, 2, 3, 5 and 6 ran on this branch; outputs are in the toolkit's trail
(`docs/reviews/REVIEW-diff-2026-10-26-test-port-per-checkout.md` in karero/croftweaver). After
the provenance fix the full suite ran again: 469 passed, 3 timed out on /security and /proof
while the machine's load average was over 160; those 3 passed on rerun (`--last-failed`).

## Round 2

Codex confirmed S1-1's page fix (it rendered the note with zero, one and two lines) and that the
date check still guards the base stamp. Round 3 checks S2-1.

| Id | Sev | Finding | Disposition | Evidence |
|----|-----|---------|-------------|----------|
| S2-1 | BUG | "A malformed line stops the build" was wrong: an indented `added:` line was ignored, and a fourth field was accepted | fixed: lines are matched with any leading blanks and must have exactly three fields; the message says so | builds with `  added: served-build.spec.ts abc 2026-10-26` and with a fourth field both stopped with the message; the real stamp builds. `whats-new.sh --stamp-tests` rewrites the file with two lines (`write_tests_stamp`, lines 107–110), so it drops an `added:` line, as the README says |
