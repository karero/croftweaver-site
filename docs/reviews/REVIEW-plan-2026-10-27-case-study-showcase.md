# PLAN review — case study opens with the site itself (phase 1)

Plan: `docs/reviews/PLAN-2026-10-27-case-study-showcase.md`.
Gate: independent-review, PLAN, depth Normal (a plan is never Light, owner's rule; the brief names
Codex plus GLM 5.3). No red team: no box, user data, login, money, deletion or schema.

| Round | Seats | Findings | Disposition |
|---|---|---|---|
| 1 | Codex; fresh-eyes (Sonnet). Codex alone of the pair: melious out of balance ("Available: 0"), owner's rule 2026-10-27 | 3 BUG, 8 RISK, 5 NIT | all fixed in the plan, below |
| 2 (verify) | Codex alone: melious out of balance | 1 BUG, 1 RISK | both fixed, below |
| 3 (verify) | Codex alone: melious out of balance | 1 BUG | cut, below |
| 4 (verify, earned by log-note-copy, cut) | Codex, GLM 5.3 | 1 BUG, 2 RISK, 3 NIT, all wording in the plan's own reasons | fixed, then wording pass |

Round 1:
- R1-B1 BUG (Codex), "31 entries": the plan said main has 33. Wrong: the count included the two type
  lines. main has 31 (22 changes, 9 observations), as live. Fixed.
- R1-B2 BUG (Codex), spec title length is 60, not 59. Fixed.
- R1-B3 BUG (Codex), "as on the home page": the home page's positioning rule has no H1 clause. Analogy removed.
- R1-R1 RISK (Codex, fresh-eyes), the snapshot check matched bare numbers ("19 of 22" passes). Fixed:
  each card stores the exact phrase of its log entry; the check is described as traceability only.
- R1-R2 RISK (Codex), card dates not bound: AI card date must be the newest CSV date; technical card's
  date must equal its pull request's log date. Fixed in test 2.
- R1-R3 RISK (Codex), image markup passes with a missing file. Fixed: test 1 requires both images loaded
  with natural width above 0.
- R1-R4 RISK (Codex), matching build.txt reads do not prove the home page's build. Fixed: caption gives
  the date only; SHA in the PR as context.
- R1-R5 RISK (fresh-eyes), new evidence vs "three sources" comments and the 2026-10-21 decision. Fixed:
  cards restate log entries, comments updated, the screenshot named for Daniel's go.
- R1-R6 RISK (fresh-eyes), "log unchanged" was called a guard. Fixed: stated as the DIFF review's check.
- R1-R7 RISK (fresh-eyes), caption-date test tautological. Fixed: the test lists the image folder itself.
- R1-N1..N5 NIT (fresh-eyes): `h2` on `#summary`; lead text written into the plan; aside says "the log";
  image attributes and size caps; POSITIONING.md row moved to phase 2. All fixed.

Round 2:
- R2-B1 BUG (Codex), the plan said the pull-request rule "stays in the log's own note"; that note only
  explains merge and publish dates. Fixed: the note gains that sentence, and "Not touched" says so.
- R2-R1 RISK (Codex), the image-folder test cannot prove when the pixels were captured. Fixed: claim
  narrowed to caption/file-name agreement; capture date recorded in the PR.

Round 3:
- R3-B1 BUG (Codex), the new log-note sentence said every change names its checks; three changes have
  none recorded and point to the pull request. Patched first; the same kind (log-note copy) earned round 2,
  so the fix became a cut: no sentence is added to the log's note, which stays as it is.

Round 4 (both seats):
- R4-B1 BUG (Codex) and R4-R2 RISK (GLM), the cut's reason said "each entry already shows its own
  pull request and checks": false (observations have none; three changes point to the PR). Reason
  deleted. Plan prose only; the build is unchanged, so no fifth round.
- R4-R1 RISK (GLM), the edited aside was not located. Fixed: it is the hero's `<p class="aside">`,
  not the log's note in `#log`.
- R4-N1 NIT (GLM), aside date hand-typed. Fixed: rendered from `UPDATED` (as today).
- R4-N2 NIT (GLM), "what it is out of" claimed for every card. Narrowed: where a figure has a whole.
- R4-N3 NIT (GLM), "not moved anywhere" vs the new lead's clause. Reworded.

Wording pass (both seats, not a round):
- WP-B1 BUG (Codex), the planned comment edit left "Three sources and no others" and the test's
  "shows only what its three sources say" false beside a screenshot. Fixed: both narrowed to figures,
  the screenshot named as separate evidence. Comment text only.
- WP-R1..R4 RISK (GLM), each from a file it could not open; refuted by reading them:
  positioning accepts the H1 or the first `<p>` in `<main>` (`tests/positioning.spec.ts`, `norm` and
  the h1 check); the existing case-study test pins no hero copy (`tests/a11y.spec.ts`, case-study
  test: only `#search`, `#ai`, `#log` and "cited"); the aside is in `section.hero`, the note in `#log`
  (`src/pages/case-study.astro`); `STACKED` counts text tables only (`tests/navigation.spec.ts`).
- WP-N1 NIT (GLM), 75 k + 97 k is not 171 k: refuted, the exact parts are 74,624 + 96,922 = 171,546.
- WP-N2 NIT (GLM), positioning test table-driven? Refuted: it is a map in the spec file, which has the
  `/case-study` row; POSITIONING.md's table is documentation.
- WP-N3 NIT (GLM), "a `<time>`" vs a period. Fixed: "at least one".

Verdict: gate closed, no BUG open. Daniel's go followed (relayed from the feature-planning session,
then "publish it" in this session).

Tokens: round 1 Codex 74,624 (294 s), fresh-eyes 96,922 (267 s); melious failed in 3 s. Round 2 Codex 65,310 (222 s). Round 3 Codex 34,854 (114 s). Round 4 Codex 38,291 (66 s), GLM 5.3 25,870 (382 s). Wording pass Codex 59,921 (202 s), GLM 5.3 27,911 (414 s). Gate total 423,703 logged.
