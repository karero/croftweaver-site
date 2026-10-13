# DIFF review — karero/croftweaver-site#68 — Home page: one sentence under the one-liner says what Croftweaver is

Base `6024143` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: one sentence of copy on one page, in words the owner gave, and the two documents that record it · verdict: **CLEAN** — no BUG, no RISK; 3 NITs in one round, left with their reasons.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for outside reviewers at any time before the merge.

Files in the change: `src/pages/index.astro`, `POSITIONING.md`, `STORY.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `6024143`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 0 / 3 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | NIT | pass 2 | "What Croftweaver is", five sections down, opens with almost the same words: "Croftweaver is a free, open-source suite of website skills for search and AI visibility" | left | that paragraph carries the market category, which `tests/positioning.spec.ts` asks for on the home page; the owner gave the new sentence word for word |
| A2 | NIT | pass 1 | the hero grows by two lines on a desktop and four on a phone; on a 375 by 812 screen the main button still shows in the first screen, the second button does not | left, owner informed | screenshots at 1200 and 375 px, light, and 1200 px dark; no sideways scrolling at 375 px |
| A3 | NIT | pass 2 | the Home line in `public/llms.txt` lists what the home page holds and does not name the new sentence | left | the file's own opening paragraph already says what Croftweaver is, in more words |

## What the change does

Adds one paragraph to the home page's hero, between the one-liner and the audience line: "Croftweaver is a free, open-source suite of website skills: instructions your AI coding assistant follows to build and test a site you own." `POSITIONING.md` records it as the definition line, with the reason and the date; `STORY.md`'s home page map names it.

## Checked beyond the findings

- The sentence is the owner's, as given in chat on 2026-10-13. Each part of it is in `POSITIONING.md` already: free and open source (§3, MIT), a suite of skills for AI coding assistants (§2), the tests (§2), a site the owner owns (§2).
- The kicker is still the first paragraph in `<main>`, which the positioning test needs.
- `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: clean. `npx playwright test`: 259 passed, none skipped.
- No route, title, description, structured data or share card changes.

## Not checked

- The page on a real phone or in a browser other than Chromium.
