# Review trail: case study, three new pages and 22 in all (DIFF gate)

Change: `src/data/case-study.ts` only. One observation for 25 October (the three pages that went live on 22 and 23 October, the owner's indexing requests, 22 pages in all, Google's index status and last crawls), and `UPDATED` set to 25 October. Depth: Normal (published text on a shipped page). Seats: Codex (gpt-6.1-sol) and GLM 5.3 on melious.ai, `reviewers: codex OK, melious OK` both times; a fresh-eyes Claude Sonnet sub-agent in round 1. The reviewers have no network, so each run sent the diff with an evidence appendix (sitemap, page lists at earlier publishes, Cloudflare deploy times, URL inspection results, the owner's answer), with `--base none`.

| Run | Artifact | BUG/RISK/NIT | Timings |
|---|---|---|---|
| Round 1 | `132039e...` first commit, with appendix | Codex 0/0/1; GLM 0/0/1; fresh-eyes 0/2/2 | codex 156 s / 49,346; GLM 81 s / 10,046; fresh-eyes 93,512 tokens |
| Wording pass (not a round) | `29a428c` alone, with appendix | Codex 0/0/0; GLM 0/0/2 | codex 221 s / 32,138; GLM 75 s / 9,632 |

1 round and a wording pass, 7 findings in all, no BUG.

| # | Seat | Finding | Disposition |
|---|---|---|---|
| 1 | fresh-eyes | RISK: the crawl times read as first crawls, right after the index requests, which suggests cause and effect | Fixed: "Its last crawl of ...", and the request sentence moves after it |
| 2 | fresh-eyes, Codex | RISK/NIT: the source misses the Cloudflare deploys and the 21 October page list | Fixed: both added to `source` |
| 3 | GLM | NIT: "an AI assistant built on 22 October" reads as the build date | Fixed: "the SEO checklist (/ai-website-seo-checklist) on 22 October" |
| 4 | fresh-eyes | NIT: the checklist was named by description only | Fixed with 3 |
| 5 | fresh-eyes | NIT: the title repeats the indexed claim and could suggest the requests caused it | Fixed: "all indexed by Google" |
| 6 | GLM (wording pass) | NIT: "were not recorded" asserts more than is known | Fixed: "on days this entry does not give" |
| 7 | GLM (wording pass) | NIT: the dates are UTC and the entry names no time zone | Refuted: the three deploys (22 Oct 16:17Z, 23 Oct 21:07Z, 21 Oct 21:48Z) fall on the same day in UTC and in Berlin time |

## Checks

`npm run check` 0 errors; the build; the export, security.txt, analytics-gate and security-page checks; `npx playwright test` 457 passed (private port). One full run in between had 1 failure at a machine load near 700 from other sessions; its log was not kept, so the test is unknown. The full rerun straight after passed all 457, and tone and a11y (96) passed after the last wording edit.
