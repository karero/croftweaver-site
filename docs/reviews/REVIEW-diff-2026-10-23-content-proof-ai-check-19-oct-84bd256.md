# DIFF review — `content/proof-ai-check-19-oct` — the AI check runs of 12 and 19 October on `/proof`

Base `48995b7` (origin/main, 2026-10-23) · depth: **Normal** (the CSV is published data behind public figures; no page code changed; nothing in the High row) · verdict: **CLEAN** (round 1: no BUG left open; the wording pass over the fix found nothing) · authority used: WORKTREE-WRITE and BRANCH-COMMIT, atom A (this session created the worktree and the branch); POST AUTHORITY, atom A (this session created the pull request); GATED-THIS-DIFF, atom A (round 1 saw `48995b7...84bd256` in full on all three seats, and the wording pass saw `84bd256..cdd6673`; the trail commit after it changes only `docs/reviews/`) · the owner's instruction, 2026-10-23: "Update /proof's AI check section with the 12 and 19 October runs from the tracker (export-ai-check.py), the way the page's own pipeline does it. Search Console figures stay as they are. New branch from origin/main, update tests, review, then PR."

The artifact is 5.2 KB: 36 rows added to `public/data/genai-wednesday-de-ai-check.csv` (made by `scripts/export-ai-check.py`; none of the 86 earlier rows changed), one README line, two hash lines in `scripts/deck.lock.json`, and the rebuilt `public/croftweaver-why.pdf` (binary; its figures come from `/why`, so `npm run deck` rebuilt it). No page code, no test code and no page text changed: `/proof`, `/why` and the home page read the latest day in the CSV.

| Round | Head | Artifact | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|---|
| 1 | `84bd256` | full `48995b7...84bd256` | codex-cli, gpt-6.1-sol, read-only · melious, glm-5.3, HTTP API · fresh-eyes, Claude Sonnet sub-agent, read-only, no shared context | codex 307 s / 92,353 · melious 224 s / 17,134 · fresh-eyes 436 s / 165,581 | codex 0 / 0 / 0 · melious 1 / 0 / 2 · fresh-eyes 0 / 0 / 0 |
| wording pass (not a round) | `cdd6673` | delta `84bd256..cdd6673`, README only, with round 1's dispositions (`--verify`) | codex, effort medium, `--seat codex` | codex 45 s / 34,206 | 0 / 0 / 0 |

| Id | Sev | Source | Round | Finding | Status | Evidence |
|---|---|---|---|---|---|---|
| F1 | BUG | melious | 1 | README step 0b put data of 12 and 19 October after "Owner, 2026-10-04:" | fixed, `externally_reverified` (wording pass) | `cdd6673`: the sentence is split, so only the one-site decision is the owner's, and the added days are dated 2026-10-23 |
| F2 | NIT | melious | 1 | `2026-10-19,google-overview,with_search,2,1,0,1,0`: cited 1, named 0 | refuted | `/proof` says cited counts answers that list the site among their sources, "whether or not the answer names it"; the tracker's own values are `cited_own` 1, `named` 0 (the host's recomputation from the tracker matched all 122 keys) |
| F3 | NIT | melious | 1 | `2026-10-12,anthropic,with_search,2,2,2,2,1`: failed 1 beside 2 answers | refuted | `failed` counts calls that gave no answer; 2 answers + 1 failed = 3 calls asked per question, as in every earlier row |

Waivers and deferrals: none.
Follow-ups: none.

Notes:

- All three seats counted in round 1. Both Codex and fresh-eyes listed items as UNVERIFIABLE because their sandboxes could not read the tracker history (outside the repository) or run the deck check. The host settled them: `python3 scripts/export-ai-check.py` printed output byte-identical to the committed CSV (`cmp`), and a separate recomputation from the tracker, written without the export script, gave the same counts for all 122 keys; `node scripts/build-deck.mjs --check` prints "deck: current (11 slides)."; Codex's own render of PDF slide 2 showed it readable and unclipped.
- Before sending: the artifact was grepped for secrets (counts, a README line, hashes): none. The repository is public. The CSV holds counts only, for genai-wednesday.de only; `tests/check_export_ai_check.sh` keeps that rule.
- Checks on `84bd256`: `npx astro check` 0 errors, 0 warnings, 0 hints. The full suite is run by the pre-push gate on the head that is pushed; its result is in the pull request. Before the deck was rebuilt, one test failed for the right reason ("the /why slide deck still matches the /why and /checks pages it was made from"); after `npm run deck` it passes.
