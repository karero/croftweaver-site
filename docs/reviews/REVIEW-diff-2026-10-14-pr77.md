# DIFF review — karero/croftweaver-site#77 — Positioning: start with it and keep your pages on it, sell the fix, next to marketingskills

Base `ac7b2ee` · depth: **Normal** (runtime copy on four pages and `POSITIONING.md`) · verdict: **no open BUG** once #76 is merged first; the remaining RISKs are answered below, for the owner to accept or waive.

Reviewers: Codex and GLM 5.3 on melious, run by the session that wrote the change. 2 rounds, 26 findings.

| Round | Reviewers | BUG/RISK/NIT |
|---|---|---|
| 1 | Codex, GLM 5.3 | 3 / 8 / 2 |
| 2, verify | Codex, GLM 5.3 | 2 / 11 / 0 |

## BUGs

- R1, fixed: `/positioning` still promised that a test keeps "every page" on its term. The test exempts legal pages and only warns about a page with no term. Both places now say "your pages".
- R1, fixed: "fails before it reaches your visitors" claimed more than the default hooks do (`/roadmap` says a person can still publish a failed build). `/compare` and the home page now say the tests run by default before every push and on every pull request.
- R1 and R2, **resolved by merge order**: `POSITIONING.md` cites the section "Broader review (14 October 2026)" in `docs/competitors.md`. That section is added by karero/croftweaver-site#76 and is not on `main` yet. Merge #76 before this pull request.

## NITs, fixed

`/compare` now says "each content page" and that legal pages need no term. Decision 1 in `POSITIONING.md` is reworded so that it reads in one pass.

## RISKs, answered

The reviewers had no network, so every claim about something outside this repository came back "unverifiable". The answers:

- **Claude Code asks before it runs a command, in its default settings.** Claude Code's permissions page, read on 14 October 2026 (https://code.claude.com/docs/en/permissions), says the `default` mode "prompts for permission on first use of each tool". The answer on the home page names the default settings, so the other modes are not covered by it.
- **`npm create croftweaver` works today.** `npm view create-croftweaver` on 14 October 2026: version 0.1.0, package created 7 October 2026; the toolkit README documents the command. **The plugin "needs nothing else"**: the toolkit README says "no Node, no script, no folder to keep". It ships with release 0.32, and `/roadmap` says it waits for the next release.
- **The visitor's own address, and the copy in Sent.** The message goes out from the visitor's own email program, so it comes from their account. Keeping a copy in Sent is what mail programs do by default; the page says "as it does for any email", not that every client does. This is the owner's argument (14 October 2026), and it matches the `website-contact-form` skill's own reasons.
- **No other kit that starts with the message ships a positioning test.** Read in the three repositories on 14 October 2026; recorded in `docs/competitors.md` (#76), with its limits.
- **Google and Bing report AI impressions and citations; plenty of tools check whether AI names you.** Sources in `docs/competitors.md` (#76): Google's Search Central blog, 3 June 2026; Bing, February 2026; Wix, Squarespace, HubSpot, Otterly. The home page makes only the general claim.
- **What the positioning test checks.** `tests/positioning.spec.ts` in this repository: title, description, and the H1 or the sentence under it (lines 109 to 128); the warn-only coverage flag and the exempt legal pages (lines 50 to 87).

## Checked beyond the findings

`npm run check`: 0 errors. `npm run build`: clean. `npx playwright test`: 274 passed, none skipped, after the round-1 fixes.
