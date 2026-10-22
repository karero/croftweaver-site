# DIFF review — PR 112 — Add /ai-website-seo-checklist: eight SEO checks for AI-built sites
Base `7b18dd7` (merge base with origin/main; origin/main later gained two commits touching only `.github/`) · depth: Normal (shipped page copy, test wiring and a build-time guard; nothing in the High row) · verdict: CLEAN · authority used: POST AUTHORITY (atom A: this session created PR 112; `gh pr create` returned its address), WORKTREE-WRITE and BRANCH-COMMIT (this session made the branch `content/ai-website-seo-checklist` and its worktree; the fixes and this trail were committed there at the owner's instruction to fix what the gate finds)

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `555e0e4` | full change (`7b18dd7...555e0e4`) | codex-cli 0.163.0, gpt-6.1-sol, config effort, read-only; GLM 5.3 on melious.ai, HTTP, text only; fresh-eyes Claude Sonnet sub-agent, read-only by instruction, allowed to fetch the six public pages the page cites | codex 543 s / 128,604; GLM 226 s / 21,220; fresh-eyes 733 s / 269,425 | 7 / 3 / 14 |
| 2 | `7b6abaa` | delta `555e0e4..7b6abaa` (`--verify`, `--base`) | Codex medium, read-only; GLM | codex 179 s / 73,614; GLM 315 s / 30,620 | 3 / 2 / 2 (three of the findings re-raise round 1 items) |
| wording pass | `3a16c9e` | delta `7b6abaa..3a16c9e` | Codex medium; GLM (the delta held one data constant and a template expression, so not prose-only: both seats read it) | codex 142 s / 117,468; GLM 158 s / 15,736 | 2 / 0 / 2 |
| confirmation 1 | `4cdca53` | delta `3a16c9e..4cdca53` | Codex medium | 68 s / 32,029 | 1 / 0 / 0 |
| confirmation 2 | `850c215` | delta `4cdca53..850c215` | Codex medium | 89 s / 34,569 | 0 / 0 / 0 |

Tokens logged: Codex 386,284, GLM 67,576, fresh-eyes 269,425; 723,285 in all. Rounds 1 and 2 are the
only rounds; the wording pass and the confirmations are not rounds (SKILL.md step 6). The review
script was run from a detached worktree at the toolkit's `origin/main` (`810a9e07`), because the
primary checkout was 52 commits behind.

| id | Sev | Source | Round | Finding | Status |
|---|---|---|---|---|---|
| D1 | BUG | Codex, fresh-eyes | 1, 2 | links row said relative links are not followed; the anchors suite follows relative section links | fixed: the limit is split by suite; verified in the wording pass |
| D2 | BUG | Codex; fresh-eyes RISK | 1 | robots row: "the allowing rule wins" holds only for equal matches; a longer block is caught | fixed: tie vs longer pattern, six crawlers named; verified in round 2 |
| D3 | BUG | Codex; fresh-eyes RISK | 1, 2 | guard comment (and the page comment) overclaimed what the guards keep true | fixed: both say inventory and provenance, not assertion text; verified |
| D4 | BUG | Codex | 1 | canonical "does not prove" cell denied what the suite proves | fixed; verified in round 2 |
| D5 | BUG/NIT | Codex, GLM | 1 | "Lovable and Bolt named once" while the page names them more than once | fixed in CONTENT_GUIDE.md and the page comment ("one passage"); GLM's round 2 BUG about a third fix site was a mistake in the author's record, corrected (R2-6) |
| D6 | BUG | fresh-eyes | 1 | served-HTML note named the analytics script (a shell script, not a suite) | fixed (a sentence the author had added just before round 1); verified |
| D7 | BUG | fresh-eyes | 1 | "no message about the canonical" while the log names the locator | fixed; verified |
| D8 | RISK | Codex | 1, 2 | the observed failures had no retained run record | fixed: `docs/ai-website-seo-checklist-breaks.md` holds setup, the eighteen lines, outcomes and the rerun steps; Node and Playwright versions stated; the historical observations stay the author's, not reproduced by a reviewer |
| D9 | RISK | GLM | 1 | positioning body clause may not match a heading or capitals | refuted: `positioning.spec.ts` lower-cases and reads `document.body.innerText`; the test for this route passed |
| D10 | RISK | fresh-eyes, Codex | 1, 2 | the second guard keys on `TESTS-VERSION`, blind to spec edits and releases | comment fixed; a `RELEASE.version` guard declined (it would fail every release update; the break rerun at merge is a plan step): **waived by the owner, 2026-10-22** |
| D11 to D17, D19, D20, D22, D23 | NIT | fresh-eyes, GLM | 1, 2 | heading and robots limits, "catches each", the report's own word "ineffective", "advice", lead wording, the unsupported link between the term vibe coded and Lovable or Bolt, `/checks` wording, a focusable table region, Node and `.nvmrc`, "among others" | fixed; verified in round 2 |
| D18 | NIT | fresh-eyes | 1 | `datetime="2026-05-07"` not on the visible page | refuted: the article's own `article:published_time` meta is 2026-05-07 |
| D21 | NIT | fresh-eyes, Codex | 1, 2 | "eight" typed in the share card, llms.txt and CONTENT_GUIDE.md | **waived by the owner, 2026-10-22** (other lines in llms.txt type counts too) |
| D24 | NIT | GLM | 1 | description close to the 160 limit | refuted: 148 characters, inside the site's 140 to 160; the SEO suite fails on any overlong edit |
| W1, W2 | BUG | Codex | wording pass | the breaks file called every cell a message excerpt, and said the tone test rejects arrows | fixed (arrows are not rejected; the column is described row by row); confirmation 2 clean |
| W3 | NIT | GLM | wording pass | "the starter asks for 24" without a unit | fixed ("Node 24") |

Waivers (the owner's sign-off, quoted, 2026-10-22, in chat): "Waive D10 (no RELEASE.version guard) and D21 (eight typed in the card, llms.txt and CONTENT_GUIDE). Record the sign-off in the trail and the PR comment." **D10**: no `RELEASE.version` guard. Reason: such a guard would fail every release update, although the page names the toolkit version the breaks ran on, and the rerun of the breaks at merge is a step in the PR's "Before merge" list; the guard cannot see spec edits, and the data comment says so. **D21**: the number "eight" stays typed in the share card, `llms.txt` and `CONTENT_GUIDE.md`. Reason: other lines in `llms.txt` type counts too, and the page and its meta description render the count from the data. No BUG was deferred.

Follow-ups, outside this change: this site's own copies of `seo.spec.ts`, `images.spec.ts` and
`navigation.spec.ts` differ from the toolkit template (by 224, 62 and 445 lines) while
`tests/TESTS-VERSION` and `/checks` say they were copied from `0597a28`; reported, not fixed.

Not established by any reviewer (the author's observation, or no network): the historical break
runs, what RFC 9309 says (the code cites it), the exact Playwright 1.64 timeout behaviour, and that
the build guard fires (the author ran three red runs; no reviewer built the site). The wording of
the four outside sources was checked by the fresh-eyes pass in round 1 and by the author.

Notes: (1) The fresh-eyes pass ran in round 1 only (Normal depth) and was allowed to fetch the six
public pages the page cites, a departure from the tooled prompt's "no network", to check the
paraphrases. (2) The claims sweep before round 1 found two sentences, fixed in `555e0e4`. (3) The
full suite passed 337 tests on the final tree on a private port after two earlier runs collided with
another process on the port every worktree of this site shares (4725); those runs count as neither
pass nor fail. (4) The stamp relies on Codex's unbroken chain (rounds 1 and 2, the wording pass and
both confirmations); GLM's chain ends at `3a16c9e`. (5) This trail was changed after the verdict only to record the owner's sign-off of the two waivers; every commit after the reviewed head `850c215` changes `docs/reviews/` alone.
