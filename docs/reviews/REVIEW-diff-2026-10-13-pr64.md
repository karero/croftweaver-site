# DIFF review — karero/croftweaver-site#64 — `/why` and POSITIONING.md §4 drop "a site nobody finds earns nothing"; the assistant merges when the owner asks

Base `1f6b662` · depth: **Normal** (shipped page copy, the positioning file, and an instruction file for assistants) · verdict: **PENDING** — no BUG in rounds 1 and 2; 4 RISKs and 10 NITs in all, each fixed or refuted with evidence (`7b43d0b`, `521105a`); round 3 has not run yet

Files in the change: `src/pages/why.astro`, `public/llms.txt`, `POSITIONING.md`, `STORY.md`, `AGENTS.md`, and this file.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT (all seats, before dedup) |
|---|---|---|---|---|---|
| 1 | `11b707a` (content of `e067604`) | full `main...11b707a`, without `docs/reviews/` | codex-cli 0.162.1, gpt-6.1-sol, config effort, read-only; melious glm-5.3 (HTTP API, text only); fresh-eyes: a sub-agent of the host's model family, one size down, read-only in the checkout | codex 268 s / 81,427; glm 131 s / 28,581; fresh-eyes 224 s / 138,771 | codex 0 / 0 / 1; glm 0 / 0 / 2; fresh-eyes 0 / 3 / 5 · total 0 / 3 / 8, 9 after dedup |
| 2 | `15fa800` (content of `7b43d0b`) | delta `11b707a..15fa800`, without `docs/reviews/`, with the author's record of round 1 | codex (effort medium); melious glm-5.3: FAILED, its reply broke off at the 300-second limit; ollama-cloud glm-5.3:cloud stood in (text only) | codex 131 s / 71,218; melious 301 s, no review; ollama-cloud 358 s, tokens not reported | codex 0 / 0 / 0, K1 to K9 confirmed; ollama-cloud 0 / 1 / 2, K1 to K9 confirmed, and 1 NIT outside the scope |
| 3 | pending | delta `15fa800..HEAD`, without `docs/reviews/`, with the author's record of rounds 1 and 2 | pending | pending | pending |

| id | Sev | Source | Round | Finding — one line | Status | Evidence |
|---|---|---|---|---|---|---|
| K1 | RISK | fresh-eyes | 1 | AGENTS.md §2: "otherwise the person does it on GitHub" can be read as leave to merge when the conditions fail; the sentence does not say how an assistant, which cannot press the button, merges | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "When the owner has not asked, merging stays the person's step on GitHub, under the same conditions." and "It merges as the button does, with a merge commit (`gh pr merge <number> --merge`), and never with a flag that passes over the checks." |
| K2 | RISK | fresh-eyes; melious (as a NIT) | 1 | AGENTS.md §2 and §5: one of "the conditions above" is written for a person, so a cold reader can conclude the assistant never qualifies, or is exempt; what to do while checks run is unclear; §5's merge-rule line shows no trace of the new rule | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | §2: "The owner's request is what the third condition asks for. If the checks are still running, the assistant merges only once they are green; if they are red, it reports that and does not merge." §5, after the four lines the team-setup skill rewrites: "The assistant's part is in §2: …" |
| K3 | RISK | fresh-eyes | 1 | AGENTS.md §2 names the clash with the copy of `website-team-setup` but does not say which text holds here | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "On this site it holds over the toolkit's default, "the assistant never merges", which the copy of `website-team-setup` in `.claude/skills/` still states." The skill copy is the toolkit's text and is not edited |
| K4 | NIT | codex, fresh-eyes | 1 | the description of `/why` is 139 characters; AGENTS.md §4 and CONTENT_GUIDE.md ask for 140 to 160 | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "…, in a site that you own.": 144 characters, read from the source and from the built page |
| K5 | NIT | fresh-eyes | 1 | the opening of `/why`: those who have yet to find the site are not "visitors"; and the step to "search and AI visibility" is left to the reader | fixed in part `7b43d0b` — locally_verified, externally_reverified (round 2, both seats); one part refuted, and both seats accepted the refutation | "Some people already know your name and look you up. The rest have to find you first." No connecting clause: it would have to say how people find a site, and the page has no source for that; the term in the next sentence carries the link |
| K6 | NIT | fresh-eyes | 1 | POSITIONING.md §4: "first" and "second" in one clause; the bullet no longer says what is lost | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "people who do not know them yet have to find the site before it can win them (the second of the two jobs below)" |
| K7 | NIT | fresh-eyes | 1 | §4 and STORY.md say `/why` "keeps its own wording" while its opening now names both kinds of people | fixed `7b43d0b`, in STORY.md — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "The rule still binds the home page only; that `/why` now names both kinds of people is its own wording." The §4 bullet, which the owner confirmed word for word on 2026-10-12, is still true and is not edited |
| K8 | NIT | fresh-eyes | 1 | STORY.md: one changed line of 115 characters among lines of 91 to 96 | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | the changed lines are 86 to 92 characters |
| K9 | NIT | melious | 1 | STORY.md gives `/why` the quoted line, but the page opened with a variant of it | fixed `7b43d0b` — locally_verified, externally_reverified (round 2, codex and ollama-cloud glm-5.3) | "and, as "A website that nobody finds earns nothing", opened `/why`" |
| L1 | RISK | ollama-cloud glm-5.3 | 2 | AGENTS.md §2: the sentence with the merge command rests on claims the reviewer could not check (what `--merge` does, whether a flag passes over checks, whether the repository allows merge commits) | refuted with evidence; wording made explicit in `521105a` — locally_verified | `gh pr merge --help` (gh 2.102.0): "-m, --merge   Merge the commits with the base branch" and "--admin   Use administrator privileges to merge a pull request that does not meet requirements"; the repository's settings: `allow_merge_commit: true`; the merges of 2026-10-12 made this way are two-parent commits "Merge pull request #N from …" on `main`; codex read the same help text in round 2. New: "with a merge commit and not a squash or a rebase (`gh pr merge <number> --merge`), and never with a flag that passes over the checks (`--admin`)" |
| L2 | NIT | ollama-cloud glm-5.3 | 2 | AGENTS.md §2: "The owner's request is what the third condition asks for" fits only a pull request the assistant did not open | fixed `521105a` — locally_verified | "The owner's request settles the third condition, whoever opened the pull request." |
| L3 | NIT | ollama-cloud glm-5.3 | 2 | AGENTS.md §5: the sentence on the assistant's part stood inside the block that `website-team-setup` rewrites | fixed `521105a` — locally_verified | the sentence stands after the table, its words unchanged |
| L4 | NIT, outside the scope | ollama-cloud glm-5.3 | 2 | the pull request's description must not say more than the owner reviewed | fixed in the description of the pull request | it says which words are the owner's, which are the author's, and which changed in review |

