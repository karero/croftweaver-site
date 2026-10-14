# DIFF review — karero/croftweaver-site#76 — docs/competitors.md: broader competitive review, 14 October 2026

Base `52d864a` · depth: **Light, then Normal** · verdict: **no open BUG**; the remaining RISKs are claims an offline reviewer cannot check, answered below, for the owner to accept or waive.

The change is working notes that no page serves and no agent loads as instructions, so it started at the Light gate (Codex alone). Round 2 of the Light gate still found two BUGs, which moves a change to Normal (Codex plus GLM 5.3 on melious) from its round 1. The reviews were run by the session that wrote the change.

| Round | Depth | Reviewers | BUG/RISK/NIT |
|---|---|---|---|
| L1 | Light | Codex (medium) | 3 / 3 / 0 |
| L2 | Light, verify | Codex (medium) | 2 / 2 / 0 |
| N1 | Normal | Codex, GLM 5.3 | 2 / 7 / 6 |
| N2 | Normal, verify | Codex, GLM 5.3 | 0 / 9 / 4 |

4 rounds, 38 findings, many of them the same item raised again.

## BUGs, all fixed

- L1: "every page" overstated the positioning test. It checks the pages in its map, exempts legal pages, and only warns about a page with no term. The row and proposal 1 now say so.
- L1: the FAQ rich results row said `src/data/established-faq.ts` agreed with "ended for all sites". It does not: its comment, from Google's page read on 9 October 2026, says government and health sites only. The row now shows the conflict.
- L1: the labels "Gap (all)" and "Lead" for business listings contradicted the legend. Now "Shared gap" and "Ahead", with the legend extended.
- L2: what the positioning test checks: the declared phrases, by default in the title, the description, and the H1 or the sentence under it.
- L2: "Ahead" was defined as "all have some", which the business listings row contradicts. Now: "Croftweaver has more of it than any of the three".
- N1: the summary said each competitor has "one or two" of five things; website-build-kit has three. Corrected.
- N1: four figures had no source (the $25 price, the Lovable records, Wix Harmony, Wix's AI overview). Sources added; single third-party sources are marked *unverified*.

## NITs, fixed

The legend now covers every label the table uses, and the Gap and Partial labels follow one rule. "Lead" rows where a competitor has part of the capability are now "Ahead". Programmatic SEO is a gap, not on the roadmap, left to the owner. The kostja94 row says which star count is whose. Sources were added for Adobe and Semrush, HubSpot, Bing (a second source), Google's `llms.txt` guidance (secondary), and the seven derived skills.

## RISKs, answered

All the open RISKs have one shape: the reviewers ran without network and without the other repositories, so they could not see the sources. The answers:

- **Competitor capabilities and absences** (marketingskills, Wondel, website-build-kit): read by a research pass on 14 October 2026 from downloaded copies of each repository (README, SKILL.md files, scripts, CI files, commit history). Pinned commits were not recorded. Re-read the repositories before a public claim rests on an absence.
- **Croftweaver's column**: read from `karero/croftweaver` at `origin/main` `e038603` on 14 October 2026, in the toolkit checkout at `~/Devel/website-builder`, which is not this repository.
- **Cloudflare's rule for crawlers that do search and training together**: read by the author on Cloudflare's blog on 14 October 2026 (https://blog.cloudflare.com/content-independence-day-ai-options/): a block on Training also blocks Googlebot, Applebot and Bingbot. No crawler request was reproduced.
- **Free monitoring in Wix, Squarespace and HubSpot**: the wording is narrowed to what the sources say. Plan limits were not checked, and the doc says so.
- **Google's `llms.txt` guidance, the Lighthouse audit, the Ahrefs study**: linked, with the Google item marked as a secondary source. The study's method was not inspected.

## Checked beyond the findings

No page serves this file, so the test suite does not read it. The pre-push gate (build and Playwright) ran on every push of this branch.
