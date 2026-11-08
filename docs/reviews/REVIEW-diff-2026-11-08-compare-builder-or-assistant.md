# DIFF review — `/compare`: the section "AI website builder or AI coding assistant?"

Branch `content/compare-builder-or-assistant`, base `91fad2e` (origin/main). Built from the plan
`compare-ai-builder/PLAN.md` (hub commit a6e06c6; its PLAN gate: 4 rounds, a final full read, 30 findings,
no BUG open).

Depth: **Normal** (`src/data/compare.ts` and `src/pages/compare.astro` ship, so never Light; statements
about other kinds of product; no box, user data, logins, money, deletion or schema) · verdict: **CLEAN at
round 1**, no BUG, two seats plus fresh-eyes · the owner's go on the plan, 2026-11-08: "Go, build it". Earlier
trails record the owner's OK for Codex and melious.ai on this public repository.

| Round | Head | Reviewers | seconds, tokens per seat | BUG/RISK/NIT |
|---|---|---|---|---|
| 1 | `5d545bf` | codex gpt-6.1-sol · melious glm-5.3 · fresh-eyes Sonnet sub-agent | codex 139 s / 58,329 · melious 80 s / 12,368 · fresh-eyes 95 s / 87,969 | codex 0 / 1 / 0 · melious 0 / 1 / 2 · fresh-eyes 0 / 0 / 3 |

| Id | Kind | Seat | Finding | Disposition |
|---|---|---|---|---|
| R1-1 | RISK | codex | UNVERIFIABLE: nothing checks that AI app builders deliver accounts, stored data and a checkout without separate services | refuted: the sentence restates `GROUPS` apps `chooseThem` ("You need an application: accounts, stored data, a checkout.", `compare.ts:170`) and `what` (`:164`), which the page sources and dates; the section adds no claim about a product (plan S6). Not introduced by this change |
| R1-2 | RISK | melious | the test never asserts that the link targets exist, so a renamed group id leaves it green | refuted: `tests/anchors.spec.ts` resolves every internal `#fragment` on every page in `PAGES` to a real id (it ran green on the built page, 500 of 506 passed in the first full run, the other six were load timeouts that passed on rerun). The plan names this suite as the cover (How it is tested) |
| R1-3 | NIT | melious | the comment above `BUILDER_OR_ASSISTANT` says the section sums up "the groups and the Claude Code section it links" but it also links `#wrong-choice` | fixed: "the groups and the sections it links". A comment only, no round owed |
| R1-4 | NIT | melious | the notes read "…with a visual editor: hosted website builders." and "…for every site: when Croftweaver is the wrong choice." | declined: the plan's copy, exactly; the colon form was in PLAN-gate rounds 1 to 4. Reported to the manager as a wording question, not changed here |
| R1-5 | NIT | fresh-eyes | `drag.text` says a hosted builder "runs the site"; the group's `what` says the company "hosts the site" | declined: the plan's copy, reviewed in the PLAN gate (trail rows 2, 21); the plan's table maps it to the `hosted` `what` line. Reported to the manager |
| R1-6 | NIT | fresh-eyes | "works in your project" and "Both start from what you write in plain language" go past the sourced lines | declined: the plan's S6 table lists both (the second as "not a product's feature"); PLAN-gate final-read row 21 set this wording. Reported to the manager |
| R1-7 | NIT | fresh-eyes | the page's local use of "AI website builder" for the app builders may be read as Croftweaver being one | no change asked by the reviewer ("leave as is"); `what` says "On this page" |

UNVERIFIABLE entries: codex asked two more (Claude Code, hosted builders: primary documentation), none confirmed,
both about lines the page already quotes with a source and date; melious asked two (the ids exist; Astro
renders `false` as nothing), both settled: the five ids exist once each in the built HTML (fresh-eyes read it),
and the built HTML shows "See" + the link with no "false".

Seeded failures, each restored after (see the PR for the output): the second card without its links; the
`{ label: 'AI app builders', href: '#apps' }` entry removed from the data; the `drag` line without its text.
Seed 2 fails with a `TypeError` at the test's read of `B.builder.links[0].label`, before any `href` is compared.

Notes: R1-4 to R1-6 change plan-gated copy, so they are the owner's or the manager's call, not this build's.
No round 2: no BUG, no in-scope RISK calling for a fix that changes what runs; the one fix is a comment.
