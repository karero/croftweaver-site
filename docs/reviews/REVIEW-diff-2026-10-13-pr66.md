# DIFF review — karero/croftweaver-site#66 — Roadmap, compare and home page: say what the toolkit already does

Base `0d77ac2` · depth: **the site's own two-pass review** (`website-review`), read by hand, no `/code-review` run and no outside reviewer: sentence-level copy on three pages and one optional link field, no instruction file, no script, no test, no setting · verdict: **CLEAN** — no BUG; 1 RISK and 2 NITs in one round; one NIT fixed, the RISK and one NIT left for the follow-up named in the table.

This review was made by the session that wrote the change. It is not an independent read, and it is a lighter gate than karero/croftweaver-site#65 got (no `/code-review` pass). The owner can ask for outside reviewers at any time before the merge.

Files in the change: `src/pages/roadmap.astro`, `src/pages/compare.astro`, `src/data/compare.ts`, `src/pages/index.astro`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | the working tree before the first commit | full diff against `0d77ac2`, without `docs/reviews/` | pass 1 (correctness) and pass 2 (consistency across files), both by the author, by hand | 0 / 1 / 2 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | RISK | pass 2 | `/checks` still lists "Every leftover template slot" under "What no test here covers", and the home page still counts 12 test suites, while the roadmap now says the starter has a test for leftover slots | left for the next pull request | the line on `/checks` is still true (the new test does not catch every slot), and both it and the count describe this site's own copy of the tests, taken on 2026-09-26. The owner asked on 2026-10-13 for a separate pull request that brings the tests up to the release and changes the count |
| A2 | NIT | pass 1 | the first wording, "is already there, since release 0.30", did not say where | fixed before the first commit | now "The starter has had a test for leftover template slots and filler text since release 0.30." |
| A3 | NIT | pass 2 | the home page's fit section says "A contact form or one live widget is fine: the output supports a single serverless function", which reads as if a contact form needs a function | left, owner informed | not in what the owner asked for; the sentence is not false |

## What the change does

- **Roadmap.** "Missing today": the import line says what is missing (bringing a site into the starter) and that checking a live site works today; the forms line says which form exists (the optional contact-form skill, which opens the visitor's email program) and which does not (one that sends through the website). "Next": the leftover-slot check is no longer listed as future, and the import and forms items say the same as above.
- **Compare**, group "Skills for AI coding assistants": no longer sends everyone who already has a site to the other tools; the Croftweaver card says its checks and measurements work on a live site and links to `/established-sites`. "When Croftweaver is the wrong choice": the GitHub account is named as a need of the new-site route only.
- **Home page.** The `llms.txt` line says the file guarantees no reading. The line about install guides says which assistant Croftweaver is developed with and which two are untested.

## Checked beyond the findings

- Toolkit tag `v0.30` has `skills/new-website/templates/astro/tests/placeholders.spec.ts`; tag `v0.29` does not.
- `skills/website-contact-form/SKILL.md` at toolkit `origin/main`: the form opens the visitor's mail program, and "Nothing is sent or stored by the site".
- "On any stack" and "the ready-made test suite needs the Croftweaver starter" are the words of the lead on `/established-sites`. A GitHub account is on the list of needs on `/start`.
- "Not tested from start to finish" matches `/start` and `/roadmap`.
- The built pages were read: the new link on `/compare` stands inside the card's paragraph with a space before it, and both new links go to `/established-sites`.
- No statement about another product's facts changed, so the date on `/compare` stays.
- No route, title, description, structured data or share card changes. `public/llms.txt`, `POSITIONING.md` and `STORY.md` describe these pages in words that still hold.

## Not checked

- Whether the two SEO skills on `/compare` are best described as "one focused SEO or AI-search audit": it restates their own READMEs as read on 2026-10-03 and 2026-10-04, and they were not read again.
- The pages in a browser other than Chromium.
