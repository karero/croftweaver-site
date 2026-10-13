# DIFF review — karero/croftweaver-site#74 — Proof page: no event in the latest 28 days, said next to the figure

Base `136b05a` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: two sentences of copy on one page, one computed figure with a guard in the page's data file, and one passage in `README.md` · verdict: **CLEAN** — no BUG, no RISK; 3 NITs in one round, left with their reasons.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for an outside reviewer at any time before the merge.

Files in the change: `src/pages/proof.astro`, `src/data/proof.ts`, `README.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `136b05a`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 0 / 3 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | NIT | pass 1 | the owner said "summer and early autumn"; the page gives dates and a count of weeks | left, owner informed | a season is typed and goes stale when the figures are refreshed; the dates and the weeks are computed from the same data as the figures, and a guard stops the build when they no longer hold |
| A2 | NIT | pass 2 | `/why` still says only that clicks have fallen and that the cause is not established | left | a test compares `/why` with the slide deck, so a change there means a new deck; `/why` links to `/proof` for what the figures do not show |
| A3 | NIT | pass 2 | the page's fact was already there, at the end of a long paragraph under the table | this is the change | the owner read the section and did not find it |

## What the change does

- **Next to the latest figure**, in the first paragraph of "Clicks from Google since the launch": "GenAI Wednesday held no event in those 28 days: its last one was on 1 July 2026, 9 weeks before they began."
- **Under the table**, the paragraph now says that no event followed "up to 29 September 2026, the last day of these figures", as the maintainer's own account, with the site's event pages as the second source. It used to rest on the event pages alone. Its last sentence joins the two cautions the paragraph had in two places: the link between the missing events and the fall was not tested, so the cause is not established.
- **In the data**, the last event and the weeks are computed, and the build stops if the last event is not before the latest 28 days.

## Checked beyond the findings

- 1 July 2026 to 2 September 2026 is 63 days, which is 9 full weeks.
- The page makes no causal claim: it still says the cause of the fall is not established, and still says that the rise had begun before the first of the two events, with the two totals that `tests/a11y.spec.ts` reads on the page.
- That the community held no event is the owner's statement of 2026-10-13. The event pages, read on 2026-10-12, list none after 1 July 2026.
- `npm ci`, `npm run check` (0 errors, 0 warnings), `npm run build`, `npx playwright test`: 262 passed, none skipped.
