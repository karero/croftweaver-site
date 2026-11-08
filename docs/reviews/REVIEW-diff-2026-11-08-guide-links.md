# DIFF review — links to the guide (header, footer, SEO checklist page, llms.txt)
Base `be0c35d` · depth: Normal · verdict: CLEAN after one round; the wording and the Preview are Daniel's · authority used: POST AUTHORITY, WORKTREE-WRITE and BRANCH-COMMIT, each by atom A (this session created the worktree `croftweaver-site-guide-links` and the branch `build/guide-links`)

Plan: `croftweaver-features/guide-site/PLAN-header-and-links.md`, Part B (R13, R14). Gate `20261108T223057Z-10538`. Seats: Codex gpt-6.1-sol (read-only), GLM 5.3 on melious, a Sonnet fresh-eyes pass in round 1.

| Round | Head | Artifact | Reviewers | Seconds, tokens | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `14ae55e` | full, `be0c35d...HEAD`, with an evidence file | Codex, GLM 5.3, Sonnet fresh-eyes | Codex 129 s / 50,373; GLM 189 s / 20,605; fresh-eyes 88 s / 121,118 (not in the script's log) | 1 BUG / 5 RISK / 5 NIT, deduplicated |

| id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| 1 | BUG | GLM | 1 | "nine checks, with links to the pages that explain them" promised more than the guide's links give | fixed | Now "nine checks, each with links into the guide" |
| 2 | RISK | Codex, fresh-eyes | 1 | The 22 fold tests force Verdana and fall back to DejaVu Sans; a narrower font would let a fold set too low pass, silently | fixed | Each test now fails loudly if the item row is under 800 px (Verdana: 838 and more); with "Arial Narrow" forced, 22 of 22 fail. DejaVu Sans on Linux CI is not measured here: CI is the check |
| 3 | RISK | GLM, fresh-eyes | 1 | Links to `/ai-seo-checklist` are dead if this site ships before the guide | refuted | `curl` on 2026-11-08: https://guide.croftweaver.com/ai-seo-checklist, / and /llms.txt all answer 200; the page is live already, not part of the guide's header PR |
| 4 | RISK | Codex, GLM | 1 | The llms.txt line and the checklist sentence describe the guide beyond what was checked | fixed | Fresh-eyes checked the built guide: nine checks, every listed topic is a page, "a way to check your own site" is its Check page; the sourcing claim now reads like the guide's own llms.txt ("every claim about Google or AI names its source") |
| 5 | RISK | Codex, GLM | 1 | Browser measurements not reproduced | follow-up | They are in the evidence (all 22 pages, Verdana); the test suite re-measures on CI |
| 6 | NIT | GLM | 1 | The fold-test comment said "the one-row test above" | fixed | Names the test by title |
| 7 | NIT | fresh-eyes | 1 | The footer comment said GitHub and the guide are the two links that leave the site; `Base.astro` has others | fixed | "in this list" |
| 8 | NIT | fresh-eyes | 1 | The `.co` typo mutation: the evidence said 2 tests fail | fixed | The run filtered on "guide" and left out the phone-menu test, which also asserts the address; the claim stands as "at least 2" |
| 9 | NIT | GLM | 1 | "531" against "509 + 22" | fixed | The 3 new discrete tests were already in the 509; 509 + 22 = 531 |
| 10 | NIT | fresh-eyes | 1 | The Guide link sits in the "Toolkit" footer column; the paragraph sits in "If your site already exists" and says "nine checks" next to the page's own "eight" | left | The plan names both places; the numbers are right |

Waivers and deferrals: none. Finding 5 is a follow-up that CI settles. No second round: the fixes are two text lines, a comment and a stronger guard on the new tests, which was checked against a mutation; `npm run check`, `npm test` (531 passed) and the shell checks `check_analytics_gate.sh`, `check_security_page.sh`, `check_ship_push.sh` were green after the last edit.
