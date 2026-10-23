# DIFF review — branch feat/header-groups — the header navigation as links and groups of links
Base `046d344` (origin/main, PR 119 merged) · depth: Normal (shipped markup, script, styles and test logic; nothing in the High row) · verdict: CLEAN for code head `8be42f9` (later commits touch `docs/reviews/` only); one NIT (H19) waived by the owner · authority used: WORKTREE-WRITE and BRANCH-COMMIT, atom A for both (this session created the worktree `croftweaver-site-header` and the branch); POST AUTHORITY: atom A once the PR exists (this session creates it) and atom B (the owner, 2026-10-23: "Yes: push feat/header-groups to karero/croftweaver-site and open the PR against main."); GATED-THIS-DIFF: atom A, the reviewer input recorded against a chain of `(base, head)` pairs that still matches (round 1 in full, then three deltas, then one link); GLM holds the chain unbroken, Codex and fresh-eyes do not (see Notes)

| Round | Head | Artifact (full / delta since <sha>) | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `b89b07e` | full change (`046d344...b89b07e`) | codex-cli 0.163.0, gpt-6.1-sol, config effort, read-only: FAILED (provider capacity), run twice; GLM 5.3 on melious.ai, HTTP, text only; fresh-eyes Claude Sonnet sub-agent, read-only by instruction, no running of tests | GLM 259 s / 31,221; fresh-eyes 685 s / 232,697; Codex 240 s / 57,564 and 85 s / 96,080, both FAILED, no review | 3 / 5 / 14 (de-duplicated; GLM and fresh-eyes) |
| 2 | `fe77300` | delta `b89b07e..fe77300` (`--verify`) | Codex medium, read-only; GLM 5.3 | codex 317 s / 69,070; GLM 581 s / 48,392 | 1 / 1 / 4 |
| 3 | `14ddb22` | delta `fe77300..14ddb22` (`--verify`) | Codex: FAILED (provider capacity); GLM 5.3 | GLM 178 s / 15,597; Codex 60 s / 18,024, FAILED | 0 / 0 / 3 |
| link | `8be42f9` | delta `14ddb22..8be42f9` (`--verify`, `--seat melious`) | GLM 5.3 | GLM 32 s / 3,160 | 0 / 0 / 0 |

Tokens logged for the gate: about 572k with fresh-eyes (339,108 across eight script seat runs, plus fresh-eyes 232,697). Codex's three FAILED runs used 171k of that and produced no review. Three rounds; the link is not a round (SKILL.md step 6).

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| H1 | BUG | fresh-eyes | 1 | comment: a group shows "above its links" without JavaScript on a wide screen; it sits beside them | fixed; externally_reverified (round 2) | the CSS comment already said "under or beside"; the header comment now says "above or beside" |
| H2 | BUG | fresh-eyes | 1 | comment "nothing here can be reached" elsewhere; an open list stayed open when the window narrowed and reappeared open on widening | fixed; externally_reverified (round 2) | `resize` closes groups when the button is not shown; `pageshow` with `persisted` closes them; tests, red when each is removed (break sets H, I) |
| H3 | BUG | fresh-eyes | 1 | `CONTENT_GUIDE.md` said nothing fails when a header place is missing; two tests pinned Existing Sites and Security | fixed with H4; externally_reverified (round 2) | the tests read NAV; the stale test comment corrected |
| H4 | RISK | fresh-eyes | 1 | the tests pinned today's NAV (group 'For your site', `/established-sites`, Security as a plain link) | fixed; externally_reverified | current-page tests derive from NAV; in round 2 every grouped link got its own test (J1) |
| H5 | RISK | fresh-eyes | 1 | the one-row test depends on the font: Verdana wraps the nav at 768 px | fixed; externally_reverified (round 2) | measured here: Verdana at 768 px, nav content 728 = available 728, two rows; fits at 800. The fold moved from 47.99rem to 51.99rem (832 px) |
| H6 | RISK | fresh-eyes | 1 | nothing exercised the null-`relatedTarget` guard | fixed; externally_reverified | a test presses on the open list (not a link) and expects it to stay open; red with the guard removed (set H) |
| H7 | RISK | fresh-eyes | 1 | iOS Safari may not send a click to the document for a tap on text | fixed, not testable here; externally_reverified for the code | the outside check is on `pointerdown`; not tried on iOS |
| H8 | RISK | GLM | 1 | the CSP helper used only the first policy line | fixed; superseded by J2 | all lines, then (J2) the lines under `/*` only |
| H9 | NIT | fresh-eyes | 1 | `max-width: calc(100vw - 2.5rem)` could never bind | fixed | deleted |
| H10 | NIT | fresh-eyes | 1 | a list had no accessible name on a phone or without JavaScript | fixed; externally_reverified | `aria-labelledby`; the phone menu test and the wide-screen test assert the name; red with it removed (sets H, J) |
| H11 | NIT | fresh-eyes | 1 | label visibility untested | fixed | hidden on a wide screen, shown on a phone and without JavaScript; red with a label shown on a wide screen (set I) |
| H12 | NIT | fresh-eyes | 1 | a comment said "its links show, and only its" but counted buttons | fixed | counts visible lists too |
| H13 | NIT | fresh-eyes | 1 | the document handler and `focusout` cannot be told apart in Chromium | refuted | behaviour holds by two paths; the loop was removed after break run E (nothing red); the path is now `pointerdown` |
| H14 | NIT | fresh-eyes | 1 | group wiring sits after `if (!button \|\| !nav) return;` | refuted | the Menu button and the nav are in the same template, both unconditional |
| H15 | NIT | fresh-eyes | 1 | back/forward-cache restore brought a list back open | fixed with H2 | `pageshow` test, `persisted` true and false |
| H16 | NIT | fresh-eyes | 1 | the complement fix had no regression test | fixed | a test reads both numbers from `Header.astro` and expects them equal; red when unequal (set I) |
| H17 | NIT | fresh-eyes | 1 | config comment and guide disagreed about whose PR edits NAV | fixed in the code in round 1, in the guide in round 2 (J3) | both say "the navigation work's pull request that adds the second page's place" |
| H18 | NIT | fresh-eyes | 1 | the CSP-refusal collector had no negative control | fixed | a control test loads an image from another origin and expects a refusal; red with a blind collector (set I) |
| H19 | NIT | GLM | 1 | the current group is marked on the hidden button only, so on a phone the group name carries no mark | waived by the owner, 2026-10-23 | the current link is marked and highlighted in its list; the plan places the mark on the button only |
| H20 | NIT | GLM | 1 | move focus to the button after an outside press | refuted | by then focus is where the user pressed; moving it back would take it from them |
| H21 | NIT | GLM | 1 | the panel's links were not measured against 44 px | fixed | the window test measures them; red with a 30 px link (set I) |
| H22 | NIT | GLM | 1 | a comment overstated what the width scan returns | fixed | the comment says "probed in steps of 4 px from 480 up to 1400 (it fails if none unfolds)" |
| J1 | BUG | Codex, GLM | 2 | a comment claimed coverage after a link moves into a group, but only the first group's first link was tested | fixed; externally_reverified (round 3) | every link of every group has its own test; red with a position-dependent group mark (set J) |
| J2 | RISK | Codex | 2 | the CSP helper ignored the path each policy is for | fixed; externally_reverified (round 3) | only policies under `/*`; a policy under another path fails with a message; red with `/private/*` added (set J) |
| J3 | NIT | Codex, GLM | 2 | the guide still named the page's own PR | fixed | wording matches the config |
| J5 | NIT | GLM | 2 | on a wide screen nothing asserted the open list's name (its label is hidden) | fixed | the wide-screen test asserts it; red with `aria-labelledby` removed (set J) |
| J6 | NIT | GLM | 2 | the fixed widths in the row test all lie on one side of the new fold | fixed | a row test at the narrowest unfolded width; red when the nav wraps (set J) |
| J7 | NIT | GLM | 2 | claim: the width scan returns `undefined` | refuted | the function throws after the loop; the comment states the 1400 ceiling |
| K1 | NIT | GLM | 3 | a comment said the per-link tests are "below" | fixed; externally_reverified (link) | "above" |
| K2 | NIT | GLM | 3 | the row helper's comment said "tenths of a pixel row" | fixed; externally_reverified (link) | "in 10-pixel bands" |
| K3 | NIT | GLM | 3 | the CSP helper's message read `under ""` before any path rule | fixed; externally_reverified (link) | "(no path rule above it)"; checked as code |