## What the change does

| Place | Before | After |
|---|---|---|
| `/why`, opening paragraph | "A website that nobody finds earns nothing." | "Some people already know your name and look you up. The rest have to find you first." The sentence after it is unchanged |
| `/why`, search description | "The case for search and AI visibility as the first job of a website: … in a site you own." (150 characters) | "The case for a website made for search and AI visibility: … in a site that you own." (144 characters; the site's guide asks for 140 to 160) |
| `public/llms.txt`, the line for `/why` | "the case for search and AI visibility as the first job of a website, for the person who decides: …" | "the case for a website made for search and AI visibility, for the person who decides: …" |
| POSITIONING.md §4, "Why they care most" | "a site nobody finds earns nothing, and the search and AI work is exactly what gets skipped …" | "people who do not know them yet have to find the site before it can win them (the second of the two jobs below), and the search and AI work is exactly what gets skipped …" |
| STORY.md, the note of 2026-10-12 | the line "still stands in POSITIONING.md §4 and opens `/why`, and the owner has not decided on those" | the line had stood in §4 and, in the page's own variant, opened `/why`; on 2026-10-13 the owner had it replaced in both; the rule still binds the home page only |
| AGENTS.md §2, merging | "The assistant never merges; the person does that on GitHub." | the assistant merges only when the owner asks for that pull request in chat, and only when the conditions above the sentence hold; the paragraph says what the owner's request stands for, what to do while checks run or are red, how the merge is made, and that this rule holds here over the toolkit's default |
| AGENTS.md §5 | no word on the assistant | one sentence after the table that points to §2 for the assistant's part in merging and shipping |

Why: POSITIONING.md §4 gives a site two jobs since 2026-10-12, and being found is the second. The old line, and "the first job of a website", both leave out the people who already know your name. The owner asked for the line to be updated in §4 and on `/why`, and said yes to the new start of the description, to the `llms.txt` line and to the merge sentence, each as worded. The opening of `/why` and the §4 bullet are the author's wording: the owner saw the first version of both before the pull request and did not comment; round 1 changed a word in the one and a clause in the other.

Not changed, on purpose: `/established-sites` (§4 says it keeps its own wording); the share card and the slide deck of `/why` (neither carries either phrase, and the deck does not read the opening paragraph); the copy of the toolkit's `website-team-setup` skill in `.claude/skills/`, which still says "the assistant never merges" as the toolkit's default.

## Test records

| Run | On | Result | Exit status |
|---|---|---|---|
| `npm run check` | the working tree with the content of `e067604` | 0 errors, 0 warnings, 0 hints | 0 |
| `npm run build` | the same | complete; the build marker reads `b4ee92b`, the commit checked out at that moment (the last two commits were made right after, with no further edit) | 0 |
| `npx playwright test` | the same | 224 passed, none skipped or failed | 0 |
| `git push` (the pre-push gate: build, then the tests) | `e067604`, committed | 224 passed; "pre-push gate passed" | 0 on the fourth attempt |
| `npm run check` | `7b43d0b`, after the round-1 fixes | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (its web server runs `npm run build` first) | `7b43d0b` | 224 passed, none skipped or failed; the build marker reads `7b43d0b` | 0 |
| `npm run check` | `521105a`, after the round-2 fixes | 0 errors, 0 warnings, 0 hints | 0 |
| `npx playwright test` (the same) | `521105a` | 224 passed, none skipped or failed; the build marker reads `521105a` | 0 |

The first push needed four attempts. In the first three the gate passed each time (224 tests) and the upload then failed: the connection to GitHub on port 22 was closed or timed out. The fourth went over HTTPS for that one push, with the same gate. Nothing about the change differs between the attempts.

The change adds no test. The existing tests that read these places: the description's length and the positioning term on `/why` (`tests/seo.spec.ts`, `tests/positioning.spec.ts`), the tone rules on `/why` and on the slide deck (`tests/tone.spec.ts`), every route listed in `llms.txt` (`tests/llms-coverage.spec.ts`), and the slide deck still matching the page (`tests/seo.spec.ts`).

Waivers: none. Deferrals: none.

Notes:
- Codex listed as unverifiable, in round 1, the recorded test runs (no result file bound to a commit), the repository's settings on GitHub and Cloudflare's preview check. The test runs are in the brief with their whole output and exit status; the settings were read with `gh api` on 2026-10-13 and are context, not part of the change.
- Data check: the artifact holds no credentials, and the repository is public. Destinations: Codex and GLM 5.3 on melious, as in the gates of karero/croftweaver-site#46, #53, #54, #57 and #60 in the same session.
