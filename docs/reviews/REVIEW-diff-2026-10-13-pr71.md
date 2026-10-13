# DIFF review — karero/croftweaver-site#71 — Compare page: Croftweaver begins with the end in mind

Base `34c9033` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: one new section of copy on one page, its statements about three other projects in the page's data file, and two documents that list the page · verdict: **CLEAN** — no BUG, no RISK; 3 NITs in one round, left with their reasons.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for an outside reviewer at any time before the merge.

Files in the change: `src/pages/compare.astro`, `src/data/compare.ts`, `public/llms.txt`, `CONTENT_GUIDE.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `34c9033`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 0 / 3 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | NIT | pass 2 | the owner asked for the point that none of the alternatives starts with positioning, and asked for it to be checked. It does not hold, so the section does not say it | left, owner informed | three of the five skill projects on the page start with the message or with discovery, in their own READMEs' words (below); the page's rule is that it never says what another product lacks |
| A2 | NIT | pass 1 | the heading "begins with the end in mind" is the owner's wording and also the second habit in Stephen Covey's book *The 7 Habits of Highly Effective People* | left, owner informed | used as a common phrase, with no claim to the method; the site credits the two methods its skills build on, and this is not one |
| A3 | NIT | pass 2 | the new statements carry their own date, 13 October 2026, while the page's other links say 4 October 2026 | left | only three READMEs were read again; `src/data/compare.ts` asks for every link to be re-checked before the page's date moves |

## What the change does

Adds a section to `/compare`, between the opening and the four groups. It says what Croftweaver does first: it works out the positioning with the owner, asks what shows that each claim is true, builds in customer quotes where there are any, writes the answers to one file and keeps the pages on them with a test. It says this is a method and not a result. A note then names three projects from the page's own list that also start with the message, each with a link.

## Checked beyond the findings

- **Croftweaver's side**, against the toolkit at `origin/main` on 2026-10-13: positioning is step 2 of the build and required (`skills/new-website/SKILL.md`, `skills/website-positioning/SKILL.md`); "value + proof ... with evidence (a metric, a mechanism, a reference)" is the skill's own wording; testimonials are built from one file with the author and the thing reviewed (`skills/website-testimonials/SKILL.md`), and only where a site has quotes, so the section says "where you have them". The file and the test are as `/positioning` describes them.
- **The other projects**, each README read on 2026-10-13:
  - marketingskills: "The `product-marketing` skill is the foundation — every other skill checks it first to understand your product, audience, and positioning before doing anything."
  - Wondel.ai skills: an `obviously-awesome` skill ("Product positioning: competitive alternatives, unique value, target customers, market category", from April Dunford's book), and a `create-website` journey: "message first, then design, then conversion engineering".
  - website-build-kit: "A method and a starter for shipping production marketing sites: discovery → stack and provider decisions → build → ...".
  - claude-seo and geo-seo-claude describe audits, and their READMEs name no such first step. The page says nothing about them here.
- The hosted builders, the AI app builders and the visual builders were not checked for this, and the section makes no statement about them.
- `npm ci`, `npm run check` (0 errors, 0 warnings), `npm run build`, `npx playwright test`: 262 passed, none skipped.
