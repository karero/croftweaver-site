# DIFF review — branch feat/current-page-underline — the current menu item gets a 3px underline
Base `6d56daa` (origin/main, PR 135 merged) · depth: Normal (shipped markup and styles; nothing in the High row) · verdict: CLEAN for code head `9e10288`; one BUG (fixed), two RISKs (one fixed, one refuted), four NITs (fixed), and one finding of the host's (fixed): 8 in all · two rounds; round 2 found no BUG or RISK, so no third · authority: this session created the worktree `croftweaver-site-breadcrumbs-base` and the branch; the owner asked for the change in chat (quoted in Notes)

| Round | Head | Artifact | Reviewers: CLI version, model, effort, sandbox | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `2e552c2` | full change (`6d56daa...2e552c2`, 2 files, +36) | Codex gpt-6.1-sol, config effort, read-only; GLM 5.3 on melious.ai, HTTP, text only; fresh-eyes Claude Sonnet sub-agent, read-only, ran the tests and took screenshots | codex 182 s / 64,575; GLM 102 s / 11,885; fresh-eyes 85 s / 100,253 | 1 / 2 / 4 (de-duplicated) |
| 2 | `9c616ce` | the fixes (`2e552c2..9c616ce`), with the round 1 findings | Codex gpt-6.1-sol, medium effort, read-only; GLM 5.3 on melious.ai | codex 79 s / 40,627; GLM 125 s / 12,653 | 0 / 0 / 1 |
| re-gate (not a round) | `bdbcec6` | the F7 fix (`9c616ce..bdbcec6`, the review record excluded) | the same two seats | codex 40 s / 48,416; GLM 24 s / 3,581 | 0 / 0 / 0 |

Both seats of the standard pair ran in both rounds: `reviewers: codex OK, melious OK`. Tokens logged for the gate: 229,993 in the two rounds (fresh-eyes included), plus 51,997 for the re-gate.

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | fresh-eyes | 1 | on a group button the underline broke at the arrow: the name and the arrow are separate flex boxes, so it drew a long bar, a gap and a short lower bar under the arrow. The tests read computed style only, so they passed | fixed, externally re-verified (round 2) | the name is wrapped in `<span class="group-name">`, and both the current and the hover underline sit on it. Screenshots of `/security` at 1024 px in light and dark: one bar under "Technology", none under the arrow |
| F2 | RISK | Codex, fresh-eyes | 1 | "thicker than the hover underline" rested on the hover thickness being `auto` | fixed, externally re-verified | both hover rules set `text-decoration-thickness: 1px`; the comment says so |
| F3 | RISK | GLM | 1 | the "no other item is underlined" check skips every element with `aria-current`, so a duplicate link in NAV marking two items would pass | refuted, externally re-verified | the existing per-link tests assert `toHaveText([link.label])` on `a[aria-current="page"]`, so exactly one current link per page; Codex traced Playwright's array matcher to confirm it rejects a different count |
| F4 | NIT | GLM | 1 | the current link inside the open group was never checked on a wide screen | fixed, externally re-verified | the test opens the group and checks that link |
| F5 | NIT | GLM | 1 | the phone test checked `/security` only | fixed, externally re-verified | it runs on every NAV page |
| F6 | NIT | fresh-eyes | 1 | a computed-style check cannot see a split underline | fixed, externally re-verified | on a grouped page the test asserts that the button itself has no underline and only its name does. Mutation check: the underline moved back onto the whole button fails the 7 grouped-page tests; with no underline, all 18 fail |
| F7 | NIT | GLM | 2 | after the click, the current link's underline was read without checking that the list had opened | fixed, externally re-verified (re-gate) | `toBeVisible()` before the check; 439 tests pass |
| H1 | — | host | 1 | hovering the current group would have drawn the button's thin hover underline and the name's thick one together | fixed, externally re-verified | the same move to `.group-name`; screenshot with the pointer on "Technology": one bar |

Checks: `npm run check` 0 errors, 0 warnings; `npm test` 421 passed on `7afae6c` (main just before PR 135, which changed only `AGENTS.md` and added its own review record), 439 passed on `9e10288`.

Waivers and deferrals: none.

Follow-ups: none.

Notes:
- The owner's request, quoted: "Yes: underline the current menu item (and its group). Park the breadcrumbs until I've seen it on my phone." Before that: "I feel a bit disoriented on the page. I do not know which tab I am on."
- No wording pass: nothing changed after round 2 except F7, one assertion in a test, which both seats re-gated.
- Daniel looks at the change on the pull request's Cloudflare preview before it is merged.
