# DIFF review — karero/croftweaver-site#70 — Home page: two measured figures under the AI panel; the first AI snapshot filed

Base `406610a` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: one paragraph of copy on one page whose figures are read from data that two other pages already show, three documents that record it, and three files under `docs/` that no page serves · verdict: **CLEAN** — no BUG, no RISK; 3 NITs in one round, left with their reasons.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for an outside reviewer at any time before the merge.

Files in the change: `src/pages/index.astro`, `STORY.md`, `POSITIONING.md`, `public/llms.txt`, `docs/ai-snapshots/2026-10-13-codex-api/` (three files), and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `406610a`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 0 / 3 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | NIT | pass 1 | the sentence differs from the one the owner saw in chat: it adds "all of them the maintainer's own" and "out of 100", keeps the pointer to the trust scores, and splits the AI figures at a semicolon | left, owner informed | `/more-proof` says the three sites belong to the maintainer, so the home page should too; the figures and the two links are the ones shown |
| A2 | NIT | pass 2 | the word "three" is typed, the range is computed | left | the page stops the build if the list in `src/data/proof.ts` is not three sites long |
| A3 | NIT | pass 2 | `all-answers.md` holds answers by three assistants with claims about other tools that nobody checked, in a public repository | left, owner informed | the owner asked for the snapshot to be filed; the folder's README says the answers are evidence and not advice; no page serves the folder; the file holds no address, phone number or key |

## What the change does

- **Home page.** The closing paragraph of the proof section, under the AI panel and the prompt, now states two measured figures and links to the page behind each: the PageSpeed range for three sites on 4 October 2026, and how many answers named genai-wednesday.de with and without web search on 8 October 2026. The panel stays where it is.
- **Documents.** `STORY.md` and `POSITIONING.md` record it with the date; the Home line of `public/llms.txt` names it.
- **The snapshot.** The two files Codex produced on 13 October 2026, unchanged, and a README with how the run was made, what it shows, what it does not show, and what to settle before repeating it.

## Checked beyond the findings

- `npm ci`, `npm run check` (0 errors, 0 warnings), `npm run build`, `npx playwright test`: 260 passed, none skipped.
- Read from the built home page: "On 4 October 2026, Google's PageSpeed Insights gave three sites built with Croftweaver, all of them the maintainer's own, scores of 99 to 100 out of 100 across its four categories." and "On 8 October 2026, 16 of 18 answers from AI assistants with web search named genai-wednesday.de; without web search, 0 of 24 did." The live `/proof` page gives the same counts and the live `/more-proof` page the same scores.
- The counts in the snapshot's README were computed from `results.csv`: 24 rows; Croftweaver named in 0 of 18 answers to the questions that do not name it and in 4 of 6 to the two that do; no page of croftweaver.com among the cited or retrieved addresses.
- The clicks from Google are not on the home page. That was the author's proposal, and the owner accepted it with the sentence.
