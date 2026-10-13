# DIFF review — karero/croftweaver-site#64 — `/why` and POSITIONING.md §4 drop "a site nobody finds earns nothing"; the assistant merges when the owner asks

Base `1f6b662` · depth: **Normal** (shipped page copy, the positioning file, and an instruction file for assistants) · verdict: **PENDING** — round 1 has not run yet

Files in the change: `src/pages/why.astro`, `public/llms.txt`, `POSITIONING.md`, `STORY.md`, `AGENTS.md`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | pending | full `main...HEAD`, without `docs/reviews/` | pending | pending | pending |

## What the change does

| Place | Before | After |
|---|---|---|
| `/why`, opening paragraph | "A website that nobody finds earns nothing." | "Some visitors already know your name and look you up. The rest have to find you first." The sentence after it is unchanged |
| `/why`, search description | "The case for search and AI visibility as the first job of a website: …" (150 characters) | "The case for a website made for search and AI visibility: …" (139 characters; the test allows 120 to 160) |
| `public/llms.txt`, the line for `/why` | "the case for search and AI visibility as the first job of a website, for the person who decides: …" | "the case for a website made for search and AI visibility, for the person who decides: …" |
| POSITIONING.md §4, "Why they care most" | "a site nobody finds earns nothing, and the search and AI work is exactly what gets skipped …" | "people who do not know them yet have to find the site first (the second of the two jobs below), and the search and AI work is exactly what gets skipped …" |
| STORY.md, the note of 2026-10-12 | the line "still stands in POSITIONING.md §4 and opens `/why`, and the owner has not decided on those" | "it had also stood in POSITIONING.md §4 and opened `/why`, and on 2026-10-13 the owner had it replaced in both" |
| AGENTS.md §2, merging | "The assistant never merges; the person does that on GitHub." | the assistant merges only when the owner asks for that pull request in chat, and only when the conditions above the sentence hold; the toolkit's default is named as unchanged |

Why: POSITIONING.md §4 gives a site two jobs since 2026-10-12, and being found is the second. The old line, and "the first job of a website", both leave out the people who already know your name. The owner asked for the line to be updated in §4 and on `/why`, and said yes to the description, to the `llms.txt` line and to the merge sentence, each as worded here.

Not changed, on purpose: `/established-sites` (§4 says it keeps its own wording); the share card and the slide deck of `/why` (neither carries either phrase, and the deck does not read the opening paragraph); the copy of the toolkit's `website-team-setup` skill in `.claude/skills/`, which still says "the assistant never merges" as the toolkit's default.

## Test records

| Run | On | Result | Exit status |
|---|---|---|---|
| `npm run check` | the working tree with the content of `e067604` | 0 errors, 0 warnings, 0 hints | 0 |
| `npm run build` | the same | complete; the build marker reads `b4ee92b`, the commit checked out at that moment (the last two commits were made right after, with no further edit) | 0 |
| `npx playwright test` | the same | 224 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | `e067604`, committed | 224 passed; "pre-push gate passed" | 0 on the fourth attempt |

The push needed four attempts. In the first three the gate passed each time (224 tests) and the upload then failed: the connection to GitHub on port 22 was closed or timed out. The fourth went over HTTPS for that one push, with the same gate. Nothing about the change differs between the attempts.

The change adds no test. The existing tests that read these places: the description's length and the positioning term on `/why` (`tests/seo.spec.ts`, `tests/positioning.spec.ts`), the tone rules on `/why` and on the slide deck (`tests/tone.spec.ts`), every route listed in `llms.txt` (`tests/llms-coverage.spec.ts`), and the slide deck still matching the page (`tests/seo.spec.ts`).

Waivers: none. Deferrals: none.
