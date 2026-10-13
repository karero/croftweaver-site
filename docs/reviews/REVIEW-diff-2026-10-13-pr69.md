# DIFF review — karero/croftweaver-site#69 — Structured data: operator, website and software apart; who maintains Croftweaver

Base `406610a` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: structured data, one short section of copy and two tests, none of it a payment flow, personal data, a repositioning or a redesign · verdict: **one RISK for the owner to confirm, no BUG**; 5 NITs in one round, left with their reasons.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for an outside reviewer at any time before the merge. A second model, Kimi K3, read the audit and the live structured data before the change was written and named the same faults; it has not read this diff.

Files in the change: `src/config.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `tests/seo.spec.ts`, `README.md`, `STORY.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the second commit | full diff against `406610a`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 1 / 5 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | RISK | pass 2 | three facts in the new section are not on this site: co-founded M-Squad in 2001 and leads it, more than 20 years in product development for mobile and telecom, built GenAI Wednesday and still co-organizes it. `AGENTS.md` §4 asks for facts the person gives or that are on the site | for the owner to confirm at the merge | each is on the operator's own site, https://m-squad.com/company/team, read 2026-10-13, and the section links to it; the owner asked for the section and said "do whatever works best"; `STORY.md` lists every fact with its source |
| A2 | NIT | pass 1 | on every page but the home page, `WebSite.about` points at `https://croftweaver.com/#software`, a node that only the home page describes | left | a reference by `@id` is valid JSON-LD; the other way was to repeat the software node on 14 pages. The second new test pins the identifier on every page |
| A3 | NIT | pass 2 | the Organization keeps `knowsAbout` with four topics; Kimi K3 read them as the project's topics, not the company's | left, owner informed | the company operates the site and its managing director maintains the toolkit; dropping them was not asked for |
| A4 | NIT | pass 2 | the Home line in `public/llms.txt` does not name the new section | left | the file's Facts section already says "Maintainer: Daniel Melter, Munich, Germany" |
| A5 | NIT | pass 1 | `runtimePlatform: 'Astro'` describes the starter, not the instruction files (Kimi K3) | left | it stood before this change and nobody asked to change it |
| A6 | NIT | pass 1 | the LinkedIn address could not be opened from here: LinkedIn answers automated requests with HTTP 999 | left | the owner gave the address, and M-Squad's team page lists the same profile for him |

## What the change does

- **The operator's node.** The Organization is M-Squad GmbH with the address `https://m-squad.com`. It no longer has "Croftweaver" as `alternateName`, the product's description, the product's logo, or `sameAs` links to the toolkit's repository and the Builder Lab.
- **The software's node.** The `SoftwareSourceCode` node on the home page gets the identifier `https://croftweaver.com/#software`, an address, the logo as its image and the licence file. The website says it is about that node, and the home page names it as its main subject.
- **The maintainer.** A Person node, `https://croftweaver.com/#daniel-melter`, is the software's author and maintainer and works for the operator. Its profiles are LinkedIn, M-Squad's team page and the GitHub account `karero`.
- **A visible section.** "Who maintains Croftweaver" on the home page, after the learning section: five sentences and three links.
- **Two tests** in `tests/seo.spec.ts`, and the decision in `README.md` and `STORY.md`.

## Checked beyond the findings

- `npm ci`, `npm run check` (0 errors, 0 warnings), `npm run build`, `npx playwright test`: 262 passed, none skipped (260 before, plus the two new tests).
- The first new test fails when the starter's line `alternateName: SITE.name` is put back ("the Organization must not carry \"alternateName\""), and passes again without it.
- Read from the built pages: the five nodes on the home page and the three on `/roadmap`. Every reference on the home page meets a node there.
- `https://m-squad.com/imprint` names M-Squad GmbH with the address and the managing director this site's imprint gives, so the address belongs to the operator. The licence file in the toolkit's repository is MIT and names Daniel Melter as copyright holder, so the software has an author and no publisher in the markup.
- Nothing else reads `SAME_AS`, `COMPANY.logo` or the fields that were removed (`grep` over `src`, `tests`, `scripts`).
- The audit proposed `legalName` beside `name`; left out, because both would hold the same words.

## For the next sync of the starter

`src/layouts/Base.astro` now differs from the toolkit's starter on purpose. The starter gives the Organization the site's name, description and logo. The tests fail if that comes back.
