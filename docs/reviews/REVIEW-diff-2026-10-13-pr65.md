# DIFF review — karero/croftweaver-site#65 — Home page: Dr. Andrea Geistanger's testimonial, with her photo, under the proof strip

Base `4f7eb4e` · depth: **the site's own two-pass review** (`website-review`), no outside reviewer: one content section on one page, no instruction file, no script, no setting · verdict: **CLEAN** — no BUG; 1 RISK and 4 NITs in one round; the RISK and one NIT fixed, three NITs left as they are, with the reason in the table.

This review was made by the session that wrote the change. It is not an independent read. The owner can ask for outside reviewers (as on karero/croftweaver-site#64) at any time before the merge.

Files in the change: `src/pages/index.astro`, `public/images/testimonials/andrea-geistanger.webp`, `public/llms.txt`, `STORY.md`, and this file.

| Round | Head | Artifact | Reviewers | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | `5d6b202` plus the `llms.txt` line in the working tree | full `main...5d6b202`, without `docs/reviews/` | pass 1: `/code-review` at high effort, eight angles, in the author's session; pass 2: the consistency sweep of `website-review`, by the author | 0 / 1 / 4 |

| id | Sev | Source | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|
| A1 | RISK | pass 2 | STORY.md §3 says the guide's authority uses "proof from §3 only" and lists what the home page shows; the testimonial was in neither that list nor POSITIONING.md §3 | fixed in the commit that adds this file — locally_verified | §3's authority bullet now names the testimonial, says it is not proof from §3 and names the differentiation contract and the owner decision of 2026-10-13 |
| A2 | NIT | pass 2 | `public/llms.txt` lists what the home page holds and did not name the testimonial | fixed in the commit that adds this file — locally_verified | the Home line names it; the push gate ran the tests on that commit |
| A3 | NIT | pass 1 | "By “the Builder” she means this toolkit" states what a named person meant: a reading, not a fact the owner gave or the site held (AGENTS.md §4) | left, owner informed | the owner was shown the line and the doubt about it in chat on 2026-10-13 before asking for the push, and did not ask for a change. The Lab has shown the quote as a testimonial for this toolkit since 2026-08-19, under the heading "What builders say" |
| A4 | NIT | pass 1 | the portrait's alt text and the caption both carry her name, so a screen reader says it twice | left | AGENTS.md §3 asks for an alt text on every image; "Portrait of …" says what the image is |
| A5 | NIT | pass 1 | the rename date is typed into the page, and `src/data/skills.ts` holds it too | left | a past date does not change, and this page types its other dates in by hand |

## What the change does

Adds one section to the home page, under the proof strip: a portrait, the quote as the Builder Lab shows it in English, the Lab's caption, and one line that says what "the Builder" is. `STORY.md` and `llms.txt` follow.

## Checked beyond the findings

- The quote and the caption match https://genai-wednesday.de/croftweaver as served on 2026-10-13.
- https://www.geistanger-consulting.com/ answers 200.
- The photo: WebP, 176×176, 6,054 bytes, shown at 88 px, with `width`, `height`, `alt` and `loading="lazy"`; it loads from this site, so the content security policy (`img-src 'self'`) allows it.
- The long dash and the two contractions are inside a `<blockquote>`, which `tests/tone.spec.ts` leaves alone.
- No route, title, description, structured data or share card changes. The slide deck reads `/why` and `/checks` only.
- `POSITIONING.md` and the README already allow one shared testimonial.
- Consent: the owner confirmed in chat on 2026-10-13 that she agreed to her name, quote and photo on croftweaver.com. No reviewer can check that.

## Not checked

- The section on a real phone or in Safari: it was looked at in Chromium only, in light, dark and at 375 px.