Waivers and deferrals: H19 waived by the owner, in chat, 2026-10-23: "I waive H19: the current group needs no mark on the plain group name, because the current link is marked." Reason: on a phone and without JavaScript the current link is marked and highlighted in its open list, and the plan places the group mark on the button only. No deferrals.

Follow-ups:
- Footer text links keep today's size; BRAND.md asks 44 px targets (the plan's "Left as it is, on purpose").
- The header takes its taller layout (the nav under the logo, 135 px) from about 930 px down; before this change from about 830 px. The owner's visual check, with the Menu fold now at 52rem.
- A `/what-it-runs-on` page will turn Security into a Technology group (step 3 of the navigation plan).
- Every worktree of this site shares one Playwright port; a sibling session's server has answered for mine before. Deriving it from the worktree path would fix it, in its own change.

Notes:
- Degraded record: Codex failed with a provider capacity error ("Selected model is at capacity") twice in round 1 and once in round 3, and reviewed only round 2. Rounds 1 and 3 each had one counted cross-model seat (GLM); fresh-eyes (a Claude sub-agent) ran in round 1 only, by design at Normal depth. GLM holds the unbroken chain through the link.
- Every test run used a private port through an untracked local `pw.own-port.config.ts` (never committed): the worktrees of this site share one Playwright port and other sessions' servers have answered for mine. Final state on `8be42f9`: whole suite 387 passed, `npm run check` 0 errors, the analytics gate, the security page check and the security.txt check pass.
- Break runs (sets A to J, plus a dead-link run) each turned the test they target red for its own reason, with the tree restored after each run. One break, the loop that closed other groups on a click, turned nothing red: the loop was redundant and was removed. The CSP-refusal collector has its own control test.
- The font finding (H5) was reproduced here with Verdana, close to DejaVu Sans on a Linux runner; the fold moved from 48rem to 52rem, so tablets in portrait (768 to 831 px) get the Menu.
- One command slip: a GLM link was first started with `MELIOUS_MODEL` set after the script call; the script names no model by default, so it made no call ("melious SKIPPED") and nothing was sent; it was rerun correctly. The owner's OK to send the diff to Codex and GLM 5.3 on melious.ai, quoted: "Yes: I OK sending the header diff to Codex and to GLM 5.3 on melious.ai. Run the DIFF gate at Normal depth."
